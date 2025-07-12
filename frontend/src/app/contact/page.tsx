import Image from "next/image"
import { WavySeparator } from "@/components/wavy-separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="Contact Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gold/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left">
          Get in Touch
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      <section className="py-16 px-4 md:px-6 bg-babyPink">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple">We'd Love to Hear From You</h2>
            <p className="font-body text-lg text-gray-800 leading-relaxed">
              Whether you have a question about our menu, want to discuss a custom order, or simply want to share your
              Royal Delights experience, feel free to reach out.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-royalBlue">
                <Mail className="h-8 w-8 text-gold" />
                <span className="font-body text-lg">pasticeriamanda@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-royalBlue">
                <Phone className="h-8 w-8 text-gold" />
                <span className="font-body text-lg">+355 69 352 0462</span>
              </div>
              <div className="flex items-start gap-4 text-royalBlue">
                <MapPin className="h-8 w-8 text-gold shrink-0 mt-1" />
                <span className="font-body text-lg">Rruga Lefter Talo, Saranda, Albania</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl animate-fade-in-up delay-200">
            <h3 className="font-title text-3xl text-royalPurple mb-6 text-center">Send Us a Message</h3>
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-semibold text-royalBlue mb-1 block">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold text-royalBlue mb-1 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="font-semibold text-royalBlue mb-1 block">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Subject of your message"
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold text-royalBlue mb-1 block">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  className="font-body border-lightAccent focus:border-babyPink"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gold text-white hover:bg-royalPurple transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
      <section className="px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="w-full h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.9000000000005!2d20.0000000!3d39.8700000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDUyJzEyLjAiTiAyMMKwMDAnMDQuMCJF!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" // Placeholder, replace with actual embed code for Rruga Lefter Talo, Saranda, Albania
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location on Google Maps"
            ></iframe>
          </div>
          <div></div>
        </div>
      </section>
    </div>
  )
}
