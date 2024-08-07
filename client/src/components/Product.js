import React from "react";
import { formatMoney } from "../utils/helper";
import label from "../assets/label.png";
import labelBlue from "../assets/label-blue.png";

const Product = ({ prodData, isNew }) => {
  console.log(prodData);
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div className="w-full relative">
          <img
            alt=""
            src={
              prodData?.thumb ||
              "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            }
            className="w-[243px] h-[243px] object-cover"
          />
          <img
            src={isNew ? label : labelBlue}
            alt=""
            className={`absolute top-[-25px] left-[-30px] ${
              isNew ? "w-[100px] h-[45px]" : "w-[130px] h-[50px]"
            }`}
          />
          {isNew ? (
            <span className="font-bold absolute text-white top-[-16px] left-[-12px]">
              New
            </span>
          ) : (
            <span className="font-bold absolute text-white top-[-14px] left-[-8px]">
              Trending
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="line-clamp-1">{prodData?.title}</span>
          <span>{`${formatMoney(prodData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
