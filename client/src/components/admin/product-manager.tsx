import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type {
  Category,
  Product,
} from "@shared/schema";

// Type aliases for clarity
type ProductCategory = Category;
type ProductModel = Product;
type ProductColor = any; // Will be defined in schema
type ProductStorageOption = any; // Will be defined in schema
type ProductPrice = any; // Will be defined in schema

export default function ProductManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");

  // Fetch all data
  const { data: categories = [] } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: models = [] } = useQuery<ProductModel[]>({
    queryKey: ["/api/models"],
  });

  const { data: colors = [] } = useQuery<ProductColor[]>({
    queryKey: ["/api/colors"],
  });

  const { data: storageOptions = [] } = useQuery<ProductStorageOption[]>({
    queryKey: ["/api/storage-options"],
  });

  const { data: prices = [] } = useQuery<ProductPrice[]>({
    queryKey: ["/api/product-prices"],
  });

  return (
    <Card data-testid="card-product-manager">
      <CardHeader>
        <CardTitle>مدیریت محصولات</CardTitle>
        <CardDescription>
          افزودن و ویرایش دسته‌بندی‌ها، مدل‌ها، رنگ‌ها و حجم‌های حافظه
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="categories" data-testid="tab-categories">
              دسته‌بندی‌ها ({categories.length})
            </TabsTrigger>
            <TabsTrigger value="models" data-testid="tab-models">
              مدل‌ها ({models.length})
            </TabsTrigger>
            <TabsTrigger value="colors" data-testid="tab-colors">
              رنگ‌ها ({colors.length})
            </TabsTrigger>
            <TabsTrigger value="storage" data-testid="tab-storage">
              حجم حافظه ({storageOptions.length})
            </TabsTrigger>
            <TabsTrigger value="prices" data-testid="tab-prices">
              قیمت‌ها ({prices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoryManager categories={categories} />
          </TabsContent>

          <TabsContent value="models">
            <ModelManager models={models} categories={categories} colors={colors} storageOptions={storageOptions} />
          </TabsContent>

          <TabsContent value="colors">
            <ColorManager colors={colors} />
          </TabsContent>

          <TabsContent value="storage">
            <StorageManager storageOptions={storageOptions} categories={categories} />
          </TabsContent>

          <TabsContent value="prices">
            <ProductPriceManager prices={prices} models={models} colors={colors} storageOptions={storageOptions} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Category Manager Component
function CategoryManager({ categories }: { categories: ProductCategory[] }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameFa: "",
    slug: "",
    order: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/categories", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsDialogOpen(false);
      setFormData({ name: "", nameFa: "", slug: "", order: 0 });
      toast({ title: "دسته‌بندی با موفقیت اضافه شد" });
    },
    onError: () => {
      toast({ title: "خطا در افزودن دسته‌بندی", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4" data-testid="container-category-manager">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">دسته‌بندی‌ها</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="ml-2 h-4 w-4" />
              افزودن دسته‌بندی
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن دسته‌بندی جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">نام انگلیسی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="iPhone, iPad, ..."
                  data-testid="input-category-name"
                />
              </div>
              <div>
                <Label htmlFor="nameFa">نام فارسی</Label>
                <Input
                  id="nameFa"
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="آیفون، آیپد، ..."
                  data-testid="input-category-name-fa"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="iphone, ipad, ..."
                  data-testid="input-category-slug"
                />
              </div>
              <div>
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  data-testid="input-category-order"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending}
                data-testid="button-submit-category"
              >
                {createMutation.isPending ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>نام فارسی</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>ترتیب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.nameFa}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category.slug}</Badge>
              </TableCell>
              <TableCell>{category.order}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Model Manager Component
function ModelManager({ 
  models, 
  categories,
  colors,
  storageOptions
}: { 
  models: ProductModel[]; 
  categories: ProductCategory[];
  colors: ProductColor[];
  storageOptions: ProductStorageOption[];
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    nameFa: "",
    generation: "",
    order: 0,
    selectedColors: [] as string[],
    selectedStorage: [] as string[],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Create model first
      const model = await apiRequest("/api/models", "POST", {
        categoryId: data.categoryId,
        name: data.name,
        nameFa: data.nameFa,
        generation: data.generation || null,
        order: data.order,
      });

      // Add color associations
      for (const colorId of data.selectedColors) {
        await apiRequest(`/api/models/${model.id}/colors/${colorId}`, "POST");
      }

      // Add storage associations
      for (const storageId of data.selectedStorage) {
        await apiRequest(`/api/models/${model.id}/storage/${storageId}`, "POST");
      }

      return model;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      setIsDialogOpen(false);
      setFormData({
        categoryId: "",
        name: "",
        nameFa: "",
        generation: "",
        order: 0,
        selectedColors: [],
        selectedStorage: [],
      });
      toast({ title: "مدل با موفقیت اضافه شد" });
    },
    onError: () => {
      toast({ title: "خطا در افزودن مدل", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4" data-testid="container-model-manager">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">مدل‌ها</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-model">
              <Plus className="ml-2 h-4 w-4" />
              افزودن مدل
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>افزودن مدل جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryId">دسته‌بندی</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger data-testid="select-model-category">
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">نام انگلیسی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="16 Pro Max, Air M3, ..."
                  data-testid="input-model-name"
                />
              </div>
              <div>
                <Label htmlFor="nameFa">نام فارسی</Label>
                <Input
                  id="nameFa"
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="۱۶ پرو مکس، ایر M3، ..."
                  data-testid="input-model-name-fa"
                />
              </div>
              <div>
                <Label htmlFor="generation">نسل (اختیاری)</Label>
                <Input
                  id="generation"
                  value={formData.generation}
                  onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                  placeholder="iPhone 16, iPhone 17, ..."
                  data-testid="input-model-generation"
                />
              </div>
              <div>
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  data-testid="input-model-order"
                />
              </div>
              <div>
                <Label>رنگ‌های موجود</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {colors.map((color) => (
                    <label key={color.id} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedColors.includes(color.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedColors: [...formData.selectedColors, color.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedColors: formData.selectedColors.filter((id) => id !== color.id),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="flex items-center gap-2">
                        {color.hexCode && (
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color.hexCode }}
                          />
                        )}
                        {color.nameFa}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>حجم‌های حافظه موجود</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {storageOptions.map((storage) => (
                    <label key={storage.id} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedStorage.includes(storage.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedStorage: [...formData.selectedStorage, storage.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedStorage: formData.selectedStorage.filter((id) => id !== storage.id),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{storage.nameFa}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending}
                data-testid="button-submit-model"
              >
                {createMutation.isPending ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>نام فارسی</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead>نسل</TableHead>
            <TableHead>ترتیب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => {
            const category = categories.find((c) => c.id === model.categoryId);
            return (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.nameFa}</TableCell>
                <TableCell>
                  <Badge>{category?.nameFa || "—"}</Badge>
                </TableCell>
                <TableCell>{(model as any).generation || "—"}</TableCell>
                <TableCell>{(model as any).order || 0}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Color Manager Component
function ColorManager({ colors }: { colors: ProductColor[] }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameFa: "",
    hexCode: "#000000",
    order: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/colors", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colors"] });
      setIsDialogOpen(false);
      setFormData({ name: "", nameFa: "", hexCode: "#000000", order: 0 });
      toast({ title: "رنگ با موفقیت اضافه شد" });
    },
    onError: () => {
      toast({ title: "خطا در افزودن رنگ", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4" data-testid="container-color-manager">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">رنگ‌ها</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-color">
              <Plus className="ml-2 h-4 w-4" />
              افزودن رنگ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن رنگ جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">نام انگلیسی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Desert, White, ..."
                  data-testid="input-color-name"
                />
              </div>
              <div>
                <Label htmlFor="nameFa">نام فارسی</Label>
                <Input
                  id="nameFa"
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="صحرایی، سفید، ..."
                  data-testid="input-color-name-fa"
                />
              </div>
              <div>
                <Label htmlFor="hexCode">کد رنگ (Hex)</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="hexCode"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    placeholder="#E5D4C1"
                    data-testid="input-color-hex"
                  />
                  <input
                    type="color"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  data-testid="input-color-order"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending}
                data-testid="button-submit-color"
              >
                {createMutation.isPending ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نمونه</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>نام فارسی</TableHead>
            <TableHead>کد رنگ</TableHead>
            <TableHead>ترتیب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.id}>
              <TableCell>
                {color.hexCode && (
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                )}
              </TableCell>
              <TableCell>{color.name}</TableCell>
              <TableCell>{color.nameFa}</TableCell>
              <TableCell>
                <Badge variant="secondary">{color.hexCode}</Badge>
              </TableCell>
              <TableCell>{color.order}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Storage Manager Component
function StorageManager({ 
  storageOptions,
  categories
}: { 
  storageOptions: ProductStorageOption[];
  categories: ProductCategory[];
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameFa: "",
    categoryId: "all",
    order: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/storage-options", "POST", {
        ...data,
        categoryId: data.categoryId === "all" ? null : data.categoryId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage-options"] });
      setIsDialogOpen(false);
      setFormData({ name: "", nameFa: "", categoryId: "all", order: 0 });
      toast({ title: "حجم حافظه با موفقیت اضافه شد" });
    },
    onError: () => {
      toast({ title: "خطا در افزودن حجم حافظه", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4" data-testid="container-storage-manager">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">حجم‌های حافظه</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-storage">
              <Plus className="ml-2 h-4 w-4" />
              افزودن حجم حافظه
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن حجم حافظه جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">نام انگلیسی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="128GB, 256GB Wi-Fi, ..."
                  data-testid="input-storage-name"
                />
              </div>
              <div>
                <Label htmlFor="nameFa">نام فارسی</Label>
                <Input
                  id="nameFa"
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="۱۲۸ گیگابایت، ۲۵۶ گیگابایت Wi-Fi، ..."
                  data-testid="input-storage-name-fa"
                />
              </div>
              <div>
                <Label htmlFor="categoryId">دسته‌بندی (اختیاری)</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger data-testid="select-storage-category">
                    <SelectValue placeholder="همه دسته‌بندی‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">ترتیب نمایش</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  data-testid="input-storage-order"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending}
                data-testid="button-submit-storage"
              >
                {createMutation.isPending ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>نام فارسی</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead>ترتیب</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storageOptions.map((storage) => {
            const category = categories.find((c) => c.id === storage.categoryId);
            return (
              <TableRow key={storage.id}>
                <TableCell>{storage.name}</TableCell>
                <TableCell>{storage.nameFa}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{category?.nameFa || "همه"}</Badge>
                </TableCell>
                <TableCell>{storage.order}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Product Price Manager Component
function ProductPriceManager({
  prices,
  models,
  colors,
  storageOptions,
}: {
  prices: ProductPrice[];
  models: ProductModel[];
  colors: ProductColor[];
  storageOptions: ProductStorageOption[];
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null);
  const [formData, setFormData] = useState({
    modelId: "",
    colorId: "",
    storageId: "",
    price: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/product-prices", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-prices"] });
      setIsDialogOpen(false);
      setFormData({ modelId: "", colorId: "", storageId: "", price: 0 });
      toast({ title: "قیمت با موفقیت اضافه شد" });
    },
    onError: () => {
      toast({ title: "خطا در افزودن قیمت", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { price: number } }) => {
      return await apiRequest(`/api/product-prices/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-prices"] });
      setEditingPrice(null);
      toast({ title: "قیمت با موفقیت بروزرسانی شد" });
    },
    onError: () => {
      toast({ title: "خطا در بروزرسانی قیمت", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/product-prices/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-prices"] });
      toast({ title: "قیمت با موفقیت حذف شد" });
    },
    onError: () => {
      toast({ title: "خطا در حذف قیمت", variant: "destructive" });
    },
  });

  const handleEdit = (price: ProductPrice) => {
    setEditingPrice(price);
  };

  const handleSaveEdit = () => {
    if (editingPrice) {
      updateMutation.mutate({ id: editingPrice.id, data: { price: editingPrice.price } });
    }
  };

  return (
    <div className="space-y-4" data-testid="container-price-manager">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">قیمت محصولات</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-price">
              <Plus className="ml-2 h-4 w-4" />
              افزودن قیمت
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن قیمت جدید</DialogTitle>
              <DialogDescription>
                برای یک ترکیب مدل + حافظه + رنگ قیمت تعیین کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="modelId">مدل</Label>
                <Select value={formData.modelId} onValueChange={(value) => setFormData({ ...formData, modelId: value })}>
                  <SelectTrigger data-testid="select-price-model">
                    <SelectValue placeholder="انتخاب مدل" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="storageId">حجم حافظه</Label>
                <Select value={formData.storageId} onValueChange={(value) => setFormData({ ...formData, storageId: value })}>
                  <SelectTrigger data-testid="select-price-storage">
                    <SelectValue placeholder="انتخاب حجم حافظه" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageOptions.map((storage) => (
                      <SelectItem key={storage.id} value={storage.id}>
                        {storage.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="colorId">رنگ</Label>
                <Select value={formData.colorId} onValueChange={(value) => setFormData({ ...formData, colorId: value })}>
                  <SelectTrigger data-testid="select-price-color">
                    <SelectValue placeholder="انتخاب رنگ" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">قیمت (تومان)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  placeholder="85000000"
                  data-testid="input-price"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending || !formData.modelId || !formData.storageId || !formData.colorId}
                data-testid="button-submit-price"
              >
                {createMutation.isPending ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {prices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          هیچ قیمتی ثبت نشده است. برای شروع روی "افزودن قیمت" کلیک کنید.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>مدل</TableHead>
              <TableHead>حجم حافظه</TableHead>
              <TableHead>رنگ</TableHead>
              <TableHead>قیمت (تومان)</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((price) => {
              const model = models.find((m) => m.id === price.modelId);
              const storage = storageOptions.find((s) => s.id === price.storageId);
              const color = colors.find((c) => c.id === price.colorId);
              const isEditing = editingPrice?.id === price.id;

              return (
                <TableRow key={price.id}>
                  <TableCell>
                    <Badge>{model?.nameFa || "—"}</Badge>
                  </TableCell>
                  <TableCell>{storage?.nameFa || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {color?.hexCode && (
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      )}
                      {color?.nameFa || "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editingPrice.price}
                        onChange={(e) =>
                          setEditingPrice({ ...editingPrice, price: parseInt(e.target.value) || 0 })
                        }
                        className="w-32"
                        data-testid={`input-edit-price-${price.id}`}
                      />
                    ) : (
                      <span className="font-mono">{price.price.toLocaleString("fa-IR")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={updateMutation.isPending}
                            data-testid={`button-save-price-${price.id}`}
                          >
                            ذخیره
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPrice(null)}
                            data-testid={`button-cancel-price-${price.id}`}
                          >
                            لغو
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(price)}
                            data-testid={`button-edit-price-${price.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(price.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-price-${price.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
