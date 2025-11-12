





import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4">
           
      <div className="text-center max-w-md space-y-6">
        <div className="text-7xl animate-bounce">🚀</div>

        <h1 className="text-6xl font-extrabold text-red-500 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link to="/" className="btn btn-primary gap-2 text-white shadow-lg hover:scale-105 transition-transform duration-300">
          <FaArrowLeft />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
