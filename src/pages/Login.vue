<!-- Login -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

      <!-- Forma za prijavu -->
      <form v-if="!showRegister" @submit.prevent="loginUser" class="space-y-4">
        <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>

        <!-- Polje za email -->
        <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <!-- Polje za lozinku -->
        <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <!-- Dugme za login -->
        <button
            type="submit"
            class="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition"
        >
          Login
        </button>

        <!-- Link za prebacivanje na registraciju -->
        <p class="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <button @click="showRegister = true" class="text-primary font-semibold hover:underline">Register</button>
        </p>
      </form>

      <!-- Forma za registraciju -->
      <form v-else @submit.prevent="registerUser" class="space-y-4">
        <h2 class="text-2xl font-semibold text-center mb-6">Register</h2>

        <!-- Polje za email registraciju -->
        <input
            v-model="regEmail"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <!-- Polje za šifru -->
        <input
            v-model="regPassword"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <!-- Dugme za registraciju -->
        <button
            type="submit"
            class="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition"
        >
          Register
        </button>

        <!-- Link za vraćanje na login -->
        <p class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <button @click="showRegister = false" class="text-primary font-semibold hover:underline">Login</button>
        </p>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

// Form state
const email = ref('')
const password = ref('')
const regEmail = ref('')
const regPassword = ref('')
const showRegister = ref(false)

const userStore = useUserStore()
const router = useRouter()

// Funkcija za login korisnika
function loginUser() {
  const namePart = email.value.split('@')[0] || 'Guest'
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
  userStore.setUsername(formattedName)
  router.push('/dashboard')
}

// Funkcija za registraciju korisnika
function registerUser() {
  // Ovde možeš implementirati backend poziv za registraciju
  showRegister.value = false
}
</script>
