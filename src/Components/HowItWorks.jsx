import React from "react";
import { FaListCheck, FaChartBar, FaRocket } from "react-icons/fa6";
import { motion } from "framer-motion";
console.log(motion);

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaListCheck className="text-indigo-600 text-4xl mb-3" />,
      title: "1. Set Your Goals",
      desc: "Choose the habits you want to build and define how often you want to practice them.",
    },
    {
      icon: <FaChartBar className="text-indigo-600 text-4xl mb-3" />,
      title: "2. Track Progress",
      desc: "Log your daily activities and visualize how your consistency improves over time.",
    },
    {
      icon: <FaRocket className="text-indigo-600 text-4xl mb-3" />,
      title: "3. Stay Motivated",
      desc: "Celebrate streaks and milestones that keep your motivation high and your habits strong.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mx-auto px-6"
      >
        <h2 className="text-4xl font-bold text-indigo-700 mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 mb-12">
          It’s simple — define, track, and grow. Our system helps you make
          improvement a daily routine.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card bg-indigo-50 shadow-md hover:shadow-xl transition-all p-6 rounded-xl"
            >
              <div className="flex flex-col items-center text-center">
                {step.icon}
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
