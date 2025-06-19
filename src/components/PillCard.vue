<template>
  <div class="flex bg-white rounded-lg shadow-md p-4 mb-4 items-center hover:shadow-lg transition-shadow duration-200">
    <img
        v-if="pill.image"
        :src="imageSrc"
        :alt="`Image of ${pill.name}`"
        class="w-12 h-12 rounded-md object-cover bg-gray-200 mr-4"
    />
    <div>
      <h2 class="font-semibold text-text-dark">{{ pill.name }}</h2>
      <p class="text-sm text-text-light leading-relaxed">
        Dosage: {{ pill.dosage || 'N/A' }}<br />
        Frequency: {{ pill.frequency || 'N/A' }}<br />
        Note: {{ pill.note || 'Nema' }}
      </p>
      <p class="mt-1 text-sm font-semibold text-primary"> Time 💊 {{ formatTime(pill.time) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pill: {
    type: Object,
    required: true
  }
})

const imageSrc = computed(() => {
  if (props.pill.image) {
    try {
      return new URL(`../assets/${props.pill.image}`, import.meta.url).href
    } catch {
      return ''
    }
  }
  return ''
})

function formatTime(time) {
  if (!time) return 'N/A'
  return time.slice(0, 5)
}
</script>
