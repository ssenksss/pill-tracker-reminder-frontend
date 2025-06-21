<template>
  <nav class="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 shadow flex flex-col justify-between items-center py-6 z-50">

    <div class="flex flex-col space-y-6 items-center" style="margin-top: 25vh;">
      <RouterLink to="/dashboard" class="flex flex-col items-center text-green-800 hover:text-green-900 transition">
        <span class="material-icons text-[26px]">home</span>
        <span class="text-[11px]">Home</span>
      </RouterLink>
      <RouterLink to="/pills" class="flex flex-col items-center text-green-800 hover:text-green-900 transition">
        <span class="material-icons text-[26px]">medical_services</span>
        <span class="text-[11px]">Meds</span>
      </RouterLink>
    </div>

    <RouterLink to="/add" class="bg-green-400 hover:bg-green-500 text-green-900 text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition">
      +
    </RouterLink>

    <div class="flex flex-col space-y-6 items-center" style="margin-bottom: 20vh;">
      <RouterLink to="/history" class="flex flex-col items-center text-green-800 hover:text-green-900 transition">
        <span class="material-icons text-[26px]">notifications</span>
        <span class="text-[11px]">Alerts</span>
      </RouterLink>
      <RouterLink to="/login" class="flex flex-col items-center text-green-800 hover:text-green-900 transition">
        <span class="material-icons text-[26px]">person</span>
        <span class="text-[11px]">Profile</span>
      </RouterLink>
      <button @click="logout" class="flex flex-col items-center text-green-800 hover:text-red-500 transition text-[11px] mt-2">
        <span class="material-icons text-[26px]">logout</span>
        Logout
      </button>
    </div>

  </nav>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
