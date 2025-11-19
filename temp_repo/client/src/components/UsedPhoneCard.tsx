import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Battery } from "lucide-react";

interface UsedPhoneCardProps {
  id: string;
  model: string;
  color: string;
  storage: string;
  batteryHealth: number;
  condition: string;
  price: number;
  image: string;
  description: string;
}

const conditionColors: Record<string, string> = {
  "نو": "default",
  "عالی": "default",
  "خوب": "secondary",
  "متوسط": "secondary",
};

export default function UsedPhoneCard({
  id,
  model,
  color,
  storage,
  batteryHealth,
  condition,
  price,
  image,
  description,
}: UsedPhoneCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getBatteryColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 80) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-used-phone-${id}`}>
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={image}
          alt={model}
          className="w-full h-full object-cover"
        />
        <Badge
          variant={conditionColors[condition] as any}
          className="absolute top-4 right-4"
        >
          {condition}
        </Badge>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2" data-testid={`text-model-${id}`}>
            {model}
          </h3>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{color}</span>
            <span>•</span>
            <span>{storage}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Battery className={`w-4 h-4 ${getBatteryColor(batteryHealth)}`} />
          <span className={getBatteryColor(batteryHealth)}>
            سلامت باتری: {batteryHealth}%
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-2xl font-bold" data-testid={`text-price-${id}`}>
              {formatPrice(price)} <span className="text-base font-normal">تومان</span>
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => console.log(`Used phone ${id} clicked`)}
            data-testid={`button-view-${id}`}
          >
            جزئیات
          </Button>
        </div>
      </div>
    </Card>
  );
}
