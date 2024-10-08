import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import { CustomSlider } from "./";
import { useDispatch, useSelector } from "react-redux";
import { getNewProducts } from "../store/products/asyncAction";

const tabs = [
  {
    id: 1,
    name: "best seller",
  },
  {
    id: 2,
    name: "new arrivals",
  },
];
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);

  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: "-sold" });
    if (response?.data.success) {
      setBestSellers(response.data.data);
      setProducts(response.data.data);
    }
  };
  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);
  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);

  return (
    <div>
      <div className="flex text-[20px] gap-8  ml-[-32px]">
        {tabs.map((el) => (
          <span
            className={`font-semibold px-8 uppercase border-r cursor-pointer text-gray-400 ${
              activedTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActivedTab(el.id)}
            key={el.id}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 mx-[-10px] border-t-2 border-main">
        <CustomSlider products={products} activedTab={activedTab} />
      </div>
      <div className="w-full flex gap-4 mt-4">
        <img
          alt=""
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          className="flex-1 object-contain"
        />
        <img
          alt=""
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          className="flex-1 object-contain"
        />
      </div>
    </div>
  );
};

export default BestSeller;
