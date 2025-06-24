<!-- BottomNav -->
<template>
  <!-- Navigaciona traka fiksirana na dnu ekrana -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner z-50 flex justify-around items-center py-2">

    <!-- Link do dashboard-a -->
    <RouterLink to="/dashboard" class="flex flex-col items-center text-xs text-primary">
      <span class="material-icons text-[24px] leading-none">home</span> <!-- Ikonica Home -->
      <span>Home</span> <!-- Naziv linka -->
    </RouterLink>

    <!-- Link do liste lekova -->
    <RouterLink to="/pills" class="flex flex-col items-center text-xs text-primary">
      <span class="material-icons text-[24px] leading-none">medical_services</span>
      <span>Meds</span>
    </RouterLink>

    <!-- Centralni dugmić za dodavanje leka -->
    <RouterLink to="/add" class="bg-primary text-white text-2xl w-12 h-12 rounded-full -mt-6 shadow-lg flex items-center justify-center hover:bg-secondary transition duration-300 ease-in-out">
      +
    </RouterLink>

    <!-- Link do istorije podsetnika/alerta -->
    <RouterLink to="/history" class="flex flex-col items-center text-xs text-primary">
      <span class="material-icons text-[24px] leading-none">notifications</span>
      <span>Alerts</span>
    </RouterLink>

    <!-- Link do profila korisnika -->
    <RouterLink to="/login" class="flex flex-col items-center text-xs text-primary">
      <span class="material-icons text-[24px] leading-none">person</span>
      <span>Profile</span>
    </RouterLink>
  </nav>
</template>

<script setup>
// Nema posebnog JS koda za ovu komponentu, samo statički meni
</script>

<style scoped>
/* Učitavanje Google Material Icons fonta */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
