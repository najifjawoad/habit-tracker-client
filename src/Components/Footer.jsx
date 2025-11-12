import React from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import icon from '../../src/assets/istockphoto-117247268-612x612.jpg'

const Footer = () => {
  const linkStyle =
    "hover:text-indigo-600 transition-colors duration-200";

  return (
    <footer className="bg-white border-t shadow-sm mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand + Description */}
        <div>
          <div className="flex items-center pb-3">
            <h2 className="text-2xl font-bold text-indigo-600 ">Habit Tracker</h2>
          <img className="h-9 w-9" src={icon} alt="" />
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Build better habits, track consistency, and grow every day.
            Stay motivated and improve yourself, one habit at a time.
          </p>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li><NavLink to="/" className={linkStyle}>Home</NavLink></li>
            <li><NavLink to="/addHabits" className={linkStyle}>Add Habit</NavLink></li>
            <li><NavLink to="/myHabits" className={linkStyle}>My Habits</NavLink></li>
            <li><NavLink to="/publicHabits" className={linkStyle}>Browse Public Habits</NavLink></li>
            <li><a href="">Terms And Conditions</a></li>
            <li><a href="">Contact Details</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h3>
          <div className="flex items-center gap-4 text-xl text-gray-500">
            <a href="https://www.facebook.com/" className="hover:text-indigo-600"><FaFacebook /></a>
            <a href="https://x.com/" className="hover:text-indigo-600"><FaTwitter /></a>
            <a href="https://www.linkedin.com/" className="hover:text-indigo-600"><FaLinkedin /></a>
            <a href="https://www.github.com/" className="hover:text-indigo-600"><FaGithub /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-50 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Habit Tracker — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
