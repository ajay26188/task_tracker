import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/auth/Signup";
import AddOrganization from "./pages/AddOrganization";
import Landing from "./pages/Landing";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyNotice from "./pages/auth/VerifyNotice";
import RequestReset from "./pages/auth/RequestReset";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/addOrg" element={<AddOrganization />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-notice" element={<VerifyNotice />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    
  );
}

export default App;
