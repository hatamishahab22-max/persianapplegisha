import UsedPhoneCard from "./UsedPhoneCard";
import usedPhoneImage from "@assets/generated_images/Used_iPhone_product_photo_b55cba89.png";
import { Button } from "@/components/ui/button";

//todo: remove mock functionality
const mockUsedPhones = [
  {
    id: "1",
    model: "آیفون ۱۴ پرو مکس",
    color: "مشکی",
    storage: "256GB",
    batteryHealth: 92,
    condition: "عالی",
    price: 62000000,
    image: usedPhoneImage,
    description: "گوشی در حد صفر، بدون خط و خش، همراه با جعبه و لوازم جانبی کامل",
  },
  {
    id: "2",
    model: "آیفون ۱۳ پرو",
    color: "آبی",
    storage: "128GB",
    batteryHealth: 88,
    condition: "خوب",
    price: 48000000,
    image: usedPhoneImage,
    description: "شرایط عالی، با گارانتی فروشگاه، همراه با شارژر اصلی",
  },
  {
    id: "3",
    model: "آیفون ۱۴ پرو",
    color: "بنفش",
    storage: "512GB",
    batteryHealth: 94,
    condition: "نو",
    price: 68000000,
    image: usedPhoneImage,
    description: "گوشی نو، استفاده نشده، پلمپ، با گارانتی کامل",
  },
];

export default function UsedPhonesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-used-phones-title">
            گوشی‌های کارکرده
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            آیفون‌های دست دوم با بهترین کیفیت و قیمت
          </p>
          <p className="text-sm text-muted-foreground">
            تمام گوشی‌ها با گارانتی فروشگاه و بازرسی کامل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {mockUsedPhones.map((phone) => (
            <UsedPhoneCard key={phone.id} {...phone} />
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => console.log('مشاهده همه گوشی‌ها clicked')}
            data-testid="button-view-all-used"
          >
            مشاهده همه گوشی‌ها
          </Button>
        </div>
      </div>
    </section>
  );
}
