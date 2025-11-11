import React from "react";
import { FaClock, FaBrain, FaChartLine, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const WhyBuildHabits = () => {
  const reasons = [
    {
      icon: <FaClock className="text-indigo-600 text-4xl mb-3" />,
      title: "Consistency Builds Success",
      desc: "Small actions repeated daily compound into massive results. Building habits makes progress automatic.",
    },
    {
      icon: <FaBrain className="text-indigo-600 text-4xl mb-3" />,
      title: "Rewire Your Mind",
      desc: "Habits reprogram your brain to favor discipline and focus over procrastination and distraction.",
    },
    {
      icon: <FaChartLine className="text-indigo-600 text-4xl mb-3" />,
      title: "Track Your Growth",
      desc: "Visual progress tracking keeps you motivated and helps you identify what truly drives improvement.",
    },
    {
      icon: <FaHeart className="text-indigo-600 text-4xl mb-3" />,
      title: "Live Healthier & Happier",
      desc: "Healthy habits boost your energy, improve your mood, and create balance in every area of life.",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-40"></div>

      <motion.div
        className="container mx-auto px-6 text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-4xl font-bold text-indigo-700 mb-4"
          variants={cardVariants}
        >
          Why Build Habits?
        </motion.h2>

        <motion.p
          className="max-w-2xl mx-auto text-gray-600 mb-12"
          variants={cardVariants}
        >
          Habits are the foundation of personal growth. Whether you’re learning,
          exercising, or improving your mindset — consistent small actions shape
          who you become.
        </motion.p>

        {/* Cards Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {reasons.map((item, idx) => (
            <motion.div
              key={idx}
              className="card bg-white shadow-lg border border-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="card-body items-center text-center">
                {item.icon}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyBuildHabits;
