import { useParams, useLoaderData, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* same helpers as in MyHabits (kept local here) */
const parseDateUTC = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

const calculateStreak = (completionHistory = []) => {
  if (!Array.isArray(completionHistory) || completionHistory.length === 0)
    return { streak: 0, endsToday: false };

  const uniq = Array.from(new Set(completionHistory));
  const sortedDesc = uniq
    .map((s) => s.trim())
    .filter(Boolean)
    .sort((a, b) => parseDateUTC(b) - parseDateUTC(a));

  const todayStr = new Date().toISOString().split("T")[0];
  const mostRecent = sortedDesc[0];
  let streak = 1;
  let prevTs = parseDateUTC(mostRecent);

  for (let i = 1; i < sortedDesc.length; i++) {
    const ts = parseDateUTC(sortedDesc[i]);
    const diffDays = Math.round((prevTs - ts) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      prevTs = ts;
    } else break;
  }

  const endsToday = mostRecent === todayStr;
  return { streak, endsToday };
};

const countLastNDays = (completionHistory = [], days = 30) => {
  if (!Array.isArray(completionHistory) || completionHistory.length === 0)
    return 0;
  const uniq = Array.from(new Set(completionHistory));
  const today = new Date();
  const cutoffTs =
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) -
    (days - 1) * 24 * 60 * 60 * 1000;

  return uniq.filter((d) => parseDateUTC(d) >= cutoffTs).length;
};

const HabitDetails = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const [habit, setHabit] = useState(null);

  useEffect(() => {
    const found = (data || []).find((h) => h._id === id);
    if (found) setHabit({ ...found, completionHistory: found.completionHistory || [] });
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

  const todayStr = new Date().toISOString().split("T")[0];
  const uniqueHistory = Array.from(new Set(habit.completionHistory || []));
  const { streak, endsToday } = calculateStreak(uniqueHistory);
  const isCompletedToday = uniqueHistory.includes(todayStr);
  const last30Count = countLastNDays(uniqueHistory, 30);
  const progress = Math.round((last30Count / 30) * 100);

  // Mark Complete (one-time)
  const markComplete = async () => {
    if (isCompletedToday) {
      toast.info("You've already marked this habit complete today!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3050/habits/${habit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", date: todayStr }),
      });

      if (!res.ok) throw new Error("Server failed to add completion");

      // update UI
      setHabit((prev) => ({
        ...prev,
        completionHistory: Array.from(new Set([...(prev.completionHistory || []), todayStr])),
      }));

      toast.success("Habit marked complete for today!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update habit on server.");
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
            {!endsToday && streak > 0 ? <span className="ml-2 text-xs opacity-80">last active</span> : null}
          </div>
        </figure>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{habit.title}</h1>
          <p className="text-gray-600 mb-4">{habit.description}</p>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="badge badge-outline">{habit.category}</span>
            <div className="flex items-center gap-1">
              <FaClock /> {habit.reminderTime}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <FaUser /> <span>{habit.creatorName}</span>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Progress (last 30 days)</p>
            <progress className="progress progress-success w-full" value={progress} max="100"></progress>
            <p className="text-sm text-gray-500 mt-1">{progress}% completed (last 30 days)</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">✅ Completion History</h2>
            {uniqueHistory.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto">
                {uniqueHistory
                  .map((d) => d.trim())
                  .sort((a, b) => parseDateUTC(b) - parseDateUTC(a))
                  .map((date, idx) => (
                    <li key={idx}>{new Date(date + "T00:00:00Z").toDateString()}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No completions yet.</p>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <Link to="/publicHabits" className="btn btn-outline flex items-center gap-2">
              <FaArrowLeft /> Back
            </Link>
            <button
              onClick={markComplete}
              disabled={isCompletedToday}
              className={`btn ${isCompletedToday ? "btn-success cursor-not-allowed opacity-70" : "btn-primary"}`}
            >
              {isCompletedToday ? "Completed ✅" : "Mark Complete"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitDetails;
