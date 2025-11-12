import { useParams, useLoaderData, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HabitDetails = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const [habits, setHabits] = useState(data);
  const [habit, setHabit] = useState(null);

  useEffect(() => {
    const found = data.find((h) => h._id === id);
    if (found) setHabit(found);
    else toast.error("Habit not found!");
  }, [id, data]);

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>Habit not found or is private.</p>
        <Link to="/publicHabits" className="btn btn-primary mt-4">
          Go Back
        </Link>
      </div>
    );
  }

  // Calculate streak and progress
  const streak = habit.completionHistory?.length || 0;

  const daysInMonth = 30;
  const progress =
    ((habit.completionHistory?.length || 0) / daysInMonth) * 100;

  const markComplete = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (habit.completionHistory.includes(today)) {
      toast.info("You already marked this habit complete for today!");
      return;
    }

    const updatedHabit = {
      ...habit,
      completionHistory: [...habit.completionHistory, today],
    };

    // update state instantly
    setHabit(updatedHabit);

    // Update DB (optional - assuming you have PATCH endpoint)
    try {
      await fetch(`http://localhost:3050/habits/${habit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completionHistory: updatedHabit.completionHistory }),
      });
      toast.success("Marked complete for today!");
    } catch (error) {
      toast.error("Failed to update on server.");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-base-200 py-10 px-4"
    >
      <div className="max-w-3xl mx-auto bg-base-100 shadow-2xl rounded-2xl overflow-hidden border border-base-300">
        {/* Image */}
        <figure className="h-72 w-full relative">
          <img
            src={
              habit.imageUrl?.trim()
                ? habit.imageUrl
                : "https://i.ibb.co.com/MRkH5Pp/default-habit.jpg"
            }
            alt={habit.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 shadow">
            <FaFire /> {streak}🔥
          </div>
        </figure>

        {/* Details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{habit.title}</h1>
          <p className="text-gray-600 mb-4">{habit.description}</p>

          {/* Meta Info */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="badge badge-outline">{habit.category}</span>
            <div className="flex items-center gap-1">
              <FaClock /> {habit.reminderTime}
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <FaUser /> <span>{habit.creatorName}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">
              Progress (last 30 days)
            </p>
            <progress
              className="progress progress-success w-full"
              value={progress}
              max="100"
            ></progress>
            <p className="text-sm text-gray-500 mt-1">
              {progress.toFixed(0)}% completed
            </p>
          </div>

          {/* Completion History */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">✅ Completion History</h2>
            {habit.completionHistory.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto">
                {habit.completionHistory.map((date, idx) => (
                  <li key={idx}>{new Date(date).toDateString()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No completions yet.</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-between">
            <Link to="/publicHabits" className="btn btn-outline flex items-center gap-2">
              <FaArrowLeft /> Back
            </Link>
            <button onClick={markComplete} className="btn btn-primary">
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitDetails;
