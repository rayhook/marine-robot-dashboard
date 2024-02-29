import { useQuery } from "@tanstack/react-query";
import { fetchcomData } from "../api/robotTelemetry";

const Dashboard = () => {
  const deviceId = 1;
  const { isPending, error, data } = useQuery({
    queryKey: ["data", deviceId],
    queryFn: async () => await fetchcomData(deviceId),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occured" + error.message;
  return (
    <div className="min-h-screen">
      <Stats data={data} />
    </div>
  );
};
export default Dashboard;

interface DataType {
  id: number;
  time_since_last_grease: number;
  total_distance: number;
  serial_number: string;
  user_id: number;
}
const Stats = ({ data }: { data: DataType }) => {
  return (
    <div className="container min-h-screen flex justify-between p-3">
      <div className="bg-red-300 flex flex-col w-1/3 text-center">
        <div>User{data.user_id}</div>
        <div>Travelled: {data.total_distance} meters</div>
        <div>Robot serial_number: {data.serial_number}</div>
      </div>
      <div className="bg-orange-300 w-2/3">Charts and map</div>
    </div>
  );
};
