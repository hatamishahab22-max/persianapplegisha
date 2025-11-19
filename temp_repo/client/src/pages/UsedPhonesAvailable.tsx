import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Phone, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UsedPhone } from "@shared/schema";
import ImageGallery from "@/components/ImageGallery";
import appleBg from "@assets/IMG_6591_1763126640275.jpeg";

export default function UsedPhonesAvailable() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const { data: phones = [], isLoading } = useQuery<UsedPhone[]>({
    queryKey: ["/api/used-phones"],
  });

  const availablePhones = phones.filter(phone => phone.isApproved && !phone.isSold);

  // گروه‌بندی گوشی‌ها بر اساس مدل
  const phonesByModel = availablePhones.reduce((acc, phone) => {
    const model = phone.modelFa || phone.model || "نامشخص";
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push(phone);
    return acc;
  }, {} as Record<string, UsedPhone[]>);

  const modelNames = Object.keys(phonesByModel).sort();

  const handleContact = (phone: UsedPhone) => {
    const message = `سلام، در مورد این گوشی کارکرده اطلاعات بیشتری می‌خواهم:
${phone.modelFa}
${phone.storage} - ${phone.colorFa}
قیمت: ${Number(phone.price).toLocaleString('fa-IR')} تومان`;

    const whatsappUrl = `https://wa.me/989121149079?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // اگر هیچ مدلی انتخاب نشده، لیست مدل‌ها رو نمایش بده
  if (!selectedModel) {
    return (
      <div 
        className="min-h-screen text-white relative bg-cover bg-center"
        style={{ backgroundImage: `url(${appleBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10">
          <div className="border-b border-white/20 p-4 bg-black/30 backdrop-blur-sm">
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

          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">گوشی‌های کارکرده موجود</h1>
              <p className="text-white/90 text-xl drop-shadow">انتخاب مدل گوشی</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-xl drop-shadow-lg">در حال بارگذاری...</div>
              </div>
            ) : modelNames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/30 p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">گوشی موجود نیست</h3>
                <p className="text-white/90 mb-6">
                  در حال حاضر گوشی کارکرده‌ای موجود نیست
                </p>
                <Link href="/used-phone-order">
                  <Button 
                    style={{ backgroundColor: '#D64218' }}
                    data-testid="button-order-custom"
                  >
                    ثبت سفارش
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modelNames.map((modelName, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedModel(modelName)}
                    className="bg-transparent border-0 cursor-pointer p-0 text-right group"
                    data-testid={`button-model-${index}`}
                  >
                    <div className="bg-white/5 backdrop-blur-sm hover:bg-white/20 transition-all p-8 rounded-2xl border border-white/20 hover:border-white/40 hover:scale-105 duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                            {modelName}
                          </h3>
                          <p className="text-white/80 text-lg">
                            {phonesByModel[modelName].length} گوشی موجود
                          </p>
                        </div>
                        <ChevronLeft className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // نمایش جزئیات گوشی‌های یک مدل خاص
  const selectedPhones = phonesByModel[selectedModel] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 p-4">
        <button 
          onClick={() => setSelectedModel(null)}
          className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
          data-testid="button-back-to-models"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-lg">بازگشت به لیست مدل‌ها</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{selectedModel}</h1>
          <p className="text-white/60">{selectedPhones.length} گوشی موجود</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedPhones.map((phone) => (
            <Card 
              key={phone.id} 
              className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-all"
            >
              {phone.images && phone.images.length > 0 && (
                <div className="p-4">
                  <ImageGallery 
                    images={phone.images}
                    alt={phone.modelFa || phone.model || "Used Phone"}
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-lg font-bold">
                    {phone.storage}
                  </p>
                  <p>
                    <span className="text-white/60">رنگ: </span>
                    {phone.colorFa || phone.color}
                  </p>
                  <p>
                    <span className="text-white/60">وضعیت: </span>
                    {phone.conditionFa}
                  </p>
                  {phone.batteryHealth && (
                    <p>
                      <span className="text-white/60">سلامت باتری: </span>
                      {phone.batteryHealth}%
                    </p>
                  )}
                </div>

                {phone.descriptionFa && (
                  <p className="text-sm text-white/70 mb-4">
                    {phone.descriptionFa}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold" data-testid={`text-phone-price-${phone.id}`}>
                    {Number(phone.price).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-white/60">تومان</span>
                </div>

                <Button
                  onClick={() => handleContact(phone)}
                  className="w-full"
                  style={{ backgroundColor: '#D64218' }}
                  data-testid={`button-contact-${phone.id}`}
                >
                  <Phone className="w-4 h-4 ml-2" />
                  تماس برای خرید
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
