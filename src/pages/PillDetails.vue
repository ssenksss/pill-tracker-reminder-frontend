<!-- PillDetails -->
<template>
  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

    <!-- Dugme za povratak na prethodnu stranicu -->
    <button
        @click="$router.back()"
        class="self-start mb-6 text-blue-600 hover:text-blue-800 transition"
    >
      &larr; Back
    </button>

    <!-- Prikaz kada lek još nije učitan -->
    <div v-if="!pill" class="text-center text-gray-500 text-lg font-light mt-20">
      Loading pill details...
    </div>

    <!-- Prikaz detalja leka -->
    <div v-else class="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

      <!-- Prikaz kada nije u modu za uređivanje -->
      <div v-if="!isEditing">
        <div class="flex flex-col items-center mb-6">
          <!-- Slika leka -->
          <img
              :src="imagesMap[pill.image]"
              class="w-36 h-36 rounded-xl shadow-md object-contain mb-4 cursor-pointer"
              alt="Medication Main"
              @click="showModal = true"
          />
        </div>

        <!-- Prikaz osnovnih informacija o leku -->
        <h1 class="text-3xl font-extrabold text-gray-900 mb-4 text-center">{{ pill.name }}</h1>
        <p class="text-gray-700 mb-3"><span class="font-semibold">📝 Description:</span> {{ pill.description || 'No description available' }}</p>
        <p class="text-gray-700 mb-3"><span class="font-semibold">💊 Dosage:</span> {{ pill.dosage || 'N/A' }}</p>
        <p class="text-gray-700 mb-3"><span class="font-semibold">📅 Frequency:</span> {{ formattedFrequency }}</p>
        <p class="text-gray-700 mb-3"><span class="font-semibold">⏰ Time(s):</span> {{ formatMultipleTimes(pill.time) }}</p>
        <p class="text-gray-700 mb-3"><span class="font-semibold">🕓 Last Taken:</span> {{ formatDateTime(lastTakenDisplay) }}</p>

        <!-- Vizuelni indikator broja preostalih pilula -->
        <p
            class="mb-3"
            :class="{
              'text-red-600 font-bold': pill.count !== undefined && pill.count < pill.refillReminderCount,
              'text-gray-700': !(pill.count !== undefined && pill.count < pill.refillReminderCount)
            }"
        >
          <span class="font-semibold">📦 Pills Left:</span> {{ pill.count ?? 'N/A' }}
        </p>
        <p class="text-gray-600 mb-6 text-sm italic">
          🔔 Refill Reminder: when {{ pill.refillReminderCount }} pills left
        </p>

        <!-- Dugme za prebacivanje u edit mod -->
        <button
            @click="isEditing = true"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          Edit Medication
        </button>
      </div>

      <!-- Mod za uređivanje leka -->
      <div v-else>
        <div class="flex justify-center mb-6">
          <img
              :src="imagesMap[pill.image]"
              class="w-36 h-36 rounded-xl shadow-md object-contain"
              alt="Medication"
          />
        </div>

        <!-- Forma za izmenu leka -->
        <form @submit.prevent="saveChanges" class="space-y-6">
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Name</label>
            <input v-model="pill.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Medication Name" />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea v-model="pill.description" rows="4" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Description or notes about medication"></textarea>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Dosage</label>
            <input v-model="pill.dosage" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 2 pills, 10 mg" />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Frequency</label>
            <select v-model="pill.frequency" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Time(s)</label>
            <input v-model="pill.time" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 08:00,14:00,20:00" />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Pills Count</label>
            <input v-model.number="pill.count" type="number" min="0" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="How many pills left" />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Last Taken</label>
            <input v-model="lastTakenDisplay" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <!-- Dugmad za čuvanje i otkazivanje -->
          <div class="flex justify-between space-x-4">
            <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition">Save Changes</button>
            <button type="button" @click="cancelEdit" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal sa većom slikom leka -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" @click="showModal = false">
      <img :src="imagesMap[pill.image]" alt="Large Medication Image" class="max-w-full max-h-full rounded-xl shadow-lg" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Import slika za lekove
