export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "manufacturing"
  | "quality_check"
  | "ready_to_ship"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type Priority = "low" | "medium" | "high" | "urgent";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "partial"
  | "refunded"
  | "failed";

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  category: string;
  diameter: number;
  length: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications: {
    material: string;
    grade?: string;
    pressure?: string;
  };
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ShippingInfo {
  method: string;
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cost: number;
}

export interface StatusHistory {
  id: string;
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  priority: Priority;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  shipping: ShippingInfo;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedCompletion?: string;
  statusHistory: StatusHistory[];
  assignedTo?: string;
  tags?: string[];
}

export interface OrderFilters {
  status?: OrderStatus[];
  priority?: Priority[];
  paymentStatus?: PaymentStatus[];
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  orderNumber?: string;
  assignedTo?: string;
  tags?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface BulkAction {
  type: "update_status" | "assign_to" | "add_tag" | "remove_tag" | "export";
  value?: string;
  orderIds: string[];
}

export interface OrderFormData {
  customer: Customer;
  items: OrderItem[];
  priority: Priority;
  dueDate?: string;
  notes?: string;
  shipping: ShippingInfo;
}
