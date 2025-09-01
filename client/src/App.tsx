import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/auth/Signup";
import AddOrganization from "./pages/AddOrganization";
import Landing from "./pages/Landing";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/addOrg" element={<AddOrganization />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    
  );
}

export default App;
