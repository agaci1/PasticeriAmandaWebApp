"use client"

import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"
import OurCreationsCarousel from "@/app/components/OurCreationsCarousel"
import { useTranslation } from "@/contexts/TranslationContext"
import { Playfair_Display } from "next/font/google"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"

// Add Dancing Script font for fancy titles
const dancingScript = {
  fontFamily: 'Dancing Script, cursive',
}

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair"
})

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Image
            src="/logoAmanda.jpg"
            alt="Pastiçeri Amanda Logo"
            width={200}
            height={200}
            className="rounded-full border-4 border-gold shadow-xl relative z-10"
          />
          {/* Gold Light Surrounding */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 blur-xl animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-8 text-royal-blue">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          {t("aboutAmanda")}
        </h1>

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
              className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
              style={{
                ...dancingScript,
                textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
              }}
            >
              {t("welcomeToAmanda")}
            </h2>
            <ScrollFadeIn threshold={0.2} delay={0}>
              <p className={`text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto tracking-wide ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9, color: '#b91c7a' }}>
                {t("aboutStory")}
              </p>
            </ScrollFadeIn>
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
            <div className="space-y-6 order-2 md:order-1">
              <h3 
                className="text-3xl md:text-4xl font-bold text-white leading-tight"
                style={{
                  ...dancingScript,
                  textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
                }}
              >
                {t("ourStory")}
              </h3>
              <ScrollFadeIn threshold={0.2} delay={100}>
                <p className={`text-lg md:text-xl leading-relaxed tracking-wide ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9, color: '#b91c7a' }}>
                  {t("ourStoryContent")}
                </p>
              </ScrollFadeIn>
            </div>
            <ScrollFadeIn threshold={0.2} delay={200} direction="right">
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <Image
                  src="/cakespic.WEBP"
                  alt="Beautiful Cakes"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </ScrollFadeIn>
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
                className="text-3xl font-bold text-white leading-tight"
                style={{
                  ...dancingScript,
                  textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
                }}
              >
                {t("ourPhilosophy")}
              </h2>
              <div className="space-y-4">
                <ScrollFadeIn threshold={0.2} delay={0}>
                  <p className={`text-lg md:text-xl leading-relaxed tracking-wide ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9, color: '#b91c7a' }}>
                    {t("philosophyDescription1")}
                  </p>
                </ScrollFadeIn>
                <ScrollFadeIn threshold={0.2} delay={150}>
                  <p className={`text-lg md:text-xl leading-relaxed tracking-wide ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9, color: '#b91c7a' }}>
                    {t("philosophyDescription2")}
                  </p>
                </ScrollFadeIn>
              </div>
            </div>
            <ScrollFadeIn threshold={0.2} delay={200} direction="left">
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <Image
                  src="/tartapic.webp"
                  alt="Beautiful Tarts"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </ScrollFadeIn>
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
              className="text-3xl font-bold text-white mb-6 leading-tight"
              style={{
                ...dancingScript,
                textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
              }}
            >
              {t("meetOurTeam")}
            </h2>
            <ScrollFadeIn threshold={0.2} delay={100}>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 text-royal-blue tracking-wide leading-relaxed ${playfairDisplay.className}`} style={{ fontWeight: 300 }}>
                {t("teamDescription")}
              </p>
            </ScrollFadeIn>
            <div className="flex justify-center">
              <div className="text-center">
                <ScrollFadeIn threshold={0.2} delay={150} direction="up">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-6">
                    <Image
                      src="/amandapic.jpg"
                      alt="Amanda Gaci - Founder & Head Pastry Chef"
                      fill
                      className="rounded-full object-cover border-6 border-gold shadow-2xl"
                    />
                  </div>
                </ScrollFadeIn>
                <h3 className="text-2xl md:text-3xl font-bold text-royal-purple mb-2 leading-tight">Amanda Gaci</h3>
                <p className="text-lg md:text-xl text-royal-blue font-semibold mb-3 tracking-wide">Founder, Head Pastry Chef & Custom Cake Specialist</p>
                <ScrollFadeIn threshold={0.2} delay={200}>
                  <p className={`text-base md:text-lg mt-2 max-w-md mx-auto leading-relaxed tracking-wide ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.85, color: '#b91c7a' }}>
                    {t("amandaDescription")}
                  </p>
                </ScrollFadeIn>
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
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-white leading-tight"
            style={{
              ...dancingScript,
              textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
            }}
          >
            {t("ourCreations")}
          </h2>
          <ScrollFadeIn threshold={0.2} delay={0}>
            <p className={`text-xl md:text-2xl text-center mb-12 max-w-4xl mx-auto px-4 tracking-wide leading-relaxed ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9, color: '#b91c7a' }}>
              {t("creationsDescription")}
            </p>
          </ScrollFadeIn>
          <OurCreationsCarousel />
        </div>
      </div>
    </div>
  )
}
