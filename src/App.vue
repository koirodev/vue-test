<script setup lang="ts">
import { ref } from 'vue';

import SectionsListing from '@/components/Sections/Listing.vue';
import CardsLunch from '@/components/Cards/Lunch.vue';
import BlocksSlider from '@/components/Blocks/Slider.vue';
import BlocksSliderNavigation from '@/components/Blocks/Slider/Navigation.vue';

import rawLunchData from '@/data/lunch.json';
import type { LunchData } from '@/types/lunch.d.ts';

const lunchData = rawLunchData as LunchData[];

const activeIndex = ref(0);
const slideCount = ref(0);
const current = ref(0);
const cardWidth = ref(0);

function onSliderUpdate({
  count,
  index,
  width,
}: {
  count: number;
  index: number;
  width: number;
}) {
  slideCount.value = count;
  current.value = index;
  cardWidth.value = width;
}

function onSliderIndexUpdate(newIndex: number) {
  activeIndex.value = newIndex;
}
</script>

<template>
  <main>
    <SectionsListing
      navigation
      class="section_padding_top section_padding_bottom"
      title="Бизнес-ланчи в Витебске"
      title-link="https://clever.by/vitebsk/dostavka/"
      logo="/images/clever.svg"
      logo-alt="Clever"
      logo-link="https://clever.by/vitebsk/dostavka/"
      v-if="lunchData.length"
    >
      <template #default>
        <BlocksSlider
          @update="onSliderUpdate"
          :active-index="activeIndex"
          @update:index="onSliderIndexUpdate"
        >
          <CardsLunch :item="item" v-for="item in lunchData" />
        </BlocksSlider>
      </template>
      <template #menu>
        <BlocksSliderNavigation
          :slide-count="slideCount"
          :current-index="activeIndex"
          :card-width="cardWidth"
          @update:index="onSliderIndexUpdate"
        />
      </template>
    </SectionsListing>
  </main>
</template>
