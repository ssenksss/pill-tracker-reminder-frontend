<template>
  <div
      class="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200"
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
      <h2 class="font-semibold text-text-dark text-lg">{{ pill.name }}</h2>
      <p class="mt-1 text-sm text-text-light leading-relaxed">
        Dosage: <span class="font-medium">{{ pill.dosage || 'N/A' }}</span><br />
        Frequency: <span class="font-medium">{{ pill.frequency || 'N/A' }}</span><br />
        Note: <span class="font-medium">{{ pill.note || 'Nema' }}</span>
      </p>
    </div>

    <div class="ml-4 text-primary font-semibold text-sm whitespace-nowrap">
      <span class="mr-1">Time</span>💊 {{ formatTime(pill.time) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import brufenImg from '../assets/Brufen.png'
import paracetamolImg from '../assets/paracetamol.png'

const props = defineProps({
  pill: {
    type: Object,
    required: true
  }
})

const localImages = {
  'Brufen.png': brufenImg,
  'paracetamol.png': paracetamolImg
}

const imageSrc = computed(() => {
  const img = props.pill.image?.trim() || ''

  const normalized = img.toLowerCase()

  const normalizedLocalImages = {
    'brufen.png': brufenImg,
    'paracetamol.png': paracetamolImg
  }

  if (normalized in normalizedLocalImages) {
    return normalizedLocalImages[normalized]
  }

  return img
})


function formatTime(time) {
  if (!time) return 'N/A'
  return time.slice(0, 5)
}
</script>
