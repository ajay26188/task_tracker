import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlertMessage from "./components/AlertMessage";
import { useSelector} from "react-redux";
import type { RootState } from "./store";
import Signup from "./pages/Signup";

function App() {
  const alertMessage = useSelector((state: RootState) => state.alertMessage);
  return (
    <div>
      <AlertMessage {...alertMessage} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    
  );
}

export default App;
