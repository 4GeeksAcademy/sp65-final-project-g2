import React, { useState, useEffect, useRef } from 'react';
import "../../styles/chrono.css";

const Chrono = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundTime, setBackgroundTime] = useState(0);
  const [isBackgroundRunning, setIsBackgroundRunning] = useState(false);
  const intervalRef = useRef(null);
  const backgroundIntervalRef = useRef(null);

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

  return (
    <div className='text-white text-center mt-5'>
      <div className='d-flex justify-content-center align-items-center'>
        <p className='mb-0'>ACTIVE time:&nbsp; </p>
        <div className="roller-container mr-3 mb-0" style={{ width: '180px' }}>
          {formatTime(time)}
        </div>
        <div className="px-4">
          <button
            onClick={handleStartStop}
            className="btn btn-outline-white rounded-pill text-orange border-orange mx-2">
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-outline-white rounded-pill text-orange border-orange mx-2">
            Reset
          </button>
        </div>
        <p className='mb-0'>REST time:&nbsp; </p>
        <div className="roller-container mb-0" style={{ width: '180px' }}>
          {formatTime(backgroundTime)}
        </div>
      </div>
    </div>
  );
};

export default Chrono;