<script setup lang="ts">
import { onMounted } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonLoading,
} from "@ionic/vue";
import { useOrders } from "../composables/useOrders";
import MenuComponent from "../components/MenuComponent.vue";

const { orders, loading, error, getUserOrders } = useOrders();

console.log("orders.date", orders.value);

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-yellow-600";
  }
};

function formatIndonesianDateFromTimestamp(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  // Fungsi untuk menambahkan nol di depan angka jika kurang dari 10
  const padZero = (num) => (num < 10 ? "0" + num : num);

  // Mendapatkan komponen tanggal
  const day = padZero(date.getDate());
  const month = date.toLocaleString("id-ID", { month: "long" });
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  // const seconds = padZero(date.getSeconds());

  // Menggabungkan komponen tanggal menjadi format yang diinginkan
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

onMounted(getUserOrders);
</script>

<template>
  <MenuComponent>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Pesananku</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="p-4">
        <ion-loading
          trigger="open-loading"
          message="Loading.."
          duration="3000"
          v-if="loading"
          class=""
          :isOpen="true"
        ></ion-loading>

        <div v-else-if="error" class="text-center text-red-500 py-4">
          {{ error }}
        </div>

        <div
          v-else-if="orders.length === 0"
          class="text-center py-4 text-gray-500"
        >
          Belum ada pesanan
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow-lg p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-semibold text-lg">{{ order.productName }}</h3>
                <p class="text-gray-600 text-sm">Order ID: {{ order.id }}</p>
              </div>
              <span :class="['font-medium', getStatusColor(order.status)]">
                {{
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }}
              </span>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <p>Quantity: {{ order.quantity }}</p>
              <p>
                Total Price:
                {{
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(order.totalPrice)
                }}
              </p>
              <p>Address: {{ order.address }}</p>
              <p>Phone: {{ order.phoneNumber }}</p>
              <p>
                Date: {{ formatIndonesianDateFromTimestamp(order.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </MenuComponent>
</template>
