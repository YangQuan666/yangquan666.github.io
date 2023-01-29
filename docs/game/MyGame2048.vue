<template>
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
    <!--      <div class="game-awards-container" :style="gameAwardsContainerStyle">-->
    <!--        <game2048-award ref="awards" v-for="a in awards" key="a.aim" :award="a" :style="gameAwardStyle" :like-style="gameAwardLikeStyle"></game2048-award>-->
    <!--      </div>-->
    <div style="display:none" ref="collectAllAwards" class="collect-all-awards" v-if="!allAwardsObtained">
      <span>Collect all awards!</span>
    </div>
  </div>
</template>

<script type="ts">

// import Game2048 from "./game2048.vue";

import Game2048 from "./game2048.vue";

var defBoardSizePx = 420
var defSize = 4
export default {
  components: {Game2048},
  el: '#app',
  data: function () {
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

    return {
      boardSizePx: defBoardSizePx,
      size: defSize,
      sizes: sizes,
      sizeAimMap: sizeAimMap,
      gameStarted: false,
      gameEnded: false,
      gameAim: sizeAimMap[defSize],
      gameAimReached: false,
      score: 0,
      scoreInc: '',
      bestScore: bestScore,
      awards: awards
    }
  },
  created: function () {
    this.loadState()
  },
  mounted: function () {
    var self = this
    requestAnimationFrame(function () {
      self.fitBoardSizePx()
      requestAnimationFrame(function () {
        self.$el.style.visibility = 'visible'
        self.showCollectAllAwards()
      })
    })
  },
  computed: {
    gameOverStyle: function () {
      return {fontSize: this.boardSizePx / 6 + 'px'}
    },
    gameContainerStyle: function () {
      return {
        width: this.boardSizePx + 'px',
        height: this.boardSizePx + 'px'
      }
    },
    mainContainerStyle: function () {
      return {
        width: this.boardSizePx + 'px',
      }
    },
    gameControlsStyle: function () {
      return {
        height: (this.boardSizePx * 0.2) + 'px'
      }
    },
    scoreContainerStyle: function () {
      return {
        height: (this.boardSizePx * 0.20) + 'px'
      }
    },
    gameAimStyle: function () {
      var bsh = (this.boardSizePx / 50) + 'px '
      return {
        boxShadow: '0 ' + bsh + bsh + 'black',
        fontSize: this.boardSizePx / 110 + 'em'
      }
    },
    buttonStyle: function () {
      return {
        fontSize: this.boardSizePx / 450 + 'em'
      }
    },
    scoreStyle: function () {
      return {
        fontSize: this.boardSizePx / 280 + 'em'
      }
    },
    gameAwardsContainerStyle: function () {
      return {
        height: (this.boardSizePx * 0.08) + 'px',
      }
    },
    gameAwardStyle: function () {
      return {
        width: this.boardSizePx / 5 + 'px',
        fontSize: this.boardSizePx / 350 + 'em'
      }
    },
    gameAwardLikeStyle: function () {
      return {
        height: this.boardSizePx / 21 + 'px'
      }
    },
    allAwardsObtained: function () {
      for (var i in this.awards)
        if (!this.awards[i].obtained)
          return false
      return true
    }
  },
  watch: {
    size: function () {
      this.gameEnded = false
    }
  },
  methods: {
    fitBoardSizePx: function () {
      if (window.innerWidth < defBoardSizePx * 1.04) {
        this.boardSizePx = window.innerWidth * 0.96
      } else {
        this.boardSizePx = defBoardSizePx
      }
    },
    loadState: function () {
      try {
        var s = document.cookie
        if (s) {
          var state = JSON.parse(s)
          if (state) {
            if (state.awards)
              this.awards = state.awards
            if (state.bestScore)
              this.bestScore = state.bestScore
          }
        }
      } catch (e) {
      }
    },
    persistState: function () {
      try {
        var state = {
          bestScore: this.bestScore,
          awards: this.awards
        }
        document.cookie = JSON.stringify(state)
      } catch (e) {
      }
    },
    startGame: function () {
      this.gameStarted = true
      this.score = 0
      this.showCollectAllAwards()
    },
    onGameStarted: function () {
      this.gameStarted = true
      this.gameEnded = false
    },
    onGameEnded: function () {
      this.gameStarted = false
      this.gameEnded = true
      this.gameAimReached = false
      this.persistState()
    },
    onGameScore: function (args) {
      var s = {score: this.score}
      var self = this
      TweenLite.to(s, 0.3, {
        score: args.score, ease: Power0.easeNone, onUpdate: function () {
          self.score = Math.floor(s.score)
        }
      })

      if (args.score > this.bestScore[this.size]) {
        var bs = {score: this.bestScore[this.size]}
        TweenLite.to(bs, 0.3, {
          score: args.score, ease: Power0.easeNone, onUpdate: function () {
            Vue.set(self.bestScore, self.size, Math.floor(bs.score))
          }
        })
      }

      this.scoreInc = args.scoreInc + '+'
      Vue.nextTick(function () {
        self.scoreInc = ''
      })
    },
    onGameAimChanged: function (aim) {
      this.gameAim = aim
    },
    onGameAimReached: function () {
      this.gameAimReached = true
      this.awards[this.gameAim].obtained = true
      this.persistState()

      var awardEl = this.getAwardEl(this.gameAim)
      var gameAimEl = this.$refs.gameAim
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
    },
    getAwardEl: function (aim) {
      for (var i in this.$refs.awards) {
        var c = this.$refs.awards[i]
        if (c.award.aim == aim)
          return c.$el
      }
      return null
    },
    showCollectAllAwards: function () {
      var s = this.$refs.collectAllAwards.style
      s['-webkit-animation'] = s.animation = ''
      requestAnimationFrame(function () {
        s['-webkit-animation'] = s.animation = 'collect-all-awards 10s'
      })
    }
  }
}
</script>

