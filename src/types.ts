export type Role = "student" | "staff" | "admin";
export type OrderStatus = "PLACED" | "ACCEPTED" | "PREPARING" | "READY" | "COLLECTED" | "REJECTED" | "CANCELLED";

export type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
};

export type CartItem = Food & { quantity: number };

export type Order = {
  id: string;
  userId: string;
  tokenNumber: string;
  items: { foodId: string; name: string; quantity: number; unitPrice: number; subtotal: number }[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: "PAY_AT_COUNTER";
  createdAt?: any;
  updatedAt?: any;
  rejectionReason?: string;
};