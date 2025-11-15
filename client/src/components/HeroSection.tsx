import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Store_interior_hero_banner_f9573032.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="فروشگاه پرشین اپل"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" data-testid="text-hero-title">
          پرشین اپل استور
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
          تجربه خرید محصولات اصل اپل با بهترین قیمت و گارانتی معتبر
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="default"
            className="text-lg px-8 backdrop-blur-sm bg-primary border-primary-border"
            data-testid="button-explore-products"
            onClick={() => console.log('مشاهده محصولات clicked')}
          >
            مشاهده محصولات
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
            data-testid="button-used-phones"
            onClick={() => console.log('گوشی‌های کارکرده clicked')}
          >
            گوشی‌های کارکرده
          </Button>
        </div>
      </div>
    </section>
  );
}
