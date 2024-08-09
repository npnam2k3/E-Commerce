import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, Navigation, TopHeader } from "../../components";

const Public = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <TopHeader />
      <Header className="w-full flex justify-center" />

      <Navigation className="w-full flex justify-center" />

      <div className="w-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Public;
