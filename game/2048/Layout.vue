<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh">
        <v-card width="600" class="pa-4">
            <v-row justify="space-between" align="center">
                <v-col>
                    <v-card-title :class="display.mobile.value ? 'text-h4' : 'text-h3'">{{ target }}</v-card-title>
                </v-col>
                <v-col cols="auto">
                    <v-chip color="primary" label prepend-icon="mdi-scoreboard-outline"
                        :size="display.mobile.value ? 'small' : 'x-large'">
                        Score: {{ score }}
                    </v-chip>
                </v-col>
                <v-col cols="auto">
                    <v-chip color="primary" label prepend-icon="mdi-counter"
                        :size="display.mobile.value ? 'small' : 'x-large'">
                        Best: {{ best }}
                    </v-chip>
                </v-col>
            </v-row>

            <v-row justify="space-between" align="center">
                <v-col cols="12" sm="auto">
                    <v-radio-group v-model="gridSize" @update:model-value="restart" inline color="primary"
                        hide-details>
                        <v-radio v-for="size in [3, 4, 5, 6]" :key="size" :label="String(size)" :value="size"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" sm="auto" class="d-flex ga-2">
                    <v-btn :disabled="!previousState" @click="undo">UNDO</v-btn>
                    <v-btn @click="restart" color="primary">NEW</v-btn>
                </v-col>
            </v-row>

            <v-row class="d-flex align-center justify-center ma-2">
                <v-sheet color="transparent" @touchstart.passive="handleTouchStart" @touchend="handleTouchEnd">
                    <v-row no-gutters v-for="(row, rowIndex) in grid" :key="rowIndex">
                        <v-col v-for="(cell, colIndex) in row" :key="colIndex" class="pa-1">
                            <v-sheet :color="getColor(cell)" class="d-flex align-center justify-center"
                                :height="cellSize" :width="cellSize" rounded>
                                <span class="text-h6" v-if="cell !== 0">{{ cell }}</span>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-row>

            <v-overlay :model-value="gameState !== 'playing'" class="align-center justify-center"
                location-strategy="connected" scroll-strategy="block" contained>
                <v-card class="pa-4 text-center">
                    <v-card-title>{{ gameState === 'won' ? 'You Win!' : 'Game Over!' }}</v-card-title>
                    <v-card-actions class="justify-center">
                        <v-btn v-if="gameState === 'won'" @click="continueGame">继续游戏</v-btn>
                        <v-btn color="primary" @click="restart">重新开始</v-btn>
                    </v-card-actions>
                </v-card>
            </v-overlay>
        </v-card>
    </v-container>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const display = useDisplay()
const grid = ref([])
const gridSize = ref(4)
const score = ref(0)
const best = ref(0)
const gameState = ref('playing')
const previousState = ref(null)
const touchStart = ref(null)

const target = computed(() => ({ 3: 256, 4: 2048, 5: 4096, 6: 8192 })[gridSize.value])
const cellSize = computed(() => {
    const desktopSizes = { 3: 125, 4: 92, 5: 72, 6: 58 }
    const mobileSizes = { 3: 86, 4: 62, 5: 49, 6: 40 }
    return (display.mobile.value ? mobileSizes : desktopSizes)[gridSize.value]
})

const cloneGrid = value => value.map(row => [...row])

watch(score, newScore => {
    if (newScore > best.value) {
        best.value = newScore
        localStorage.setItem('2048-best-score', String(newScore))
    }
})

const addRandomTile = () => {
    const emptyCells = []
    for (let row = 0; row < gridSize.value; row++) {
        for (let column = 0; column < gridSize.value; column++) {
            if (grid.value[row][column] === 0) emptyCells.push({ row, column })
        }
    }

    if (emptyCells.length > 0) {
        const { row, column } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        grid.value[row][column] = Math.random() < 0.9 ? 2 : 4
    }
}

const getColor = value => ({
    0: 'grey-lighten-2',
    2: 'orange-lighten-5',
    4: 'orange-lighten-4',
    8: 'orange-lighten-3',
    16: 'orange-lighten-2',
    32: 'orange-lighten-1',
    64: 'orange-darken-1',
    128: 'orange-darken-2',
    256: 'orange-darken-3',
    512: 'orange-darken-4',
    1024: 'indigo-darken-4',
    2048: 'purple-darken-4'
})[value] ?? 'grey-darken-3'

const rotate = (value, times) => {
    let result = value
    for (let index = 0; index < times; index++) {
        result = result[0].map((_, column) => result.map(row => row[column]).reverse())
    }
    return result
}

const checkGameState = () => {
    if (gameState.value === 'playing' && grid.value.some(row => row.includes(target.value))) {
        gameState.value = 'won'
        return
    }

    for (let row = 0; row < gridSize.value; row++) {
        for (let column = 0; column < gridSize.value; column++) {
            if (grid.value[row][column] === 0) return
            if (row < gridSize.value - 1 && grid.value[row][column] === grid.value[row + 1][column]) return
            if (column < gridSize.value - 1 && grid.value[row][column] === grid.value[row][column + 1]) return
        }
    }
    gameState.value = 'lost'
}

const move = direction => {
    if (gameState.value !== 'playing') return

    const originalGrid = cloneGrid(grid.value)
    const originalScore = score.value
    const rotations = { left: 0, right: 2, up: 3, down: 1 }
    const reverseRotations = { left: 0, right: 2, up: 1, down: 3 }
    const rotated = rotate(cloneGrid(grid.value), rotations[direction])

    for (let rowIndex = 0; rowIndex < gridSize.value; rowIndex++) {
        const row = rotated[rowIndex].filter(value => value !== 0)
        for (let column = 0; column < row.length - 1; column++) {
            if (row[column] === row[column + 1]) {
                row[column] *= 2
                score.value += row[column]
                row.splice(column + 1, 1)
            }
        }
        while (row.length < gridSize.value) row.push(0)
        rotated[rowIndex] = row
    }

    const nextGrid = rotate(rotated, reverseRotations[direction])
    if (JSON.stringify(nextGrid) === JSON.stringify(originalGrid)) return

    previousState.value = { grid: originalGrid, score: originalScore }
    grid.value = nextGrid
    addRandomTile()
    checkGameState()
}

const undo = () => {
    if (!previousState.value) return
    grid.value = cloneGrid(previousState.value.grid)
    score.value = previousState.value.score
    previousState.value = null
    gameState.value = 'playing'
}

const restart = () => {
    grid.value = Array.from({ length: gridSize.value }, () => Array(gridSize.value).fill(0))
    score.value = 0
    gameState.value = 'playing'
    previousState.value = null
    addRandomTile()
    addRandomTile()
}

const continueGame = () => {
    gameState.value = 'playing'
}

const handleKey = event => {
    const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    }
    const direction = directions[event.key]
    if (direction) {
        event.preventDefault()
        move(direction)
    }
}

const handleTouchStart = event => {
    const touch = event.touches[0]
    touchStart.value = { x: touch.clientX, y: touch.clientY }
}

const handleTouchEnd = event => {
    if (!touchStart.value) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.value.x
    const deltaY = touch.clientY - touchStart.value.y
    touchStart.value = null

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 30) return
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        move(deltaX > 0 ? 'right' : 'left')
    } else {
        move(deltaY > 0 ? 'down' : 'up')
    }
}

onMounted(() => {
    best.value = Number(localStorage.getItem('2048-best-score')) || 0
    restart()
    window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
</script>
