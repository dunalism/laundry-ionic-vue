<script setup lang="ts">
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonAvatar,
  IonIcon,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonMenuToggle,
} from "@ionic/vue";
import { home, receipt, logOut } from "ionicons/icons";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { clearStorage } from "../firebase/localStorage";
const router = useRouter();
const { userLocal, signOut } = useAuth();
const thisPage = ref(router.currentRoute.value.path);
let users = userLocal.value;

const toHome = () => {
  thisPage.value = "/dashboard";
  router.push("/dashboard");
};

const toOrders = () => {
  thisPage.value = "/orders";
  router.push("/orders");
};

const handleSignOut = async () => {
  await signOut();
  users = null;
  clearStorage();
  router.replace("/home");
};

// watch(thisPage, () => alert("berubah"));
</script>

<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="">Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- <section class="flex flex-col gap-96"> -->
      <div class="flex flex-col p-2 gap-2">
        <div
          @click="toHome"
          class="rounded-md hover:bg-[#f4f5f8] hover:text-blue-700 h-10 border-b px-2 flex gap-2 items-center"
          :class="thisPage == '/dashboard' ? 'bg-[#f4f5f8] text-blue-700' : ''"
        >
          <ion-icon :icon="home" class="h-6 w-6" />
          <p>Beranda</p>
        </div>
        <div
          @click="toOrders"
          class="rounded-md hover:bg-[#f4f5f8] hover:text-blue-700 h-10 border-b px-2 flex gap-2 items-center"
          :class="thisPage == '/orders' ? 'bg-[#f4f5f8] text-blue-700' : ''"
        >
          <ion-icon :icon="receipt" class="h-6 w-6" />
          <p>Pesanan</p>
        </div>
      </div>
      <ion-menu-toggle>
        <div
          @click="handleSignOut"
          class="rounded-md hover:bg-[#f4f5f8] hover:text-blue-700 h-10 px-2 flex gap-2 items-center m-2 absolute bottom-20 w-[95%]"
        >
          <ion-icon :icon="logOut" class="h-7 w-7" />
          <p>Keluar</p>
        </div>
      </ion-menu-toggle>
      <div class="absolute bottom-0 flex p-2">
        <ion-avatar class="border rounded-xl">
          <img :src="users.image" :alt="users.name" />
        </ion-avatar>
        <div className="ml-4 flex flex-col mt-auto mb-auto text-left  ">
          <span className="truncate font-semibold">{{ users.name }}</span>
          <span className="truncate text-sm">{{ users.email }}</span>
        </div>
      </div>
      <!-- </section> -->
    </ion-content>
  </ion-menu>
  <IonPage v-bind="$attrs" id="main-content"><slot></slot></IonPage>
</template>
