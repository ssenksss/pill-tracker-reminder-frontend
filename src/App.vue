<!-- App -->
<template>
  <div class="bg-background font-sans text-text-dark">
    <!-- Sidebar sa leve strane (uvek prikazan) -->
    <Sidebar class="fixed top-0 left-0 h-screen w-20 lg:w-52 z-50" />

    <!-- Glavni sadržaj -->
    <div class="pl-20 lg:pl-52 min-h-screen flex flex-col">
      <Header class="h-16 shrink-0" /> <!-- Gornji deo aplikacije -->
      <main class="flex-1 overflow-auto p-4 pb-20">
        <router-view /> <!-- Prikaz stranice zavisno od rute -->
      </main>
      <BottomNav class="md:hidden" /> <!-- Navigacija za mobilne -->
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
</script>
