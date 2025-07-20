import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-8 text-royal-blue">
        <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          About Amanda Pastry Shop
        </GradientText>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=500&width=700"
              alt="Pastry Chef at Work"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-royal-purple">Our Story</h2>
            <p className="text-lg leading-relaxed">
              Welcome to Amanda Pastry Shop, a place where passion for baking meets the art of confectionery. Nestled in
              the heart of Saranda, Albania, our shop was founded with a simple dream: to bring joy and sweetness to
              every celebration and everyday moment.
            </p>
            <p className="text-lg leading-relaxed">
              For years, we have dedicated ourselves to perfecting classic recipes and innovating new ones, always using
              the finest, freshest ingredients. We believe that a truly delicious pastry starts with quality, and ends
              with a smile.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center pt-12">
          <div className="space-y-4 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-royal-purple">Our Philosophy</h2>
            <p className="text-lg leading-relaxed">
              At Amanda Pastry Shop, we are more than just bakers; we are artists. Each cake, each pastry, is a canvas
              where we blend flavors, textures, and designs to create edible masterpieces. We pride ourselves on our
              attention to detail, ensuring that every bite is a delightful experience.
            </p>
            <p className="text-lg leading-relaxed">
              From elegant wedding cakes to whimsical birthday treats and delicate daily pastries, we pour our heart
              into every creation. We are committed to sustainability, supporting local suppliers, and fostering a warm,
              welcoming environment for our community.
            </p>
          </div>
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
            <Image
              src="/placeholder.svg?height=500&width=700"
              alt="Interior of Pastry Shop"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="pt-12 text-center">
          <h2 className="text-3xl font-bold text-royal-purple mb-4">Meet Our Team</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Our talented team of pastry chefs and dedicated staff are the heart of Amanda Pastry Shop. With years of
            experience and a shared love for baking, they work tirelessly to bring your sweet dreams to life.
          </p>
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Chef 1"
                width={150}
                height={150}
                className="rounded-full object-cover mx-auto mb-2 border-4 border-gold shadow-md"
              />
              <h3 className="font-semibold text-royal-purple">Chef Amanda</h3>
              <p className="text-sm text-royal-blue">Founder & Head Pastry Chef</p>
            </div>
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Chef 2"
                width={150}
                height={150}
                className="rounded-full object-cover mx-auto mb-2 border-4 border-gold shadow-md"
              />
              <h3 className="font-semibold text-royal-purple">Chef David</h3>
              <p className="text-sm text-royal-blue">Custom Cake Specialist</p>
            </div>
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Staff 1"
                width={150}
                height={150}
                className="rounded-full object-cover mx-auto mb-2 border-4 border-gold shadow-md"
              />
              <h3 className="font-semibold text-royal-purple">Sarah</h3>
              <p className="text-sm text-royal-blue">Customer Relations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
