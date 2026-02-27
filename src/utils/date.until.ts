import dayjs from "dayjs";
import ar from "dayjs/locale/ar";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const dateFormat = (
  date: string | Date = new Date(),
  format: string = "DD MMM YYYY",
) => {
  const isValid = dayjs(date).isValid();
  return isValid ? dayjs(date).locale(ar).format(format) : "--";
};

export const convertToTimeStamp = (date: Date) => {
  const dateInUTC = dayjs(date).format("DD MMMM YYYY HH:mm:ss [UTC]");
  return new Date(dateInUTC).getTime();
};
