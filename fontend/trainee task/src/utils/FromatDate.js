import { format } from "date-fns";

export const FormatTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd HH:mm a");
};
export const FormatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};
