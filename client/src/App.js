import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  FAQs,
  Service,
  Blogs,
  DetailProduct,
  Product,
} from "./pages/public";
import path from "./utils/path";
import { useDispatch } from "react-redux";
import { getCategories } from "./store/app/asyncActions";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>

          <Route path={path.BLOGS} element={<Blogs />}></Route>
          <Route path={path.PRODUCTS} element={<Product />}></Route>
          <Route
            path={path.DETAIL_PRODUCT__PID__TITLE}
            element={<DetailProduct />}
          ></Route>
          <Route path={path.FAQ} element={<FAQs />}></Route>
          <Route path={path.OUR_SERVICES} element={<Service />}></Route>
        </Route>
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
