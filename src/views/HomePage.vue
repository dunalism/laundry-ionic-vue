<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Welcome to LaundryApp</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="flex flex-col items-center justify-center h-full space-y-4">
        <h1 class="text-3xl font-bold text-primary-600">LaundryApp</h1>
        <p class="text-center mb-8">Find the best laundry service near you</p>
        <div class="space-y-4 w-full max-w-xs">
          <IonButton
            expand="block"
            @click="router.push('/register')"
            class="w-full"
          >
            Register
          </IonButton>
          <IonButton
            expand="block"
            fill="outline"
            @click="router.push('/login')"
            class="w-full"
          >
            Login
          </IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>
