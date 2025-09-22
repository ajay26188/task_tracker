import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const {user} = useAuth();
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Welcome {user?.name}!</h2>
        <p>This is your dashboard main content area.</p>
      </div>
    </DashboardLayout>
  );
};

export default Home;
