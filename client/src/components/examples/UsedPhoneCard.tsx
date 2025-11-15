import UsedPhoneCard from '../UsedPhoneCard'
import usedPhoneImage from '@assets/generated_images/Used_iPhone_product_photo_b55cba89.png'

export default function UsedPhoneCardExample() {
  return (
    <div className="max-w-sm">
      <UsedPhoneCard
        id="1"
        model="آیفون ۱۴ پرو مکس"
        color="مشکی"
        storage="256GB"
        batteryHealth={92}
        condition="عالی"
        price={62000000}
        image={usedPhoneImage}
        description="گوشی در حد صفر، بدون خط و خش، همراه با جعبه و لوازم جانبی کامل"
      />
    </div>
  )
}
