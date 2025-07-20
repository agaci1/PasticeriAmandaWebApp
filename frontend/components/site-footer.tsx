import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"
import Link from "next/link"
import { GradientText } from "./ui/gradient-text"

export function SiteFooter() {
  return (
    <footer className="relative z-20 bg-gradient-to-r from-footer-gradient-light-start to-footer-gradient-light-end py-8 md:py-12 border-t border-gold">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-dark-royal-blue">
        <div className="space-y-4">
          <GradientText className="text-2xl font-bold">Amanda Pastry Shop</GradientText>
          <p className="text-sm">Delicious custom cakes & pastries made with the finest ingredients.</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-royal-purple">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              Located in the heart of Saranda, Albania
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <Link href="tel:+355693520462" className="hover:underline">
                +355 69 352 0462
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              <Link href="mailto:pasticeriamanda@gmail.com" className="hover:underline">
                pasticeriamanda@gmail.com
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              Open every day: 8:00 AM – 11:00 PM
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-royal-purple">Follow Us</h3>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/pasticeriamanda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-royal-blue hover:text-gold transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.facebook.com/pasticeriamanda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-royal-blue hover:text-gold transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
          <p className="text-xs text-dark-royal-blue/80 pt-4">© 2025 Amanda Pastry Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
