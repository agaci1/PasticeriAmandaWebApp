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
    </div>
  )
}
