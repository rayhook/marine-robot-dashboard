import axios from "axios";
export const getDeviceData = async (deviceId: number) => {
  const response = await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/comdata/${deviceId}`,
  });
  return response.data;
};
