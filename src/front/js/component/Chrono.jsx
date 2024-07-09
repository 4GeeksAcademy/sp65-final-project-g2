import React, { useState, useContext, useEffect, useRef } from 'react';
import "../../styles/chrono.css";
import { Context } from "../store/appContext.js";

const Chrono = () => {
  const { store } = useContext(Context);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundTime, setBackgroundTime] = useState(0);
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);
  const intervalRef = useRef(null);
  const backgroundIntervalRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isBackgroundRunning) {
      backgroundIntervalRef.current = setInterval(() => {
        setBackgroundTime((prevTime) => prevTime + 1);
      }, 10);
    } else {
      clearInterval(backgroundIntervalRef.current);
    }
    return () => clearInterval(backgroundIntervalRef.current);
  }, [isBackgroundRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsBackgroundRunning(true);
    } else {
      setIsRunning(true);
      setIsBackgroundRunning(false);
      setBackgroundTime(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBackgroundRunning(false);
    setTime(0);
    setBackgroundTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time / 100) % 60);
    const centiseconds = time % 100;

    return (
      <>
        <span className="roller">{('0' + minutes).slice(-2)[0]}</span>
        <span className="roller">{('0' + minutes).slice(-2)[1]}</span>:
        <span className="roller">{('0' + seconds).slice(-2)[0]}</span>
        <span className="roller">{('0' + seconds).slice(-2)[1]}</span>.
        <span className="roller">{('0' + centiseconds).slice(-2)[0]}</span>
        <span className="roller">{('0' + centiseconds).slice(-2)[1]}</span>
      </>
    );
  };

  const toggleChrono = () => {
    if (store.isLogin) {
      setIsActive(!isActive);
    }
  };

  if (!store.isLogin) {
    return null;
  }

  return (
    <div>
      <div className="chrono-bubble" onClick={toggleChrono}>
        {isActive ? <span style={{ color: 'white', fontSize: '24px' }}>❌</span> : <i className="chrono-icon fas fa-clock"></i>}
      </div>
      <div className={`chrono-container ${isActive ? 'active' : ''}`}>
        <div className='text-center mt-2'> {/* Reducido para ser más compacto */}
          <div className='d-flex flex-column align-items-center'>
            <p className='mb-0'>ACTIVE time:&nbsp; </p>
            <div className="roller-container mb-2" style={{ width: '90px' }}> {/* Reducido al 50% */}
              {formatTime(time)}
            </div>
            <div className="mb-2">
              <button
                onClick={handleStartStop}
                className="btn btn-outline-primary rounded-pill mx-1">
                {isRunning ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={handleReset}
                className="btn btn-outline-primary rounded-pill mx-1">
                Reset
              </button>
            </div>
            <p className='mb-0'>REST time:&nbsp; </p>
            <div className="roller-container" style={{ width: '90px' }}> {/* Reducido al 50% */}
              {formatTime(backgroundTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chrono;
