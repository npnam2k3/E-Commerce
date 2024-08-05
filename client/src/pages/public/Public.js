import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation } from "../../components";

const Public = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Header className="w-full flex justify-center" />

      <Navigation className="w-full flex justify-center" />

      <div className="w-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Public;
