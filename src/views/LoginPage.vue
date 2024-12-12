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
  IonButtons,
  IonTitle,
} from "@ionic/vue";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";
import { loginSchema } from "../composables/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { setItem } from "../firebase/localStorage";

const { login, loading, error } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const validationError = ref("");

console.log("auth.currentUser", auth.currentUser);

const handleLogin = async () => {
  try {
    validationError.value = "";
    const result = loginSchema.parse({
      email: email.value,
      password: password.value,
    });
    const user = await login(result.email, result.password);
    const usersCollectionRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(usersCollectionRef);
    const userInfo = userDoc.data();
    setItem("currentUser", { ...userInfo, auth: true });
    router.push("/dashboard");
  } catch (err: any) {
    if (err.errors) {
      validationError.value = err.errors[0].message;
    }
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
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login to your account
            </h2>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
            <div class="rounded-md shadow-sm -space-y-px">
              <ion-input
                type="email"
                label="Email"
                label-placement="floating"
                v-model="email"
                required
              />

              <ion-input
                label="Password"
                label-placement="floating"
                type="password"
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
                {{ loading ? "Loading..." : "Sign in" }}
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
