<script setup lang="ts">
import {
  ref,
  computed,
  useSlots,
  onMounted,
  onUnmounted,
  watch,
  defineEmits,
  defineProps,
} from 'vue';

import { useSliderDrag } from '@/composables/useSliderDrag';

const props = defineProps<{ activeIndex?: number }>();
const emit = defineEmits<{
  (e: 'update', payload: { count: number; index: number; width: number }): void;
  (e: 'update:index', value: number): void;
}>();

const slots = useSlots();
const rawSlides = computed(() => (slots.default ? slots.default() : []));
const slides = computed(() =>
  Array.isArray(rawSlides.value[0]) ? rawSlides.value[0] : rawSlides.value
);

const current = ref(props.activeIndex ?? 0);
const cardWidth = ref(0);
const sliderRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);
const slidePerView = computed(() =>
  sliderRef.value
    ? Math.round(sliderRef.value.offsetWidth / cardWidth.value) - 1
    : 0
);
const slideCount = computed(
  () => slides.value[0].children.length - slidePerView.value
);

const { isDragging, dragOffset, onDragStart } = useSliderDrag(
  cardWidth,
  slideCount,
  current
);

const updateCardWidth = () => {
  let el = cardRef.value;

  if (el && el.nodeType === 3 && el.nextElementSibling) {
    el = el.nextElementSibling as HTMLElement;
  }

  if (el && el instanceof HTMLElement) cardWidth.value = el.offsetWidth;

  if (current.value >= slideCount.value - 1) {
    current.value = Math.max(0, slideCount.value - 1);
  }

  emit('update', {
    count: slideCount.value,
    index: current.value,
    width: cardWidth.value,
  });
};

onMounted(() => {
  updateCardWidth();
  window.addEventListener('resize', updateCardWidth);
  emit('update', {
    count: slideCount.value,
    index: current.value,
    width: cardWidth.value,
  });
});

onUnmounted(() => window.removeEventListener('resize', updateCardWidth));

watch([current, slideCount], () =>
  emit('update', {
    count: slideCount.value,
    index: current.value,
    width: cardWidth.value,
  })
);

watch(
  () => props.activeIndex,
  (val) => {
    if (typeof val === 'number' && val !== current.value) current.value = val;
  }
);

watch(current, (val) => emit('update:index', val));
</script>

<template>
  <div
    class="food-slider"
    ref="sliderRef"
    @mousedown="onDragStart"
    @touchstart="onDragStart"
    style="user-select: none"
  >
    <div
      class="food-slider__wrapper"
      ref="wrapperRef"
      :style="{
        transform: `translateX(-${current * cardWidth + (isDragging ? -dragOffset : 0)}px)`,
        transition: isDragging ? 'none' : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
      }"
    >
      <component :is="slides[0]" v-if="slides.length" ref="cardRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/mixins';

.food-slider {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  &__wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
    flex-shrink: 0;

    will-change: transform;

    transition: transform var(--animation-default);

    > * {
      width: 25%;
      flex-shrink: 0;

      @include mediaLaptop {
        width: 33.3333%;
      }

      @include mediaTablet {
        width: 50%;
      }

      @include mediaMobile {
        width: 100%;
      }
    }
  }
}
</style>
