import ProductCard from '../ProductCard'
import iphoneImage from '@assets/generated_images/iPhone_16_Pro_hero_image_e2bda205.png'

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        name="iPhone 16 Pro"
        nameFa="آیفون ۱۶ پرو"
        image={iphoneImage}
        price={85000000}
        colors={['#000000', '#4A5568', '#CBD5E0', '#F7FAFC']}
        storage={['128GB', '256GB', '512GB', '1TB']}
        generation="iPhone 16 Pro"
      />
    </div>
  )
}
