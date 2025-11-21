import { Link, useParams } from "wouter";
import { ArrowRight } from "lucide-react";
import categoryVideo from "@assets/video-output-48494C47-4131-44E2-8B08-AEBB876A23ED-1_1763767507137.mov";

export default function Category() {
  const params = useParams();
  const slug = params.slug || "";

  // Define products for each category
  const categoryData: Record<string, { title: string; products: string[] }> = {
    iphone: {
      title: "آیفون",
      products: [
        "iPhone 17 Pro Max",
        "iPhone 17 Pro",
        "iPhone 17",
        "iPhone Air",
      ]
    },
    corporate: {
      title: "آیفون",
      products: [
        "iPhone 17 Pro Max (رجیستری شرکتی)",
        "iPhone 17 Pro (رجیستری شرکتی)",
        "iPhone 17 (رجیستری شرکتی)",
        "iPhone Air (رجیستری شرکتی)",
      ]
    },
    ipad: {
      title: "آیپد",
      products: [
        "iPad Pro 12.9 (2024)",
        "iPad Pro 11 (2024)",
        "iPad Air (2024)",
        "iPad (2024)",
        "iPad mini (2024)",
        "iPad Pro 12.9 (2023)",
        "iPad Pro 11 (2023)",
        "iPad Air (2023)",
      ]
    },
    airpods: {
      title: "ایرپاد",
      products: [
        "AirPods Pro (2nd generation)",
        "AirPods Max",
        "AirPods (3rd generation)",
        "AirPods (2nd generation)",
      ]
    },
  };

  const currentCategory = categoryData[slug] || { title: "محصولات", products: [] };

  return (
    <div className="h-screen overflow-hidden relative bg-black" dir="rtl">
      {/* Video Background - Full Screen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/attached_assets/IMG_6574_1763107623273.jpeg"
      >
        <source src={categoryVideo} type="video/mp4" />
      </video>
      
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Back Button - Top Left */}
      <div className="absolute top-6 right-6 z-20">
        <Link href="/products">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-black/30 backdrop-blur-md border-0 flex items-center gap-2 px-4 py-2 rounded-lg"
            data-testid="button-back-products"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      {/* Category Title - Top Center */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg">
          {currentCategory.title}
        </h1>
      </div>

      {/* Product List - Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="space-y-4 w-full max-w-2xl px-8">
          {currentCategory.products.map((product, index) => (
            <Link key={index} href={`/product/${encodeURIComponent(product)}`}>
              <button
                className="w-full text-center text-white hover:opacity-80 transition-all p-6 cursor-pointer transform hover:scale-105 duration-300"
                data-testid={`product-item-${index}`}
              >
                <span className="text-3xl font-bold drop-shadow-lg">{product}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
