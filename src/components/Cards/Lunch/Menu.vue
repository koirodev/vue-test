<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';

import { priceToString } from '@/utils/helpers';

import IconCross from '@/components/Icons/Cross.vue';
import type { LunchMenuSection } from '@/types/lunch.d.ts';

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    menu: LunchMenuSection;
    selected?: string[];
  }>(),
  {
    isOpen: false,
    selected: () => [],
  }
);

const emit = defineEmits(['select', 'close']);

const selectedItems = ref<string[]>(
  props.selected.length
    ? [...props.selected]
    : props.menu.children.length
      ? [props.menu.children[0].name]
      : []
);

function toggleItem(name: string) {
  if (selectedItems.value.includes(name)) {
    selectedItems.value = selectedItems.value.filter((n) => n !== name);
  } else {
    selectedItems.value.push(name);
  }
}

function accept() {
  emit('select', [...selectedItems.value]);
  emit('close');
}

function closeMenu() {
  emit('close');
}

watch(
  () => props.selected,
  (val) => {
    selectedItems.value = val.length
      ? [...val]
      : props.menu.children.length
        ? [props.menu.children[0].name]
        : [];
  }
);
</script>

<template>
  <div class="card-menu" :class="{ 'card-menu_open': isOpen }">
    <span class="card-menu__title text">{{ menu.name }}</span>
    <button class="card-menu__close" @click="closeMenu">
      <IconCross class="icon" />
    </button>
    <ul class="card-menu__list">
      <li
        class="card-menu__item"
        v-for="item in menu.children"
        :key="item.name"
      >
        <label class="card-menu__label">
          <input
            type="checkbox"
            :checked="selectedItems.includes(item.name)"
            @change="toggleItem(item.name)"
          />
          <span class="card-menu__text text">
            {{ item.name }}
            <span class="card-menu__price text"
              >&nbsp;{{ priceToString(item.price) }}</span
            >
          </span>
        </label>
      </li>
    </ul>
    <button class="card-menu__accept" @click="accept">
      Посчитать цену обеда
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/mixins';

.card-menu {
  position: absolute;
  top: 0;
  right: 1px;
  left: 1px;
  z-index: 3;

  padding: var(--card-pt) var(--card-px);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: rem(15);

  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);

  transform: translateY(calc(100% + 2px));
  transition: transform var(--animation-default);

  &_open {
    transform: translateY(0);
  }

  &__title {
    color: var(--color-text-dark);
    font: var(--font-card-title);
  }

  &__close {
    position: absolute;
    top: rem(14);
    right: rem(14);
    margin: 0;

    padding: 0;
    width: fit-content;
    height: fit-content;

    background: transparent;
    border: none;

    cursor: pointer;
    user-select: none;

    @include hover {
      .icon {
        --icon-color: var(--color-accent);
      }
    }

    &::before {
      @include pseudo(14);
    }

    .icon {
      --icon-color: var(--color-text-dark);
      --icon-size: #{rem(16)};
    }
  }

  &__list {
    margin: 0;

    padding: 0;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    list-style: none;

    overflow-x: hidden;
    overflow-y: auto;
  }

  &__item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  &__label {
    --local-text-color: var(--color-text-dark);

    padding: rem(8) 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: rem(8);

    border-bottom: 1px dotted #ccc;

    cursor: pointer;

    @include hover {
      --local-text-color: var(--color-accent);
    }
  }

  &__text {
    flex-grow: 1;

    color: var(--local-text-color);
    font: var(--font-body);
    line-height: 1.2;

    transition: color var(--animation-default);
  }

  &__price {
    color: var(--color-grey);
    font: var(--font-price-small);
  }

  &__accept {
    margin-top: auto;

    width: 100%;
    min-height: rem(33);

    color: var(--color-text-light);
    font: var(--font-button);

    box-shadow: var(--shadow-button);
    background-color: var(--color-system-success);
    border: none;
    border-radius: 0;

    cursor: pointer;
    user-select: none;
  }
}
</style>
