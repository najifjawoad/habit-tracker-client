import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../Context/AuthContext";

const AddHabit = () => {
  const auth = getAuth();
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    reminderTime: "",
    privacy: "Private",
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Get Firebase logged-in user
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "Anonymous",
        email: currentUser.email,
      });
    }
  }, [auth]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.reminderTime) {
      toast.error("Please fill out all required fields!");
      return;
    }

    try {
      setIsLoading(true);

      const newHabit = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reminderTime: formData.reminderTime,
        imageUrl: formData.imageUrl || "",
        creatorEmail: user?.email || "unknown@example.com",
        creatorName: user?.name || "Anonymous",
        isPublic: formData.privacy === "Public",
        createdAt: new Date().toISOString(),
        completionHistory: [],
      };

      const res = await fetch("http://localhost:3050/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit),
      });

      if (!res.ok) throw new Error("Failed to add habit!");

      toast.success("🎉 Habit added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        reminderTime: "",
        privacy: "Private",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding the habit!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto p-8 mt-10 bg-base-100 shadow-xl rounded-2xl border border-base-300"
    >
      <h2 className="text-3xl font-bold text-center mb-6">🪴 Add a New Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="label font-semibold">Habit Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="e.g. Morning Yoga Session"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Briefly describe your habit goal"
            rows="3"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="label font-semibold">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Category</option>
            <option value="Morning">Morning</option>
            <option value="Work">Work</option>
            <option value="Fitness">Fitness</option>
            <option value="Evening">Evening</option>
            <option value="Study">Study</option>
          </select>
        </div>

        {/* Reminder Time */}
        <div>
          <label className="label font-semibold">Reminder Time *</label>
          <input
            type="time"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Privacy */}
        <div>
          <label className="label font-semibold">Privacy *</label>
          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
        </div>

        {/* Image URL */}
        <div>
          <label className="label font-semibold">Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="input input-bordered w-full"
          />
        </div>

        {/* Read-only Firebase User Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label font-semibold">User Name</label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </div>

          <div>
            <label className="label font-semibold">User Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Submitting...
              </>
            ) : (
              "Add Habit"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddHabit;
