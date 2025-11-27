import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Phone, Sparkles, LogIn, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dreamBackground from "@assets/dream-background.jpeg";

interface DreamPhone {
  id: string;
  sellerId: string;
  model: string;
  storage: string | null;
  color: string | null;
  colorFa: string | null;
  condition: string | null;
  conditionFa: string | null;
  price: string;
  originalPrice: string | null;
  description: string | null;
  images: string[] | null;
  isAvailable: boolean;
  isSold: boolean;
  sellerName?: string;
}

export default function DreamDeals() {
  const [, setLocation] = useLocation();
  const [showProducts, setShowProducts] = useState(false);

  const { data: phones = [], isLoading } = useQuery<DreamPhone[]>({
    queryKey: ["/api/dream-phones"],
    enabled: showProducts,
  });

  const availablePhones = phones.filter(p => p.isAvailable && !p.isSold);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fa-IR").format(parseInt(price));
  };

  const calculateDiscount = (price: string, originalPrice: string | null) => {
    if (!originalPrice) return null;
    const discount = ((parseInt(originalPrice) - parseInt(price)) / parseInt(originalPrice)) * 100;
    return Math.round(discount);
  };

  if (!showProducts) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${dreamBackground})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
          <div className="absolute top-6 right-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="text-center space-y-8 max-w-md">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm">
                <Crown className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              پیشنهاد رویایی
            </h1>

            <div className="space-y-4">
              <p className="text-xl text-white/90 leading-relaxed">
                این برنامه مشترک بین قوی‌ترین فروشندگان آیفون بازار هست
              </p>
              <p className="text-lg text-yellow-400 font-semibold flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                قیمت‌ها تکرار نشدنی
                <Star className="w-5 h-5" />
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => setShowProducts(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg rounded-2xl shadow-lg"
                data-testid="button-view-products"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                مشاهده پیشنهادات ویژه
              </Button>

              <Link href="/seller/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/40 text-white hover:bg-white/20 font-semibold py-6 text-lg rounded-2xl backdrop-blur-sm"
                  data-testid="button-seller-login"
                >
                  <LogIn className="w-5 h-5 ml-2" />
                  ورود فروشندگان
                </Button>
              </Link>
            </div>

            <p className="text-sm text-white/60 pt-4">
              فقط فروشندگان مجاز می‌توانند محصول اضافه کنند
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowProducts(false)}
            className="text-white hover:bg-white/10"
            data-testid="button-back-to-landing"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">پیشنهادات رویایی</h1>
          </div>

          <div className="w-10" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : availablePhones.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              در حال حاضر پیشنهادی موجود نیست
            </h2>
            <p className="text-gray-400">
              به زودی پیشنهادات جدید اضافه می‌شود
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePhones.map((phone) => {
              const discount = calculateDiscount(phone.price, phone.originalPrice);
              
              return (
                <Card 
                  key={phone.id}
                  className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden hover:border-purple-500/50 transition-all"
                  data-testid={`card-phone-${phone.id}`}
                >
                  {phone.images && phone.images.length > 0 ? (
                    <div className="aspect-square relative">
                      <img
                        src={phone.images[0]}
                        alt={phone.model}
                        className="w-full h-full object-cover"
                      />
                      {discount && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                          {discount}% تخفیف
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <Phone className="w-16 h-16 text-gray-500" />
                      {discount && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                          {discount}% تخفیف
                        </Badge>
                      )}
                    </div>
                  )}

                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-white">
                      {phone.model}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {phone.storage && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                          {phone.storage}
                        </Badge>
                      )}
                      {phone.colorFa && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                          {phone.colorFa}
                        </Badge>
                      )}
                      {phone.conditionFa && (
                        <Badge 
                          variant="secondary" 
                          className={phone.condition === 'new' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}
                        >
                          {phone.conditionFa}
                        </Badge>
                      )}
                    </div>

                    {phone.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {phone.description}
                      </p>
                    )}

                    <div className="space-y-1">
                      {phone.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(phone.originalPrice)} تومان
                        </p>
                      )}
                      <p className="text-2xl font-bold text-green-400">
                        {formatPrice(phone.price)} تومان
                      </p>
                    </div>

                    {phone.sellerName && (
                      <p className="text-xs text-gray-500">
                        فروشنده: {phone.sellerName}
                      </p>
                    )}

                    <a 
                      href="tel:+989121149079"
                      className="block"
                      data-testid={`button-call-${phone.id}`}
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-bold">
                        <Phone className="w-4 h-4 ml-2" />
                        تماس برای خرید
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
            <Phone className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">تماس با پرشین اپل: </span>
            <a href="tel:+989121149079" className="text-green-400 font-bold" data-testid="link-main-phone">
              ۰۹۱۲۱۱۴۹۰۷۹
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
