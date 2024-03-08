import { useQuery } from "@tanstack/react-query";
import { getDeviceData } from "../api/marineTelemetry";
import { fetchDatapoints } from "../api/TripDatapoints";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Dashboard = ({ device_id = 1 }) => {
  const [deviceId] = useState(device_id);
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

interface DatapointType {
  lat: number;
  long: number;
}

const Stats = ({ deviceData }: { deviceData: DeviceDataType }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [tripId, setTripId] = useState(null);

  const handleTripSelect = async (tripId: number | null) => {
    setTripId(tripId);
    setShowDropDown((prevState: boolean) => !prevState);
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["dataPoint", tripId],
    queryFn: async () => fetchDatapoints(tripId),
    enabled: tripId !== null,
  });

  if (isError) return <div>There was an error</div>;

  const trackPoints = (dataPoints: DatapointType[]) =>
    dataPoints?.map((dataPoint) => [dataPoint.lat, -dataPoint.long]);

  return (
    <div className="">
      <div className="grid grid-cols-[auto,1550px,auto]">
        <div className="col-start-2 grid grid-cols-2 w-full min-h-32 h-[900px]">
          <div className="flex flex-col items-center text-2xl bg-gray-600 w-full py-8 left-column">
            <div className="flex flex-col justify-center py-10 px-6 bg-gray-400 rounded-xl h-full">
              <h2 className="text-white">User: {deviceData.user_id}</h2>
              <h2 className="text-white">
                Travelled:
                <span className="font-bold">
                  {deviceData.total_distance}
                </span>{" "}
                meters
              </h2>
              <div>Robot serial_number:{deviceData.serial_number} </div>
            </div>
          </div>

          <div className="flex w-full bg-gray-600 py-8 px-6 right-column">
            <div className="flex justify-center bg-gray-400 w-full py-12 px-16 rounded-xl">
              <div className="w-full bg-gray-100 py-6 px-2 list-container">
                {deviceData.trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex justify-center gap-4 bg-slate-300 w-full rounded-2xl"
                    onClick={() => handleTripSelect(trip.id)}
                  >
                    <div className="">trip id {trip.id}</div>
                    <div>distance {trip.distance}</div>
                    <div>duration {trip.duration}</div>
                    {showDropDown && tripId && (
                      <div>
                        {isLoading && <div>Loading data...</div>}
                        {data &&
                          Array.isArray(data) &&
                          data.map((dataPoint) => (
                            <div
                              className="flex"
                              key={dataPoint.id}
                            >
                              <div>lat: {dataPoint.lat}</div>
                              <div>long: {dataPoint.long}</div>
                              <div>depth: {dataPoint.depth}</div>
                              <div>temp: {dataPoint.temp}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
                {showDropDown && tripId && (
                  <MapContainer
                    center={[38.237182, -122.986095]}
                    zoom={30}
                    scrollWheelZoom={true}
                    style={{ height: "420px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {data && data.length >= 2 && (
                      <Polyline positions={trackPoints(data)} />
                    )}
                    <Marker position={[38.237182, -122.986095]}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
