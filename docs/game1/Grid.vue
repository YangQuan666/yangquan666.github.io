<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {CellState, CellWithPosition, Direction, useGrid} from './game';
import {useLocalStorage, uuid} from './utils';
import Heading from './Heading.vue';
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
const handleSizeChange = (event: Event) => {
  bestScore.value = getItem(storageKey.value) ?? 0;
  init(size.value);
  start();
  (event.target as HTMLSelectElement).blur();
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
        <Heading :score="score" :score-increment="scoreDiff" :best-score="bestScore"/>

        <div class="controls">
          <div class="select-wrapper">
            <label class="label" for="select">SIZE</label>
            <select class="select" id="select" v-model.number="size" @change="handleSizeChange">
              <template v-for="i in [3,4,5,6]" :key="i">
                <option class="option" v-if="i > 1" :value="i">{{ i }}</option>
              </template>
            </select>
          </div>
          <div class="btns">
            <button class="btn" @click="handleNewGame">NEW</button>
            <button class="btn" @click="undo">UNDO</button>
          </div>
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
            <p class="text">{{ 'message.game_over' }}</p>
          </div>
        </transition>
      </main>
    </div>
  </div>

</template>

<style lang="scss">
@import './grid.scss';
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
    .btns {
      .btn {
        padding: 8px 16px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        border-radius: 4px;
        color: var(--btn-color);
        background: var(--btn-bg-color);
        border: none;
        outline: none;
        cursor: pointer;
        @include smaller(480px) {
          padding: 4px 12px;
          font-size: 14px;
        }
        &:last-child {
          margin-inline-start: 10px;
        }
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
  @include smaller(960px) {
    width: 400px;
    height: 400px;
  }
  @include smaller(720px) {
    width: 350px;
    height: 350px;
  }
  @include smaller(480px) {
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