<template>
  <router-link
    :to="link"
    :class="[link == '' ? 'cursor-not-allowed' : 'hover-button']"
    class="flex items-center justify-between rounded-lg bg-custom-black-3 px-5 py-3 duration-75"
  >
    <slot></slot>
  </router-link>
</template>

<script lang="ts" setup>
defineProps<{ link: string }>();
</script>
