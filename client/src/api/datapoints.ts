import axios from "axios";

export const fetchDatapoints = async (trip_id: number) => {
  const response = await axios({
    method: "get",
    url: `http://localhost:8000/api/datapoint/${trip_id}`,
  });
  return response.data;
};
