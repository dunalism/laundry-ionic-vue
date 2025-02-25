<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonLoading,
} from "@ionic/vue";
import { useLaundryServices } from "../composables/useLaundryServices";
import ServiceCard from "../components/ServiceCard.vue";
import MenuComponent from "../components/MenuComponent.vue";
import { useAuth } from "../composables/useAuth";

const {
  services,
  loading,
  error,
  currentPage,
  totalPages,
  fetchServices,
  resetServices,
} = useLaundryServices();
const searchQuery = ref("");
const selectedCity = ref("Bandung");
const cities = ["Bandung", "Jakarta", "Surabaya"];
useAuth();
// const isHidden = ref(false);
// let lastScrollTop = 0;

// const handleScroll = (ev: CustomEvent) => {
//   const scrollTop = ev.detail?.scrollTop as number;
//   if (scrollTop > lastScrollTop) {
//     isHidden.value = true;
//   } else {
//     isHidden.value = false;
//   }
//   lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//   //
//   //
// };

// watch(isHidden, () =>

const loadServices = async () => {
  resetServices();
  await fetchServices(selectedCity.value, searchQuery.value);
};

const loadNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchServices(
      selectedCity.value,
      searchQuery.value,
      4,
      currentPage.value
    );
  }
};

const loadPrevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchServices(
      selectedCity.value,
      searchQuery.value,
      4,
      currentPage.value
    );
  }
};

const handleSearch = async () => {
  await loadServices();
};

const handleCityChange = async (city: string) => {
  selectedCity.value = city;
  await loadServices();
};

//saat komponen telah dimuat, jalankan fungsinya
onMounted(loadServices);

//debug
</script>

<template>
  <MenuComponent>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Beranda</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="">
      <div class="p-4">
        <div class="mb-4 sticky top-[-8px] z-50">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Cari layanan laundry..."
            @ionInput="handleSearch()"
            :debounce="1000"
            color="light"
          />
        </div>

        <ion-segment
          v-model="selectedCity"
          @ionChange="handleCityChange($event.detail.value as string)"
        >
          <ion-segment-button v-for="city in cities" :value="city" :key="city">
            <ion-label>{{ city }}</ion-label>
          </ion-segment-button>
        </ion-segment>

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

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
          />
        </div>
        <div
          :class="`flex items-center gap-10 md:gap-52 justify-center ${
            loading ? 'hidden' : ''
          } `"
        >
          <ion-button
            :disabled="currentPage == 1 ? true : false"
            @click.stop="loadPrevPage"
            class=" "
            >Prev</ion-button
          >
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <ion-button
            :disabled="currentPage == totalPages ? true : false"
            @click.stop="loadNextPage"
            class=" "
            >Next</ion-button
          >
        </div>
      </div>
    </ion-content>
  </MenuComponent>
</template>
