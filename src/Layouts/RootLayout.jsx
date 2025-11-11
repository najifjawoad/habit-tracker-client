import React from "react";
import NavBar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";

const RootLayout = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
