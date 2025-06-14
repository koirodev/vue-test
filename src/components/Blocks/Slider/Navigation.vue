<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

import IconChevronLeft from '@/components/Icons/ChevronLeft.vue';

const props = withDefaults(
  defineProps<{
    slideCount?: number;
    currentIndex?: number;
    cardWidth?: number;
  }>(),
  {
    slideCount: 0,
    currentIndex: 0,
    cardWidth: 0,
  }
);

const slideCount = computed(() => props.slideCount);
const currentIndex = computed(() => props.currentIndex);

const emit = defineEmits<{
  (e: 'update:index', value: number): void;
}>();

const canPrev = computed(() => currentIndex.value > 0);
const canNext = computed(() => currentIndex.value < slideCount.value - 1);

function onPrev() {
  if (canPrev.value) {
    emit('update:index', currentIndex.value - 1);
  }
}

function onNext() {
  if (canNext.value) {
    emit('update:index', currentIndex.value + 1);
  }
}
</script>

<template>
  <div class="slide-navigation">
    <button
      class="slide-navigation__button slider-navigation__button_prev"
      @click="onPrev"
      :disabled="!canPrev"
      type="button"
    >
      <IconChevronLeft class="icon" />
    </button>
    <button
      class="slide-navigation__button slider-navigation__button_next"
      @click="onNext"
      :disabled="!canNext"
      type="button"
    >
      <IconChevronLeft class="icon" style="transform: rotate(180deg)" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/mixins';

.slide-navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: rem(10);

  &__button {
    background: transparent;
    border: none;

    transition: opacity var(--animation-default);

    cursor: pointer;

    &:disabled {
      opacity: 0.5;

      cursor: not-allowed;
    }

    @include hover {
      &:not(:disabled) {
        .icon {
          --icon-color: var(--color-accent);
        }
      }
    }
  }
}
</style>
