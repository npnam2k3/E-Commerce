import React from "react";
import { generateStarFromNumber, formatMoney } from "../utils/helper";

const ProductCard = ({ price, totalRatings, image, title }) => {
  return (
    <div className="w-1/3 flex-auto px-[10px] mb-[20px]">
      <div className="flex w-full border">
        <img alt="" src={image} className="w-[120px] object-contain p-4" />
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-xs">
          <span className="flex h-4">
            {generateStarFromNumber(totalRatings, 14)}
          </span>
          <span className="line-clamp-1 capitalize text-sm">
            {title?.toLowerCase()}
          </span>
          <span>{`${formatMoney(price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
