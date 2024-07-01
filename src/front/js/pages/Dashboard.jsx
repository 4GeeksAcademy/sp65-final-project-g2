import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ChicaPesas from "../../img/ChicaPesas.webp";
import MotivationCarousel from "./MotivationCarousel.jsx"; // Importa el componente MotivationCarousel
import ImageCarousel from "./ImageCarousel.jsx"; // Importa el componente ImageCarousel
import '/workspaces/sp65-final-project-g2/src/front/styles/dashboard.css';
import Chrono from "./Chrono.jsx"; 

export const Dashboard = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();


  useEffect(() => {
    if (!store.isLogin) {
      navigate('/');
    }
  }, []);

  return (
    <div className="container">
      {store.isLogin ? (
        <div className="container">
          <h2 className="text-white text-start mt-5">Hi {store.user.first_name}!</h2>
          <Link to="/workouts">
            <button type="button" className="btn btn-outline-light mt-3 rounded-pill mb-3">
              Create your routine
            </button>
          </Link>
          <div>
          <Chrono />
          </div>
          <div className="mt-3">
            <hr className="separator text-white" />
          </div>
          <div className="mt-5 mb-5">
            <MotivationCarousel />
            <ImageCarousel />
            <div>
              <hr className="separator text-white mt-5" />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>You don't have access</h1>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
