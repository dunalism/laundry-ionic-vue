import { ref } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { LaundryService } from "../types";

export function useLaundryServices() {
  const services = ref<LaundryService[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastVisible = ref<any>(null); //berisi dokumen terakhir yang difetch
  const hashmore = ref(true);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = 4;

  const fetchServices = async (
    city: string,
    searchQuery = "",
    pageSize = 4,
    page = 1
  ) => {
    try {
      loading.value = true;
      error.value = null;

      let q = query(
        collection(db, "laundry_services"),
        where("city", "==", city),
        orderBy("name"),
        limit(pageSize)
      );

      if (lastVisible.value && page > 1) {
        q = query(q, startAfter(lastVisible.value));
      }

      if (searchQuery) {
        q = query(
          q,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
        );
      }

      const snapshot = await getDocs(q);
      lastVisible.value = snapshot.docs[snapshot.docs.length - 1];

      const newServices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LaundryService[];

      services.value = newServices;
      if (snapshot.docs.length < pageSize) {
        hashmore.value = false;
      }

      totalPages.value = Math.ceil(snapshot.size + 1);

      console.log("totalPages.value", totalPages.value);
      console.log("currentPage.value", currentPage.value);

      return newServices;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resetServices = () => {
    services.value = [];
    lastVisible.value = null;
  };

  return {
    services,
    loading,
    error,
    hashmore,
    currentPage,
    totalPages,
    fetchServices,
    resetServices,
  };
}
