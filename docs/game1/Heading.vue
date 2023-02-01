<script lang="ts" setup>
const props = defineProps<{
  score: number;
  bestScore: number;
  scoreIncrement: { id: number; value: number; };
}>();
</script>

<template>
  <div class="heading">
    <h1 class="title">2048</h1>
    <div class="scores">
      <div class="score score-now">
        <p class="label">{{ 'SCORE'}}</p>
        <p class="value">{{ props.score }}</p>

        <!-- score increment -->
        <span class="score-increment" v-show="props.scoreIncrement.value > 0" :key="props.scoreIncrement.id">
          +{{ props.scoreIncrement.value }}
        </span>
      </div>
      <div class="score">
        <p class="label">BEST</p>
        <p class="value">{{ props.bestScore }}</p>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
@import './grid.scss';

.heading {
  display: flex;
  justify-content: space-between;

  .title {
    margin: 0;
    font-size: 4em;

    @include smaller(500px) {
      font-size: 3em;
    }
  }

  .scores {
    display: flex;
    align-items: center;

    .score {
      min-width: 80px;
      padding: 8px 12px;
      font-weight: bold;
      text-align: center;
      border-radius: 4px;
      background: var(--score-bg-color);

      @include smaller(720px) {
        padding: 2px 4px;
      }

      &:last-child {
        margin-inline-start: 8px;
      }

      .label {
        margin: 0;
        font-size: 12px;
        color: var(--score-label-color);
      }

      .value {
        margin: 0;
        font-size: 18px;
        color: var(--score-value-color);
      }
    }

    .score-now {
      position: relative;

      .score-increment {
        position: absolute;
        top: 0;
        left: 20px;
        z-index: 100;
        font-size: 2em;
        font-weight: bold;
      }

      @media (prefers-reduced-motion: no-preference) {
        .score-increment {
          animation: popup 500ms linear;
          animation-fill-mode: forwards;
        }

        @keyframes popup {
          0% {
            opacity: 0.5;
            transform: translateY(30px);
          }

          50% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
      }
    }
  }
}
</style>
