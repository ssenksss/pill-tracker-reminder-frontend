<template>
  <div class="bg-white rounded-lg p-6 shadow-md w-full max-w-xl mx-auto mt-8">
    <h2 class="text-xl font-semibold text-primary mb-4">
      {{ isEdit ? 'Edit Pill' : 'Add New Pill' }}
    </h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="form.name" placeholder="Pill name" class="input" required />
      <input v-model="form.description" placeholder="Pill description" class="input" required />
      <input v-model="form.time" type="time" class="input" required />
      <input v-model="form.image" placeholder="Picture URL" class="input" />
      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">
        {{ isEdit ? 'Update' : 'Save' }}
      </button>
    </form>

    <p v-if="message" :class="messageClass" class="mt-4 text-center">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref({
  name: '',
  description: '',
  time: '',
  image: ''
})

const message = ref('')
const isError = ref(false)

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.params.id !== undefined)

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await fetch(`http://localhost:3000/api/pills/${route.params.id}`)
      if (!res.ok) throw new Error('Pill not found')
      const data = await res.json()
      form.value = {
        name: data.name || '',
        description: data.description || '',
        time: data.time || '',
        image: data.image || ''
      }
    } catch (err) {
      console.error('Failed to load pill:', err)
      message.value = 'Ne mogu da učitam lek.'
      isError.value = true
    }
  }
})

const submitForm = async () => {
  const url = isEdit.value
      ? `http://localhost:3000/api/pills/${route.params.id}`
      : 'http://localhost:3000/api/pills'

  const method = isEdit.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) throw new Error('Failed to save pill')

    message.value = isEdit.value ? 'Lek je uspešno ažuriran!' : 'Lek je uspešno dodat!'
    isError.value = false


    setTimeout(() => router.push('/pills'), 2000)
  } catch (err) {
    console.error('Submit error:', err)
    message.value = 'Došlo je do greške pri čuvanju leka.'
    isError.value = true
  }
}

const messageClass = computed(() =>
    isError.value ? 'text-red-600' : 'text-green-600'
)
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded;
}
</style>
