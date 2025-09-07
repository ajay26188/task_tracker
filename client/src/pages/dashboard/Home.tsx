import DashboardLayout from "../../components/layouts/DashboardLayout";

const Home = () => {
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Welcome Ajay!</h2>
        <p>This is your dashboard main content area.</p>
      </div>
    </DashboardLayout>
  );
};

export default Home;
