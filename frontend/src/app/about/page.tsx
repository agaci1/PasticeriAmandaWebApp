import Image from "next/image"
import { WavySeparator } from "@/components/wavy-separator"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="About Us Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royalPurple/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left text-outline-royal-purple">
          About Amanda Pastry Shop
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      <section className="py-16 px-4 md:px-6 bg-babyPink">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple">
              Our Vision: A Dreamy & Royal Experience
            </h2>
            <p className="font-body text-lg text-gray-800 leading-relaxed">
              Royal Delights was born from a passion for creating desserts that transcend the ordinary. Our vision is to
              blend the whimsical, dreamy aesthetic of a fairytale with the sophisticated elegance of royalty. We
              believe that every pastry should be a piece of art, a luxurious indulgence that delights both the eyes and
              the palate.
            </p>
            <p className="font-body text-lg text-gray-800 leading-relaxed">
              From the delicate swirls of our frostings to the shimmering accents of gold, every detail is meticulously
              crafted to evoke a sense of wonder and exclusivity. We aim to make every customer feel as though they are
              stepping into a royal dessert boutique, where every treat is specially made for them.
            </p>
          </div>
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up delay-200">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Pastry Shop Interior"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <WavySeparator color="#FFFFFF" height={80} className="-mt-10 z-30 rotate-180" />

      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple animate-fade-in-up">
            Our Craftsmanship
          </h2>
          <p className="font-body text-lg text-gray-700 animate-fade-in-up delay-100">
            We use only the finest ingredients, combined with traditional techniques and innovative artistry, to create
            desserts that are as delicious as they are beautiful.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="space-y-4 animate-fade-in-up delay-200">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Quality Ingredients"
                width={200}
                height={200}
                className="mx-auto rounded-full shadow-lg"
              />
              <h3 className="font-title text-2xl text-royalBlue">Finest Ingredients</h3>
              <p className="font-body text-gray-700">Sourced globally for unparalleled taste and quality.</p>
            </div>
            <div className="space-y-4 animate-fade-in-up delay-300">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Artisan Techniques"
                width={200}
                height={200}
                className="mx-auto rounded-full shadow-lg"
              />
              <h3 className="font-title text-2xl text-royalBlue">Artisan Techniques</h3>
              <p className="font-body text-gray-700">
                Handcrafted with precision and passion by our master pastry chefs.
              </p>
            </div>
            <div className="space-y-4 animate-fade-in-up delay-400">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Creative Designs"
                width={200}
                height={200}
                className="mx-auto rounded-full shadow-lg"
              />
              <h3 className="font-title text-2xl text-royalBlue">Creative Designs</h3>
              <p className="font-body text-gray-700">
                Each dessert is a unique piece of edible art, tailored to perfection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
