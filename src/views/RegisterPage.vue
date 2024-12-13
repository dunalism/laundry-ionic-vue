<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
  IonSpinner,
} from "@ionic/vue";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";
import { registerSchema } from "../composables/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { setItem } from "../firebase/localStorage";

const { register, error } = useAuth();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const validationError = ref("");
const loading = ref(false);

const handleRegister = async () => {
  try {
    loading.value = true;
    validationError.value = "";
    const result = registerSchema.parse({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    const user = await register(result.name, result.email, result.password);
    const usersCollectionRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(usersCollectionRef);
    const userInfo = userDoc.data();
    setItem("currentUser", { ...userInfo, auth: true });
    router.replace("/dashboard");
  } catch (err: any) {
    loading.value = false;
    if (err.errors) {
      validationError.value = err.errors[0].message;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/" />
        </ion-buttons>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
            <div class="rounded-md shadow-sm -space-y-px">
              <ion-input
                type="text"
                label="Full Name"
                labelPlacement="floating"
                v-model="name"
                required
              />

              <ion-input
                type="email"
                label="Email"
                labelPlacement="floating"
                v-model="email"
                required
              />

              <ion-input
                type="password"
                label="password"
                labelPlacement="floating"
                v-model="password"
                required
              />
            </div>

            <div
              v-if="error || validationError"
              class="text-red-500 text-sm text-center"
            >
              {{ error || validationError }}
            </div>

            <div>
              <ion-button expand="block" type="submit" :disabled="loading">
                <span v-if="loading"> <ion-spinner name="dots" /> </span>
                <span v-else>Register</span>
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
