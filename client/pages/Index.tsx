import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  Users,
  Package,
  Clock,
  TrendingUp,
  Plus,
  AlertTriangle,
  Bell,
  Eye,
  Edit,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  // Mock data for demonstration
  const metrics = {
    totalOrders: 1247,
    totalShipped: 986,
    totalComplete: 923,
    totalCustomers: 156,
  };

  // Low stock items
  const lowStockItems = [
    {
      id: "ITM-001",
      name: "Steel Pipes 6mm",
      currentStock: 5,
      minimumStock: 20,
      category: "steel",
    },
    {
      id: "ITM-002",
      name: "PVC Pipes 12mm",
      currentStock: 8,
      minimumStock: 25,
      category: "pvc",
    },
    {
      id: "ITM-003",
      name: "Copper Pipes 8mm",
      currentStock: 3,
      minimumStock: 15,
      category: "copper",
    },
  ];

  // New orders (last 24 hours)
  const newOrders = [
    {
      id: "ORD-006",
      customer: "TechBuild Solutions",
      items: "Steel Pipes 10mm x 150m",
      priority: "High",
      time: "2 minutes ago",
      amount: "$18,500",
    },
    {
      id: "ORD-007",
      customer: "Modern Construction",
      items: "PVC Pipes 15mm x 80m",
      priority: "Medium",
      time: "15 minutes ago",
      amount: "$9,200",
    },
    {
      id: "ORD-008",
      customer: "Elite Manufacturing",
      items: "Aluminum Pipes 12mm x 120m",
      priority: "Urgent",
      time: "1 hour ago",
      amount: "$22,400",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "ABC Construction",
      items: "Steel Pipes 6mm x 100m",
      status: "Processing",
      priority: "High",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "XYZ Industries",
      items: "PVC Pipes 12mm x 50m",
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "BuildTech LLC",
      items: "Copper Pipes 8mm x 75m",
      status: "Completed",
      priority: "Low",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "Metro Pipes Co.",
      items: "Steel Pipes 10mm x 200m",
      status: "Processing",
      priority: "High",
      date: "2024-01-12",
    },
    {
      id: "ORD-005",
      customer: "Global Manufacturing",
      items: "PVC Pipes 15mm x 120m",
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-11",
    },
  ];

  const completedDeliveries = [
    {
      id: "DEL-001",
      customer: "Premium Construction",
      items: "Steel Pipes Bundle",
      deliveredDate: "2024-01-15",
      amount: "$15,400",
    },
    {
      id: "DEL-002",
      customer: "Urban Developers",
      items: "PVC Pipes Set",
      deliveredDate: "2024-01-14",
      amount: "$8,750",
    },
    {
      id: "DEL-003",
      customer: "Industrial Works",
      items: "Copper Pipes Kit",
      deliveredDate: "2024-01-13",
      amount: "$12,300",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your pipes manufacturing operations
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.totalOrders.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Shipped
              </CardTitle>
              <Truck className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.totalShipped.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Complete
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.totalComplete.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.totalCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Completed Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Package className="h-5 w-5 text-red-600" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {order.id}
                        </span>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gray-600">{order.items}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {order.date}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Deliveries */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CheckCircle className="h-5 w-5 text-red-600" />
                Completed Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {delivery.id}
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Delivered
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {delivery.customer}
                      </p>
                      <p className="text-xs text-gray-600">{delivery.items}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {delivery.deliveredDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {delivery.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
