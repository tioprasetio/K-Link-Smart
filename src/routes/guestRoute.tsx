import { Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const GuestRoute = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
