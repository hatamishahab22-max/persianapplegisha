# Design Guidelines: Persian Apple Store (پرشین اپل استور گیشا)

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Apple.com's minimalist elegance combined with modern Persian e-commerce patterns. The design should feel premium, clean, and effortlessly sophisticated while accommodating RTL (Right-to-Left) layout for Farsi content.

**Key Design Principles:**
- **Premium Minimalism**: Let products shine through generous whitespace and restrained design
- **Visual Hierarchy**: Clear product categorization with bold typography
- **Trust & Credibility**: Professional presentation befitting a premium Apple retailer
- **RTL Optimization**: Seamless right-to-left reading flow

---

## Core Design Elements

### A. Typography

**Font System** (via Google Fonts):
- **Primary (Farsi)**: Vazirmatn (weights: 400, 500, 600, 700)
- **Secondary (English/Numbers)**: Inter (weights: 400, 500, 600)

**Hierarchy:**
- Hero Headlines: text-4xl md:text-6xl font-bold (Vazirmatn 700)
- Section Titles: text-2xl md:text-4xl font-semibold
- Product Names: text-xl font-medium
- Body Text: text-base font-normal
- Captions/Meta: text-sm text-muted-foreground

**Direction**: `dir="rtl"` on root HTML element, with careful handling of product codes/English terms using `dir="ltr"` spans

### B. Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Grid gaps: gap-4, gap-6, gap-8

**Grid Structure:**
- Container: max-w-7xl mx-auto px-4 md:px-6
- Product Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Featured Products: grid-cols-1 lg:grid-cols-2 gap-8

---

## Component Library

### Navigation
**Header**: Fixed top navigation with subtle backdrop-blur
- Logo (right-aligned for RTL)
- Navigation links: دسته‌بندی‌ها | گوشی‌های کارکرده | تماس با ما
- Admin login icon (left-aligned)
- Mobile: Hamburger menu (left side)
- Height: h-16 with shadow-sm

### Hero Section
**Style**: Full-width hero with product imagery
- Height: min-h-[500px] md:min-h-[600px]
- Featured product image with overlay gradient
- Text overlay with blurred background (backdrop-blur-sm bg-black/30 p-6 rounded-xl)
- CTA buttons with no hover states on blur backgrounds

### Product Cards
**Design**: Clean cards with hover lift effect
- Image: aspect-square object-cover rounded-lg
- Product name + generation
- Storage/color badges (small rounded pills)
- Price: Large, bold, with "تومان" suffix
- Card: border rounded-xl hover:shadow-lg transition p-4

### Product Detail Page
**Layout**: Two-column (image gallery + details)
- Image Gallery: Large primary image with thumbnail strip
- Details Panel: Model selector, color swatches, storage options
- Price Calculator: Live price updates based on selections
- Sticky "افزودن به سبد خرید" button on mobile

### Used iPhones Section
**Display**: Grid of used product cards
- Image + battery health indicator (circular progress)
- Condition badge: نو | عالی | خوب (with color coding)
- Price comparison vs new
- Quick view modal for details

### Admin Panel
**Layout**: Sidebar navigation + main content area
- Tabs: دسته‌بندی‌ها | مدل‌ها | رنگ‌ها | قیمت‌ها | گوشی‌های کارکرده
- Data Tables: Sortable, with inline edit/delete actions
- Forms: Well-spaced with clear labels and validation states

### Forms & Inputs
**Style**: Clean, accessible inputs with proper RTL alignment
- Labels: font-medium text-sm mb-2
- Inputs: border rounded-md p-3 focus:ring-2
- Error states: Red border with error message below
- Success states: Green border with checkmark

### Image Upload Component
**Design**: Drag-drop area with preview
- Empty state: Dashed border, upload icon, "انتخاب تصویر از گالری"
- Preview state: Thumbnail with remove button (X icon)
- Loading state: Progress indicator with "در حال آپلود..."
- Tab switcher: آپلود فایل | آدرس (URL)

### Footer
**Structure**: Multi-column footer with rich content
- Column 1: درباره ما + short description
- Column 2: لینک‌های سریع (quick links)
- Column 3: اطلاعات تماس (address, phone, email)
- Column 4: شبکه‌های اجتماعی (social icons)
- Bottom bar: کپی‌رایت + payment badges
- Background: subtle texture or gradient

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Single column, stacked layout
- Tablet: 768px - 1024px - Two columns where appropriate
- Desktop: > 1024px - Full grid layouts

**Mobile Optimizations:**
- Bottom navigation bar for key actions
- Collapsible filters for product pages
- Thumb-friendly tap targets (min 44px)
- PWA install prompt

---

## Images

**Hero Section**: Large lifestyle image showcasing Apple products in Persian context (store interior or product spread)

**Product Images**: High-quality product photography on white/neutral backgrounds, aspect-square format

**Category Banners**: iPhone, iPad, Mac, Watch categories each with representative device imagery

**Trust Signals**: Authentic Apple authorized reseller badge, customer testimonials with photos

**Used iPhones**: Real product photos showing condition, not stock images

---

## Special Considerations

**RTL Implementation:**
- Icons flip horizontally (chevrons, arrows)
- Animations reverse direction
- Text alignment: text-right for Farsi, text-left for codes/numbers
- Margin/padding: Use logical properties (ms-4 instead of ml-4)

**Performance:**
- Lazy load product images below fold
- Optimize hero image (WebP format)
- Service worker caching for offline support

**Trust & Security:**
- Display security badges prominently
- Show store address and phone prominently
- Customer reviews section with verified purchase badges