import React from "react";
import { useParams } from "react-router-dom";

const Product = () => {
  const { pid, title } = useParams();
  return <div>Product</div>;
};

export default Product;
