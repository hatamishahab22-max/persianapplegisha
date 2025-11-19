import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import { Download, QrCode as QrCodeIcon } from "lucide-react";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://persian-apple-gisha.onrender.com");
  const [showQR, setShowQR] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      if (!ctx) return;
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "persian-apple-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-qr-title">تولید QR Code</h1>
        <p className="text-muted-foreground mt-2">
          QR Code سایت خودتون رو بسازین و برای مشتری‌ها بفرستین
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5" />
              تنظیمات QR Code
            </CardTitle>
            <CardDescription>
              آدرس سایت خودتون رو وارد کنین
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">آدرس سایت (URL)</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-site.onrender.com"
                className="text-left"
                dir="ltr"
                data-testid="input-qr-url"
              />
              <p className="text-xs text-muted-foreground">
                بعد از deploy کردن، آدرس Render خودتون رو اینجا بذارین
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowQR(true)}
                className="w-full"
                data-testid="button-generate-qr"
              >
                <QrCodeIcon className="ml-2 h-4 w-4" />
                تولید QR Code
              </Button>

              {showQR && (
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="w-full"
                  data-testid="button-download-qr"
                >
                  <Download className="ml-2 h-4 w-4" />
                  دانلود PNG (1024x1024)
                </Button>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">💡 نکته مهم:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• بعد از deploy روی Render، URL واقعی رو اینجا بذارین</li>
                <li>• QR Code رو دانلود کنین و چاپ کنین</li>
                <li>• مشتری‌ها با اسکن کردن مستقیم به سایت میرن</li>
                <li>• برای بنر، کارت ویزیت، و پوستر مناسبه</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>پیش‌نمایش QR Code</CardTitle>
            <CardDescription>
              QR Code زیر رو دانلود کنین
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showQR && url ? (
              <div className="flex flex-col items-center space-y-4">
                <div 
                  ref={qrRef}
                  className="bg-white p-6 rounded-lg shadow-lg"
                  data-testid="qr-preview"
                >
                  <QRCode
                    value={url}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                    level="H"
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">پرشین اپل استور گیشا</p>
                  <p className="text-xs text-muted-foreground break-all" dir="ltr">
                    {url}
                  </p>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg text-center space-y-2">
                  <p className="text-sm font-semibold text-primary">
                    ✨ آماده چاپ و استفاده!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    کیفیت: 1024×1024 پیکسل
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <div className="text-center space-y-2">
                  <QrCodeIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    آدرس سایت رو وارد کنین
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>راهنمای استفاده از QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h4 className="font-semibold">چاپ کنین</h4>
              <p className="text-sm text-muted-foreground">
                روی کارت ویزیت، بنر، یا پوستر چاپ کنین
              </p>
            </div>

            <div className="space-y-2">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h4 className="font-semibold">نصب کنین</h4>
              <p className="text-sm text-muted-foreground">
                جلوی فروشگاه، روی میز، یا ویترین بذارین
              </p>
            </div>

            <div className="space-y-2">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h4 className="font-semibold">مشتری‌ها اسکن کنن</h4>
              <p className="text-sm text-muted-foreground">
                با دوربین موبایل اسکن میکنن و به سایت میرن
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
