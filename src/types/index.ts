export interface LaundryService {
  id: string;
  image: string;
  gmaps_url: string;
  city: string;
  name: string;
  address: string;
  phone_number: string;
  reviews: number;
  rating: string;
  url: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  productId: string;
  productName: string;
  phoneNumber: string;
  address: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}
