<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {CellState, CellWithPosition, Direction, useGrid} from './game';
import {useLocalStorage, uuid} from './utils';
// init
const size = ref(4);
const {cells, score, isEnd, move, undo, init, start} = useGrid(size.value);
const {setItem, getItem} = useLocalStorage();
const storageKey = computed(() => `size${size.value}_best`);
const bestScore = ref(getItem(storageKey.value) ?? 0);
const scoreDiff = ref({id: uuid(), value: 0});
watch(score, (newVal, oldVal) => {
  // score diff
  scoreDiff.value.id = uuid();
  scoreDiff.value.value = newVal - oldVal;
  // update best score
  if (newVal > bestScore.value) {
    bestScore.value = newVal;
    setItem(storageKey.value, bestScore.value);
  }
});
const gap = 8;
const gridSize = ref(0);
const cellSize = computed(() => {
  return (gridSize.value - ((size.value + 1) * gap)) / size.value;
});
const gridStyle = computed(() => {
  return `
    display: grid;
    grid-template-columns: repeat(${size.value}, 1fr);
    grid-template-rows: repeat(${size.value}, 1fr);
    gap: ${gap}px;
    padding: ${gap}px;
  `;
});
const getCellStyle = (cell: CellWithPosition) => {
  const width = cellSize.value;
  const {x, y} = cell;
  const ty = (width * y) + (gap * (y + 1));
  const tx = (width * x) + (gap * (x + 1));
  return `
    width: ${width}px;
    height: ${width}px;
    top: ${ty}px;
    left: ${tx}px;
    font-size: ${Math.round(width / 2.5)}px;
  `;
};
// watch size change
const handleSizeChange = () => {
  console.log('d')
  bestScore.value = getItem(storageKey.value) ?? 0;
  init(size.value);
  start();
}
// event
const gridRef = ref<HTMLElement>();
let touchStartX: number = 0;
let touchStartY: number = 0;
let playing = false;
let observer: ResizeObserver;
const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
};
const onTouchMove = (event: TouchEvent) => {
  event.preventDefault();
};
const onTouchEnd = (event: TouchEvent) => {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const dx = Math.abs(touchEndX - touchStartX);
  const dy = Math.abs(touchEndY - touchStartY);
  if (Math.max(dx, dy) <= 10) return;
  if (dx > dy) {
    touchEndX > touchStartX ? move(Direction.RIGHT) : move(Direction.LEFT);
  } else {
    touchEndY > touchStartY ? move(Direction.DOWN) : move(Direction.UP);
  }
};
const onKeydown = (event: KeyboardEvent) => {
  if (playing) return;
  playing = true;
  const modifier =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  if (isEnd.value || modifier) return;
  switch (event.code) {
    case 'ArrowUp':
      move(Direction.UP);
      break;
    case 'ArrowDown':
      move(Direction.DOWN);
      break;
    case 'ArrowLeft':
      move(Direction.LEFT);
      break;
    case 'ArrowRight':
      move(Direction.RIGHT);
      break;
  }
};
const onKeyup = () => {
  playing = false;
};
onMounted(() => {
  document.addEventListener('keydown', onKeydown, false);
  document.addEventListener('keyup', onKeyup, false);
  if (gridRef.value) {
    const el = gridRef.value
    el.addEventListener('touchstart', onTouchStart, false);
    el.addEventListener('touchmove', onTouchMove, false);
    el.addEventListener('touchend', onTouchEnd, false);
    observer = new ResizeObserver(() => {
      gridSize.value = el.clientWidth;
    });
    observer.observe(el);
    gridRef.value?.scrollIntoView({behavior: 'smooth'});
  }
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, false);
  document.removeEventListener('keyup', onKeyup, false);
  if (gridRef.value) {
    const el = gridRef.value
    el.removeEventListener('touchstart', onTouchStart, false);
    el.removeEventListener('touchmove', onTouchMove, false);
    el.removeEventListener('touchend', onTouchEnd, false);
    observer.disconnect();
  }
});
const handleNewGame = () => {
  init();
  start();
};
// start game
start();
</script>

<template>

  <div class="game">
    <div class="grid">
      <header class="grid-header">
        <div class="controls">
          <h3>2048</h3>
            <div>
              <p class="label">{{ 'SCORE' }}</p>
              <p class="value">{{ score }}</p>
              <!-- score increment -->
<!--              <span class="score-increment" v-show="scoreDiff.value > 0" :key="scoreDiff.id">-->
<!--                +{{ scoreDiff.value }}-->
<!--              </span>-->
            </div>
            <div>
              <p class="label">BEST</p>
              <p class="value">{{ bestScore }}</p>
            </div>
          </div>
        <div class="row">
          <q-select
              v-model="size"
              :options="[3,4,5,6]"
              behavior="menu"
              @update:model-value="handleSizeChange"
          >
            <template v-slot:prepend>
              <q-icon name="lens_blur"/>
            </template>
          </q-select>
          <q-space/>
          <q-btn-group>
            <q-btn icon="refresh" @click="handleNewGame"/>
            <q-btn icon="undo" @click="undo"/>
          </q-btn-group>
        </div>
      </header>

      <main class="grid-main" ref="gridRef" :style="gridStyle">
        <!-- cell placeholder -->
        <div class="cell-placeholder" v-for="i in size * size" :key="i"/>

        <!-- cells -->
        <div class="cell" v-for="cell in cells" :key="cell.id" :class="{
        [`cell-${cell.value}`]: true,
        'cell-merge': cell.state === CellState.MERGE,
        'cell-new': cell.state === CellState.NEW
      }" :style="getCellStyle(cell)">{{ cell.value }}
        </div>

        <!-- dialog wrapper -->
        <transition name="fade">
          <div v-show="isEnd" class="dialog">
            <p class="text">GAME OVER</p>
          </div>
        </transition>
      </main>
    </div>
  </div>

