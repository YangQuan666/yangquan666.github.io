<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh">
        <v-card width="600" class="pa-4">
            <v-row justify="space-between" align="center">
                <v-col>
                    <v-card-title class="text-h3">{{ target }}</v-card-title>
                </v-col>
                <v-col cols="auto">
                    <v-chip color="primary" label prepend-icon="mdi-scoreboard-outline" size="x-large">Score: {{ score
                    }}</v-chip>
                </v-col>
                <v-col cols="auto">
                    <v-chip color="primary" label prepend-icon="mdi-counter" size="x-large">Best: {{ best }}</v-chip>
                </v-col>
            </v-row>

            <v-row justify="space-between">
                <v-col cols="auto">
                    <v-radio-group v-model="gridSize" @update:model-value="restart" inline color="primary">
                        <v-radio v-for="i in [3, 4, 5, 6]" :label="i" :value="i"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="restart">UNDO</v-btn>
                    <v-btn @click="restart" color="primary">NEW</v-btn>
                </v-col>
            </v-row>

            <v-row class="d-flex align-center justify-center ma-4">
                <div>
                    <v-row no-gutters v-for="(row, rowIndex) in grid" :key="rowIndex">
                        <v-col v-for="(cell, colIndex) in row" :key="colIndex" class="pa-1">
                            <v-sheet :color="getColor(cell)" class="d-flex align-center justify-center"
                                :height="cellHeight" :width="cellHeight" rounded>
                                <span class="white--text text-h6" v-if="cell !== 0">{{ cell }}</span>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </div>
            </v-row>
            <v-overlay :model-value="gameOver" class="align-center justify-center" location-strategy="connected"
                scroll-strategy="block" contained>
                <v-btn variant="flat">Game Over!</v-btn>
            </v-overlay>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const grid = ref([])
const gridSize = ref(4) // 默认 4x4
const target = computed(() => { return { 3: 256, 4: 2048, 5: 4096, 6: 8192 }[gridSize.value]; }) // 目标值
const score = ref(0) //当前分数
const best = ref(0) //最高分数
const gameState = ref('playing') // 游戏状态 enum: playing, won, lost
const gameOver = ref(false)
const cellHeight = computed(() => { return { 3: 125, 4: 92, 5: 72, 6: 58 }[gridSize.value]; });

watch(score, (newScore) => {
    if (newScore > best.value) {
        best.value = newScore;
        // uselocalStorage.setItem('bestScore', newScore);
    }
});

const addRandomTile = () => {
    const emptyCells = [];
    for (let i = 0; i < gridSize.value; i++) {
        for (let j = 0; j < gridSize.value; j++) {
            if (grid.value[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid.value[i][j] = Math.random() < 0.9 ? 2 : 4
    }
};

const getColor = (value) => {
    const colors = {
        0: 'grey lighten-2',
        2: 'orange-lighten-5',
        4: 'orange-lighten-4',
        8: 'orange-lighten-3',
        16: 'orange-lighten-2',
        32: 'orange-lighten-1',
        64: 'orange-darken-1',
        128: 'orange-darken-2',
        256: 'orange-darken-3',
        512: 'orange-darken-4',
        1024: 'indigo darken-4',
        2048: 'purple darken-4'
    };
    return colors[value] || 'grey';
};

const move = (direction) => {
    let moved = false;
    let newGrid = JSON.parse(JSON.stringify(grid.value));

    const rotate = (grid, times) => {
        for (let t = 0; t < times; t++) {
            grid = grid[0].map((_, col) => grid.map(row => row[col]).reverse());
        }
        return grid;
    };

    let rotated = newGrid;
    if (direction === 'left') rotated = rotate(newGrid, 0);
    if (direction === 'right') rotated = rotate(newGrid, 2);
    if (direction === 'up') rotated = rotate(newGrid, 3);
    if (direction === 'down') rotated = rotate(newGrid, 1);

    for (let i = 0; i < gridSize.value; i++) {
        let row = rotated[i].filter(val => val);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score.value += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        while (row.length < gridSize.value) row.push(0);
        if (JSON.stringify(rotated[i]) !== JSON.stringify(row)) moved = true;
        rotated[i] = row;
    }

    if (direction === 'left') newGrid = rotate(rotated, 0);
    if (direction === 'right') newGrid = rotate(rotated, 2);
    if (direction === 'up') newGrid = rotate(rotated, 1);
    if (direction === 'down') newGrid = rotate(rotated, 3);

    if (moved) {
        grid.value = newGrid;
        addRandomTile();
        checkGameOver();
    }
};

const checkWin = () => {
    for (let i = 0; i < gridSize.value; i++) {
        for (let j = 0; j < gridSize.value; j++) {
            if (grid.value[i][j] === target.value) {
                gameState.value = 'won';
                return;
            }
        }
    }
};
const checkGameOver = () => {
    for (let i = 0; i < gridSize.value; i++) {
        for (let j = 0; j < gridSize.value; j++) {
            if (grid.value[i][j] === 0) return;
            if (i < gridSize.value - 1 && grid.value[i][j] === grid.value[i + 1][j]) return;
            if (j < gridSize.value - 1 && grid.value[i][j] === grid.value[i][j + 1]) return;
        }
    }
    gameOver.value = true;
    gameState.value = 'lost';
};

const handleKey = (event) => {
    if (gameOver.value && event.key === ' ') {
        restart();
        return;
    }
    if (!gameOver.value) {
        switch (event.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    }
};

const restart = () => {
    grid.value = Array(gridSize.value).fill().map(() => Array(gridSize.value).fill(0));
    score.value = 0;
    gameOver.value = false;
    addRandomTile();
    addRandomTile();
};

onMounted(() => {
    restart();
    window.addEventListener('keydown', handleKey);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey);
});
</script>