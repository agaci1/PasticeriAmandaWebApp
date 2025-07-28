import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"
import OurCreationsCarousel from "@/app/components/OurCreationsCarousel"

// Add Dancing Script font for fancy titles
const dancingScript = {
  fontFamily: 'Dancing Script, cursive',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Image
            src="/logoAmanda.jpg"
            alt="Pasticeri Amanda Logo"
            width={200}
            height={200}
            className="rounded-full border-4 border-gold shadow-xl relative z-10"
          />
          {/* Gold Light Surrounding */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 blur-xl animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-8 text-royal-blue">
        <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          About Amanda Pastry Shop
        </GradientText>

        {/* Selected Text Section */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-white/90 to-white/70 rounded-3xl shadow-2xl border-2 border-gold overflow-hidden">
          {/* Donut Background */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/donutspic.jpg"
              alt="Donut Background"
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
            />
          </div>
          
          {/* Royal Corner Decorations */}
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 z-10">
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-gold rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-gold/60 rounded-tl-xl"></div>
          </div>
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 z-10">
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-gold rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-gold/60 rounded-tr-xl"></div>
          </div>
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-gold rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-gold/60 rounded-bl-xl"></div>
          </div>
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-gold rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-gold/60 rounded-br-xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              style={{
                ...dancingScript,
                textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
              }}
            >
              Welcome to Amanda Pastry Shop
            </h2>
            <p className="text-xl leading-relaxed font-bold text-royal-blue max-w-4xl mx-auto">
              A place where passion for baking meets the art of confectionery. Nestled in the heart of Saranda, Albania, 
              our shop was founded with a simple dream: to bring joy and sweetness to every celebration and everyday moment.
            </p>
          </div>
        </div>

        {/* Our Story Section with Royal Frame */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-white/90 to-white/70 rounded-3xl shadow-2xl border-2 border-gold overflow-hidden">
          {/* Donut Background */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/donutspic.jpg"
              alt="Donut Background"
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
            />
          </div>
          
          {/* Royal Corner Decorations */}
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 z-10">
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-gold rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-gold/60 rounded-tl-xl"></div>
          </div>
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 z-10">
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-gold rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-gold/60 rounded-tr-xl"></div>
          </div>
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-gold rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-gold/60 rounded-bl-xl"></div>
          </div>
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-gold rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-gold/60 rounded-br-xl"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/cupcakespic.jpg"
                alt="Delicious Cupcakes"
                fill
                className="rounded-xl object-cover"
              />
            </div>
            <div className="space-y-6">
              {/* Title in the middle */}
              <div className="text-center py-4">
                <h2 
                  className="text-3xl font-bold text-white"
                  style={{
                    ...dancingScript,
                    textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
                  }}
                >
                  Our Story
                </h2>
              </div>
              
              <p className="text-lg leading-relaxed font-bold text-royal-blue">
                For years, we have dedicated ourselves to perfecting classic recipes and innovating new ones, always using
                the finest, freshest ingredients. We believe that a truly delicious pastry starts with quality, and ends
                with a smile.
              </p>
            </div>
          </div>
        </div>

        {/* Our Philosophy Section with Royal Frame */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-white/90 to-white/70 rounded-3xl shadow-2xl border-2 border-gold overflow-hidden">
          {/* Donut Background */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/donutspic.jpg"
              alt="Donut Background"
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
            />
          </div>
          
          {/* Royal Corner Decorations */}
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 z-10">
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-gold rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-gold/60 rounded-tl-xl"></div>
          </div>
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 z-10">
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-gold rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-gold/60 rounded-tr-xl"></div>
          </div>
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-gold rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-gold/60 rounded-bl-xl"></div>
          </div>
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-gold rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-gold/60 rounded-br-xl"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6 order-2 md:order-1">
              <h2 
                className="text-3xl font-bold text-white"
                style={{
                  ...dancingScript,
                  textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
                }}
              >
                Our Philosophy
              </h2>
              <p className="text-lg leading-relaxed font-bold text-royal-blue">
                At Amanda Pastry Shop, we are more than just bakers; we are artists. Each cake, each pastry, is a canvas
                where we blend flavors, textures, and designs to create edible masterpieces. We pride ourselves on our
                attention to detail, ensuring that every bite is a delightful experience.
              </p>
              <p className="text-lg leading-relaxed font-bold text-royal-blue">
                From elegant wedding cakes to whimsical birthday treats and delicate daily pastries, we pour our heart
                into every creation. We are committed to sustainability, supporting local suppliers, and fostering a warm,
                welcoming environment for our community.
              </p>
            </div>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
              <Image
                src="/tartapic.webp"
                alt="Beautiful Tarts"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>



        {/* Meet Our Team Section with Royal Frame */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-white/90 to-white/70 rounded-3xl shadow-2xl border-2 border-gold overflow-hidden">
          {/* Donut Background */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/donutspic.jpg"
              alt="Donut Background"
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
            />
          </div>
          
          {/* Royal Corner Decorations */}
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 z-10">
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-gold rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-gold/60 rounded-tl-xl"></div>
          </div>
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 z-10">
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-gold rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-gold/60 rounded-tr-xl"></div>
          </div>
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-gold rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-gold/60 rounded-bl-xl"></div>
          </div>
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-gold rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-gold/60 rounded-br-xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h2 
              className="text-3xl font-bold text-white mb-6"
              style={{
                ...dancingScript,
                textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
              }}
            >
              Meet Our Team
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 font-bold text-royal-blue">
              Our talented team of pastry chefs and dedicated staff are the heart of Amanda Pastry Shop. With years of experience and a shared love for baking, they work tirelessly to bring your sweet dreams to life.
            </p>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-6">
                  <Image
                    src="/amandapic.jpg"
                    alt="Amanda Gaci - Founder & Head Pastry Chef"
                    fill
                    className="rounded-full object-cover border-6 border-gold shadow-2xl"
                  />
                </div>
                <h3 className="text-2xl font-bold text-royal-purple mb-2">Amanda Gaci</h3>
                <p className="text-lg text-royal-blue font-semibold">Founder, Head Pastry Chef & Custom Cake Specialist</p>
                <p className="text-sm text-royal-blue/80 mt-2 max-w-md mx-auto font-bold">
                  With years of experience in pastry arts and a passion for creating edible masterpieces, 
                  Amanda leads our team with creativity, precision, and dedication to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Creations Carousel Section - Full Screen */}
      <div className="relative w-screen -mx-4 md:-mx-6 lg:-mx-8 py-16 bg-gradient-to-br from-white/90 to-white/70 overflow-hidden">
        {/* Donut Background */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/donutspic.jpg"
            alt="Donut Background"
            fill
            className="object-cover"
            style={{ filter: 'blur(8px)' }}
          />
        </div>
        
        <div className="relative z-10">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-white"
            style={{
              ...dancingScript,
              textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
            }}
          >
            Our Creations
          </h2>
          <p className="text-xl md:text-2xl text-center mb-12 text-royal-blue font-bold max-w-4xl mx-auto px-4">
            Discover our wide variety of delicious offerings including custom cakes, traditional sweets, modern desserts, 
            and everything in between. From elegant wedding cakes to whimsical birthday treats, from classic pastries 
            to innovative creations, we bring your sweetest dreams to life with passion and artistry.
          </p>
          <OurCreationsCarousel />
        </div>
      </div>
    </div>
  )
}
