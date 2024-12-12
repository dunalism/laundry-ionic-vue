<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import type { LaundryService } from "../types";

const props = defineProps<{
  service: LaundryService;
}>();

const router = useRouter();

const goToServiceDetails = () => {
  router.push(`/service/${props.service.id}`);
};
</script>

<template>
  <ion-card class="" @click="goToServiceDetails">
    <img
      :src="service.image"
      :alt="service.name"
      class="w-full h-48 object-cover"
    />
    <ion-card-header>
      <ion-card-title>{{ service.name }}</ion-card-title>
      <ion-card-subtitle>{{ service.city }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <span class="text-yellow-500 mr-1">★</span>
          <span>{{ service.rating }}</span>
          <span class="text-gray-500 ml-1">({{ service.reviews }})</span>
        </div>
      </div>
      <p class="text-sm text-gray-600 mb-4">{{ service.address }}</p>
      <ion-button expand="block" @click.stop="goToServiceDetails">
        Lihat Detail
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>
