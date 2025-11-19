import { Card } from "@/components/ui/card";
import { Smartphone, Tablet, Laptop, Watch } from "lucide-react";

const categories = [
  {
    id: "iphone",
    name: "آیفون",
    nameEn: "iPhone",
    icon: Smartphone,
    description: "جدیدترین مدل‌های آیفون",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: "ipad",
    name: "آیپد",
    nameEn: "iPad",
    icon: Tablet,
    description: "تبلت‌های قدرتمند اپل",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "mac",
    name: "مک",
    nameEn: "Mac",
    icon: Laptop,
    description: "لپ‌تاپ‌های حرفه‌ای",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "watch",
    name: "واچ",
    nameEn: "Watch",
    icon: Watch,
    description: "ساعت‌های هوشمند اپل",
    gradient: "from-green-500/20 to-teal-500/20",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-categories-title">
            دسته‌بندی محصولات
          </h2>
          <p className="text-lg text-muted-foreground">
            انتخاب کنید و بهترین‌ها را تجربه کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
              onClick={() => console.log(`Category ${category.id} clicked`)}
              data-testid={`card-category-${category.id}`}
            >
              <div className={`p-8 bg-gradient-to-br ${category.gradient}`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-background rounded-full">
                    <category.icon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2" dir="ltr">
                      {category.nameEn}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
