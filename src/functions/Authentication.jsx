import { useEffect } from "react";
import { isTokenValid } from "./LoginFunc";
import { useNavigate, useParams } from "react-router-dom";
function CheckInitialRoute() {
  const { system, user } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("MyComponent has loaded");
    if (!isTokenValid()) {
      console.log("Since jwt not found we go to /login");
      navigate(`/${system}/login`);
    } else {
      console.log("Since jwt found and valid we go to /");
      navigate(`/${system}/home`);
    }
  }, []);
}
export default CheckInitialRoute;
