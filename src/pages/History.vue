<template>
  <div>
    <h2 class="text-xl font-semibold text-primary mb-4">Istorija uzimanja lekova</h2>
    <ul class="bg-white rounded-lg shadow divide-y">
      <li v-for="entry in history" :key="entry.id" class="p-4">
        {{ entry.time }} - {{ entry.name }} ({{ entry.status }})
      </li>
    </ul>
  </div>
</template>

<script setup>
const history = [
  { id: 1, name: 'Paracetamol', time: '10.06.2025. u 10:00', status: 'Uzeto' },
  { id: 2, name: 'Ibuprofen', time: '10.06.2025. u 18:00', status: 'Preskočeno' }
]
</script>