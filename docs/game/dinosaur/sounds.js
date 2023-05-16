import jump from '/game/dino/jump.mp3'
import levelUp from '/game/dino/level-up.mp3'
import gameOver from '/game/dino/game-over.mp3'
import {ref} from 'vue'

const map = {'jump': jump, 'level-up': levelUp, 'game-over': gameOver}
const audioRef = ref()

if (typeof Audio != "undefined") {
    // Browser-only code
    audioRef.value = new Audio();
}

export function playSound(name) {
    const audio = audioRef.value;
    audio.src = map[name]
    audio.play().catch((error) => {
        console.error('播放音频时出错：', error);
    })
}