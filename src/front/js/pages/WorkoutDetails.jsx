import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../../styles/workoutdetails.css";

export const WorkoutDetails = () => {

    const { id } = useParams();
    const [workoutDetails, setWorkoutDetails] = useState([]);
    const [workout, setWorkout] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found in localStorage.');
                }
                const response = await fetch(`${process.env.BACKEND_URL}/api/workoutdetails/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched workout details:', data);
                setWorkoutDetails(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout details:', error.message);
                setLoading(false);
            }
        };

        const fetchWorkout = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found in localStorage.');
                }
                const response = await fetch(`${process.env.BACKEND_URL}/api/workouts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched workout:', data);
                setWorkout(data.results); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout:', error.message);
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
        fetchWorkout();
    }, [id]);

    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec`;
    }
    const calculateTotalRoutineDuration = () => {
        let totalSeconds = 0;
        workoutDetails.forEach(exercise => {
            const exerciseDuration = exercise.duration || 60; // 60 segundos como valor por defecto si no hay duración.
            totalSeconds += exerciseDuration;
        });

        const restTime = 30; //30 segundos de descanso entre ejercicios.
        totalSeconds += (workoutDetails.length - 1) * restTime;
        return totalSeconds;
    };

    const handleDelete = async (exerciseId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found in localStorage.');
            }
            const response = await fetch(`${process.env.BACKEND_URL}/api/workoutdetails/${exerciseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Actualizar la lista de detalles del workout después de eliminar un ejercicio
            const updatedWorkoutDetails = workoutDetails.filter(exercise => exercise.id !== exerciseId);
            setWorkoutDetails(updatedWorkoutDetails);
            // Recalcular la duración de la rutina después de eliminar el ejercicio
            const updatedDuration = calculateTotalRoutineDuration(updatedWorkoutDetails);
            setWorkout(prevWorkout => ({
                ...prevWorkout,
                duration: updatedDuration
            }));
        } catch (error) {
            console.error('Error deleting exercise:', error.message);
        }
    };
    if (loading) return <div>Loading...</div>;
    if (workoutDetails.length === 0) {
        return <div className=''>
            <h2 className='text-white mt-3 text-center'>No exercises in workout!</h2>
            <Link to="/workouts" className="btn btn-outline-light rounded-pill text-orange border-orange mt-3">Back to Workouts</Link>
        </div>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="container">
            <div className='justify-content-around d-flex mb-5 mt-5'>
                <h3 className="text-white">Workout name: {workout.name}</h3>
                <h3 className="text-white">Workout duration: {formatDuration(workout.duration)}</h3>
            </div>
            <ul className="list-group">
                {workoutDetails.map((workout) => (
                    <li key={workout.id} className="list-group-item text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                        <img
                            src={workout.exercise_gif}
                            alt={workout.exercise_name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                        />
                        <span>
                            {capitalizeFirstLetter(workout.exercise_name)} - {workout.reps_num} reps, {workout.series_num} sets
                        </span>
                        <div>
                            <i className="fas fa-trash-alt text-danger fs-4 mx-5" title="Remove exercise" type="button" onClick={() => handleDelete(workout.id)}></i>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Botón para volver a la lista de workouts */}
            <Link to="/workouts" className="btn btn-outline-light rounded-pill text-orange border-orange mt-3">Back to Workouts</Link>
        </div>
    );
};