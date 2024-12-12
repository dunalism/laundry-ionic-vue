import { ref } from "vue";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { z } from "zod";
import { getItem } from "../firebase/localStorage";

export const registerSchema = z.object({
  name: z.string().min(1, "Silakan isi nama lengkap."),
  email: z.string().email(`Email tidak valid! contoh: "your@mail.com."`),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const loginSchema = z.object({
  email: z.string().email(`Email tidak valid! contoh: "your@mail.com."`),
  password: z.string().min(1, "Password harus diisi."),
});

export function useAuth() {
  const local = getItem("currentUser");

  const user = ref(auth.currentUser);
  const userLocal = ref(local);
  const error = ref<string | null>(null);
  const loading = ref(false);

  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser;
  });

  const register = async (name: string, email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        name: name,
        image: `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${result.user.uid}&size=200`,
      });

      return result.user;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  return {
    user,
    userLocal,
    error,
    loading,
    register,
    login,
    signOut,
  };
}
