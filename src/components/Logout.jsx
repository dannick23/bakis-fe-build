import React, { useEffect } from "react";
import { useSystem } from "../App";
import { useNavigate } from "react-router-dom";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import axios from "axios";

const Logout = () => {
  const { logout, system, setUser } = useSystem();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const util = require("util");

  const logoutApi = async () => {
    try {
      const response = await axios.post(
        `{process.env.BE_HOST}/user/${system}/logout`,
        null,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      );

      if (response.status === 200) {
        console.log("Logged out successfully");
        console.log(util.inspect(response.data, false, null, true));
        signOut();
        setUser(null);
        navigate(`/${system}/login`);
      }
    } catch (error) {
      console.log(util.inspect(error.response, false, null, true));
      signOut();
      setUser(null);
      console.log("JWT bad my man ", error.response);
    }
  };

  useEffect(() => {
    logoutApi();
  }, [logout, system]);

  return <div></div>;
};

export default Logout;