<style scoped>
body,
html {
  font-family: 'Source Sans Pro', Arial, sans-serif;
  color: #2c3e50;
  font-size: 18px;
  margin: 0;
  background-color: honeydew;
}

.half-white {
  background-color: white;
  opacity: 0.7;
}

.main-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 2%;
  /* Hack to improve transition performance on mobile devices. It enables GPU rendering. */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.main-container .score-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-container .score-container .game-aim {
  font-weight: bold;
  font-size: 4em;
  text-align: center;
  color: white;
  background-color: #35495e;
  border-radius: 5% / 9%;
  width: 38%;
}

.main-container .score-container .game-aim-reached {
  text-shadow: 0 0 20px;
  animation: pulse 1s 3;
  -webkit-animation: pulse 1s 3;
  transition: text-shadow 3s;
  -webkit-transition: -webkit-text-shadow 3s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale(1)
  }

  50% {
    -webkit-transform: scale(1.1)
  }

  100% {
    -webkit-transform: scale(1)
  }
}

.main-container .score-container .scores {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  width: 50%;
}

.main-container .score-container .scores .score {
  position: relative;
  text-align: center;
  color: white;
  background-color: #9aa4af;
  border-radius: 5%/ 8%;
  width: 50%;
  padding-top: 2%;
}

.main-container .score-container .scores .score .score-inc {
  position: absolute;
  left: 0;
  color: #2c3e50;
  width: 100%;
  animation: up-disappear 1.5s;
  -webkit-animation: up-disappear 1.5s;
}

.main-container .score-container .scores .score .label {
  color: white;
  font-size: 1rem;
}


.main-container .game-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.main-container .game-controls .button {
  background-color: #35495e;
  border: none;
  border-radius: 5% / 9%;
  width: 25%;
  height: 75%;
  color: white;
  outline: none;
  font-weight: bold;
  overflow: hidden;
  cursor: pointer;
  animation: appearing 0.5s;
  -webkit-animation: appearing 0.5s;
}

.main-container .game-controls .size-control {
  width: 75%;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: appearing 0.5s;
  -webkit-animation: appearing 0.5s;
}

.main-container .game-controls .size-control input[type=radio]:not(checked) {
  position: absolute;
  opacity: 0;
}

.main-container .game-controls .size-control input[type=radio]+label {
  cursor: pointer;
  border: 5px solid #35495e;
  height: 30px;
  width: 30px;
  display: inline-flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  position: relative;
  vertical-align: middle;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
  -webkit-transition: -webkit-background-color 0.3s, -webkit-color 0.3s;
}

.main-container .game-controls .size-control input[type=radio]:checked+label {
  background: #41b883;
  color: white;
}

.main-container .game-container {
  position: relative;
}

.main-container .game-container .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-container .game-awards-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2%;
}

.main-container .game-awards-container .award {
  border-radius: 15% / 50%;
  text-align: center;
  font-size: 1.2em;
}

.main-container .game-awards-container .award .like {
  width: 25%;
  top: 2px;
  position: relative;
}

.main-container .game-awards-container .award-not-obtained {
  color: #dee8ff;
  background-color: #9aa4af;
  fill: #dee8ff;
}

