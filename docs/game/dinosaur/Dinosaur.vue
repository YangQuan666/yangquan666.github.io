<template>
    <div class="row">
        <div class="col-12 offset-sm-3 col-sm-6">
            <div ref="gamePanelRef"/>
        </div>
    </div>
</template>
<script setup>
import DinoGame from './game/DinoGame.js'
import {useQuasar} from 'quasar'
import {onMounted, onUnmounted, ref} from 'vue'

const gamePanelRef = ref()

const $q = useQuasar()
const isTouchDevice = $q.platform.has.touch

const game = new DinoGame()

onMounted(() => {
    const gamePanel = gamePanelRef.value;
    game.createCanvas(gamePanel.offsetWidth, 400, gamePanel)
    game.start().catch(console.error)

    if (isTouchDevice) {
        // 绑定触屏设备上的单击事件
        gamePanel.addEventListener('touchstart', handleMobileTap)
    } else if (typeof window !== 'undefined') {
        // 绑定键盘事件
        window.addEventListener('keydown', handleDesktopKeyDown)
        window.addEventListener('keyup', handleDesktopKeyUp);
    }
})

onUnmounted(() => {
    console.log(game)
    game.stop()
    if (!isTouchDevice && typeof window !== 'undefined') {
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
</script>