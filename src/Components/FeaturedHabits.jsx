import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import { FaFire, FaUser, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

const FeaturedHabits = () => {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch recent habits
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch("http://localhost:3050/habits");
        const data = await res.json();

        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setHabits(sorted);
      } catch (error) {
        toast.error("Failed to fetch featured habits");
      }
    };

    fetchHabits();
  }, []);

  const handleViewDetails = (id) => {
    if (!user) {
      toast.info("Please login to view full details.");
      navigate("/login");
    } else {
      navigate(`/habit-details/${id}`);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No habits found yet!</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-base-200 to-base-300 relative overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-10 text-primary drop-shadow-sm"
      >
        🔥 Featured Habits
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {habits.map((habit) => (
          <motion.div
            key={habit._id}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              y: -6,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
            }}
            className="bg-base-100 shadow-xl border border-base-300 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <figure className="h-52 w-full overflow-hidden relative">
              <motion.img
                src={
                  habit.imageUrl?.trim()
                    ? habit.imageUrl
                    : "https://i.ibb.co.com/MRkH5Pp/default-habit.jpg"
                }
                alt={habit.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                whileHover={{ scale: 1.1 }}
              />
              <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs shadow-md flex items-center gap-1">
                <FaFire /> {habit.completionHistory?.length || 0} days
              </div>
            </figure>

            <div className="card-body px-5 py-4">
              <h2 className="card-title text-lg font-semibold line-clamp-1">
                {habit.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {habit.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="badge badge-outline">{habit.category}</span>
                <span className="flex items-center gap-1">
                  <FaClock /> {habit.reminderTime}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-gray-500 text-xs">
                <FaUser /> {habit.creatorName || "Anonymous"}
              </div>

              <motion.div
                className="mt-5 flex justify-between items-center"
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleViewDetails(habit._id)}
                  className="btn btn-sm btn-primary w-full"
                >
                  View Details
                </button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative floating shapes (optional aesthetic touch) */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
    </section>
  );
};

export default FeaturedHabits;
