<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonRadio,
  IonRadioGroup,
} from "@ionic/vue";
import { checkmarkCircle } from "ionicons/icons";
import { useOrders } from "../composables/useOrders";
import AppLayout from "../components/AppLayout.vue";
import type { Order } from "../types";

const route = useRoute();
const router = useRouter();
const { getOrder, updateOrderStatus, loading } = useOrders();

const order = ref<Order | null>(null);
const selectedPaymentMethod = ref("");
const isLoading = ref(true);
const error = ref<string | null>(null);
const showSuccessModal = ref(false);

const paymentMethods = [
  { id: "bca", name: "BCA Virtual Account" },
  { id: "mandiri", name: "Mandiri Virtual Account" },
  { id: "bni", name: "BNI Virtual Account" },
  { id: "cash", name: "Cash on Delivery" },
];

const loadOrder = async () => {
  try {
    const orderId = route.params.orderId as string;
    const orderData = await getOrder(orderId);
    if (orderData) {
      order.value = orderData;
    } else {
      error.value = "Order not found";
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const handlePayment = async () => {
  if (!order.value || !selectedPaymentMethod.value) return;

  try {
    await updateOrderStatus(order.value.id, "completed");
    showSuccessModal.value = true;
    // setTimeout(() => {
    //   router.push("/orders");
    // }, 2000);
  } catch (e: any) {
    error.value = e.message;
  }
};

onMounted(loadOrder);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Pembayaran</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <div class="text-center">Loading...</div>
      </div>

      <div v-else-if="error" class="flex justify-center items-center h-full">
        <div class="text-center text-red-500">{{ error }}</div>
      </div>

      <div v-else-if="order" class="p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Layanan</span>
              <span class="font-medium">{{ order.productName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Jumlah</span>
              <span class="font-medium">{{ order.quantity }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600 text-lg">Total</span>
              <span class="font-semibold text-gray-600">
                {{
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(order.totalPrice)
                }}
              </span>
            </div>
          </div>
        </div>
        <div className="shadow-lg mb-4 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
          <div className="space-y-2">
            <span className="ml-auto">{{ order.address }}</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4">Metode Pembayaran</h3>
          <ion-radio-group v-model="selectedPaymentMethod">
            <ion-item v-for="method in paymentMethods" :key="method.id">
              <!-- <ion-label>{{ method.name }}</ion-label> -->
              <ion-radio :aria-label="method.name" :value="method.id">{{
                method.name
              }}</ion-radio>
            </ion-item>
          </ion-radio-group>
        </div>

        <ion-button
          expand="block"
          @click="handlePayment"
          :disabled="!selectedPaymentMethod || showSuccessModal"
        >
          <span v-if="loading"> <ion-spinner /> </span>
          <span v-else>Konfirmasi Pembayaran</span>
        </ion-button>
      </div>

      <!-- Success Modal -->
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-slate-50 rounded-lg p-6 text-center">
          <ion-icon :icon="checkmarkCircle" class="text-6xl" color="success" />
          <h3 class="text-2xl font-bold mb-2">Pembayaran berhasil!</h3>
          <p class="text-gray-600 mb-6">
            Pesanan anda telah dikonfirmasi dan sedang diproses.
          </p>
          <ion-button @click="router.push('/')">Kembali ke beranda</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
