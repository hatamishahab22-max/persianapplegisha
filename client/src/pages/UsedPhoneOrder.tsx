import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function UsedPhoneOrder() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    model: "",
    storage: "",
    color: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `سفارش گوشی کارکرده:
نام: ${formData.name}
موبایل: ${formData.phone}
مدل: ${formData.model}
حجم: ${formData.storage}
رنگ: ${formData.color}`;

    const whatsappUrl = `https://wa.me/989121149079?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "درخواست شما ارسال شد",
      description: "به زودی با شما تماس خواهیم گرفت",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 p-4">
        <Link href="/used-phones">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
            data-testid="button-back"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">سفارش گوشی کارکرده</h1>
          <p className="text-white/60">فرم زیر را تکمیل کنید</p>
        </div>

        <Card className="bg-white/5 border-white/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-white">نام و نام خانوادگی</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="علی احمدی"
                required
                className="bg-white/10 border-white/20 text-white"
                data-testid="input-name"
              />
            </div>

            <div>
              <Label className="text-white">شماره موبایل</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="09121234567"
                required
                className="bg-white/10 border-white/20 text-white"
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label className="text-white">مدل گوشی</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-model">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-zinc-900 border-white/20 z-[100]" dir="rtl">
                  <SelectItem value="iPhone 17 Pro Max">iPhone 17 Pro Max</SelectItem>
                  <SelectItem value="iPhone 17 Pro">iPhone 17 Pro</SelectItem>
                  <SelectItem value="iPhone 17">iPhone 17</SelectItem>
                  <SelectItem value="iPhone Air">iPhone Air</SelectItem>
                  <SelectItem value="iPhone 16 Pro Max">iPhone 16 Pro Max</SelectItem>
                  <SelectItem value="iPhone 16 Pro">iPhone 16 Pro</SelectItem>
                  <SelectItem value="iPhone 16 Plus">iPhone 16 Plus</SelectItem>
                  <SelectItem value="iPhone 16">iPhone 16</SelectItem>
                  <SelectItem value="iPhone 15 Pro Max">iPhone 15 Pro Max</SelectItem>
                  <SelectItem value="iPhone 15 Pro">iPhone 15 Pro</SelectItem>
                  <SelectItem value="iPhone 15 Plus">iPhone 15 Plus</SelectItem>
                  <SelectItem value="iPhone 15">iPhone 15</SelectItem>
                  <SelectItem value="iPhone 14 Pro Max">iPhone 14 Pro Max</SelectItem>
                  <SelectItem value="iPhone 14 Pro">iPhone 14 Pro</SelectItem>
                  <SelectItem value="iPhone 14 Plus">iPhone 14 Plus</SelectItem>
                  <SelectItem value="iPhone 14">iPhone 14</SelectItem>
                  <SelectItem value="iPhone 13 Pro Max">iPhone 13 Pro Max</SelectItem>
                  <SelectItem value="iPhone 13 Pro">iPhone 13 Pro</SelectItem>
                  <SelectItem value="iPhone 13 mini">iPhone 13 mini</SelectItem>
                  <SelectItem value="iPhone 13">iPhone 13</SelectItem>
                  <SelectItem value="iPhone 12 Pro Max">iPhone 12 Pro Max</SelectItem>
                  <SelectItem value="iPhone 12 Pro">iPhone 12 Pro</SelectItem>
                  <SelectItem value="iPhone 12 mini">iPhone 12 mini</SelectItem>
                  <SelectItem value="iPhone 12">iPhone 12</SelectItem>
                  <SelectItem value="iPhone 11 Pro Max">iPhone 11 Pro Max</SelectItem>
                  <SelectItem value="iPhone 11 Pro">iPhone 11 Pro</SelectItem>
                  <SelectItem value="iPhone 11">iPhone 11</SelectItem>
                  <SelectItem value="iPhone XS Max">iPhone XS Max</SelectItem>
                  <SelectItem value="iPhone XS">iPhone XS</SelectItem>
                  <SelectItem value="iPhone XR">iPhone XR</SelectItem>
                  <SelectItem value="iPhone X">iPhone X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">حجم</Label>
              <Select
                value={formData.storage}
                onValueChange={(value) => setFormData({ ...formData, storage: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-storage">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/20 z-[100]" dir="rtl">
                  <SelectItem value="128GB">128GB</SelectItem>
                  <SelectItem value="256GB">256GB</SelectItem>
                  <SelectItem value="512GB">512GB</SelectItem>
                  <SelectItem value="1TB">1TB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">رنگ</Label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="مثلاً: مشکی، سفید، طلایی"
                required
                className="bg-white/10 border-white/20 text-white"
                data-testid="input-color"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold"
              style={{ backgroundColor: '#D64218' }}
              data-testid="button-submit-order"
            >
              <Phone className="w-5 h-5 ml-2" />
              ارسال درخواست
            </Button>

            <p className="text-center text-white/60 text-sm">
              پس از ارسال فرم، به واتساپ منتقل می‌شوید
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
