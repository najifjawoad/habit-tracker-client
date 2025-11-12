import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
console.log(motion);



const slides = [
  {
    title: "Build Better Habits, Build a Better You",
    desc: "Your daily actions define your future. Start tracking habits that push you toward success.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=60",
  },
  {
    title: "Stay Consistent, Stay Confident",
    desc: "Visualize your progress and stay motivated with your personalized habit dashboard.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=60",
  },
  {
    title: "Transform Small Steps Into Big Wins",
    desc: "Make discipline your superpower and see the magic of consistent improvement.",
    image: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1400&q=60",
  },
];

const HeroBanner = () => {
  return (
    <section className="relative">
      <Swiper
        spaceBetween={30}
        centeredSlides
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center text-white px-6 max-w-2xl"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <Typewriter
                    words={[slide.title]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </h1>
                <p className="text-lg mb-6">{slide.desc}</p>
                <a
                  href="/login"
                  className="btn bg-indigo-600 border-none text-white px-6 py-2 rounded-full hover:bg-indigo-700"
                >
                  Get Started
                </a>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;
