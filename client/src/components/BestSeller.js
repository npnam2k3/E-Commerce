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
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0]?.data.success) {
      setBestSellers(response[0].data.data);
      setProducts(response[0].data.data);
    }
    if (response[1]?.data.success) setNewProducts(response[1].data.data);
    setProducts(response[0].data.data);
  };
  useEffect(() => {
    fetchProducts();
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
            className={`font-semibold px-8 capitalize border-r cursor-pointer text-gray-400 ${
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
        <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el.id}
              prodData={el}
              isNew={activedTab === 1 ? false : true}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
