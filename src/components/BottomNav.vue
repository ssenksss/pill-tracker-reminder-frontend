<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner z-50 flex justify-around items-center py-2">
    <button class="flex flex-col items-center text-xs text-primary focus:outline-none">
      <span class="material-icons text-[24px] leading-none">home</span>
      <span>Home</span>
    </button>

    <button class="flex flex-col items-center text-xs text-primary focus:outline-none">
      <span class="material-icons text-[24px] leading-none">medical_services</span>
      <span>Meds</span>
    </button>

    <button class="bg-primary text-white text-2xl w-12 h-12 rounded-full -mt-6 shadow-lg flex items-center justify-center hover:bg-secondary transition duration-300 ease-in-out focus:outline-none">
      +
    </button>

    <button class="flex flex-col items-center text-xs text-primary focus:outline-none">
      <span class="material-icons text-[24px] leading-none">notifications</span>
      <span>Alerts</span>
    </button>

    <button class="flex flex-col items-center text-xs text-primary focus:outline-none">
      <span class="material-icons text-[24px] leading-none">person</span>
      <span>Profile</span>
    </button>
  </nav>
</template>

<script setup>

</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
