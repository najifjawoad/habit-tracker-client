import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const MyHabits = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null); // habit to edit
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch user's habits
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3050/habits?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch(() => toast.error("Failed to fetch habits"));
  }, [user]);

  // Mark complete / undo
  const markComplete = (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    const habitToUpdate = habits.find((h) => h._id === habitId);
    if (!habitToUpdate) return;

    const isCompleted = habitToUpdate.completionHistory.includes(today);
    const updatedHistory = isCompleted
      ? habitToUpdate.completionHistory.filter((d) => d !== today)
      : [...habitToUpdate.completionHistory, today];

    setHabits((prev) =>
      prev.map((h) =>
        h._id === habitId ? { ...h, completionHistory: updatedHistory } : h
      )
    );

    fetch(`http://localhost:3050/habits/${habitId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completionHistory: updatedHistory }),
    }).catch(() => toast.error("Failed to update habit"));

    toast.success(isCompleted ? "Undo successful!" : "Marked complete!");
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    if (!confirm("Are you sure?")) return;
    fetch(`http://localhost:3050/habits/${habitId}`, { method: "DELETE" })
      .then(() => setHabits((prev) => prev.filter((h) => h._id !== habitId)))
      .then(() => toast.success("Deleted successfully"))
      .catch(() => toast.error("Delete failed"));
  };

  // Open modal with habit data
  const openUpdateModal = (habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  // Handle form submission
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
      await fetch(`http://localhost:3050/habits/${editingHabit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHabit),
      });

      setHabits((prev) =>
        prev.map((h) =>
          h._id === editingHabit._id ? { ...h, ...updatedHabit } : h
        )
      );

      toast.success("Habit updated successfully!");
      setModalOpen(false);
      setEditingHabit(null);
    } catch {
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
                      className={`btn btn-sm ${
                        isCompleted ? "btn-success" : "btn-primary"
                      }`}
                      onClick={() => markComplete(habit._id)}
                    >
                      {isCompleted ? "Undo" : "Mark Complete"}
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
                placeholder="Reminder Time"
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