import pill1 from '../assets/paracetamol.png'
import pill2 from '../assets/Brufen.png'
import pill3 from '../assets/lorazepam.png'
import pill4 from '../assets/meformin.webp'
import pill5 from '../assets/omeprazole.webp'

// Ref promenljive
const pill = ref(null)
const isEditing = ref(false)
const showModal = ref(false)
const route = useRoute()
const lastTakenDisplay = ref('')

// Mapiranje imena slika na importovane slike
const imagesMap = {
  'paracetamol.png': pill1,
  'Brufen.png': pill2,
  'lorazepam.png': pill3,
  'meformin.webp': pill4,
  'omeprazole.webp': pill5,
}

// Konvertovanje MySQL datetime formata u HTML datetime-local
function formatMySQLToDateTimeLocal(mysqlDateTime) {
  if (!mysqlDateTime) return ''
  const [datePart, timePart] = mysqlDateTime.split(' ')
  const [hours, minutes] = timePart.split(':')
  return `${datePart}T${hours}:${minutes}`
}

// Prikaz više vremena u čitljivom formatu
function formatMultipleTimes(timesStr) {
  if (!timesStr) return 'N/A'
  if (typeof timesStr !== 'string') {
    if (Array.isArray(timesStr)) {
      return timesStr.map(t => String(t).trim()).join(', ')
    }
    return String(timesStr) || 'N/A'
  }
  return timesStr.split(',').map(t => t.trim()).join(', ')
}

// Formatiranje vremena u ljudski čitljiv format
function formatDateTime(dateTime) {
  if (!dateTime) return 'N/A'
  let dt = dateTime
  if (!dateTime.includes('T')) dt = dateTime.replace(' ', 'T')
  const date = new Date(dt)
  if (isNaN(date)) return dateTime
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Dohvatanje leka po ID iz URL-a
async function fetchPill() {
  try {
    const res = await fetch(`http://localhost:3000/api/pills/${route.params.id}`)
    if (res.ok) {
      pill.value = await res.json()
      lastTakenDisplay.value = formatMySQLToDateTimeLocal(pill.value.lastTaken)
    } else {
      console.error('Failed to load pill details')
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchPill)

// Formatiranje naziva frekvencije (daily → Daily)
const formattedFrequency = computed(() => {
  if (!pill.value) return 'N/A'
  if (!pill.value.frequency) return 'N/A'
  return pill.value.frequency.charAt(0).toUpperCase() + pill.value.frequency.slice(1)
})

// Čuvanje izmena i slanje u backend
async function saveChanges() {
  try {
    pill.value.lastTaken = lastTakenDisplay.value

    const updatedData = {
      name: pill.value.name,
      description: pill.value.description,
      dosage: pill.value.dosage,
      frequency: pill.value.frequency,
      time: pill.value.time,
      count: pill.value.count,
      lastTaken: pill.value.lastTaken,
    }

    // PUT zahtev za ažuriranje leka
    const res = await fetch(`http://localhost:3000/api/pills/${pill.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })

    if (!res.ok) {
      alert('Failed to update pill')
      return
    }

    // POST zahtev za kreiranje log zapisa
    const logRes = await fetch('http://localhost:3000/api/pill-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pill_id: pill.value.id,
        status: 'uzeto',
        taken_at: pill.value.lastTaken.replace('T', ' '),
      }),
    })

    if (!logRes.ok) {
      alert('Failed to log pill taken')
      return
    }

    alert('Pill updated and logged successfully!')
    isEditing.value = false
    await fetchPill()
  } catch (error) {
    console.error(error)
  }
}

// Otkazivanje izmena
function cancelEdit() {
  isEditing.value = false
  fetchPill()
}
</script>

<style scoped>
/* Prilagođena boja za klasu bg-primary */
.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(34, 197, 94, var(--tw-bg-opacity));
}
</style>
