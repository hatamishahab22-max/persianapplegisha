import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Upload, Loader, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SERVICE_PRICE = 5000000; // 5,000,000 Toman (Verify)

export default function AppleIdManager() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    birthday: "",
    paymentReceipt: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از 10 مگابایت باشد",
        variant: "destructive"
      });
      return;
    }

    setUploadingReceipt(true);

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to server using public endpoint
      const res = await fetch("/api/apple-id-orders/upload-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 })
      });

      if (!res.ok) throw new Error("Failed to upload receipt");

      const data = await res.json();
      setFormData(prev => ({ ...prev, paymentReceipt: data.url }));

      toast({
        title: "موفق",
        description: "رسید پرداخت با موفقیت آپلود شد",
        className: "bg-green-500 text-white border-none"
      });
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast({
        title: "خطا",
        description: "خطا در آپلود رسید پرداخت",
        variant: "destructive"
      });
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phoneNumber || !formData.birthday) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format (simple check)
    if (!/^09\d{9}$/.test(formData.phoneNumber)) {
      toast({
        title: "خطا",
        description: "شماره موبایل معتبر نیست (مثال: 09123456789)",
        variant: "destructive"
      });
      return;
    }

    // Validate Shamsi date format
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formData.birthday)) {
      toast({
        title: "خطا",
        description: "فرمت تاریخ تولد نامعتبر است (مثال: 1380/05/15)",
        variant: "destructive"
      });
      return;
    }

    if (!formData.paymentReceipt) {
      toast({
        title: "توجه",
        description: "لطفاً رسید پرداخت را آپلود کنید تا سفارش شما سریع‌تر بررسی شود",
        variant: "default"
      });
    }

    try {
      setLoading(true);
      const res = await fetch("/api/apple-id-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentAmount: SERVICE_PRICE.toString()
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create order");
      }

      const data = await res.json();
      setOrderCreated(data);
      
      toast({
        title: "موفق!",
        description: "سفارش شما با موفقیت ثبت شد",
        className: "bg-green-500 text-white border-none"
      });

      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        birthday: "",
        paymentReceipt: ""
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "خطا",
        description: error.message || "خطا در ثبت سفارش",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Vazirmatn'] p-4 md:p-6" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">ساخت Apple ID تایید شده</h1>
        <button
          onClick={() => setLocation("/products")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {orderCreated ? (
          <div className="bg-white/5 border border-green-500 rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-green-500">سفارش شما ثبت شد!</h2>
            </div>

            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-lg mb-3">اطلاعات سفارش:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-white/60">شماره سفارش:</span>
                  <span className="mr-2 font-mono">{orderCreated.id.substring(0, 8)}</span>
                </div>
                <div>
                  <span className="text-white/60">نام:</span>
                  <span className="mr-2">{orderCreated.name}</span>
                </div>
                <div>
                  <span className="text-white/60">شماره موبایل:</span>
                  <span className="mr-2 font-mono" dir="ltr">{orderCreated.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-white/60">تاریخ تولد (شمسی):</span>
                  <span className="mr-2">{orderCreated.birthday}</span>
                </div>
                <div>
                  <span className="text-white/60">تاریخ تولد (میلادی):</span>
                  <span className="mr-2">{orderCreated.birthdayGregorian}</span>
                </div>
                <div>
                  <span className="text-white/60">وضعیت:</span>
                  <span className="mr-2 text-yellow-400">
                    {orderCreated.status === "payment_received" ? "رسید دریافت شد" : "در انتظار پرداخت"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="font-bold text-green-400 mb-3">اطلاعات تولید شده (مخصوص شما):</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/60">رمز عبور پیشنهادی:</span>
                  <span className="mr-2 font-mono text-green-400 font-bold">{orderCreated.generatedPassword}</span>
                </div>
                <div className="mt-4">
                  <span className="text-white/60 block mb-2">سوالات امنیتی:</span>
                  <div className="space-y-1 text-xs bg-black/30 p-3 rounded">
                    <div>
                      <span className="text-white/60">1. {orderCreated.securityQuestion1}</span>
                      <div className="mr-4 text-green-400">{orderCreated.securityAnswer1}</div>
                    </div>
                    <div>
                      <span className="text-white/60">2. {orderCreated.securityQuestion2}</span>
                      <div className="mr-4 text-green-400">{orderCreated.securityAnswer2}</div>
                    </div>
                    <div>
                      <span className="text-white/60">3. {orderCreated.securityQuestion3}</span>
                      <div className="mr-4 text-green-400">{orderCreated.securityAnswer3}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                ✓ سفارش شما ثبت شد و در حال بررسی است
                <br />
                ✓ پس از تایید، Apple ID شما ساخته می‌شود
                <br />
                ✓ اطلاعات کامل از طریق شماره موبایل شما ارسال خواهد شد
                <br />
                {!orderCreated.paymentReceipt && (
                  <>
                    <br />
                    <span className="text-yellow-400">⚠ لطفاً رسید پرداخت را به شماره 09121149079 ارسال کنید</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() => setOrderCreated(null)}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-colors"
            >
              ثبت سفارش جدید
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4 text-blue-400">قیمت خدمت: {SERVICE_PRICE.toLocaleString('fa-IR')} تومان</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: علی احمدی"
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-2">شماره موبایل *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="09123456789"
                    dir="ltr"
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    data-testid="input-phone"
                  />
                  <p className="text-xs text-white/50 mt-1">Apple ID به این شماره ارسال می‌شود</p>
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-2">تاریخ تولد (شمسی) *</label>
                  <input
                    type="text"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    placeholder="1380/05/15"
                    dir="ltr"
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    data-testid="input-birthday"
                  />
                  <p className="text-xs text-white/50 mt-1">فرمت: سال/ماه/روز (مثال: 1380/05/15)</p>
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-2">ایمیل (اختیاری)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    dir="ltr"
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    data-testid="input-email"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">آپلود رسید پرداخت</h3>
              <div className="space-y-3">
                <p className="text-sm text-white/70">
                  مبلغ {SERVICE_PRICE.toLocaleString('fa-IR')} تومان را به شماره کارت زیر واریز کنید:
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-center">
                  <p className="text-sm text-white/60">شماره کارت:</p>
                  <p className="font-mono text-lg text-green-400">6104-3378-2797-7933</p>
                  <p className="text-sm text-white/60 mt-1">به نام: شهاب حاتمی</p>
                  <p className="text-xs text-white/50 mt-1">بانک ملت</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingReceipt ? "در حال آپلود..." : formData.paymentReceipt ? "✓ رسید آپلود شد" : "انتخاب رسید"}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      disabled={uploadingReceipt}
                      className="hidden"
                      data-testid="input-receipt"
                    />
                  </label>
                </div>

                {formData.paymentReceipt && (
                  <div className="mt-3">
                    <img src={formData.paymentReceipt} alt="Receipt" className="w-full max-w-xs mx-auto rounded border border-green-500" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              data-testid="button-submit"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  در حال ثبت سفارش...
                </>
              ) : (
                "ثبت سفارش"
              )}
            </button>

            <div className="text-center text-sm text-white/60">
              <p>پس از ثبت سفارش، اطلاعات کامل Apple ID به شماره موبایل شما ارسال می‌شود</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
