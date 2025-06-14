<script setup lang="ts">
import { isBlank } from '@/utils/helpers';

defineProps<{
  to?: string | null;
}>();
</script>

<template>
  <component
    :is="to ? 'a' : 'span'"
    :href="to ?? undefined"
    :target="isBlank(to) ? '_blank' : undefined"
  >
    <slot />
  </component>
</template>
