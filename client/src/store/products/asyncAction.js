import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getNewProducts = createAsyncThunk(
  "product/categories",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetProducts({ sort: "-createdAt" });
    // console.log(response);

    if (!response.data.success) return rejectWithValue(response);
    return response.data.data;
  }
);