.main-container .game-awards-container .award-obtained {
  color: white;
  text-shadow: 0px 0px 4px orange;
  background: linear-gradient(to top right, gold, yellow);
  box-shadow: 0 2px 4px 0 black;
  fill: white;
  filter: drop-shadow( -1px -1px 0 orange);
}

.main-container .collect-all-awards {
  text-align: center;
  width: 100%;
  opacity: 0;
  margin-top: 4px;
}

.main-container .collect-all-awards span {
  border: 1px solid #2c3e50;
  border-radius: 7% / 50%;
  padding: 0 3px 0 3px;
}

.game-over {
  font-weight: bold;
  text-align: center;
}

.appearing {
  animation: appearing 1s;
  -webkit-animation: appearing 1s;
}

.appearing07 {
  animation: appearing07 1s;
  -webkit-animation: appearing07 1s;
}

@keyframes appearing {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-webkit-keyframes appearing {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes up-disappear {
  0% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}

@-webkit-keyframes up-disappear {
  0% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    -webkit-transform: translateY(-40px);
  }
}

@keyframes appearing07 {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.7;
  }
}

@-webkit-keyframes appearing07 {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.7;
  }
}

.board {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: space-around;
  background-color: #35495e;
  outline: none;
}

.board .cell {
  background-color: #41b883;
  position: relative;
  border-radius: 7%;
}

.board .cell .chip {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-align: justify;
  font-weight: bold;
  background-color: honeydew;
  z-index: 1;
  border-radius: 7%;
  /* Hack to improve transition performance on mobile devices. It enables GPU rendering. */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

@keyframes chip-value-changed {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes chip-value-changed {
  0% {
    -webkit-transform: scale(1);
  }

  50% {
    -webkit-transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1);
  }
}

@keyframes chip-appear {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes chip-appear {
  0% {
    -webkit-transform: scale(0);
  }

  100% {
    -webkit-transform: scale(1);
  }
}

@keyframes collect-all-awards {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  60% {
    transform: translateY(20px);
    opacity: 0;
  }

  65% {
    opacity: 1;
    transform: translateY(0);
  }

  78% {
    transform: translateX(0);
    opacity: 1;
  }

  79% {
    transform: translateX(5px);
    opacity: 1;
  }

  80% {
    transform: translateX(-5px);
    opacity: 1;
  }

  81% {
    transform: translateX(5px);
    opacity: 1;
  }

  82% {
    transform: translateX(-5px);
    opacity: 1;
  }

  83% {
    transform: translateX(5px);
    opacity: 1;
  }

  84% {
    transform: translateX(-5px);
    opacity: 1;
  }

  85% {
    transform: translateX(5px);
    opacity: 1;
  }

  86% {
    transform: translateX(-5px);
    opacity: 1;
  }

  87% {
    transform: translateX(5px);
    opacity: 1;
  }

  88% {
    transform: translateX(-5px);
    opacity: 1;
  }

  89% {
    transform: translateX(0);
    opacity: 1;
  }

  99% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateY(20px);
    opacity: 0
  }
}

@-webkit-keyframes collect-all-awards {
  0% {
    opacity: 0;
    -webkit-transform: translateY(20px);
  }

  60% {
    -webkit-transform: translateY(20px);
    opacity: 0;
  }

  65% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }

  78% {
    -webkit-transform: translateX(0);
    opacity: 1;
  }

  79% {
    transform: translateX(5px);
    opacity: 1;
  }

  80% {
    -webkit-transform: translateX(-5px);
    opacity: 1;
  }

  81% {
    -webkit-transform: translateX(5px);
    opacity: 1;
  }

  82% {
    -webkit-transform: translateX(-5px);
    opacity: 1;
  }

  83% {
    -webkit-transform: translateX(5px);
    opacity: 1;
  }

  84% {
    -webkit-transform: translateX(-5px);
    opacity: 1;
  }

  85% {
    transform: translateX(5px);
    opacity: 1;
  }

  86% {
    -webkit-transform: translateX(-5px);
    opacity: 1;
  }

  87% {
    -webkit-transform: translateX(5px);
    opacity: 1;
  }

  88% {
    -webkit-transform: translateX(-5px);
    opacity: 1;
  }

  89% {
    -webkit-transform: translateX(0);
    opacity: 1;
  }

  99% {
    -webkit-transform: translateX(0);
    opacity: 1;
  }

  100% {
    -webkit-transform: translateY(20px);
    opacity: 0
  }
}
</style>