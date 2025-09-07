import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/dashboard/Home";
import Signup from "./pages/auth/Signup";
import AddOrganization from "./pages/AddOrganization";
import Landing from "./pages/Landing";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyNotice from "./pages/auth/VerifyNotice";
import RequestReset from "./pages/auth/RequestReset";
import ResetPassword from "./pages/auth/ResetPassword";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { setUser } from "./reducers/loggedUserReducer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  //this is used for page refreshment
  //when page is refershed without looging out 
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser) //parse when you get local storage items
      dispatch(setUser(user));
    }
    setLoading(false);
  },[dispatch])

  if (loading) {
    return <p>Loading...</p>; 
  }

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
        
        {/* Protect dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
    
  );
}

export default App;
