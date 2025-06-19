<template>
  <div class="max-w-sm mx-auto bg-white rounded-lg p-6 shadow">
    <h2 class="text-lg font-semibold text-primary mb-4">Log in</h2>
    <form @submit.prevent="login" class="space-y-4">
      <input v-model="email" placeholder="E-mail" type="email" class="input" />
      <input v-model="password" placeholder="Password" type="password" class="input" />
      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">Log in</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

const login = () => {
  const name = email.value.split('@')[0] || 'Guest'
  userStore.setUsername(name.charAt(0).toUpperCase() + name.slice(1))
  router.push('/dashboard')
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded;
}
</style>
