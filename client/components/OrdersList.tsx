import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus, Priority } from "@shared/orders";
import OrderDetailDialog from "./OrderDetailDialog";
import {
  Search,
  Filter,
  Package,
  DollarSign,
  Clock,
  User,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Download,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportOrdersReport, exportSelectedOrders } from "@/lib/pdfExport";

const OrdersList = () => {
  const {
    filteredOrders,
    filters,
    setFilters,
    selectedOrders,
    selectOrder,
    selectAllOrders,
    clearSelection,
    stats,
    updateOrderStatus,
    updateOrderPriority,
  } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, customer: term, orderNumber: term });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
      case "manufacturing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "quality_check":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready_to_ship":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "shipped":
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "out_for_delivery":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTabOrders = (tab: string) => {
    switch (tab) {
      case "pending":
        return filteredOrders.filter((o) => o.status === "pending");
      case "processing":
        return filteredOrders.filter((o) =>
          [
            "confirmed",
            "processing",
            "manufacturing",
            "quality_check",
            "ready_to_ship",
          ].includes(o.status),
        );
      case "shipped":
        return filteredOrders.filter((o) =>
          ["shipped", "in_transit", "out_for_delivery"].includes(o.status),
        );
      case "delivered":
        return filteredOrders.filter((o) => o.status === "delivered");
      case "issues":
        return filteredOrders.filter((o) =>
          ["cancelled", "returned"].includes(o.status),
        );
      default:
        return filteredOrders;
    }
  };

  const tabOrders = getTabOrders(activeTab);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExportSelected = () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to export');
      return;
    }
    exportSelectedOrders(selectedOrders, filteredOrders);
  };

  const handleExportAll = () => {
    const ordersToExport = getTabOrders(activeTab);
    if (ordersToExport.length === 0) {
      alert('No orders to export in current view');
      return;
    }
    exportOrdersReport(ordersToExport, {
      includeStats: true,
      dateRange: filters.dateFrom && filters.dateTo ? {
        from: filters.dateFrom,
        to: filters.dateTo
      } : undefined
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
      case "manufacturing":
        return <Package className="h-4 w-4" />;
      case "shipped":
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
      case "returned":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.processing}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.shipped}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAll}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Current View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allOrders = getTabOrders('all');
                  exportOrdersReport(allOrders, { includeStats: true });
                }}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export All Orders
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.priority?.[0] || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  priority: value === "all" ? undefined : [value as Priority],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.assignedTo || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  assignedTo: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assigned</SelectItem>
                <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                <SelectItem value="Lisa Chen">Lisa Chen</SelectItem>
                <SelectItem value="Jenny Adams">Jenny Adams</SelectItem>
                <SelectItem value="Tom Brown">Tom Brown</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({});
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({filteredOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabOrders("pending").length})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({getTabOrders("processing").length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({getTabOrders("shipped").length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({getTabOrders("delivered").length})
          </TabsTrigger>
          <TabsTrigger value="issues">
            Issues ({getTabOrders("issues").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedOrders.length} order
                      {selectedOrders.length !== 1 ? "s" : ""} selected
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearSelection}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportSelected}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Export Selected
                    </Button>
                    <Button size="sm" variant="outline">
                      Bulk Update Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Assign To
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={
                            selectedOrders.length === tabOrders.length &&
                            tabOrders.length > 0
                          }
                          onCheckedChange={selectAllOrders}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Order
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tabOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => selectOrder(order.id)}
                          />
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.assignedTo && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {order.assignedTo}
                                </span>
                              )}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customer.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.customer.company}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.customer.email}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-gray-600">
                              {order.items[0]?.name}
                              {order.items.length > 1 &&
                                ` +${order.items.length - 1} more`}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              getStatusColor(order.status),
                            )}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority.toUpperCase()}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0,
                              )}{" "}
                              units
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                            {order.dueDate && (
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {formatDate(order.dueDate)}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {tabOrders.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package className="h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">No orders found</p>
                            {searchTerm && (
                              <p className="text-sm text-gray-400">
                                Try adjusting your search or filters
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersList;
