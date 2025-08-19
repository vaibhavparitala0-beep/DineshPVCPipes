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
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";

export default function Index() {
  const {
    metrics,
    lowStockItems,
    newOrders,
    recentOrders,
    completedDeliveries,
    loading,
    lastUpdated,
    refreshData,
  } = useDashboard();

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
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-8">
        {/* Header */}
        <div className="mb-4 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Overview of your pipes manufacturing operations
              </p>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Link to="/items">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
              <Link to="/orders">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-4">
          {/* Low Stock Alert */}
          {lowStockItems.filter(item => item.currentStock <= item.minimumStock * 0.5).length > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Critical Stock Alert</AlertTitle>
              <AlertDescription className="text-amber-700">
                {lowStockItems.filter(item => item.currentStock <= item.minimumStock * 0.5).length} item(s) are critically low on stock and need immediate restocking.
                <Link to="/items" className="ml-2 text-amber-800 underline hover:text-amber-900">
                  Manage Inventory →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* New Orders Alert */}
          {newOrders.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Bell className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">New Orders ({newOrders.length})</AlertTitle>
              <AlertDescription className="text-blue-700">
                You have {newOrders.length} new order(s) in the last 24 hours that require attention.
                <Link to="/orders" className="ml-2 text-blue-800 underline hover:text-blue-900">
                  View Orders →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Last Updated Info */}
          <div className="text-xs text-gray-500 text-right">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column - Recent Orders */}
          <div className="xl:col-span-1">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-red-600" />
                    Recent Orders
                  </div>
                  <Link to="/orders">
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="space-y-3 lg:space-y-4">
                  {recentOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200 gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {order.id}
                          </span>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-700 font-medium">
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
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - New Orders Alerts */}
          <div className="xl:col-span-1">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    New Orders (24h)
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {newOrders.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="space-y-3 lg:space-y-4">
                  {newOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200 gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {order.id}
                          </span>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-700 font-medium">
                          {order.customer}
                        </p>
                        <p className="text-xs text-gray-600">{order.items}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {order.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-green-600">
                          {order.amount}
                        </span>
                        <Button size="sm" className="h-6 bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Low Stock & Completed Deliveries */}
          <div className="xl:col-span-1 space-y-4 lg:space-y-8">
            {/* Low Stock Items */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Low Stock Items
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {lowStockItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="space-y-3 lg:space-y-4">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-amber-50 rounded-lg border border-amber-200 gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {item.id}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-700 font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Stock: {item.currentStock} / Min: {item.minimumStock}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Critical
                        </Badge>
                        <Link to="/items">
                          <Button size="sm" variant="outline" className="h-6">
                            <Plus className="h-3 w-3 mr-1" />
                            Restock
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Deliveries */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Recent Deliveries
                  </div>
                  <Link to="/orders">
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 lg:p-6">
                <div className="space-y-3 lg:space-y-4">
                  {completedDeliveries.slice(0, 3).map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-green-50 rounded-lg border border-green-200 gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {delivery.id}
                          </span>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Delivered
                          </Badge>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-700 font-medium">
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
                        <p className="text-sm lg:text-lg font-bold text-green-600">
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
      </div>
    </Layout>
  );
}
