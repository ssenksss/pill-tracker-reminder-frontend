<!-- components/Sidebar.vue -->
<template>
  <nav class="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 shadow flex flex-col items-center justify-between py-4 z-50">

    <div class="flex flex-col space-y-6 items-center">
      <RouterLink to="/dashboard" class="flex flex-col items-center text-primary hover:text-blue-600">
        <span class="material-icons text-[24px]">home</span>
        <span class="text-[10px]">Home</span>
      </RouterLink>

      <RouterLink to="/pills" class="flex flex-col items-center text-primary hover:text-blue-600">
        <span class="material-icons text-[24px]">medical_services</span>
        <span class="text-[10px]">Meds</span>
      </RouterLink>
    </div>

    <RouterLink to="/add" class="bg-primary text-white text-2xl w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition duration-300 ease-in-out -translate-y-2">
      +
    </RouterLink>

    <div class="flex flex-col space-y-6 items-center">
      <RouterLink to="/history" class="flex flex-col items-center text-primary hover:text-blue-600">
        <span class="material-icons text-[24px]">notifications</span>
        <span class="text-[10px]">Alerts</span>
      </RouterLink>

      <RouterLink to="/login" class="flex flex-col items-center text-primary hover:text-blue-600">
        <span class="material-icons text-[24px]">person</span>
        <span class="text-[10px]">Profile</span>
      </RouterLink>
      <button @click="userStore.logout()" class="text-sm text-primary hover:text-blue-600">Logout</button>
    </div>
  </nav>

</template>

<script setup>

</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>