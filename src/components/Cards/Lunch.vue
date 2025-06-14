<script setup lang="ts">
import { ref, computed } from 'vue';

import AppLink from '@/components/App/Link.vue';
import CardsLunchMenu from '@/components/Cards/Lunch/Menu.vue';

import { toCaseCount } from '@/utils/helpers';

import type { LunchData, LunchMenuItem } from '@/types/lunch.d.ts';

const props = defineProps<{
  item: LunchData;
}>();
const item = props.item;

const openedMenu = ref<string | null>(null);
const selectedProducts = ref<Record<string, string[]>>({});

// Суммарная цена по умолчанию
const defaultTotalPrice = computed(() =>
  item.menu.reduce((sum: number, menuItem: LunchData['menu'][number]) => {
    if (menuItem.children.length > 0) {
      return sum + (menuItem.children[0].price || 0);
    }
    return sum;
  }, 0)
);

// Суммарная цена выбранных продуктов
const selectedTotalPrice = computed(() => {
  let total = 0;
  let hasSelected = false;

  item.menu.forEach((menuItem: LunchData['menu'][number]) => {
    const selected = selectedProducts.value[menuItem.name];
    if (selected && selected.length) {
      hasSelected = true;
      menuItem.children.forEach((child) => {
        if (selected.includes(child.name)) {
          total += child.price || 0;
        }
      });
    } else if (menuItem.children.length > 0) {
      total += menuItem.children[0].price || 0;
    }
  });

  return hasSelected ? total : defaultTotalPrice.value;
});

// Выбора продуктов
function handleSelect(menuName: string, selected: string[]) {
  selectedProducts.value = {
    ...selectedProducts.value,
    [menuName]: selected,
  };
}

function handleMenuClick(menuName: string) {
  openedMenu.value = openedMenu.value === menuName ? null : menuName;
}

// Подсчёт суммы выбранных продуктов в конкретном меню
function getSelectedMenuPrice(menuItem: LunchData['menu'][number]) {
  const selected = selectedProducts.value[menuItem.name];

  if (selected && selected.length) {
    return menuItem.children
      .filter((child) => selected.includes(child.name))
      .reduce((sum, child) => sum + (child.price || 0), 0);
  }

  // Если ничего не выбрано
  return menuItem.children.length ? menuItem.children[0].price || 0 : 0;
}
</script>

<template>
  <div class="lunch-card">
    <div
      class="lunch-card__head"
      :style="{
        backgroundImage: `url(${item.image ?? '/images/no-image.png'})`,
      }"
    >
      <div class="lunch-card__content">
        <AppLink class="lunch-card__title text link" :to="item.link">{{
          item.name
        }}</AppLink>
        <span
          class="lunch-card__address text"
          v-html="item.info.address"
          v-if="item.info.address"
        ></span>
        <span
          class="lunch-card__time text"
          v-html="item.info.lunch_time"
          v-if="item.info.lunch_time"
        ></span>
      </div>
    </div>
    <ul class="lunch-card__list">
      <li
        class="lunch-card__item"
        v-for="menuItem in item.menu"
        :key="menuItem.name"
        :style="{
          cursor: menuItem.children.length > 1 ? 'pointer' : 'default',
        }"
      >
        <span
          class="lunch-card__text text"
          v-if="menuItem.children.length > 1"
          @click.stop="handleMenuClick(menuItem.name)"
        >
          <template v-if="(selectedProducts[menuItem.name]?.length || 1) === 1">
            {{
              menuItem.children.find((children: LunchMenuItem) =>
                selectedProducts[menuItem.name]?.length
                  ? selectedProducts[menuItem.name][0] === children.name
                  : true
              )?.name || menuItem.children[0].name
            }}
          </template>
          <template v-else>
            Выбрано {{ selectedProducts[menuItem.name]?.length }}
            {{
              toCaseCount(selectedProducts[menuItem.name]?.length || 0, [
                'позиция',
                'позиции',
                'позиций',
              ])
            }}
          </template>
        </span>
        <span class="lunch-card__text text" v-else>
          {{ menuItem.children[0].name }}
        </span>
        <span class="tag" v-if="menuItem.children.length > 1">
          {{
            getSelectedMenuPrice(menuItem).toLocaleString('ru-RU', {
              minimumFractionDigits: 2,
            })
          }}
        </span>
        <CardsLunchMenu
          v-if="menuItem.children.length"
          :is-open="openedMenu === menuItem.name"
          :menu="menuItem"
          :selected="selectedProducts[menuItem.name] || []"
          @select="handleSelect(menuItem.name, $event)"
          @close="openedMenu = null"
          :key="menuItem.name + '-menu'"
        />
      </li>
    </ul>
    <div class="lunch-card__footer">
      <span class="lunch-card__price text">
        {{
          selectedTotalPrice.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
          })
        }}&nbsp;р
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/mixins';

.lunch-card {
  --card-gap: #{rem(15)};
  --card-pb: #{rem(40)};
  --card-pt: #{rem(15)};
  --card-px: #{rem(25)};

  position: relative;

  padding: 0 0.5px;
  padding-bottom: var(--card-pb);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--card-gap);

  overflow: hidden;

  @include hover {
    .lunch-card {
      &__head::before {
        opacity: 0.5;
      }

      &__price {
        color: var(--color-text-light);

        background-color: var(--color-system-sales);
      }
    }
  }

  &__head {
    position: relative;

    width: 100%;
    height: auto;
    aspect-ratio: 350 / 150;
    display: flex;

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    &::before {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;

      width: 100%;
      height: 100%;

      background: linear-gradient(
          to bottom,
          rgba(100, 61, 15, 1) 0,
          rgba(100, 61, 15, 0) 100%
        )
        repeat scroll 0 0;
      opacity: 0.4;

      transition: opacity var(--animation-default);

      pointer-events: none;
      user-select: none;
    }
  }

  &__content {
    position: relative;
    z-index: 1;

    padding: var(--card-pt) var(--card-px);
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: rem(10);

    color: var(--color-text-light);

    > * {
      text-shadow: var(--shadow-text-light);
    }
  }

  &__title {
    color: inherit;
    font: var(--font-card-title);

    &::before {
      @include pseudo(0);
    }
  }

  &__address {
    color: inherit;
    font: var(--font-card-description);
  }

  &__footer {
    margin-top: auto;

    padding: 0 var(--card-px);
    width: 100%;
  }

  &__price {
    position: relative;

    padding: 0 rem(5);
    width: fit-content;
    height: fit-content;

    color: var(--color-text-dark);
    font: var(--font-price);

    transition:
      color var(--animation-default),
      background-color var(--animation-default);
  }

  &__list {
    margin: 0;

    padding: 0 var(--card-px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: rem(13);

    list-style: none;
  }

  &__item {
    color: var(--color-text-dark);
    font: var(--font-body);

    &:has(.tag) {
      transition: color var(--animation-default);

      cursor: pointer;

      @include hover {
        color: var(--color-accent);
      }

      .lunch-card__text {
        text-decoration-color: inherit;
        text-decoration-line: underline;
        text-decoration-style: dashed;
        text-decoration-skip-ink: none;
        text-decoration-thickness: 1px;
        text-underline-position: from-font;
        text-underline-offset: 1%;
      }
    }

    .tag {
      margin-left: 8px;
    }
  }
}
</style>
