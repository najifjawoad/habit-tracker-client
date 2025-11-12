import { useLoaderData, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaClock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const PublicHabits = () => {
  const data = useLoaderData(); // ✅ fetched from router loader
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Public Habits Loaded Successfully!");
    }
  }, [data]);

  // Handle loading or missing data
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <span className="loading loading-spinner loading-lg mb-3"></span>
        <p>Loading public habits...</p>
      </div>
    );
  }

  const publicHabits = data.filter((habit) => habit.isPublic);

  if (publicHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>No public habits available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-center mb-10"
        >
          🌿 Public Habit Tracker
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publicHabits.map((habit) => {
            const streak = habit.completionHistory?.length || 0;

            return (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className="card bg-base-100 shadow-xl relative overflow-hidden border border-base-300 hover:shadow-2xl transition-all duration-200"
              >
                {/* 🔥 Streak Badge */}
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <FaFire /> {streak}🔥
                </div>

                {/* 🖼️ Image */}
                <figure className="h-44 w-full">
                  <img
                    src={
                      habit.imageUrl?.trim()
                        ? habit.imageUrl
                        : "https://i.ibb.co.com/MRkH5Pp/default-habit.jpg"
                    }
                    alt={habit.title}
                    className="w-full h-full object-cover"
                  />
                </figure>

                {/* 💬 Content */}
                <div className="card-body">
                  <h2 className="card-title text-lg font-semibold line-clamp-1">
                    {habit.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {habit.description}
                  </p>

                  {/* 🕒 Category + Time */}
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="badge badge-outline">{habit.category}</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaClock /> {habit.reminderTime}
                    </div>
                  </div>

                  {/* 👤 Creator Info */}
                  <div className="flex items-center gap-2 mt-3 text-gray-500 text-xs">
                    <FaUser /> {habit.creatorName}
                  </div>

                  {/* 🔘 Button */}
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => navigate(`/habit-details/${habit._id}`)}
                      className="btn btn-sm btn-primary hover:scale-105 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicHabits;
