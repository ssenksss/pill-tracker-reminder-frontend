<template>
  <div class="bg-white rounded-lg p-4 shadow-md w-full max-w-xl mx-auto">
    <h2 class="text-xl font-semibold text-primary mb-4">Add new pill</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="form.name" placeholder="Pill name" class="input" />
      <input v-model="form.description" placeholder="Pill description" class="input" />
      <input v-model="form.time" type="time" class="input" />
      <input v-model="form.image" placeholder="picture URL" class="input" />
      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({ name: '', description: '', time: '', image: '' })
const submitForm = () => {
  alert('Lek dodat: ' + form.value.name)
  form.value = { name: '', description: '', time: '', image: '' }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded;
}
</style>