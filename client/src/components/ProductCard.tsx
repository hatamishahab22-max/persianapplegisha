import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  nameFa: string;
  image: string;
  price: number;
  colors?: string[];
  storage?: string[];
  generation?: string;
}

export default function ProductCard({
  id,
  name,
  nameFa,
  image,
  price,
  colors = [],
  storage = [],
  generation,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-product-${id}`}>
      <div className="aspect-square overflow-hidden bg-muted/30">
        <img
          src={image}
          alt={nameFa}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-1" data-testid={`text-product-name-${id}`}>
            {nameFa}
          </h3>
          {generation && (
            <p className="text-sm text-muted-foreground" dir="ltr">
              {generation}
            </p>
          )}
        </div>

        {storage.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {storage.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        )}

        {colors.length > 0 && (
          <div className="flex gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded-full border-2 border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">قیمت از</p>
            <p className="text-2xl font-bold" data-testid={`text-price-${id}`}>
              {formatPrice(price)} <span className="text-base font-normal">تومان</span>
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => console.log(`Product ${id} view clicked`)}
            data-testid={`button-view-${id}`}
          >
            مشاهده
          </Button>
        </div>
      </div>
    </Card>
  );
}
