<!-- src/App.vue -->
<template>
  <div class="bg-background font-sans text-text-dark">
    <Sidebar class="fixed top-0 left-0 h-screen w-20 lg:w-52 z-50" />
    <div class="pl-20 lg:pl-52 min-h-screen flex flex-col">
      <Header class="h-16 shrink-0" />

      <main class="flex-1 overflow-auto p-4 pb-20">
        <router-view />
      </main>

      <BottomNav class="md:hidden" />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
</script>