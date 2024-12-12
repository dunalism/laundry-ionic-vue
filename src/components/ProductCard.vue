<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import type { Product } from "../types";

const props = defineProps<{
  product: Product;
  serviceId: string;
}>();

const router = useRouter();

const goToOrderForm = () => {
  router.push(
    `/order/${props.serviceId}/${encodeURIComponent(props.product.name)}`
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ product.name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div class="mb-4">
        <p class="text-sm text-gray-600">{{ product.type }}</p>
        <p class="text-lg font-semibold text-primary">
          {{ formatPrice(product.price) }}
        </p>
      </div>
      <ion-button expand="block" @click="goToOrderForm">
        Pesan Sekarang
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>
