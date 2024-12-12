<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSearchbar,
} from "@ionic/vue";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import AppLayout from "../components/AppLayout.vue";
import ProductCard from "../components/ProductCard.vue";
import type { LaundryService, Product } from "../types";

const route = useRoute();
const router = useRouter();
const service = ref<LaundryService | null>(null);
const products = ref<Product[] | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref("");

const filteredProducts = computed(() => {
  if (!products.value) return [];
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const loadService = async () => {
  try {
    const serviceId = route.params.id as string;
    const serviceDoc = await getDoc(doc(db, "laundry_services", serviceId));
    const productsCollectionRef = collection(serviceDoc.ref, "products");
    const productsSnapshot = await getDocs(productsCollectionRef);
    const productsList = productsSnapshot.docs
      .map((doc) => doc.data())
      .map((product) => ({ ...product, id: serviceDoc.id }));

    console.log(productsList);

    if (serviceDoc.exists()) {
      service.value = {
        id: serviceDoc.id,
        ...serviceDoc.data(),
      } as LaundryService;
      products.value = productsList as Product[];
    } else {
      error.value = "Service not found";
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

onMounted(loadService);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Service Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="flex justify-center items-center h-full">
        <div class="text-center">Loading...</div>
      </div>

      <div v-else-if="error" class="flex justify-center items-center h-full">
        <div class="text-center text-red-500">{{ error }}</div>
      </div>

      <div v-else-if="service" class="p-4">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <img
            :src="service.image"
            :alt="service.name"
            class="w-full h-64 object-cover"
          />
          <div class="p-6">
            <h1 class="text-2xl font-bold mb-2">{{ service.name }}</h1>
            <div class="flex items-center mb-4">
              <span class="text-yellow-500 mr-1">★</span>
              <span>{{ service.rating }}</span>
              <span class="text-gray-500 ml-1"
                >({{ service.reviews }} reviews)</span
              >
            </div>
            <p class="text-gray-600 mb-4">{{ service.address }}</p>
            <div class="flex items-center space-x-4">
              <a
                :href="service.gmaps_url"
                target="_blank"
                class="text-blue-600 hover:text-blue-800"
              >
                Lihat di Google Maps
              </a>
              <a
                :href="'tel:' + service.phone_number"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ service.phone_number }}
              </a>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search products..."
            class="mb-4"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.name"
            :product="product"
            :serviceId="service.id"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
