import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaPlusCircle, FaListAlt, FaGlobe } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logOut()
      .then(() => console.log("Logged out"))
      .catch((error) => console.error(error));
  };

  const baseLink =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50";

  const links = (
    <>
      <li>
        <NavLink to="/" className={baseLink}>
          <FaHome /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/publicHabits" className={baseLink}>
          <FaGlobe /> Public Habits
        </NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/myHabits" className={baseLink}>
              <FaListAlt /> My Habits
            </NavLink>
          </li>
          <li>
            <NavLink to="/addHabits" className={baseLink}>
              <FaPlusCircle /> Add Habit
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white shadow-lg rounded-xl mt-3 w-56 p-3 border"
          >
            {links}
          </ul>
        </div>

        <NavLink
          to="/"
          className="text-2xl font-semibold tracking-wide text-indigo-600 hover:text-indigo-800 transition"
        >
          Habit Tracker
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">{links}</ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end relative">
        {!user ? (
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium transition hover:bg-indigo-700 shadow-sm"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/register"
              className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 font-medium transition hover:bg-indigo-50 shadow-sm"
            >
              Sign Up
            </NavLink>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer"
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-3 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold text-gray-800">
                    {user.displayName || "Anonymous User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email || "No email available"}
                  </p>
                </div>

                <button
                  onClick={handleLogOut}
                  className="w-full mt-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
