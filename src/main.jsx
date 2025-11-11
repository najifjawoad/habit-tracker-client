import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./Layouts/RootLayout.jsx";
import PublicHabits from "./Components/PublicHabits.jsx";
import Home from "./Pages/Home.jsx";
import AddHabit from "./Pages/AddHabit.jsx";
import Myhabits from "./Components/Myhabits.jsx";
import Register from "./Pages/Register.jsx";
import AuthProvider from "./Context/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import LogIn from "./Components/LogIn.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children : [
      {
        index:true ,
        Component: Home,
      },
      {
        path : '/publicHabits',
        Component : PublicHabits,
      },
      {
        path : '/addHabits',
        Component : AddHabit,
      },
      {
        path : '/myHabits',
        Component : Myhabits,
      },
      {
          path : 'login',
          Component : LogIn,
      },
      {
        path : '/register',
        Component : Register,
        
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvider>
     <RouterProvider router={router} />,
     <ToastContainer></ToastContainer>
   </AuthProvider>
  </StrictMode>
);
