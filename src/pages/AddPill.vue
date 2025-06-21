<template>
  <div class="bg-white rounded-lg p-6 shadow-md w-full max-w-xl mx-auto mt-8">
    <h2 class="text-xl font-semibold text-primary mb-4">Add New Pill</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="form.name" placeholder="Pill name" class="input" required />
      <input v-model="form.description" placeholder="Pill description" class="input" required />
      <input v-model="form.dosage" placeholder="Dosage" class="input" required />
      <input v-model="form.frequency" placeholder="Frequency (e.g. daily, twice a day)" class="input" />
      <input v-model="form.time" type="time" class="input" required />
      <input v-model="form.note" placeholder="Additional note" class="input" />
      <input v-model.number="form.count" type="number" min="1" placeholder="Count" class="input" />
      <input v-model="form.image" placeholder="Image name" class="input" />
      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">Save</button>
    </form>
    <p v-if="message" :class="[messageClass, 'mt-4 text-center']">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  dosage: '',
  frequency: '',
  time: '',
  note: '',
  count: 1,
  image: ''
})

const message = ref('')
const isError = ref(false)

const messageClass = computed(() => (isError.value ? 'text-red-600' : 'text-green-600'))

const submitForm = async () => {
  if (!form.value.name.trim()) {
    message.value = 'Name is required.'
    isError.value = true
    return
  }
  if (!form.value.dosage.trim()) {
    message.value = 'Dosage is required.'
    isError.value = true
    return
  }
  if (!form.value.time) {
    message.value = 'Time is required.'
    isError.value = true
    return
  }
  if (!form.value.count || form.value.count < 1) {
    message.value = 'Count must be at least 1.'
    isError.value = true
    return
  }

  const timeFormatted = form.value.time.length === 5 ? form.value.time + ':00' : form.value.time

  const payload = {
    name: form.value.name.trim(),
    dosage: form.value.dosage.trim(),
    time: timeFormatted,
    user_id: 1,
    count: form.value.count,
    description: form.value.description.trim() || '',
    frequency: form.value.frequency.trim() || '',
    note: form.value.note.trim() || '',
    image: form.value.image.trim() || ''
  }

  try {
    const res = await fetch('http://localhost:3000/api/pills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      throw new Error('Failed to save pill')
    }

    message.value = 'Pill saved successfully!'
    isError.value = false
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (e) {
    message.value = e.message
    isError.value = true
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded;
}
</style>
