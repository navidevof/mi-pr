<template>
  <header class="fixed bottom-0 left-0 flex w-full rounded-t-2xl bg-custom-black-3 py-3 shadow shadow-custom-orange-1">
    <nav class="mx-auto w-10/12">
      <ul class="flex items-center justify-center divide-x divide-white">
        <li class="px-8">
          <router-link to="/configuracion" active-class="text-custom-orange-1 stroke-2">
            <IconSettings class="w-8" />
          </router-link>
        </li>
        <li class="px-8">
          <router-link to="/" exact-active-class="text-custom-orange-1 stroke-2">
            <IconHome class="w-8" />
          </router-link>
        </li>
        <li class="px-8">
          <router-link to="/usuario" active-class="text-custom-orange-1 stroke-2">
            <IconUser class="w-8" />
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import IconSettings from '@/components/icons/IconSettings.vue';
import IconHome from '@/components/icons/IconHome.vue';
import IconUser from '@/components/icons/IconUser.vue';
</script>
