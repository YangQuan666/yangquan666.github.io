<template>
  <h1># 2048</h1>
  <div class="main-container appearing" :style="mainContainerStyle">
    <div class="score-container" :style="scoreContainerStyle">
      <div ref="gameAim" class="game-aim" v-bind:class="{'game-aim-reached':gameAimReached}" :style="gameAimStyle">
        {{ gameAim }}
      </div>
      <div class="scores" :style="scoreStyle">
        <div class="score">
          <div class="label">Score</div>
          <div>
            {{ score }}
            <transition>
              <span v-if="scoreInc!=''" class="score-inc">{{ scoreInc }}</span>
            </transition>
          </div>
        </div>&nbsp;
        <div class="score">
          <div class="label">Best</div>
          <div>{{ bestScore[size] }}</div>
        </div>
      </div>
    </div>
    <div class="game-controls" :style="gameControlsStyle">
      <div class="size-control" v-if="!gameStarted">
        Size:
        <template v-for="s in sizes">
          <input type="radio" :id="'size-radio'+s" :value="s" v-model.number="size"/>
          <label :for="'size-radio'+s">{{ s }}</label>
        </template>&nbsp;
      </div>
      <button v-if="!gameStarted" @click="startGame()" class="button" :style="buttonStyle" key="start">New Game</button>
      <button v-else @click="gameStarted=false" class="button" :style="buttonStyle" key="end">End</button>
    </div>
    <div class="game-container" :style="gameContainerStyle">
      <div v-if="gameEnded">
        <div class="overlay half-white appearing07"></div>
        <div class="overlay game-over appearing" :style="gameOverStyle">
          <p>Game over!</p>
        </div>
      </div>
      <game-2048 ref="game" :size="size" :size-aim-map="sizeAimMap" :listen-own-key-events-only="false" :tab-index="1"
                 :board-size-px="boardSizePx"
                 :started="gameStarted" @started="onGameStarted" @ended="onGameEnded" @score="onGameScore" @aim-changed="onGameAimChanged"
                 @aim-reached="onGameAimReached"></game-2048>
    </div>
    <div class="game-awards-container" :style="gameAwardsContainerStyle">
      <game2048-award ref="awards" v-for="a in awards" key="a.aim" :award="a" :style="gameAwardStyle"
                      :like-style="gameAwardLikeStyle"></game2048-award>
    </div>
    <div style="display:none" ref="collectAllAwards" class="collect-all-awards" v-if="!allAwardsObtained">
      <span>Collect all awards!</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted} from 'vue';
import ScrollTrigger from 'gsap/ScrollTrigger';

defineProps({
  award: {type: Object, required: true},
  style: {type: Object},
  likeStyle: {type: Object}
});

var defBoardSizePx = 420
var defSize = 4

var sizeAimMap = []
sizeAimMap[3] = 256
sizeAimMap[4] = 2048
sizeAimMap[5] = 4096
sizeAimMap[6] = 8192

var awards = {}
var bestScore = {}
var sizes = []
var i = 0
for (var s in sizeAimMap) {
  var a = sizeAimMap[s]
  bestScore[s] = 0
  awards[a] = {aim: a, obtained: false}
  sizes[i++] = s
}
let boardSizePx = defBoardSizePx
const size = defSize
let gameStarted = false
let gameEnded = false
let gameAim = sizeAimMap[defSize]
let gameAimReached = false
let score = 0
let scoreInc = ''

onMounted(() => loadState())


const fitBoardSizePx = function () {
  if (window.innerWidth < defBoardSizePx * 1.04) {
    boardSizePx = window.innerWidth * 0.96
  } else {
    boardSizePx = defBoardSizePx
  }
}

const loadState = function () {
  try {
    var s = document.cookie
    if (s) {
      var state = JSON.parse(s)
      if (state) {
        if (state.awards)
          awards = state.awards
        if (state.bestScore)
          bestScore = state.bestScore
      }
    }
  } catch (e) {
  }
}

const persistState = function () {
  try {
    var state = {
      bestScore: bestScore,
      awards: awards
    }
    document.cookie = JSON.stringify(state)
  } catch (e) {
  }
}

const startGame = function () {
  gameStarted = true
  score = 0
  showCollectAllAwards()
}
const onGameStarted = function () {
  gameStarted = true
  gameEnded = false
}
const onGameEnded = function () {
  gameStarted = false
  gameEnded = true
  gameAimReached = false
  persistState()
}
const onGameScore = function (args) {
  var s = {score: score}
  TweenLite.to(s, 0.3, {
    score: args.score, ease: Power0.easeNone, onUpdate: function () {
      score = Math.floor(s.score)
    }
  })

  if (args.score > bestScore[size]) {
    var bs = {score: bestScore[size]}
    TweenLite.to(bs, 0.3, {
      score: args.score, ease: Power0.easeNone, onUpdate: function () {
        // Vue.set(bestScore, size, Math.floor(bs.score))
      }
    })
  }

  scoreInc = args.scoreInc + '+'
  nextTick(function () {
    self.scoreInc = ''
  })
}
const onGameAimChanged = function (aim) {
  gameAim = aim
}
const onGameAimReached = function () {
  gameAimReached = true
  awards[gameAim].obtained = true
  persistState()

  var awardEl = getAwardEl(gameAim)
  var gameAimEl = gameAim
  var p1 = gameAimEl.getBoundingClientRect()
  var p2 = awardEl.getBoundingClientRect()
  var ws = p1.width / p2.width
  var hs = p1.height / p2.height
  var x = p1.left - p2.left + (p1.width / 4)
  var y = p1.top - p2.top + (p1.height / 2)

  var s = awardEl.style
  s['-webkit-transform'] = s.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + ws + ',' + hs + ')'
  s['-webkit-transition'] = s.transition = ''
  s.zIndex = 100
  requestAnimationFrame(function () {
    s['-webkit-transition'] = s.transition = 'all 2s'
    s['-webkit-transform'] = s.transform = ''
  })
}
const getAwardEl = function (aim) {
  for (var i in awards) {
    var c = awards[i]
    if (c.award.aim == aim)
      return c.$el
  }
  return null
}
const showCollectAllAwards = function () {
  var s = collectAllAwards.style
  s['-webkit-animation'] = s.animation = ''
  requestAnimationFrame(function () {
    s['-webkit-animation'] = s.animation = 'collect-all-awards 10s'
  })
}

</script>

<style scoped>

</style>