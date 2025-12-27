import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import heroImage1 from "../assets/a.png";
import heroImage2 from "../assets/b.png";
import heroImage3 from "../assets/c.png";
import heroImage4 from "../assets/d.png";
import heroImage5 from "../assets/e.png";
const slides = [
    { image: heroImage1 },
    { image: heroImage2 },
    { image: heroImage3 },
    { image: heroImage4 },
    { image: heroImage5 }
];
export function HeroCarousel({ children }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    // Preload images for smooth transitions
    useEffect(() => {
        const imagePromises = slides.map((slide) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = slide.image;
                img.onload = resolve;
                img.onerror = reject;
            });
        });
        Promise.all(imagePromises)
            .then(() => setImagesLoaded(true))
            .catch(() => setImagesLoaded(true)); // Still show images even if some fail
    }, []);
    useEffect(() => {
        if (!isAutoPlaying)
            return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // Auto-swipe every 3 seconds
        return () => clearInterval(interval);
    }, [isAutoPlaying]);
    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };
    return (<div className="relative min-h-screen overflow-hidden">
      {/* Background Carousel */}
      <AnimatePresence mode="sync">
        <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="absolute inset-0">
          {/* Background Image with 2px Blur */}
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
            filter: 'blur(2px) brightness(0.6)'
        }}/>
          {/* Empty Overlay for clean look */}
          <div className="absolute inset-0 flex items-center justify-center"/>
        </motion.div>
      </AnimatePresence>

      {/* Fixed Content (children) */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {children}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full">
          {slides.map((_, index) => (<button key={index} onClick={() => goToSlide(index)} className="group relative">
              <Circle className={`w-3 h-3 transition-all ${index === currentSlide
                ? 'fill-white text-white scale-125'
                : 'fill-white/40 text-white/40 hover:fill-white/70'}`}/>
              {index === currentSlide && (<motion.div layoutId="activeSlide" className="absolute inset-0 bg-white/30 rounded-full" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}/>)}
            </button>))}
        </div>

        {/* Arrow Controls */}
        <div className="flex gap-4">
          <button onClick={prevSlide} className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95">
            <ChevronLeft className="w-6 h-6 text-white"/>
          </button>
          <button onClick={nextSlide} className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95">
            <ChevronRight className="w-6 h-6 text-white"/>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
        <motion.div className="h-full bg-white" initial={{ width: "0%" }} animate={{ width: isAutoPlaying ? "100%" : "0%" }} transition={{ duration: 3, ease: "linear" }} key={currentSlide}/>
      </div>
    </div>);
}
