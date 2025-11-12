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
import HabitDetails from "./Components/HabitDetails.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/publicHabits",
        Component: PublicHabits,
        loader: () => fetch("http://localhost:3050/habits"),
      },
      {
        path: "/habit-details/:id",
        element: <PrivateRoute>
          <HabitDetails></HabitDetails>
        </PrivateRoute>,
        loader: () => fetch("http://localhost:3050/habits"),
      },
      {
        path: "/addHabits",
        element: <PrivateRoute>
          <AddHabit></AddHabit>
        </PrivateRoute>,
      },
      {
        path: "/myHabits",
        element:<PrivateRoute>
          <Myhabits></Myhabits>
        </PrivateRoute>,
      },
      {
        path: "login",
        Component: LogIn,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />,<ToastContainer></ToastContainer>
    </AuthProvider>
  </StrictMode>
);
