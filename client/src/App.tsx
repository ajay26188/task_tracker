import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlertMessage from "./components/AlertMessage";
import { useSelector} from "react-redux";
import type { RootState } from "./store";

function App() {
  const message = useSelector((state: RootState) => state.alertMessage);
  return (
    <div>
      <AlertMessage {...message} />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </div>
    
  );
}

export default App;
