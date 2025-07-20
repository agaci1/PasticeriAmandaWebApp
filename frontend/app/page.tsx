import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import { MovingShapes } from "@/components/ui/moving-shapes" // Removed from here
import { GradientText } from "@/components/ui/gradient-text"

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center py-12 px-4 overflow-hidden">
      {/* <MovingShapes /> */} {/* Removed from here as it's now in layout */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Company Logo Section */}
        <div className="flex justify-center mb-8">
          <Image
            src="/placeholder.svg?height=200&width=200" // Replace with your actual logo
            alt="Pasticeri Amanda Logo"
            width={200}
            height={200}
            className="rounded-full border-4 border-gold shadow-xl animate-pulse-slow"
          />
        </div>

        <div className="space-y-6">
          <GradientText type="title" className="text-5xl md:text-7xl font-extrabold leading-tight">
            Pasticeri Amanda
          </GradientText>
          <p className="text-lg md:text-xl text-royal-blue max-w-2xl mx-auto">
            Indulge in Sweet Perfection: Discover exquisite custom cakes and pastries, crafted with passion and the
            finest ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Delicious Custom Cake"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <h2 className="text-white text-2xl font-bold">Custom Cakes</h2>
            </div>
          </div>
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Assortment of Pastries"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <h2 className="text-white text-2xl font-bold">Artisan Pastries</h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            asChild
            className="px-8 py-3 text-lg bg-royal-purple text-white hover:bg-royal-blue transition-colors shadow-lg"
          >
            <Link href="/menu">Explore Our Menu</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-3 text-lg border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white transition-colors shadow-lg bg-transparent"
          >
            <Link href="/order">Place a Custom Order</Link>
          </Button>
        </div>

        <div className="pt-12 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-royal-purple">Why Choose Amanda Pastry Shop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-royal-blue">
            <div className="bg-white/70 p-6 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-royal-purple">Finest Ingredients</h3>
              <p className="text-sm">We source only the highest quality ingredients for unparalleled taste.</p>
            </div>
            <div className="bg-white/70 p-6 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-royal-purple">Artisan Craftsmanship</h3>
              <p className="text-sm">Every creation is a masterpiece, handcrafted with precision and care.</p>
            </div>
            <div className="bg-white/70 p-6 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-royal-purple">Personalized Service</h3>
              <p className="text-sm">Your vision, our expertise – creating desserts tailored just for you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
