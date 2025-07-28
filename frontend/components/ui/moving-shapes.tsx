export function MovingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gold Circle 1 */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gold opacity-20 animate-move-circle-1 blur-xl" />
      {/* Pink Circle 2 */}
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-gradient-end opacity-20 animate-move-circle-2 blur-xl" />
      {/* Royal Purple Circle 3 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-royal-purple opacity-20 animate-move-circle-3 blur-xl" />
      {/* Gold Circle 4 (smaller) */}
      <div className="absolute top-1/10 right-1/10 w-32 h-32 rounded-full bg-gold opacity-15 animate-move-circle-4 blur-lg animation-delay-2s" />
      {/* Pink Circle 5 (smaller) */}
      <div className="absolute bottom-1/10 left-1/10 w-40 h-40 rounded-full bg-pink-gradient-start opacity-15 animate-move-circle-5 blur-lg animation-delay-4s" />
      {/* Additional shapes for more dynamism */}
      <div className="absolute top-[5%] left-[60%] w-24 h-24 rounded-full bg-royal-blue opacity-10 animate-move-circle-1 blur-md animation-delay-3s" />
      <div className="absolute bottom-[20%] left-[5%] w-36 h-36 rounded-full bg-gold opacity-18 animate-move-circle-2 blur-xl animation-delay-1s" />
      <div className="absolute top-[70%] right-[15%] w-52 h-52 rounded-full bg-pink-gradient-start opacity-12 animate-move-circle-3 blur-lg animation-delay-5s" />
      <div className="absolute top-[30%] right-[5%] w-28 h-28 rounded-full bg-royal-purple opacity-15 animate-move-circle-4 blur-md animation-delay-0.5s" />
      
      {/* NEW ADDITIONAL SHAPES */}
      {/* Extra Gold Circle 6 */}
      <div className="absolute top-[15%] left-[20%] w-20 h-20 rounded-full bg-gold opacity-12 animate-move-circle-2 blur-lg animation-delay-1.5s" />
      {/* Extra Pink Circle 7 */}
      <div className="absolute bottom-[40%] right-[30%] w-44 h-44 rounded-full bg-pink-gradient-end opacity-16 animate-move-circle-1 blur-xl animation-delay-2.5s" />
      {/* Extra Royal Blue Circle 8 */}
      <div className="absolute top-[60%] left-[15%] w-30 h-30 rounded-full bg-royal-blue opacity-14 animate-move-circle-3 blur-md animation-delay-3.5s" />
      {/* Extra Royal Purple Circle 9 */}
      <div className="absolute bottom-[15%] right-[5%] w-26 h-26 rounded-full bg-royal-purple opacity-13 animate-move-circle-4 blur-lg animation-delay-4.5s" />
      {/* Extra Gold Circle 10 */}
      <div className="absolute top-[25%] right-[25%] w-38 h-38 rounded-full bg-gold opacity-17 animate-move-circle-5 blur-xl animation-delay-0.8s" />
      {/* Extra Pink Circle 11 */}
      <div className="absolute bottom-[60%] left-[40%] w-22 h-22 rounded-full bg-pink-gradient-start opacity-11 animate-move-circle-1 blur-md animation-delay-1.8s" />
      {/* Extra Royal Blue Circle 12 */}
      <div className="absolute top-[80%] left-[35%] w-34 h-34 rounded-full bg-royal-blue opacity-15 animate-move-circle-2 blur-lg animation-delay-2.8s" />
      {/* Extra Gold Circle 13 */}
      <div className="absolute top-[45%] right-[40%] w-18 h-18 rounded-full bg-gold opacity-10 animate-move-circle-3 blur-sm animation-delay-3.8s" />
      {/* Extra Pink Circle 14 */}
      <div className="absolute bottom-[30%] left-[25%] w-46 h-46 rounded-full bg-pink-gradient-end opacity-18 animate-move-circle-4 blur-xl animation-delay-4.8s" />
      {/* Extra Royal Purple Circle 15 */}
      <div className="absolute top-[10%] left-[45%] w-16 h-16 rounded-full bg-royal-purple opacity-9 animate-move-circle-5 blur-sm animation-delay-0.3s" />
      {/* Extra Gold Circle 16 */}
      <div className="absolute bottom-[50%] right-[20%] w-42 h-42 rounded-full bg-gold opacity-19 animate-move-circle-1 blur-xl animation-delay-1.3s" />
      {/* Extra Pink Circle 17 */}
      <div className="absolute top-[35%] left-[30%] w-28 h-28 rounded-full bg-pink-gradient-start opacity-14 animate-move-circle-2 blur-lg animation-delay-2.3s" />
      {/* Extra Royal Blue Circle 18 */}
      <div className="absolute bottom-[10%] left-[50%] w-24 h-24 rounded-full bg-royal-blue opacity-12 animate-move-circle-3 blur-md animation-delay-3.3s" />
      {/* Extra Gold Circle 19 */}
      <div className="absolute top-[55%] right-[10%] w-32 h-32 rounded-full bg-gold opacity-16 animate-move-circle-4 blur-lg animation-delay-4.3s" />
      {/* Extra Pink Circle 20 */}
      <div className="absolute bottom-[70%] left-[10%] w-20 h-20 rounded-full bg-pink-gradient-end opacity-11 animate-move-circle-5 blur-md animation-delay-0.7s" />

      {/* EVEN MORE SHAPES TO FILL EMPTY SPACES */}
      {/* Top Left Quadrant - More Coverage */}
      <div className="absolute top-[8%] left-[8%] w-14 h-14 rounded-full bg-gold opacity-8 animate-move-circle-1 blur-sm animation-delay-0.2s" />
      <div className="absolute top-[12%] left-[12%] w-18 h-18 rounded-full bg-pink-gradient-start opacity-10 animate-move-circle-2 blur-md animation-delay-1.2s" />
      <div className="absolute top-[18%] left-[18%] w-12 h-12 rounded-full bg-royal-blue opacity-7 animate-move-circle-3 blur-sm animation-delay-2.2s" />
      <div className="absolute top-[22%] left-[22%] w-16 h-16 rounded-full bg-royal-purple opacity-9 animate-move-circle-4 blur-md animation-delay-3.2s" />
      <div className="absolute top-[28%] left-[28%] w-20 h-20 rounded-full bg-gold opacity-11 animate-move-circle-5 blur-lg animation-delay-4.2s" />

      {/* Top Right Quadrant - More Coverage */}
      <div className="absolute top-[8%] right-[8%] w-14 h-14 rounded-full bg-pink-gradient-end opacity-8 animate-move-circle-1 blur-sm animation-delay-0.4s" />
      <div className="absolute top-[12%] right-[12%] w-18 h-18 rounded-full bg-royal-blue opacity-10 animate-move-circle-2 blur-md animation-delay-1.4s" />
      <div className="absolute top-[18%] right-[18%] w-12 h-12 rounded-full bg-gold opacity-7 animate-move-circle-3 blur-sm animation-delay-2.4s" />
      <div className="absolute top-[22%] right-[22%] w-16 h-16 rounded-full bg-pink-gradient-start opacity-9 animate-move-circle-4 blur-md animation-delay-3.4s" />
      <div className="absolute top-[28%] right-[28%] w-20 h-20 rounded-full bg-royal-purple opacity-11 animate-move-circle-5 blur-lg animation-delay-4.4s" />

      {/* Bottom Left Quadrant - More Coverage */}
      <div className="absolute bottom-[8%] left-[8%] w-14 h-14 rounded-full bg-royal-purple opacity-8 animate-move-circle-1 blur-sm animation-delay-0.6s" />
      <div className="absolute bottom-[12%] left-[12%] w-18 h-18 rounded-full bg-gold opacity-10 animate-move-circle-2 blur-md animation-delay-1.6s" />
      <div className="absolute bottom-[18%] left-[18%] w-12 h-12 rounded-full bg-pink-gradient-end opacity-7 animate-move-circle-3 blur-sm animation-delay-2.6s" />
      <div className="absolute bottom-[22%] left-[22%] w-16 h-16 rounded-full bg-royal-blue opacity-9 animate-move-circle-4 blur-md animation-delay-3.6s" />
      <div className="absolute bottom-[28%] left-[28%] w-20 h-20 rounded-full bg-gold opacity-11 animate-move-circle-5 blur-lg animation-delay-4.6s" />

      {/* Bottom Right Quadrant - More Coverage */}
      <div className="absolute bottom-[8%] right-[8%] w-14 h-14 rounded-full bg-royal-blue opacity-8 animate-move-circle-1 blur-sm animation-delay-0.8s" />
      <div className="absolute bottom-[12%] right-[12%] w-18 h-18 rounded-full bg-pink-gradient-start opacity-10 animate-move-circle-2 blur-md animation-delay-1.8s" />
      <div className="absolute bottom-[18%] right-[18%] w-12 h-12 rounded-full bg-gold opacity-7 animate-move-circle-3 blur-sm animation-delay-2.8s" />
      <div className="absolute bottom-[22%] right-[22%] w-16 h-16 rounded-full bg-royal-purple opacity-9 animate-move-circle-4 blur-md animation-delay-3.8s" />
      <div className="absolute bottom-[28%] right-[28%] w-20 h-20 rounded-full bg-pink-gradient-end opacity-11 animate-move-circle-5 blur-lg animation-delay-4.8s" />

      {/* Center Area - More Coverage */}
      <div className="absolute top-[40%] left-[40%] w-22 h-22 rounded-full bg-gold opacity-12 animate-move-circle-1 blur-md animation-delay-0.1s" />
      <div className="absolute top-[45%] left-[45%] w-16 h-16 rounded-full bg-pink-gradient-start opacity-10 animate-move-circle-2 blur-lg animation-delay-1.1s" />
      <div className="absolute top-[50%] left-[50%] w-20 h-20 rounded-full bg-royal-blue opacity-11 animate-move-circle-3 blur-md animation-delay-2.1s" />
      <div className="absolute top-[55%] left-[55%] w-14 h-14 rounded-full bg-royal-purple opacity-9 animate-move-circle-4 blur-sm animation-delay-3.1s" />
      <div className="absolute top-[60%] left-[60%] w-18 h-18 rounded-full bg-gold opacity-13 animate-move-circle-5 blur-lg animation-delay-4.1s" />

      {/* Middle Top Area */}
      <div className="absolute top-[5%] left-[50%] w-15 h-15 rounded-full bg-pink-gradient-end opacity-9 animate-move-circle-1 blur-md animation-delay-0.9s" />
      <div className="absolute top-[10%] left-[55%] w-19 h-19 rounded-full bg-royal-blue opacity-11 animate-move-circle-2 blur-lg animation-delay-1.9s" />
      <div className="absolute top-[15%] left-[45%] w-13 h-13 rounded-full bg-gold opacity-8 animate-move-circle-3 blur-sm animation-delay-2.9s" />

      {/* Middle Bottom Area */}
      <div className="absolute bottom-[5%] left-[50%] w-15 h-15 rounded-full bg-royal-purple opacity-9 animate-move-circle-1 blur-md animation-delay-0.7s" />
      <div className="absolute bottom-[10%] left-[55%] w-19 h-19 rounded-full bg-gold opacity-11 animate-move-circle-2 blur-lg animation-delay-1.7s" />
      <div className="absolute bottom-[15%] left-[45%] w-13 h-13 rounded-full bg-pink-gradient-start opacity-8 animate-move-circle-3 blur-sm animation-delay-2.7s" />

      {/* Middle Left Area */}
      <div className="absolute top-[50%] left-[5%] w-15 h-15 rounded-full bg-gold opacity-9 animate-move-circle-1 blur-md animation-delay-0.3s" />
      <div className="absolute top-[55%] left-[10%] w-19 h-19 rounded-full bg-pink-gradient-end opacity-11 animate-move-circle-2 blur-lg animation-delay-1.3s" />
      <div className="absolute top-[45%] left-[15%] w-13 h-13 rounded-full bg-royal-blue opacity-8 animate-move-circle-3 blur-sm animation-delay-2.3s" />

      {/* Middle Right Area */}
      <div className="absolute top-[50%] right-[5%] w-15 h-15 rounded-full bg-royal-purple opacity-9 animate-move-circle-1 blur-md animation-delay-0.5s" />
      <div className="absolute top-[55%] right-[10%] w-19 h-19 rounded-full bg-gold opacity-11 animate-move-circle-2 blur-lg animation-delay-1.5s" />
      <div className="absolute top-[45%] right-[15%] w-13 h-13 rounded-full bg-pink-gradient-start opacity-8 animate-move-circle-3 blur-sm animation-delay-2.5s" />

      {/* Diagonal Areas - More Coverage */}
      <div className="absolute top-[20%] left-[35%] w-17 h-17 rounded-full bg-royal-blue opacity-10 animate-move-circle-4 blur-md animation-delay-0.6s" />
      <div className="absolute top-[25%] left-[40%] w-21 h-21 rounded-full bg-gold opacity-12 animate-move-circle-5 blur-lg animation-delay-1.6s" />
      <div className="absolute top-[30%] left-[45%] w-15 h-15 rounded-full bg-pink-gradient-end opacity-9 animate-move-circle-1 blur-sm animation-delay-2.6s" />
      <div className="absolute top-[35%] left-[50%] w-19 h-19 rounded-full bg-royal-purple opacity-11 animate-move-circle-2 blur-md animation-delay-3.6s" />

      <div className="absolute top-[20%] right-[35%] w-17 h-17 rounded-full bg-gold opacity-10 animate-move-circle-4 blur-md animation-delay-0.4s" />
      <div className="absolute top-[25%] right-[40%] w-21 h-21 rounded-full bg-pink-gradient-start opacity-12 animate-move-circle-5 blur-lg animation-delay-1.4s" />
      <div className="absolute top-[30%] right-[45%] w-15 h-15 rounded-full bg-royal-blue opacity-9 animate-move-circle-1 blur-sm animation-delay-2.4s" />
      <div className="absolute top-[35%] right-[50%] w-19 h-19 rounded-full bg-gold opacity-11 animate-move-circle-2 blur-md animation-delay-3.4s" />

      <div className="absolute bottom-[20%] left-[35%] w-17 h-17 rounded-full bg-pink-gradient-end opacity-10 animate-move-circle-4 blur-md animation-delay-0.8s" />
      <div className="absolute bottom-[25%] left-[40%] w-21 h-21 rounded-full bg-royal-purple opacity-12 animate-move-circle-5 blur-lg animation-delay-1.8s" />
      <div className="absolute bottom-[30%] left-[45%] w-15 h-15 rounded-full bg-gold opacity-9 animate-move-circle-1 blur-sm animation-delay-2.8s" />
      <div className="absolute bottom-[35%] left-[50%] w-19 h-19 rounded-full bg-royal-blue opacity-11 animate-move-circle-2 blur-md animation-delay-3.8s" />

      <div className="absolute bottom-[20%] right-[35%] w-17 h-17 rounded-full bg-royal-blue opacity-10 animate-move-circle-4 blur-md animation-delay-0.2s" />
      <div className="absolute bottom-[25%] right-[40%] w-21 h-21 rounded-full bg-gold opacity-12 animate-move-circle-5 blur-lg animation-delay-1.2s" />
      <div className="absolute bottom-[30%] right-[45%] w-15 h-15 rounded-full bg-pink-gradient-start opacity-9 animate-move-circle-1 blur-sm animation-delay-2.2s" />
      <div className="absolute bottom-[35%] right-[50%] w-19 h-19 rounded-full bg-royal-purple opacity-11 animate-move-circle-2 blur-md animation-delay-3.2s" />

      {/* Additional Small Shapes for Density */}
      <div className="absolute top-[3%] left-[25%] w-8 h-8 rounded-full bg-gold opacity-6 animate-move-circle-3 blur-sm animation-delay-0.1s" />
      <div className="absolute top-[7%] left-[75%] w-10 h-10 rounded-full bg-pink-gradient-start opacity-7 animate-move-circle-4 blur-sm animation-delay-1.1s" />
      <div className="absolute top-[13%] left-[85%] w-6 h-6 rounded-full bg-royal-blue opacity-5 animate-move-circle-5 blur-xs animation-delay-2.1s" />
      <div className="absolute top-[17%] left-[95%] w-9 h-9 rounded-full bg-royal-purple opacity-6 animate-move-circle-1 blur-sm animation-delay-3.1s" />
      <div className="absolute top-[23%] left-[3%] w-7 h-7 rounded-full bg-gold opacity-5 animate-move-circle-2 blur-xs animation-delay-4.1s" />
      <div className="absolute top-[27%] left-[7%] w-11 h-11 rounded-full bg-pink-gradient-end opacity-8 animate-move-circle-3 blur-sm animation-delay-0.2s" />
      <div className="absolute top-[33%] left-[13%] w-5 h-5 rounded-full bg-royal-blue opacity-4 animate-move-circle-4 blur-xs animation-delay-1.2s" />
      <div className="absolute top-[37%] left-[17%] w-9 h-9 rounded-full bg-royal-purple opacity-6 animate-move-circle-5 blur-sm animation-delay-2.2s" />

      <div className="absolute bottom-[3%] left-[25%] w-8 h-8 rounded-full bg-pink-gradient-start opacity-6 animate-move-circle-3 blur-sm animation-delay-0.3s" />
      <div className="absolute bottom-[7%] left-[75%] w-10 h-10 rounded-full bg-gold opacity-7 animate-move-circle-4 blur-sm animation-delay-1.3s" />
      <div className="absolute bottom-[13%] left-[85%] w-6 h-6 rounded-full bg-royal-purple opacity-5 animate-move-circle-5 blur-xs animation-delay-2.3s" />
      <div className="absolute bottom-[17%] left-[95%] w-9 h-9 rounded-full bg-royal-blue opacity-6 animate-move-circle-1 blur-sm animation-delay-3.3s" />
      <div className="absolute bottom-[23%] left-[3%] w-7 h-7 rounded-full bg-pink-gradient-end opacity-5 animate-move-circle-2 blur-xs animation-delay-4.3s" />
      <div className="absolute bottom-[27%] left-[7%] w-11 h-11 rounded-full bg-gold opacity-8 animate-move-circle-3 blur-sm animation-delay-0.4s" />
      <div className="absolute bottom-[33%] left-[13%] w-5 h-5 rounded-full bg-royal-blue opacity-4 animate-move-circle-4 blur-xs animation-delay-1.4s" />
      <div className="absolute bottom-[37%] left-[17%] w-9 h-9 rounded-full bg-pink-gradient-start opacity-6 animate-move-circle-5 blur-sm animation-delay-2.4s" />

      <div className="absolute top-[3%] right-[25%] w-8 h-8 rounded-full bg-royal-purple opacity-6 animate-move-circle-3 blur-sm animation-delay-0.5s" />
      <div className="absolute top-[7%] right-[75%] w-10 h-10 rounded-full bg-royal-blue opacity-7 animate-move-circle-4 blur-sm animation-delay-1.5s" />
      <div className="absolute top-[13%] right-[85%] w-6 h-6 rounded-full bg-gold opacity-5 animate-move-circle-5 blur-xs animation-delay-2.5s" />
      <div className="absolute top-[17%] right-[95%] w-9 h-9 rounded-full bg-pink-gradient-end opacity-6 animate-move-circle-1 blur-sm animation-delay-3.5s" />
      <div className="absolute top-[23%] right-[3%] w-7 h-7 rounded-full bg-royal-blue opacity-5 animate-move-circle-2 blur-xs animation-delay-4.5s" />
      <div className="absolute top-[27%] right-[7%] w-11 h-11 rounded-full bg-gold opacity-8 animate-move-circle-3 blur-sm animation-delay-0.6s" />
      <div className="absolute top-[33%] right-[13%] w-5 h-5 rounded-full bg-pink-gradient-start opacity-4 animate-move-circle-4 blur-xs animation-delay-1.6s" />
      <div className="absolute top-[37%] right-[17%] w-9 h-9 rounded-full bg-royal-purple opacity-6 animate-move-circle-5 blur-sm animation-delay-2.6s" />

      <div className="absolute bottom-[3%] right-[25%] w-8 h-8 rounded-full bg-gold opacity-6 animate-move-circle-3 blur-sm animation-delay-0.7s" />
      <div className="absolute bottom-[7%] right-[75%] w-10 h-10 rounded-full bg-pink-gradient-end opacity-7 animate-move-circle-4 blur-sm animation-delay-1.7s" />
      <div className="absolute bottom-[13%] right-[85%] w-6 h-6 rounded-full bg-royal-blue opacity-5 animate-move-circle-5 blur-xs animation-delay-2.7s" />
      <div className="absolute bottom-[17%] right-[95%] w-9 h-9 rounded-full bg-royal-purple opacity-6 animate-move-circle-1 blur-sm animation-delay-3.7s" />
      <div className="absolute bottom-[23%] right-[3%] w-7 h-7 rounded-full bg-gold opacity-5 animate-move-circle-2 blur-xs animation-delay-4.7s" />
      <div className="absolute bottom-[27%] right-[7%] w-11 h-11 rounded-full bg-pink-gradient-start opacity-8 animate-move-circle-3 blur-sm animation-delay-0.8s" />
      <div className="absolute bottom-[33%] right-[13%] w-5 h-5 rounded-full bg-royal-blue opacity-4 animate-move-circle-4 blur-xs animation-delay-1.8s" />
      <div className="absolute bottom-[37%] right-[17%] w-9 h-9 rounded-full bg-gold opacity-6 animate-move-circle-5 blur-sm animation-delay-2.8s" />
    </div>
  )
}
