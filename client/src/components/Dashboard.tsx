import { useQuery } from "@tanstack/react-query";
import { getDeviceData } from "../api/marineTelemetry";
import { fetchDatapoints } from "../api/TripDatapoints";
import { useState } from "react";

const Dashboard = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["data", deviceId],
    queryFn: async () => await getDeviceData(deviceId),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occured" + error.message;
  return <Stats deviceData={data} />;
};
export default Dashboard;

interface TripType {
  id: number;
  device_id: number;
  distance: number;
  duration: number;
}

interface DeviceDataType {
  id: number;
  time_since_last_grease: number;
  total_distance: number;
  serial_number: string;
  user_id: number;
  trips: TripType[];
}

const Stats = ({ deviceData }: { deviceData: DeviceDataType }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [tripId, setTripId] = useState(null);

  const handleTripSelect = async (tripId: number) => {
    setShowDropDown((prevState: boolean) => !prevState);
  };

  const { isPending, error, dataPoints } = useQuery({
    queryKey: ["dataPoint", tripId],
    queryFn: async () => fetchDatapoints(tripId),
  });

  return (
    <div className="container min-h-screen flex justify-between">
      <div className="bg-red-300 flex flex-col w-1/3 text-center">
        <div>User{deviceData.user_id}</div>
        <div>Travelled: {deviceData.total_distance} meters</div>
        <div>Robot serial_number: {deviceData.serial_number}</div>
      </div>
      <div className="bg-orange-300 w-2/3 flex">
        <div>
          {deviceData.trips.map((trip) => (
            <div
              className="flex gap-2 bg-slate-300 py-4"
              onClick={() => handleTripSelect(trip.id)}
            >
              <div>trip id {trip.id}</div>
              <div>trip distance {trip.distance}</div>
              <div>trip duration {trip.duration}</div>
              {showDropDown && (
                <div className="">{isPending && <>isLoading...</>}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
