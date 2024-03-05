import axios from "axios";

export const fetchDatapoints = async (trip_id: number) => {
  if (!trip_id) return;
  const response = await axios({
    method: "get",
    url: `http://localhost:8000/api/datapoints/${trip_id}`,
  });
  return response.data;
};
