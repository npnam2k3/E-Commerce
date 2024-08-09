import React, { useState } from "react";
import { formatMoney } from "../utils/helper";
import newLable from "../assets/new.png";
import trending from "../assets/trending.png";
import { generateStarFromNumber } from "../utils/helper";
import SelectOption from "./SelectOption";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";

const { AiFillEye, BsFillSuitHeartFill, IoMenu } = icons;

const Product = ({ prodData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  // console.log(prodData);
  return (
    <div className="w-full text-base px-[10px]">
      <Link
        className="w-full border p-[15px] flex flex-col items-center"
        to={`/${path.DETAIL_PRODUCT}/${prodData?._id}/${prodData?.title}`}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon=<AiFillEye /> />
              <SelectOption icon=<IoMenu /> />
              <SelectOption icon=<BsFillSuitHeartFill /> />
            </div>
          )}
          <img
            alt=""
            src={
              prodData?.thumb ||
              "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            }
            className="w-[274px] h-[274px] object-cover"
          />
          <img
            src={isNew ? newLable : trending}
            alt=""
            className={`absolute w-[100px] h-[35px] top-[0] right-[0] object-cover`}
          />
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {generateStarFromNumber(prodData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{prodData?.title}</span>
          <span>{`${formatMoney(prodData?.price)} VND`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
