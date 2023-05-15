<template>
    <div ref="gamePanelRef">
        <div>is dark mode: {{ dark }}</div>
        <div>is touch device: {{ isTouchDevice }}</div>
    </div>
</template>
<script setup>
import DinoGame from './game/DinoGame.js'
import {useQuasar} from 'quasar'
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue'

const gamePanelRef = ref()

const $q = useQuasar()
const dark = computed(() => $q.dark.isActive)
const isTouchDevice = $q.platform.has.touch

const game = new DinoGame()

onMounted(() => {
    const gamePanel = gamePanelRef.value;
    game.createCanvas(600, 400, gamePanel)
    game.start().catch(console.error)

    if (isTouchDevice) {
        // 绑定触屏设备上的单击和双击事件
        gamePanel.addEventListener('click', handleMobileTap)
        gamePanel.addEventListener('dblclick', handleMobileDoubleTap)
    } else {
        // 绑定键盘事件
        window.addEventListener('keydown', handleDesktopKeyDown)

        window.addEventListener('keyup', handleDesktopKeyUp)
    }
})

onUnmounted(() => {
    console.log(game)
    game.stop()
    if (!isTouchDevice) {
        window.removeEventListener('keydown', handleDesktopKeyDown)
        window.removeEventListener('keyup', handleDesktopKeyUp)
    }
})

const handleMobileTap = () => {
    // 处理触屏设备上的单击事件
    game.onInput('jump')
}

const handleMobileDoubleTap = () => {
    // 处理触屏设备上的双击事件
    game.onInput('duck')
}

const handleDesktopKeyDown = event => {
    if (event.key === 'ArrowUp' || event.key === ' ') {
        // 处理键盘的上方向键事件
        game.onInput('jump')
    } else if (event.key === 'ArrowDown') {
        // 处理键盘的下方向键事件
        game.onInput('duck')
    }
}

const handleDesktopKeyUp = event => {
    if (event.key === 'ArrowDown') {
        // 处理键盘的下方向键事件
        console.log('键盘-向下-解除')
        game.onInput('stop-duck')
    }
}

// if (isTouchDevice) {
//     document.addEventListener('touchstart', ({touches}) => {
//         if (touches.length === 1) {
//             game.onInput('jump')
//         } else if (touches.length === 2) {
//             game.onInput('duck')
//         }
//     })
//
//     document.addEventListener('touchend', ({ touches }) => {
//         game.onInput('stop-duck')
//     })
// } else {
//     const keycodes = {
//         // up, spacebar
//         JUMP: { 38: 1, 32: 1 },
//         // down
//         DUCK: { 40: 1 },
//     }
//
//     document.addEventListener('keydown', ({ keyCode }) => {
//         if (keycodes.JUMP[keyCode]) {
//             game.onInput('jump')
//         } else if (keycodes.DUCK[keyCode]) {
//             game.onInput('duck')
//         }
//     })
//
//     document.addEventListener('keyup', ({keyCode}) => {
//         if (keycodes.DUCK[keyCode]) {
//             game.onInput('stop-duck')
//         }
//     })
// }

</script>