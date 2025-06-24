<!-- Header -->
<template>
  <!-- Glavni header sa pozdravom i slikom -->
  <header class="bg-primary text-white rounded-b-lg shadow-md p-4 flex justify-between items-center">
    <div>
      <!-- Dinamički pozdrav sa korisničkim imenom ili "Guest" ako nije ulogovan -->
      <h1 class="font-semibold text-lg">{{ greeting }}, {{ userStore.username || 'Guest' }}</h1>
      <p class="text-sm opacity-90">Wishing you a healthy day 🌿</p>
    </div>
    <!-- Logo sa leve strane -->
    <img src="../assets/logo.jpg" alt="Logo" class="w-12 h-12 rounded-full bg-white" />
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'

const greeting = ref('Hello')           // Inicijalni pozdrav
const userStore = useUserStore()        // Pristup Pinia store za korisnika

onMounted(() => {
  const hour = new Date().getHours()    // Dobija trenutni sat
  if (hour >= 5 && hour < 12) greeting.value = 'Good morning'
  else if (hour >= 12 && hour < 18) greeting.value = 'Good afternoon'
  else if (hour >= 18 && hour < 22) greeting.value = 'Good evening'
  else greeting.value = 'Welcome back' // Alternativni pozdrav

  userStore.loadUsername()              // Učitava korisničko ime iz store-a ili API-ja
})
</script>
