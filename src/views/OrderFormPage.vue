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
  IonItem,
  IonTextarea,
  IonInput,
  IonButton,
  IonLoading,
} from "@ionic/vue";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../composables/useAuth";
import { useOrders } from "../composables/useOrders";
import type { LaundryService, Product } from "../types";

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const { createOrder } = useOrders();

const service = ref<LaundryService | null>(null);
const products = ref<Product[] | null>(null);
const selectedProduct = ref<Product | null>(null);
const quantity = ref(1);
const address = ref("");
const phoneNumber = ref("");
const loading = ref(true);
const error = ref<string | null>(null);

const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0;
  return selectedProduct.value.price * quantity.value;
});

const loadServiceAndProduct = async () => {
  try {
    const serviceId = route.params.serviceId as string;
    const productName = decodeURIComponent(route.params.productId as string);

    const serviceDoc = await getDoc(doc(db, "laundry_services", serviceId));
    const productsCollectionRef = collection(serviceDoc.ref, "products");
    const productsSnapshot = await getDocs(productsCollectionRef);
    const productsList = productsSnapshot.docs
      .map((doc) => doc.data())
      .map((product) => ({ ...product, id: serviceDoc.id }));

    if (serviceDoc.exists()) {
      service.value = {
        id: serviceDoc.id,
        ...serviceDoc.data(),
      } as LaundryService;
      products.value = productsList as Product[];

      selectedProduct.value =
        products.value?.find((p) => p.name === productName) || null;
      if (!selectedProduct.value) {
        error.value = "Product not found";
      }
    } else {
      error.value = "Service not found";
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!service.value || !selectedProduct.value || !user.value) return;

  try {
    const orderId = await createOrder({
      serviceId: service.value.id,
      productName: selectedProduct.value.name,
      quantity: quantity.value,
      totalPrice: totalPrice.value,
      address: address.value,
      phoneNumber: phoneNumber.value,
    });

    router.push(`/payment/${orderId}`);
  } catch (e: any) {
    error.value = e.message;
  }
};

onMounted(loadServiceAndProduct);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Pesanan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="">
      <ion-loading
        trigger="open-loading"
        message="Loading.."
        duration="3000"
        v-if="loading"
        class=""
        :isOpen="true"
      ></ion-loading>

      <div v-else-if="error" class="flex justify-center items-center h-full">
        <div class="text-center text-red-500">{{ error }}</div>
      </div>

      <div v-else-if="service && selectedProduct" class="p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Detail Pesanan</h2>
          <div class="space-y-4">
            <div>
              <p class="text-gray-600">Penyedia Layanan</p>
              <p class="font-medium">{{ service.name }}</p>
            </div>
            <div>
              <p class="text-gray-600">Layanan</p>
              <p class="font-medium">
                {{ selectedProduct.name }} - {{ selectedProduct.type }}
              </p>
              <p class="text-primary font-medium">
                {{
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(selectedProduct.price)
                }}
              </p>
            </div>
          </div>
          <!-- <div class="p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-2">
            {{ selectedProduct.name }}
          </h2>
          <p>{{ selectedProduct.type }}</p>
          <p color="primary" class="font-semibold mt-2">
            Rp {{ selectedProduct.price.toLocaleString("id-ID") }}/{{
              selectedProduct.type
            }}
          </p>
        </div> -->
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <ion-item>
            <!-- <ion-label position="floating">Quantity</ion-label> -->
            <ion-input
              :label="`Jumlah (${selectedProduct.type})`"
              label-placement="start"
              type="number"
              v-model="quantity"
              min="1"
              required
            />
          </ion-item>

          <ion-item>
            <!-- <ion-label position="floating">Address</ion-label> -->
            <IonTextarea
              label="Alamat"
              label-placement="start"
              type="text"
              v-model="address"
              placeholder="Jl. Sukanagara No.22, Antapani Kidul, Kec. Antapani, Kota Bandung, Jawa Barat 40291, Indonesia"
              required
            />
          </ion-item>

          <ion-item>
            <!-- <ion-label position="floating">Phone Number</ion-label> -->
            <ion-input
              label="Nomor Telepon"
              label-placement="start"
              type="tel"
              v-model="phoneNumber"
              placeholder="08562262113"
              required
            />
          </ion-item>

          <div class="bg-white p-6 mt-6">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span class="text-primary">
                {{
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)
                }}
              </span>
            </div>
          </div>

          <ion-button expand="block" type="submit" class="mt-6">
            Lanjutkan ke Pembayaran
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>
