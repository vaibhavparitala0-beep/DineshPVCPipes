import Layout from "@/components/Layout";
import { OrdersProvider } from "@/hooks/useOrders";
import OrdersList from "@/components/OrdersList";
import { Truck } from "lucide-react";

function OrdersContent() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
            <p className="text-gray-600">Track and manage pipe orders by priority and status</p>
          </div>
        </div>

        {/* Orders List */}
        <OrdersList />
      </div>
    </Layout>
  );
}

export default function Orders() {
  return (
    <OrdersProvider>
      <OrdersContent />
    </OrdersProvider>
  );
}
