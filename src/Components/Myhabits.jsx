import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

/**
 * Helper: parse YYYY-MM-DD -> UTC midnight timestamp
 */
const parseDateUTC = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

/**
 * Calculate consecutive-day streak ending at the most recent completion.
 * Returns { streak, endsToday (bool) }
 */
const calculateStreak = (completionHistory = []) => {
  if (!Array.isArray(completionHistory) || completionHistory.length === 0)
    return { streak: 0, endsToday: false };

  // Unique + sort descending by date
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
    // difference in days
    const diffDays = Math.round((prevTs - ts) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      prevTs = ts;
    } else break;
  }

  const endsToday = mostRecent === todayStr;
  return { streak, endsToday };
};

/**
 * Count unique completion days within the last `days` days (including today)
 */
const countLastNDays = (completionHistory = [], days = 30) => {
  if (!Array.isArray(completionHistory) || completionHistory.length === 0)
    return 0;
  const uniq = Array.from(new Set(completionHistory));
  const today = new Date();
  const cutoffTs = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ) - (days - 1) * 24 * 60 * 60 * 1000; // earliest included day

  return uniq.filter((d) => parseDateUTC(d) >= cutoffTs).length;
};

const MyHabits = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3050/habits?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        // ensure completionHistory exists and is array of YYYY-MM-DD strings
        const normalized = (data || []).map((h) => ({
          ...h,
          completionHistory: Array.isArray(h.completionHistory)
            ? Array.from(new Set(h.completionHistory.map((d) => String(d))))
            : [],
        }));
        setHabits(normalized);
      })
      .catch(() => toast.error("Failed to fetch habits"));
  }, [user]);

  // Mark Complete (one-time per day) — uses server PATCH with { action: 'complete', date }
  const markComplete = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    const habitToUpdate = habits.find((h) => h._id === habitId);
    if (!habitToUpdate) return;

    // Prevent duplicate same-day entry client-side
    if (habitToUpdate.completionHistory.includes(today)) {
      toast.info("You've already marked this habit complete today!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3050/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", date: today }),
      });

      if (!res.ok) throw new Error("Server failed to add completion");

      // optimistic + canonical update: add today if not present
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId
            ? {
                ...h,
                completionHistory: Array.from(
                  new Set([...(h.completionHistory || []), today])
                ),
              }
            : h
        )
      );

      toast.success("Habit marked complete for today!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update habit status");
    }
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    if (!confirm("Are you sure?")) return;
    fetch(`http://localhost:3050/habits/${habitId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("delete failed");
        setHabits((prev) => prev.filter((h) => h._id !== habitId));
      })
      .then(() => toast.success("Deleted successfully"))
      .catch(() => toast.error("Delete failed"));
  };

  const openUpdateModal = (habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedHabit = {
      title: form.title.value,
      category: form.category.value,
      description: form.description.value,
      reminderTime: form.reminderTime.value,
      imageUrl: form.imageUrl.value || editingHabit.imageUrl,
    };

    try {
      const res = await fetch(
        `http://localhost:3050/habits/${editingHabit._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedHabit),
        }
      );
      if (!res.ok) throw new Error("update failed");

      setHabits((prev) =>
        prev.map((h) =>
          h._id === editingHabit._id ? { ...h, ...updatedHabit } : h
        )
      );
      toast.success("Habit updated successfully!");
      setModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update habit");
    }
  };

  if (!user) return <p className="p-4">Please login to view your habits.</p>;
  if (!habits.length) return <p className="p-4">No habits found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Habits</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Current Streak</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const uniqueHistory = Array.from(new Set(habit.completionHistory || []));
              const { streak, endsToday } = calculateStreak(uniqueHistory);
              const isCompleted = uniqueHistory.includes(today);
              const last30Count = countLastNDays(uniqueHistory, 30);

              return (
                <tr key={habit._id}>
                  <td>{habit.title}</td>
                  <td>{habit.category}</td>
                  <td>
                    {streak}
                    {endsToday ? " (active today)" : ""}
                  </td>
                  <td>{new Date(habit.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      className={`btn btn-sm ${
                        isCompleted
                          ? "btn-success cursor-not-allowed opacity-70"
                          : "btn-primary"
                      }`}
                      disabled={isCompleted}
                      onClick={() => markComplete(habit._id)}
                    >
                      {isCompleted ? "Completed ✅" : "Mark Complete"}
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => openUpdateModal(habit)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => deleteHabit(habit._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {modalOpen && editingHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Update Habit</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                defaultValue={editingHabit.title}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                defaultValue={editingHabit.category}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={editingHabit.description}
                className="input input-bordered w-full"
                required
              />
              <input
                type="time"
                name="reminderTime"
                defaultValue={editingHabit.reminderTime}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL (optional)"
                defaultValue={editingHabit.imageUrl}
                className="input input-bordered w-full"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHabits;
