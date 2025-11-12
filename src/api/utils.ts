const pad = (num: number): string => num.toString().padStart(2, "0");

export const formatDateTime = (isoString: string): string => {
  if (!isoString) {
    return "";
  }

  try {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error(`Invalid date string to format: ${isoString}`, error);
    return "날짜 오류";
  }
};
