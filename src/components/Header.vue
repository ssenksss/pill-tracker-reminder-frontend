<template>
  <header class="bg-primary text-white rounded-b-lg shadow-md p-4 flex justify-between items-center">
    <div>
      <h1 class="font-semibold text-lg">
        {{ greeting }}, {{ userStore.username || 'Guest' }}
      </h1>
      <p class="text-sm opacity-90">Wishing you a healthy day 🌿</p>
    </div>

    <img src="/src/assets/pilllogo.png" alt="Logo" class="w-13 h-10 rounded-full bg-white" />
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'

const greeting = ref('Hello')
const userStore = useUserStore()

onMounted(() => {

  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) greeting.value = 'Good morning'
  else if (hour >= 12 && hour < 18) greeting.value = 'Good afternoon'
  else if (hour >= 18 && hour < 22) greeting.value = 'Good evening'
  else greeting.value = 'Welcome back'


  userStore.loadUsername()
})
</script>
