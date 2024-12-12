<!-- App.vue -->
<template>
  <AuthProvider>
    <YourComponent />
  </AuthProvider>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";

useAuth();
</script>
