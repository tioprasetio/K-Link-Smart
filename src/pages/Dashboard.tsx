import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <p>Email: {user?.email}</p>
      <p>No HP: {user?.no_hp}</p>
      <p>Alamat: {user?.alamat}</p>
    </div>
  );
};

export default Dashboard;