</template>

<style lang="scss" scoped>

@mixin smaller($value) {
  @media screen and (max-width: $value) {
    @content;
  }
}

@function exponent($base, $exponent) {
  // reset value
  $value: $base;
  // positive intergers get multiplied
  @if $exponent > 1 {
    @for $i from 2 through $exponent {
      $value: $value * $base;
    }
  }
  // negitive intergers get divided. A number divided by itself is 1
  @if $exponent < 1 {
    @for $i from 0 through -$exponent {
      $value: $value / $base;
    }
  }
  // return the last value written
  @return $value;
}

@function pow($base, $exponent) {
  @return exponent($base, $exponent);
}

$cell-color: #eee4da;
$cell-gold-color: #edc22e;
$cell-gold-glow-color: lighten($cell-gold-color, 15%);
$bright-text-color: #f9f6f2;
$base: 2;
$exponent: 1;
$limit: 15;

$special-colors: false false,
  // 2
false false,
  // 4
#f78e48 true,
  // 8
#fc5e2e true,
  // 16
#ff3333 true,
  // 32
#ff0000 true,
  // 64
false true,
  // 128
false true,
  // 256
false true,
  // 512
false true,
  // 1024
false true,
  // 2048
false true,
  // 4096
false true,
  // 8192
false true,
  // 16384
false true;

@mixin buildCellStyle {
  & {
    will-change: left;
    will-change: top;
    transition: left 100ms ease-in-out 0s;
    transition: top 100ms ease-in-out 0s;
    animation-fill-mode: backwards;
  }

  @while $exponent <= $limit {
    $power: pow($base, $exponent);

    &.cell-#{$power} {
      // Calculate base background color
      $gold-percent: calc(($exponent - 1) / ($limit - 1));
      $mixed-background: mix($cell-gold-color, $cell-color, $gold-percent * 100%);

      $nth-color: nth($special-colors, $exponent);

      $special-background: nth($nth-color, 1);
      $bright-color: nth($nth-color, 2);

      @if $special-background {
        $mixed-background: mix($special-background, $mixed-background, 55%);
      }

      @if $bright-color {
        color: $bright-text-color;
      }

      // Set background
      background: $mixed-background;

      // Add glow
      $glow-opacity: calc(max($exponent - 4, 0) / ($limit - 4));

      @if not $special-background {
        box-shadow: 0
        0
        30px
        10px
        rgba($cell-gold-glow-color, calc($glow-opacity / 1.8)),
        inset 0 0 0 1px rgba(white, calc($glow-opacity / 3));
      }
    }

    $exponent: $exponent + 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    @keyframes appear {
      0% {
        opacity: 0;
        transform: scale(0);
      }

      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes pop {
      0% {
        transform: scale(0);
      }

      50% {
        transform: scale(1.2);
      }

      100% {
        transform: scale(1);
      }
    }

    &.cell-new {
      animation: appear 300ms ease-in 100ms;
      animation-fill-mode: backwards;
    }

    &.cell-merge {
      animation: pop 200ms ease-in 100ms;
      animation-fill-mode: backwards;
    }
  }
}

.game {
  flex: 1;
  display: flex;
  align-items: center;
  flex-flow: column;
}
.grid-header {
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-start: 2em;
    .select-wrapper {
      display: flex;
      align-items: center;
      .label {
        font-size: 14px;
      }
      .select {
        display: inline-block;
        width: 60px;
        padding: 4px;
        margin-inline-start: 8px;
        border-radius: 4px;
        cursor: pointer;
        color: var(--select-color);
        background-color: var(--select-bg-color);
      }
    }
  }
}
.grid-main {
  width: 500px;
  height: 500px;
  margin-block: 12px;
  background-color: #bbada0;
  border-radius: 6px;
  resize: none;
  user-select: none;
  position: relative;
  // media query
  @media screen and (max-width: 960px) {
    width: 400px;
    height: 400px;
  }
  @media screen and (max-width: 720px) {
    width: 350px;
    height: 350px;
  }
  @media screen and (max-width: 480px) {
    width: 300px;
    height: 300px;
  }
  .cell-placeholder {
    border-radius: 6px;
    background-color: #c8bbaf;
  }
  .cell {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 6px;
    @include buildCellStyle();
    color: var(--cell-color);
  }
  .dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background: var(--dialog-bg-color);
    .text {
      font-size: 3em;
      font-weight: bold;
      transform: translateY(-20px);
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>