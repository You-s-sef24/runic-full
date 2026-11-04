import axios from "axios";
import { api } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createOrder(orderData) {
  const res = await api.post(`${BASE_URL}/api/orders`, orderData);
  return res.data;
}

export async function getUserOrders(userId) {
  const res = await api.get(`${BASE_URL}/api/orders/user/${userId}`);
  return res.data;
}
