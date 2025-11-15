import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageSquare, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Clock,
  CheckCircle2,
  Ban 
} from "lucide-react";
import type { WhatsappOrder } from "@shared/schema";
import { format } from "date-fns";

export default function WhatsappOrdersManager() {
  const { toast } = useToast();
  const [editingOrder, setEditingOrder] = useState<WhatsappOrder | null>(null);
  const [viewDetails, setViewDetails] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery<WhatsappOrder[]>({
    queryKey: ["/api/whatsapp-orders"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WhatsappOrder> }) => {
      const response = await fetch(`/api/whatsapp-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-orders"] });
      setEditingOrder(null);
      toast({ title: "سفارش بروزرسانی شد" });
    },
    onError: () => {
      toast({ title: "خطا در بروزرسانی سفارش", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/whatsapp-orders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-orders"] });
      toast({ title: "سفارش حذف شد" });
    },
    onError: () => {
      toast({ title: "خطا در حذف سفارش", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "در انتظار", icon: Clock, variant: "default" as const },
      contacted: { label: "تماس گرفته شد", icon: Phone, variant: "secondary" as const },
      completed: { label: "تکمیل شد", icon: CheckCircle2, variant: "default" as const },
      cancelled: { label: "لغو شد", icon: Ban, variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleWhatsAppCall = (phone: string) => {
    // Remove any non-numeric characters and add country code if needed
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('98') ? cleanPhone : `98${cleanPhone}`;
    window.open(`https://wa.me/${phoneWithCode}`, '_blank');
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  const pendingOrders = orders?.filter(o => o.status === 'pending') || [];
  const contactedOrders = orders?.filter(o => o.status === 'contacted') || [];
  const completedOrders = orders?.filter(o => o.status === 'completed') || [];
  const cancelledOrders = orders?.filter(o => o.status === 'cancelled') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">سفارشات واتساپ مشتریان</h2>
          <p className="text-muted-foreground mt-1">مدیریت درخواست‌های دریافتی از طریق واتساپ</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{pendingOrders.length}</div>
            <div className="text-xs text-muted-foreground">در انتظار</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{contactedOrders.length}</div>
            <div className="text-xs text-muted-foreground">تماس گرفته</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completedOrders.length}</div>
            <div className="text-xs text-muted-foreground">تکمیل</div>
          </div>
        </div>
      </div>

      {editingOrder && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">ویرایش سفارش</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>نام مشتری</Label>
                <Input
                  value={editingOrder.customerName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                  data-testid="input-customer-name"
                />
              </div>
              <div>
                <Label>شماره واتساپ</Label>
                <Input
                  value={editingOrder.customerPhone}
                  onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                  data-testid="input-customer-phone"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label>وضعیت</Label>
              <Select
                value={editingOrder.status}
                onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="contacted">تماس گرفته شد</SelectItem>
                  <SelectItem value="completed">تکمیل شد</SelectItem>
                  <SelectItem value="cancelled">لغو شد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>یادداشت مدیر</Label>
              <Textarea
                value={editingOrder.adminNotes || ""}
                onChange={(e) => setEditingOrder({ ...editingOrder, adminNotes: e.target.value })}
                placeholder="یادداشت‌های داخلی برای مدیریت سفارش..."
                rows={3}
                data-testid="textarea-admin-notes"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => updateMutation.mutate({ id: editingOrder.id, data: editingOrder })}
                disabled={updateMutation.isPending}
                data-testid="button-save-order"
              >
                <Check className="w-4 h-4 ml-2" />
                ذخیره تغییرات
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingOrder(null)}
                data-testid="button-cancel-edit"
              >
                <X className="w-4 h-4 ml-2" />
                انصراف
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {orders?.map((order) => (
          <Card
            key={order.id}
            className={`p-4 ${order.status === 'pending' ? 'border-orange-500' : ''}`}
            data-testid={`order-card-${order.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-lg">{order.customerName}</h3>
                  {getStatusBadge(order.status)}
                  <span className="text-sm text-muted-foreground">
                    {order.createdAt && format(new Date(order.createdAt), 'yyyy/MM/dd - HH:mm')}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span dir="ltr">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{order.productNameFa || order.productName}</span>
                  </div>
                </div>

                {order.productDetails && (
                  <p className="text-sm text-muted-foreground">{order.productDetails}</p>
                )}

                {order.message && (
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>پیام مشتری:</strong> {order.message}
                  </div>
                )}

                {order.adminNotes && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded text-sm border border-yellow-200 dark:border-yellow-900">
                    <strong>یادداشت مدیر:</strong> {order.adminNotes}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleWhatsAppCall(order.customerPhone)}
                  data-testid={`button-whatsapp-${order.id}`}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingOrder(order)}
                  data-testid={`button-edit-${order.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
                      deleteMutation.mutate(order.id);
                    }
                  }}
                  data-testid={`button-delete-${order.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!orders || orders.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>هنوز سفارشی دریافت نشده است</p>
        </Card>
      )}
    </div>
  );
}
