import axios from "../axios";

export const apiGetCategories = () => {
  return axios({
    url: "/category-product/",
    method: "get",
  });
};
