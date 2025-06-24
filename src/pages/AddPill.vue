<!-- AddPill -->
<template>
  <div class="bg-white rounded-lg p-6 shadow-md w-full max-w-xl mx-auto mt-8">
    <!-- Naslov forme koji menja tekst u zavisnosti da li je edit ili dodavanje novog leka -->
    <h2 class="text-xl font-semibold text-primary mb-4">{{ isEdit ? 'Edit Pill' : 'Add New Pill' }}</h2>

    <!-- Forma sa sprečavanjem default submit ponašanja -->
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Polja za unos osnovnih informacija o leku -->
      <input v-model="form.name" placeholder="Pill name" class="input" required />
      <input v-model="form.description" placeholder="Pill description" class="input" required />
      <input v-model="form.dosage" placeholder="Dosage" class="input" required />
      <input v-model="form.frequency" placeholder="Frequency (e.g. daily, twice a day)" class="input" />

      <!-- Dinamički unos vremena uzimanja leka (više termina) -->
      <div>
        <label class="block font-semibold mb-2">Times</label>
        <!-- Prikaz svakog vremena sa mogućnošću brisanja -->
        <div v-for="(time, index) in form.times" :key="index" class="flex items-center gap-2 mb-2">
          <input
              v-model="form.times[index]"
              type="time"
              class="input flex-1"
              required
          />
          <!-- Dugme za brisanje termina ako ih ima više -->
          <button
              v-if="form.times.length > 1"
              type="button"
              class="text-red-500 font-bold"
              @click="removeTime(index)"
          >
            ✕
          </button>
        </div>
        <!-- Dodavanje novog termina -->
        <button type="button" @click="addTime" class="text-blue-600 hover:underline">+ Add Time</button>
      </div>

      <!-- Ostala polja za dodatne informacije -->
      <input v-model="form.note" placeholder="Additional note" class="input" />
      <input v-model.number="form.count" type="number" min="1" placeholder="Count" class="input" />
      <input v-model="form.image" placeholder="Image name or URL" class="input" />

      <!-- Dugmad za potvrdu i resetovanje -->
      <button type="submit" class="bg-primary text-white py-2 px-4 rounded">
        {{ isEdit ? 'Update' : 'Save' }}
      </button>
      <button v-if="isEdit" type="button" @click="resetForm" class="ml-4 text-gray-600 underline">
        Reset
      </button>
    </form>

    <!-- Prikaz poruke za grešku ili uspeh -->
    <p v-if="message" :class="[messageClass, 'mt-4 text-center']">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false) // Da li je u pitanju izmena ili dodavanje
const message = ref('') // Tekst poruke
const isError = ref(false) // Da li je poruka greška
const messageClass = computed(() => (isError.value ? 'text-red-600' : 'text-green-600')) // Stil poruke

// Funkcija koja vraća praznu formu za inicijalizaciju ili resetovanje
const emptyForm = () => ({
  name: '',
  description: '',
  dosage: '',
  frequency: '',
  times: [''], // pocetna vrednost je jedan prazan termin
  note: '',
  count: 1,
  image: ''
})

const form = ref(emptyForm())

// Dodavanje novog termina vremena
function addTime() {
  form.value.times.push('')
}

// Brisanje termina ako ima više unetih
function removeTime(index) {
  if (form.value.times.length > 1) {
    form.value.times.splice(index, 1)
  }
}

// Prikaz poruke sa opcijom greške ili uspeha
function showMessage(text, error) {
  message.value = text
  isError.value = error
}

// Resetovanje forme i poruke
function resetForm() {
  form.value = emptyForm()
  message.value = ''
  isError.value = false
}

// Učitavanje leka za izmenu po ID-ju iz rute
async function loadPill(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/pills/${id}`)
    if (!res.ok) throw new Error('Failed to load pill data')
    const data = await res.json()

    // Parsiranje vremena koje može doći kao JSON string ili array
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

    // Popunjavanje forme podacima leka
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

// Slanje podataka forme na backend (POST za novi, PUT za izmenu)
async function submitForm() {
  // Provera validnosti
  if (!form.value.name.trim()) return showMessage('Name is required.', true)
  if (!form.value.dosage.trim()) return showMessage('Dosage is required.', true)
  if (form.value.times.some(t => !t)) return showMessage('All time fields must be filled.', true)
  if (!form.value.count || form.value.count < 1) return showMessage('Count must be at least 1.', true)

  // Formatiranje vremena (dodavanje sekundi ako je potrebno)
  const timesFormatted = form.value.times.map(t => (t.length === 5 ? t + ':00' : t))

  // Priprema payload-a za backend
  const payload = {
    name: form.value.name.trim(),
    dosage: form.value.dosage.trim(),
    time: timesFormatted,
    user_id: 1, // fiksni user_id, kasnije iz auth sistema
    count: form.value.count,
    description: form.value.description.trim() || '',
    frequency: form.value.frequency.trim() || '',
    note: form.value.note.trim() || '',
    image: form.value.image.trim() || ''
  }

  try {
    let res
    if (isEdit.value) {
      // Update leka
      res = await fetch(`http://localhost:3000/api/pills/${route.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } else {
      // Dodavanje novog leka
      res = await fetch('http://localhost:3000/api/pills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }

    if (!res.ok) throw new Error('Failed to save pill')

    // Uspeh, prikazi poruku i nakon 1.5s preusmeri
    showMessage(`Pill ${isEdit.value ? 'updated' : 'saved'} successfully!`, false)
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (e) {
    showMessage(e.message, true)
  }
}

// Kada se komponenta mount-uje, proveri da li postoji ID u ruti da li je u pitanju edit i ucitaj lek
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
  @apply w-full p-2 border border-gray-300 rounded; /* Tailwind utility za stil input polja */
}
</style>
