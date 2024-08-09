import React, { memo } from "react";
import Slider from "react-slick";
import Product from "./Product";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const CustomSlider = ({ products, activedTab }) => {
  return (
    <>
      {products && (
        <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el._id}
              prodData={el}
              isNew={activedTab === 1 ? false : true}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(CustomSlider);
