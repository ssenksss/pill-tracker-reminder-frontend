<template>
  <div class="bg-white rounded-lg p-6 shadow-md w-full max-w-xl mx-auto mt-8">
    <h2 class="text-xl font-semibold text-primary mb-4">{{ isEdit ? 'Edit Pill' : 'Add New Pill' }}</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="form.name" placeholder="Pill name" class="input" required />
      <input v-model="form.description" placeholder="Pill description" class="input" required />
      <input v-model="form.dosage" placeholder="Dosage" class="input" required />
      <input v-model="form.frequency" placeholder="Frequency (e.g. daily, twice a day)" class="input" />

      <div>
        <label class="block font-semibold mb-2">Times</label>
        <div v-for="(time, index) in form.times" :key="index" class="flex items-center gap-2 mb-2">
          <input
              v-model="form.times[index]"
              type="time"
              class="input flex-1"
              required
          />
          <button
              v-if="form.times.length > 1"
              type="button"
              class="text-red-500 font-bold"
              @click="removeTime(index)"
          >
            ✕
          </button>
        </div>
        <button type="button" @click="addTime" class="text-blue-600 hover:underline">+ Add Time</button>
      </div>

      <input v-model="form.note" placeholder="Additional note" class="input" />
      <input v-model.number="form.count" type="number" min="1" placeholder="Count" class="input" />
      <input v-model="form.image" placeholder="Image name or URL" class="input" />

      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">
        {{ isEdit ? 'Update' : 'Save' }}
      </button>
      <button v-if="isEdit" type="button" @click="resetForm" class="ml-4 text-gray-600 underline">
        Reset
      </button>
    </form>
    <p v-if="message" :class="[messageClass, 'mt-4 text-center']">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const message = ref('')
const isError = ref(false)
const messageClass = computed(() => (isError.value ? 'text-red-600' : 'text-green-600'))

const emptyForm = () => ({
  name: '',
  description: '',
  dosage: '',
  frequency: '',
  times: [''],
  note: '',
  count: 1,
  image: ''
})

const form = ref(emptyForm())

function addTime() {
  form.value.times.push('')
}

function removeTime(index) {
  if (form.value.times.length > 1) {
    form.value.times.splice(index, 1)
  }
}

function showMessage(text, error) {
  message.value = text
  isError.value = error
}

function resetForm() {
  form.value = emptyForm()
  message.value = ''
  isError.value = false
}

async function loadPill(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/pills/${id}`)
    if (!res.ok) throw new Error('Failed to load pill data')
    const data = await res.json()


    let timesArr = []
    if (typeof data.time === 'string') {
      try {
        timesArr = JSON.parse(data.time)
        if (!Array.isArray(timesArr)) timesArr = ['']
      } catch {
        timesArr = ['']
      }
    } else if (Array.isArray(data.time)) {
      timesArr = data.time.length ? data.time : ['']
    } else {
      timesArr = ['']
    }

    form.value = {
      name: data.name || '',
      description: data.description || '',
      dosage: data.dosage || '',
      frequency: data.frequency || '',
      times: timesArr,
      note: data.note || '',
      count: data.count || 1,
      image: data.image || ''
    }
  } catch (e) {
    showMessage(e.message, true)
  }
}

async function submitForm() {
  if (!form.value.name.trim()) return showMessage('Name is required.', true)
  if (!form.value.dosage.trim()) return showMessage('Dosage is required.', true)
  if (form.value.times.some(t => !t)) return showMessage('All time fields must be filled.', true)
  if (!form.value.count || form.value.count < 1) return showMessage('Count must be at least 1.', true)

  const timesFormatted = form.value.times.map(t => (t.length === 5 ? t + ':00' : t))

  const payload = {
    name: form.value.name.trim(),
    dosage: form.value.dosage.trim(),
    time: timesFormatted,
    user_id: 1,
    count: form.value.count,
    description: form.value.description.trim() || '',
    frequency: form.value.frequency.trim() || '',
    note: form.value.note.trim() || '',
    image: form.value.image.trim() || ''
  }

  try {
    let res
    if (isEdit.value) {
      res = await fetch(`http://localhost:3000/api/pills/${route.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } else {
      res = await fetch('http://localhost:3000/api/pills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }

    if (!res.ok) throw new Error('Failed to save pill')

    showMessage(`Pill ${isEdit.value ? 'updated' : 'saved'} successfully!`, false)
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (e) {
    showMessage(e.message, true)
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    loadPill(id)
  }
})
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded;
}
</style>
