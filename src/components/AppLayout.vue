<script setup lang="ts">
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonAvatar,
} from "@ionic/vue";
import { home, receipt, logOut } from "ionicons/icons";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";

const { user, signOut } = useAuth();
const router = useRouter();

const handleSignOut = async () => {
  await signOut();
  router.push("/");
};
</script>

<template>
  <ion-menu content-id="main-content" type="overlay">
    <ion-content>
      <div class="p-4">
        <div v-if="user" class="flex items-center space-x-3 mb-6">
          <ion-avatar>
            <img
              :src="`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user.uid}&size=200`"
              :alt="user.email as string"
            />
          </ion-avatar>
          <div>
            <h3 class="font-medium">{{ user.email }}</h3>
          </div>
        </div>
        <ion-list>
          <ion-item button router-link="/dashboard">
            <ion-icon :icon="home" slot="start" />
            <ion-label>Beranda</ion-label>
          </ion-item>
          <ion-item button router-link="/orders">
            <ion-icon :icon="receipt" slot="start" />
            <ion-label>Pesanan</ion-label>
          </ion-item>
          <ion-item button @click="handleSignOut">
            <ion-icon :icon="logOut" slot="start" />
            <ion-label>Keluar</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-menu>

  <ion-content id="main-content">
    <slot></slot>
  </ion-content>
</template>
