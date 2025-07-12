import Image from "next/image"
import { WavySeparator } from "@/components/wavy-separator"
import { MapPin, Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FindUsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="Find Us Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royalPurple/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left text-outline-royal-purple">
          Visit Our Boutique
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      <section className="py-16 px-4 md:px-6 bg-babyPink">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple">Find Your Way to Sweetness</h2>
            <p className="font-body text-lg text-gray-800 leading-relaxed">
              We invite you to experience the magic of Royal Delights in person. Our boutique is a haven of elegance,
              where you can explore our exquisite collection and find the perfect treat.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-royalBlue">
                <MapPin className="h-8 w-8 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl">Our Location</h3>
                  <p className="font-body text-lg">123 Sweet Avenue, Royal City, Kingdom 90210</p>
                  <Button
                    asChild
                    variant="link"
                    className="p-0 h-auto text-gold hover:text-royalPurple transition-colors"
                  >
                    <Link
                      href="https://maps.app.goo.gl/your-google-maps-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-4 text-royalBlue">
                <Clock className="h-8 w-8 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl">Working Hours</h3>
                  <ul className="font-body text-lg space-y-1">
                    <li>Tuesday - Saturday: 10:00 AM - 6:00 PM</li>
                    <li>Sunday: 11:00 AM - 4:00 PM</li>
                    <li>Monday: Closed</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-4 text-royalBlue">
                <Phone className="h-8 w-8 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl">Contact Us</h3>
                  <p className="font-body text-lg">+1 (123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl animate-fade-in-up delay-200">
            {/* Placeholder for Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2999999999996!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064a1d1a1d1%3A0x123456789abcdef0!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location on Google Maps"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
