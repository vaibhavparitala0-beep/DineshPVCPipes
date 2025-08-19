import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus, Priority } from "@shared/orders";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Truck,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderDetailDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const OrderDetailDialog = ({
  order,
  open,
  onClose,
}: OrderDetailDialogProps) => {
  const { updateOrderStatus, updateOrderPriority } = useOrders();
  const { toast } = useToast();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [statusNotes, setStatusNotes] = useState("");
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "partial":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "failed":
      case "refunded":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, newStatus, statusNotes);
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus.replace("_", " ")}`,
      });
      setShowStatusUpdate(false);
      setStatusNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityUpdate = async (newPriority: Priority) => {
    setIsUpdatingPriority(true);
    try {
      await updateOrderPriority(order.id, newPriority);
      toast({
        title: "Priority Updated",
        description: `Order priority changed to ${newPriority}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order priority",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimelineIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
      case "returned":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Order Details - {order.orderNumber}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={getPriorityColor(order.priority)}>
                {order.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.diameter}mm × {item.length}m -{" "}
                          {item.specifications.material}
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {item.category.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                        <p className="font-bold text-red-600">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Contact Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                          {order.customer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {order.customer.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {order.customer.email}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(order.customer.email)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {order.customer.phone}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(order.customer.phone)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Billing Address
                    </h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div className="text-gray-600">
                        <p>{order.customer.address.street}</p>
                        <p>
                          {order.customer.address.city},{" "}
                          {order.customer.address.state}{" "}
                          {order.customer.address.zipCode}
                        </p>
                        <p>{order.customer.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Shipping Details
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Method:</span>{" "}
                        {order.shipping.method}
                      </p>
                      <p>
                        <span className="font-medium">Carrier:</span>{" "}
                        {order.shipping.carrier}
                      </p>
                      {order.shipping.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tracking:</span>
                          <span className="text-blue-600">
                            {order.shipping.trackingNumber}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(order.shipping.trackingNumber!)
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p>
                        <span className="font-medium">Cost:</span>{" "}
                        {formatCurrency(order.shipping.cost)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Delivery Address
                    </h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div className="text-gray-600">
                        <p>{order.shipping.address.street}</p>
                        <p>
                          {order.shipping.address.city},{" "}
                          {order.shipping.address.state}{" "}
                          {order.shipping.address.zipCode}
                        </p>
                        <p>{order.shipping.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingCost)}
                  </span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="text-center">
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Created</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                {order.dueDate && (
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{formatDate(order.dueDate)}</p>
                  </div>
                )}
                {order.estimatedCompletion && (
                  <div>
                    <p className="text-sm text-gray-600">Est. Completion</p>
                    <p className="font-medium">
                      {formatDate(order.estimatedCompletion)}
                    </p>
                  </div>
                )}
                {order.shipping.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Est. Delivery</p>
                    <p className="font-medium">
                      {formatDate(order.shipping.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Update Status</Label>
                  <Select
                    onValueChange={handleStatusUpdate}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="quality_check">
                        Quality Check
                      </SelectItem>
                      <SelectItem value="ready_to_ship">
                        Ready to Ship
                      </SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Update Priority</Label>
                  <Select
                    onValueChange={handlePriorityUpdate}
                    disabled={isUpdatingPriority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Change priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={history.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTimelineIcon(history.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {history.status.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(history.timestamp)} by {history.updatedBy}
                        </p>
                        {history.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {history.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
