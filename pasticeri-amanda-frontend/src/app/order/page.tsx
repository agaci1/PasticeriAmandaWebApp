import Image from "next/image"
import { WavySeparator } from "@/components/wavy-separator"
import { OrderForm } from "@/components/order-form"

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="Order Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royalBlue/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left text-outline-royal-blue">
          Place Your Custom Order
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      <section className="py-16 px-4 md:px-6 bg-babyPink">
        <div className="max-w-6xl mx-auto">
          <OrderForm />
        </div>
      </section>
    </div>
  )
}
