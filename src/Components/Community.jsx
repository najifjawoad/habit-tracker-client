import React from "react";
import { motion } from "framer-motion";

const CommunitySection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center px-6"
      >
        <h2 className="text-4xl font-bold text-indigo-700 mb-4">
          Join a Growing Community
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          You’re not alone in your growth journey. Connect, share, and inspire
          others who are building habits just like you.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">
              Inspire Others
            </h3>
            <p className="text-gray-600 text-sm">
              Share your achievements to encourage other habit builders.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">
              Learn from the Best
            </h3>
            <p className="text-gray-600 text-sm">
              Explore habits of successful people and adopt what works for you.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">
              Stay Accountable
            </h3>
            <p className="text-gray-600 text-sm">
              Engage in challenges and push yourself further with others.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CommunitySection;
