import React from "react";

const Product = ({ prodData }) => {
  console.log(prodData);
  return (
    <div className="w-1/3">
      <img
        alt=""
        src={prodData?.images[0] || ""}
        className="w-full h-[243px] object-cover"
      />
    </div>
  );
};

export default Product;
