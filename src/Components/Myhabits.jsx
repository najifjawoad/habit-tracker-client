import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const MyHabits = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3050/habits?email=${user.email}`)
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => toast.error("Failed to fetch habits"));
  }, [user]);

const markComplete = (habitId) => {
  const today = new Date().toISOString().split("T")[0];

  // Find the habit we are updating
  const habitToUpdate = habits.find(h => h._id === habitId);
  if (!habitToUpdate) return;

  const isCompleted = habitToUpdate.completionHistory.includes(today);
  const updatedHistory = isCompleted
    ? habitToUpdate.completionHistory.filter(d => d !== today)
    : [...habitToUpdate.completionHistory, today];

  // Update state
  setHabits(prev =>
    prev.map(h => h._id === habitId ? { ...h, completionHistory: updatedHistory } : h)
  );

  // Update DB
  fetch(`http://localhost:3050/habits/${habitId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completionHistory: updatedHistory }),
  }).catch(() => toast.error("Failed to update habit"));

  // Only one toast for the clicked habit
  toast.success(isCompleted ? "Undo successful!" : "Marked complete!");
};


  const deleteHabit = (habitId) => {
    if (!confirm("Are you sure?")) return;
    fetch(`http://localhost:3050/habits/${habitId}`, { method: "DELETE" })
      .then(() => setHabits(prev => prev.filter(h => h._id !== habitId)))
      .then(() => toast.success("Deleted successfully"))
      .catch(() => toast.error("Delete failed"));
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
            {habits.map(habit => {
              const today = new Date().toISOString().split("T")[0];
              const isCompleted = habit.completionHistory.includes(today);
              const streak = habit.completionHistory.length;

              return (
                <tr key={habit._id}>
                  <td>{habit.title}</td>
                  <td>{habit.category}</td>
                  <td>{streak}</td>
                  <td>{new Date(habit.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      className={`btn btn-sm ${isCompleted ? "btn-success" : "btn-primary"}`}
                      onClick={() => markComplete(habit._id)}
                    >
                      {isCompleted ? "Undo" : "Mark Complete"}
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => toast.info("Update coming soon")}>
                      Update
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteHabit(habit._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHabits;
