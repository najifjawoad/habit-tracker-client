import React from "react";
import NavBar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";

const RootLayout = () => {
  return (
    <div className="w-11/12 mx-auto">
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
