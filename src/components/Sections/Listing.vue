<script setup lang="ts">
import AppLink from '@/components/App/Link.vue';

defineProps<{
  title?: string;
  titleLink?: string;
  logo?: string;
  logoAlt?: string;
  logoLink?: string;
  navigation?: boolean;
}>();
</script>

<template>
  <section class="lunch-section section section_accent">
    <div class="container">
      <div class="section__head" v-if="title || logo">
        <h2 class="section__title h2" v-if="title && !titleLink">
          {{ title }}
        </h2>
        <h2 class="section__title h2" v-if="title && titleLink">
          <AppLink class="link" :to="titleLink">{{ title }}</AppLink>
        </h2>
        <AppLink
          class="lunch-section__logo"
          :to="logoLink ?? undefined"
          v-if="logo"
        >
          <img
            width="107"
            height="52"
            loading="lazy"
            :src="logo"
            :alt="logoAlt ?? undefined"
            :aria-hidden="logoAlt ? true : undefined"
          />
        </AppLink>
        <div class="section__menu" v-if="navigation">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="section__content">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/styles/mixins';

.lunch-section {
  &__logo {
    width: auto;
    height: rem(52);
    display: flex;

    user-select: none;

    @include mediaTablet {
      margin-left: auto;

      height: rem(40);
    }

    @include mediaMobile {
      height: rem(37);
    }

    img {
      width: auto;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
