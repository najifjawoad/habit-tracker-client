import React, { useState, use } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "../Context/AuthContext";

const LogIn = () => {
  const { signInUser, signInWithGoogle } = use(AuthContext)
  const [email, setEmail] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogInGoogle = () => {
    signInWithGoogle()
      .then(() => {
        toast("Google Log In Successful");
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleLogIn = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const pass = event.target.password.value;

    signInUser(email, pass)
      .then(() => {
        
        toast.success(`Logged In Successfully`);
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = "An unknown error occurred.";

        if (errorCode === "auth/user-not-found") {
          errorMessage = "No user found with this email.";
        } else if (errorCode === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (errorCode === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address.";
        } else if (errorCode === "auth/user-disabled") {
          errorMessage = "This user account has been disabled.";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage =
            "Too many failed login attempts. Please wait and try again later.";
        } else if (errorCode === "auth/invalid-credential") {
          errorMessage =
            "Invalid credentials. Please check your email and password.";
        } else {
          errorMessage = error.message; 
        }

        toast.error(errorMessage);
      });
  };

  return (
    <div className="flex items-center min-h-screen">
     
      <div className="card  w-full mx-auto max-w-sm shrink-0 shadow-2xl py-5">
        <h2 className="font-bold text-2xl text-center">Log In Your Account</h2>
        <form onSubmit={handleLogIn} className="card-body">
          <fieldset className="fieldset">
            <label className="label font-bold text-black my-3">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />

            <label className="label font-bold text-black my-3">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"} 
                className="input w-full pr-10"
                placeholder="Password"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="font-semibold mt-2">
              <Link
                to="/auth/forgot-password"
                state={{ email }}
                className="link link-hover"
              >
                Forgot password?
              </Link>
            </div>

            <button className="btn btn-neutral mt-4">Login</button>

            <p className="mt-5 text-center font-semiboldhe">
              Don't Have An Account?{" "}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-800"
              >
                Register
              </Link>
            </p>
          </fieldset>

          <button
            onClick={handleLogInGoogle}
            type="button"
            className="btn bg-white text-black border-[#e5e5e5]"
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="mr-2"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
