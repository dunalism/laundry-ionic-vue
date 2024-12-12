import { ref } from "vue";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";
import type { Order } from "../types";
import { orderBy } from "firebase/firestore";

interface CreateOrderParams {
  serviceId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  address: string;
  phoneNumber: string;
}

export function useOrders() {
  const { user, userLocal } = useAuth();
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createOrder = async (params: CreateOrderParams): Promise<string> => {
    if (!user.value) throw new Error("User not authenticated");

    try {
      const orderData = {
        userId: user.value.uid,
        serviceId: params.serviceId,
        productName: params.productName,
        quantity: params.quantity,
        totalPrice: params.totalPrice,
        address: params.address,
        phoneNumber: params.phoneNumber,
        status: "pending",
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      return docRef.id;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (orderDoc.exists()) {
        return {
          id: orderDoc.id,
          ...orderDoc.data(),
        } as Order;
      }
      return null;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const getUserOrders = async () => {
    if (!userLocal) throw new Error("User not authenticated");

    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", userLocal.value.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      orders.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: "pending" | "completed" | "cancelled"
  ) => {
    try {
      loading.value = true;
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (e: any) {
      loading.value = false;
      throw new Error(e.message);
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrder,
    getUserOrders,
    updateOrderStatus,
  };
}
