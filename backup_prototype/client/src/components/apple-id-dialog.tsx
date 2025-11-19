import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema, type InsertOrder } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AppleIdDialog() {
  const { toast } = useToast();
  
  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsapp: "",
      birthYear: 1380,
      birthMonth: 1,
      birthDay: 1,
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "سفارش شما ثبت شد",
        description: "به زودی با شما تماس خواهیم گرفت",
        className: "bg-[#00ff88] text-black border-none",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "خطا در ثبت سفارش",
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertOrder) => {
    mutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-auto p-6 bg-gradient-to-br from-[#0f0c29] to-[#302b63] border-[#00ff88]/30 text-white hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🍏</span>
            <span className="font-bold text-lg">خرید اپل آیدی</span>
            <span className="text-xs text-[#00ff88]">تحویل آنی</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[460px] w-full font-['Vazirmatn'] overflow-hidden">
        <div className="w-full mx-auto bg-white/5 backdrop-blur-[20px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#00ff88]/20 text-white" dir="rtl">
          <DialogTitle className="sr-only">خرید اپل آیدی</DialogTitle>
          <DialogDescription className="sr-only">فرم ثبت سفارش اپل آیدی</DialogDescription>
          
          <header className="bg-gradient-to-r from-[#00ff88] to-[#00c853] text-black p-[35px_20px] text-center">
            <h1 className="text-[28px] font-bold m-0">🍏 اپل آیدی با اصالت</h1>
            <p className="text-[16px] mt-2 opacity-90">ساخته شده با سیم‌کارت واقعی انگلستان • تضمین مادام‌العمر</p>
            <div className="bg-black text-[#00ff88] px-[20px] py-[8px] rounded-[50px] font-bold inline-block mt-3 text-[14px]">
              تحویل آنی زیر ۸ دقیقه
            </div>
          </header>

          <div className="p-[35px]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              
              <Input 
                {...form.register("firstName")}
                placeholder="اسم (به انگلیسی)" 
                className="w-full p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]"
              />
              {form.formState.errors.firstName && <span className="text-red-500 text-xs">{form.formState.errors.firstName.message}</span>}
              
              <Input 
                {...form.register("lastName")}
                placeholder="فامیلی (به انگلیسی)" 
                className="w-full p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]"
              />
               {form.formState.errors.lastName && <span className="text-red-500 text-xs">{form.formState.errors.lastName.message}</span>}

              <Input 
                {...form.register("whatsapp")}
                placeholder="شماره واتس‌اپ (۰۹...)" 
                className="w-full p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]"
              />
              {form.formState.errors.whatsapp && <span className="text-red-500 text-xs">{form.formState.errors.whatsapp.message}</span>}

              <div className="text-center my-[10px] text-[#00ff88]">
                تاریخ تولد شمسی:
                <div className="flex gap-[12px] justify-center mt-2">
                  <Input 
                    {...form.register("birthYear", { valueAsNumber: true })}
                    type="number" placeholder="سال" min="1320" max="1404" 
                    className="flex-1 text-center p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]" 
                  />
                  <Input 
                    {...form.register("birthMonth", { valueAsNumber: true })}
                    type="number" placeholder="ماه" min="1" max="12" 
                    className="flex-1 text-center p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]" 
                  />
                  <Input 
                    {...form.register("birthDay", { valueAsNumber: true })}
                    type="number" placeholder="روز" min="1" max="31" 
                    className="flex-1 text-center p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]" 
                  />
                </div>
              </div>

              <Input 
                {...form.register("email")}
                type="email" 
                placeholder="ایمیل دلخواه (اختیاری)" 
                className="w-full p-[18px] h-auto border-none rounded-[18px] bg-white/10 text-white text-[16px] placeholder:text-[#ccc] focus-visible:ring-1 focus-visible:ring-[#00ff88]"
              />

              <button 
                type="submit"
                disabled={mutation.isPending}
                className="w-full p-[20px] bg-[#00ff88] text-black border-none rounded-[18px] text-[20px] font-bold mt-[10px] cursor-pointer transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "در حال ثبت..." : "ساخت اپل آیدی حرفه‌ای - ۳۴۹,۰۰۰ تومان"}
              </button>
            </form>

            <div className="text-center mt-[30px] p-[20px] bg-[#00ff88]/10 rounded-[18px] text-[14px] leading-8">
              ✅ تضمین ۱۰۰٪ دائمی و بدون بلاک<br/>
              ✅ تحویل مستقیم تو واتس‌اپ<br/>
              ✅ پشتیبانی ۲۴ ساعته: <span className="text-[#00ff88] font-bold" dir="ltr">@PersianAppleGisha</span><br/>
              ✅ بیش از ۲۲,۰۰۰ مشتری راضی
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
