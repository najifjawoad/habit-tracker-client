import React, { use } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaPlusCircle, FaListAlt, FaGlobe } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logOut } = use(AuthContext);
  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("logged out");
      })
      .catch((error) => {
        console.log(error);
      });
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
      <div className="navbar-end">
        {user ? (
          <button
            onClick={handleLogOut}
            className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium transition hover:bg-indigo-700 shadow-sm"
          >
            Sign Out
          </button>
        ) : (
          <NavLink
            to="/login"
            className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium transition hover:bg-indigo-700 shadow-sm"
          >
            Log in
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
