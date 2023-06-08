import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useEffect, createContext, useState, useContext } from "react";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import "bootstrap/dist/css/bootstrap.min.css";
import PhotoCollage from "./components/PhotoCollage";
import AdminPage from "./page/AdminPage";
import WorkersList from "./components/WorkersList";
import WorkerCalendar from "./components/WorkersCalendar";
import NavigationBar from "./components/Navbar";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import WorkerAgendaSolo from "./components/WorkerAgendaSolo";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import axios from "axios";

const SystemContext = createContext();

export function useSystem() {
  return useContext(SystemContext);
}

function SystemSetter() {
  const { system, user } = useParams();
  const { setSystem, setUser } = useSystem();
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const util = require("util");
  const signOut = useSignOut();
  console.log("System from params: ", system);

  const attemptLogin = async () => {
    if (authHeader && authHeader !== "undefined") {
      console.log("Jwt token found");

      try {
        const response = await axios.post(
          `https://bakis-be.herokuapp.com/user/${system}/validate-token`,
          null,
          {
            headers: { Authorization: authHeader() },
          }
        );
        if (response.status === 200) {
          console.log(util.inspect(response.data, false, null, true));
          setUser(response.data);
          console.log("JWT is good");
          navigate(`/${system}/home`);
        }
      } catch (error) {
        signOut();
        console.log("JWT bad my man ", error.response);
        navigate(`/${system}/login`);
      }
    }
  };

  useEffect(() => {
    attemptLogin();
    setSystem(system);
  }, [system, setSystem]);
  return null;
}

export function SystemProvider({ children }) {
  const [system, setSystem] = useState("");
  const [user, setUser] = useState();

  const logout = async (system) => {
    setUser(null);
  };

  return (
    <SystemContext.Provider
      value={{ system, setSystem, user, setUser, logout }}
    >
      {children}
    </SystemContext.Provider>
  );
}

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SystemProvider>
        <NavigationBar />
        <Routes>
          <Route path=":system" element={<SystemSetter />} />
          <Route path="/:system/login" element={<LoginForm />} />
          <Route path="/:system/register" element={<RegistrationForm />} />
          <Route path="/:system/home" element={<PhotoCollage />} />
          <Route path="/:system/admin-menu" element={<AdminPage />} />
          <Route path="/:system/register-visit" element={<WorkersList />} />
          <Route path="/:system/calendar/:email" element={<WorkerCalendar />} />
          <Route path="/:system/agenda/:email" element={<WorkerAgendaSolo />} />
          <Route path="/:system/about-us" element={<AboutUs />} />
          <Route path="/:system/contact-us" element={<ContactUs />} />
          <Route path="/:system/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </SystemProvider>
    </div>
  );
}

export default App;
