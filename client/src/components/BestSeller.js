import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import Product from "./Product";
import Slider from "react-slick";

const tabs = [
  {
    id: 1,
    name: "best seller",
  },
  {
    id: 2,
    name: "new arrivals",
  },
  {
    id: 3,
    name: "tablet",
  },
];
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activedTab, setActivedTab] = useState(1);

  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0]?.data.success) setBestSellers(response[0].data.data);
    if (response[1]?.data.success) setNewProducts(response[1].data.data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
        {tabs.map((el) => (
          <span
            className={`font-semibold capitalize border-r cursor-pointer text-gray-400 ${
              activedTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActivedTab(el.id)}
            key={el.id}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="pt-4">
        <Slider {...settings}>
          {bestSellers?.map((el) => (
            <Product key={el.id} prodData={el} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
