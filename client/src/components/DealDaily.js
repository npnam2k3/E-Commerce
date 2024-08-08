import React, { memo, useEffect, useState } from "react";
import icons from "../utils/icons";
import {
  generateStarFromNumber,
  formatMoney,
  secondsToHms,
} from "../utils/helper";
import { apiGetProducts } from "../apis/product";
import { CountDown } from "../components";
import moment from "moment";

const { AiFillStar, IoMenu } = icons;

let idInterval;
const DealDaily = () => {
  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [expire, setExpire] = useState(false);
  const [dealDaily, setDealDaily] = useState(null);

  const fetchDealDaily = async () => {
    const response = await apiGetProducts({
      page: Math.round(Math.random() * 5),
      limit: 1,
      totalRatings: 5,
    });
    if (response.data.success) {
      setDealDaily(response?.data.data[0]);

      const today = `${moment().format("MM/DD/YYYY")} 7:00:00`;
      const second =
        new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
      const number = secondsToHms(second);
      setHour(number.h);
      setMinutes(number.m);
      setSeconds(number.s);
    } else {
      setHour(0);
      setMinutes(59);
      setSeconds(59);
    }
  };
  // useEffect(() => {
  //   fetchDealDaily();
  // }, []);

  useEffect(() => {
    idInterval && clearInterval(idInterval);
    fetchDealDaily();
  }, [expire]);

  useEffect(() => {
    idInterval = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev - 1);
      else {
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          if (hour > 0) {
            setHour((prev) => prev - 1);
            setMinutes(59);
            setSeconds(59);
          } else {
            setExpire(!expire);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [seconds, minutes, hour, expire]);
  // console.log(dealDaily);
  return (
    <div className="border w-full flex-auto">
      <div className="flex items-center justify-between p-4 w-full">
        <span className="flex-1 flex justify-center">
          <AiFillStar size={20} color="#DD1111" />
        </span>
        <span className="flex-8 font-semibold text-[20px] text-gray-700 flex justify-center">
          DEAL DAILY
        </span>
        <span className="flex-1"></span>
      </div>
      <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
        <img
          alt=""
          src={
            dealDaily?.thumb ||
            "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
          }
          className="w-full object-contain"
        />
        <span className="line-clamp-1 text-center">{dealDaily?.title}</span>
        <span className="flex h-4">
          {generateStarFromNumber(dealDaily?.totalRatings, 20)}
        </span>
        <span>{`${formatMoney(dealDaily?.price)} VND`}</span>
      </div>
      <div className="p-4 mt-8">
        <div className="flex justify-center gap-2 items-center mb-4">
          <CountDown unit={"Hour"} number={hour} />
          <CountDown unit={"Minutes"} number={minutes} />
          <CountDown unit={"Seconds"} number={seconds} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
        >
          <IoMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default memo(DealDaily);
