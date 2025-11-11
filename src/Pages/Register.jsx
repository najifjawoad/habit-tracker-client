import React, { useState, use } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

import { AuthContext } from "../Context/AuthContext";

const Register = () => {
  const { createUser, setUser,upadteTheUser ,signInWithGoogle} = use(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword ] = useState(false); 

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
  

  const handleRegister = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const pass = event.target.password.value;
    const name = event.target.name.value;
    const photoURLL = event.target.photoURL.value;

    const errors = [];

    if (pass.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if (!/[A-Z]/.test(pass)) {
      errors.push("Password must include at least one uppercase letter.");
    }

    if (!/[a-z]/.test(pass)) {
      errors.push("Password must include at least one lowercase letter.");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    createUser(email, pass)
      .then((res) => {
        const user = res.user;
        toast.success("Registration Done");

        upadteTheUser({ displayName: name, photoURL: photoURLL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: photoURLL });
          })
          .catch((error) => {
            toast.error(error.message);
            setUser(user);
          });

        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex items-center min-h-screen mt-5">
           
      <div className="card  w-full mx-auto max-w-sm shrink-0 shadow-2xl py-5">
        <h2 className="font-bold text-2xl text-center">Register Your Account</h2>
        <form onSubmit={handleRegister} className="card-body">
          <fieldset className="fieldset">
            {/* name */}
            <label className="label font-bold text-black my-3">Name</label>
            <input
              name="name"
              type="text"
              className="input"
              placeholder="Name"
              required
            />

            {/* photoURL */}
            <label className="label font-bold text-black my-3">Photo URL</label>
            <input
              name="photoURL"
              type="text"
              className="input"
              placeholder="Photo URL"
              required
            />

            {/* email */}
            <label className="label font-bold text-black my-3">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              placeholder="Email"
              required
            />

            {/* password */}
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label className="label mt-4">
              <input
                name="checkbox"
                type="checkbox"
                className="checkbox"
                required
              />
              Accept Terms & Conditions
            </label>

            <button className="btn btn-neutral mt-4">Register</button>

            <p className="mt-5 text-center font-semibold">
              Already Have An Account?{" "}
              <Link to="/login" className="text-red-500 hover:text-red-800">
                Log In
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

export default Register;
