<template>
  <div class="relative">
    <div
        class="flex items-center bg-white rounded-2xl shadow-md px-4 py-4 mb-4 hover:shadow-lg transition duration-200"
    >
      <div class="w-14 h-14 mr-4 flex-shrink-0">
        <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="`Image of ${pill.name}`"
            class="w-full h-full object-cover rounded-md bg-gray-200"
        />
        <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-2xl"
        >
          💊
        </div>
      </div>

      <div class="flex-1">
        <h3 class="text-base font-semibold text-gray-800">
          {{ pill.name }} - {{ pill.dosage || 'N/A' }}
        </h3>
        <p class="text-sm text-gray-500">{{ pill.note || 'After eating' }}</p>
        <p class="text-sm text-primary mt-1">🕒 {{ formatTime(pill.time) }}</p>

        <p v-if="pill.count !== undefined" class="text-sm text-gray-600 mt-1">
          💊 {{ pill.count }} pills left
        </p>
        <p v-if="pill.count !== undefined && pill.count < 5" class="text-sm text-red-600">
          ⚠️ Low supply – consider refill!
        </p>

        <p v-if="pill.last_taken" class="text-sm text-gray-500 mt-1">
          🕒 Last taken: {{ formatDateTime(pill.last_taken) }}
        </p>

        <p v-if="pill.last_status === 'uzeto'" class="text-green-600 text-sm mt-1">
          ✓ Taken today
        </p>
      </div>

      <button
          v-if="pill.last_status !== 'uzeto'"
          @click="markAsTaken"
          class="text-green-600 text-xl ml-4 hover:scale-110 transition-transform"
          title="Mark as taken"
      >
        ✓
      </button>
    </div>

    <button
        @click="openDetails"
        class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 text-sm shadow-md"
        title="Show details"
    >
      +
    </button>

    <button
        @click="$emit('delete-pill', pill.id)"
        class="absolute top-2 right-10 bg-red-600 text-white rounded-full w-6 h-6 text-sm shadow-md hover:bg-red-700"
        title="Delete pill"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pill: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-details', 'delete-pill', 'pill-taken', 'mark-taken'])

const userId = 1

const imageSrc = computed(() => {
  if (!props.pill.image) return ''
  try {
    return new URL(`../assets/${props.pill.image}`, import.meta.url).href
  } catch {
    return ''
  }
})

function formatTime(time) {
  if (!time || !Array.isArray(time) || time.length === 0) return 'N/A'
  return time
      .map((t) => (typeof t === 'string' && t.length >= 5 ? t.slice(0, 5) : t))
      .join(', ')
}

function formatDateTime(dateTime) {
  if (!dateTime) return 'N/A'
  const date = new Date(dateTime)
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
async function markAsTaken() {
  if (props.pill.count <= 0) return;

  const updatedCount = props.pill.count - 1;


  const now = new Date();
  const takenAt = now.toISOString().slice(0, 19).replace('T', ' ');

  try {
    await fetch(`http://localhost:3000/api/pills/${props.pill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: props.pill.user_id,
        name: props.pill.name,
        description: props.pill.description || null,
        dosage: props.pill.dosage || null,
        frequency: props.pill.frequency || null,
        time: props.pill.time || [],  // niz termina
        note: props.pill.note || null,
        image: props.pill.image || null,
        count: updatedCount,
      }),
    });


    await fetch('http://localhost:3000/api/pill-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pill_id: props.pill.id,
        status: 'uzeto',
        taken_at: takenAt,
      }),
    });


    props.pill.count = updatedCount;
    props.pill.last_taken = takenAt;
    props.pill.last_status = 'uzeto';

    emit('pill-taken');

  } catch (error) {
    console.error('Greška pri označavanju leka kao uzetog:', error);
  }
}


function openDetails() {
  emit('open-details', props.pill)
}
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(34, 197, 94, var(--tw-bg-opacity));
}
.text-primary {
  color: rgba(34, 197, 94, var(--tw-text-opacity));
}
</style>
