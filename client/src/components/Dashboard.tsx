import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["data"],
    queryFn: () =>
      fetch("http://127.0.0.1:8000/api/comdata/1").then((response) =>
        response.json()
      ),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occured" + error.message;
  return <div> total distance: {data.total_distance}</div>;
};
export default Dashboard;
