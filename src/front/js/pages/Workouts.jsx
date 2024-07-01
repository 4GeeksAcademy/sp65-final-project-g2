import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Workouts = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showExercises, setShowExercises] = useState(false);
    const [showRoutineExercises, setShowRoutineExercises] = useState(false);
    const [showWorkouts, setShowWorkouts] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [showDetails, setShowDetails] = useState({});
    const [selectedBodyPart, setSelectedBodyPart] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState("");
    const [selectedReps, setSelectedReps] = useState("");
    const [selectedSets, setSelectedSets] = useState("");
    const [selectedRest, setSelectedRest] = useState("");
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [routineName, setRoutineName] = useState("Workout Name");
    const [isEditingName, setIsEditingName] = useState(false);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 5;

    const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=3000&offset=0';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
                }

                const data = await response.json();

                // Filtrar ejercicios con id <= 1324 y que tienen las propiedades necesarias
                const validExercises = data.filter(exercise =>
                    exercise.id <= 1324 && // Filtro por ID
                    exercise.name &&
                    exercise.bodyPart &&
                    exercise.equipment &&
                    exercise.gifUrl
                );

                setExercises(validExercises);
            } catch (error) {
                console.error("Error al obtener los ejercicios de la API:", error);
            }
        };

        fetchExercises();


    }, []);

    const getWorkouts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found in localStorage.');
            }

            const url = `${process.env.BACKEND_URL}/api/workouts`;
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setWorkouts(data.results);
            
        } catch (error) {
            console.error('Error fetching workouts:', error.message);
        }
    };



    const resetForm = () => {
        setSelectedBodyPart("");
        setSelectedEquipment("");
        setSelectedReps("");
        setSelectedSets("");
        setSelectedRest("");
        setRoutineName("Workout Name");
        setIsEditingName(false);
        setRoutineExercises([]);
        setCurrentPage(1);
        setShowExercises(false);
        setShowRoutineExercises(false);
    };

    const saveRoutineToDatabase = async () => {
        try {
            // Verificar si no hay ejercicios en la rutina
            if (routineExercises.length === 0) {
                alert('No se puede guardar la rutina porque no has añadido ningún ejercicio.');
                return;
            }

            const response = await fetch(`${process.env.BACKEND_URL}/api/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    routineName: routineName,
                    exercises: routineExercises.map(exercise => ({
                        exercise_id: exercise.id,
                        reps_num: exercise.reps,
                        series_num: exercise.sets,
                        rest_seconds: exercise.rest || 0
                    })),
                    totalDuration: calculateTotalRoutineDuration(),
                    userId: store.user.id
                }),
            });

            if (response.ok) {
                alert('Rutina guardada exitosamente en la base de datos');
                resetForm(); // Resetear todos los estados después de guardar la rutina


            } else {
                const errorData = await response.json();
                throw new Error(`Error al guardar la rutina en la base de datos: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al intentar guardar la rutina:', error);
            alert(`Error al guardar la rutina. Por favor, intenta de nuevo más tarde. Detalle del error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (!store.isLogin) {
            navigate('/');
        }
    }, [store.isLogin, navigate]);

    const handleBodyPartChange = (event) => {
        setSelectedBodyPart(event.target.value);
    };

    const handleEquipmentChange = (event) => {
        setSelectedEquipment(event.target.value);
    };

    const handleRepsChange = (event) => {
        setSelectedReps(event.target.value);
    };

    const handleSetsChange = (event) => {
        setSelectedSets(event.target.value);
    };

    const handleRestChange = (event) => {
        setSelectedRest(event.target.value);
    };

    const handleAddToRoutine = (exercise) => {
        if (!selectedReps || !selectedSets) {
            alert("Especificar número de repeticiones y series.");
            return;
        }

        setRoutineExercises([...routineExercises, { ...exercise, reps: selectedReps, sets: selectedSets, rest: selectedRest }]);
        setSelectedBodyPart("");
        setSelectedEquipment("");
        setSelectedReps("");
        setSelectedSets("");
        setSelectedRest("");
    };

    useEffect(() => {
        if (selectedBodyPart && selectedEquipment) {
            const filtered = exercises.filter(exercise =>
                exercise.bodyPart === selectedBodyPart.toLowerCase() && exercise.equipment === selectedEquipment.toLowerCase()
            );
            setFilteredExercises(filtered);
        } else {
            setFilteredExercises([]);
        }
    }, [selectedBodyPart, selectedEquipment, exercises]);

    const bodyPartOptions = Array.from(new Set(exercises
        .map(exercise => exercise.bodyPart.toLowerCase())
        .filter(bodyPart =>
            ["back", "upper legs", "waist", "lower legs", "upper arms", "chest", "shoulders", "cardio"].includes(bodyPart)
        )
    )).map(bodyPart => bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1));

    const unwantedEquipments = [
        "assisted", "medicine ball", "stability ball", "rope", "ez barbell", "sled machine", "upper body", "olimpic barbell", "weighted",
        "bosu ball", "resistance band", "roller", "skierg", "hammer", "wheel roller", "tire", "trap bar", "stepmill machine"
    ];

    const equipmentOptions = Array.from(new Set(exercises
        .map(exercise => exercise.equipment.toLowerCase())
        .filter(equipment => !unwantedEquipments.includes(equipment))
    )).map(equipment => equipment.charAt(0).toUpperCase() + equipment.slice(1));

    const handleNameChange = (event) => {
        setRoutineName(event.target.value);
    };

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita que se envíe el formulario si está dentro de uno
            toggleEditName(); // Finaliza la edición al presionar "Enter"
        }
    };

    const toggleShowExercises = () => {
        setShowExercises(!showExercises);
    };

    const toggleShowWorkouts = () => {
        setShowWorkouts(!showWorkouts);
    };

    const toggleShowDetails = (workoutId) => {
        setShowDetails(prevState => ({
            ...prevState,
            [workoutId]: !prevState[workoutId]
        }));
    };

    const handleDelete = async (workoutId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found in localStorage.');
            }

            const response = await fetch(`${process.env.BACKEND_URL}/api/workouts/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Actualizar la lista de workouts después de eliminar uno
            setWorkouts(workouts.filter(workout => workout.id !== workoutId));
        } catch (error) {
            console.error('Error deleting workout:', error.message);
        }
    };

    const toggleShowRoutineExercises = () => {
        setShowRoutineExercises(!showRoutineExercises);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    function calculateTotalRoutineDuration() {
        let totalSeconds = 0;
        if (routineExercises.length > 0) {
            routineExercises.forEach(exercise => {
                totalSeconds += calculateTotalDuration(exercise);
            });
            totalSeconds += (routineExercises.length - 1) * 30;
        }
        return Math.max(totalSeconds, 0);
    }

    function calculateTotalDuration(exercise) {
        const totalSets = parseInt(exercise.sets, 10);
        const totalReps = parseInt(exercise.reps, 10);
        return totalSets * totalReps * 2;
    }

    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} seg`;
    }

    function removeExerciseFromRoutine(index) {
        const updatedRoutineExercises = [...routineExercises];
        updatedRoutineExercises.splice(index, 1);
        setRoutineExercises(updatedRoutineExercises);
    }

    function paginationItems() {
        const pageNumbers = Math.ceil(filteredExercises.length / exercisesPerPage);
        const maxPageNumbers = 5;
        const middlePage = Math.ceil(maxPageNumbers / 2);
        let startPage = currentPage <= middlePage ? 1 : currentPage - middlePage + 1;
        startPage = Math.max(startPage, 1);
        const endPage = Math.min(startPage + maxPageNumbers - 1, pageNumbers);

        const items = [];
        if (pageNumbers > maxPageNumbers) {
            items.push(
                <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                </li>
            );
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>
                            {i}
                        </button>
                    </li>
                );
            }
            items.push(
                <li key="next" className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                </li>
            );
        }
        return items;
    }

    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

    return (
        <div className="container">
            <div className="container">
                <h1 className="text-white text-start mt-2">Add workout!</h1>
                <div className="card text-center text-white" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                    <div className="card-header justify-content-around d-flex align-items-center">
                        {isEditingName ? (
                            <div className="col-4">
                                <input
                                    type="text"
                                    value={routineName}
                                    onChange={handleNameChange}
                                    onBlur={toggleEditName}
                                    onKeyDown={handleKeyDown}
                                    className="form-control "
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className="d-inline">{routineName}</h3>
                                <i
                                    className="fas fa-pencil-alt"
                                    onClick={toggleEditName}
                                    style={{ cursor: 'pointer' }}
                                />
                                <button className="btn btn-outline-light ml-3" onClick={toggleShowExercises}>
                                    Search exercises
                                </button>
                                <button className="btn btn-outline-light ml-3" onClick={toggleShowRoutineExercises}>
                                    See workout ({routineExercises.length})
                                </button>
                            </>
                        )}
                        <h6 className="mt-2">Exercises: {routineExercises.length}</h6>
                        <h6 className="mt-2">Duration: {formatDuration(calculateTotalRoutineDuration())}</h6>
                        <button className="btn btn-outline-success ml-3" onClick={saveRoutineToDatabase}>
                            Add workout
                        </button>
                    </div>

                    <div className="card-body">
                        {showRoutineExercises && (
                            <div className="mb-4">
                                <h4 className="text-white">Workout exercises:</h4>
                                <ul className="list-group">
                                    {routineExercises.map((exercise, index) => (
                                        <li key={index} className="list-group-item text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                                            <img
                                                src={exercise.gifUrl}
                                                alt={exercise.name}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                                            />{exercise.name.toUpperCase(0)} - {exercise.reps} reps, {exercise.sets} sets
                                            <i
                                                className="fas fa-trash-alt ml-auto"
                                                onClick={() => removeExerciseFromRoutine(index)}
                                                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {showExercises && (
                            <div className="d-flex mt-3">
                                <div className="d-flex flex-column p-4 border" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="bodyPart" className="text-white">Target Body Part</label>
                                        <select
                                            id="bodyPart"
                                            className="form-control"
                                            value={selectedBodyPart}
                                            onChange={handleBodyPartChange}
                                        >
                                            <option value="">Select body part</option>
                                            {bodyPartOptions.map((bodyPart, index) => (
                                                <option key={index} value={bodyPart}>{bodyPart}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="equipment" className="text-white">Equipment</label>
                                        <select
                                            id="equipment"
                                            className="form-control"
                                            value={selectedEquipment}
                                            onChange={handleEquipmentChange}
                                        >
                                            <option value="">Select equipment</option>
                                            {equipmentOptions.map((equipment, index) => (
                                                <option key={index} value={equipment}>{equipment}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="reps" className="text-white">Number of Reps</label>
                                        <select
                                            id="reps"
                                            className="form-control"
                                            value={selectedReps}
                                            onChange={handleRepsChange}
                                        >
                                            <option value="">Select number of reps</option>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="12">12</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="sets" className="text-white">Number of Sets</label>
                                        <select
                                            id="sets"
                                            className="form-control"
                                            value={selectedSets}
                                            onChange={handleSetsChange}
                                        >
                                            <option value="">Select number of sets</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="rest" className="text-white">Rest seconds</label>
                                        <input
                                            type="number"
                                            id="rest"
                                            className="form-control"
                                            value={selectedRest}
                                            onChange={handleRestChange}
                                        />
                                    </div>
                                </div>
                                <div className="ml-4" style={{ width: '50%' }}>
                                    <h6 className="text-white mx-5">Available exercises:</h6>
                                    <ul className="list-group mx-5">
                                        {currentExercises.map((exercise, index) => (
                                            <li key={index} className="list-group-item text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
                                                <div>{exercise.name}</div>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={exercise.gifUrl}
                                                        alt={exercise.name}
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                                                    />
                                                    <i
                                                        className="fas fa-plus mx-2 add-icon"
                                                        onClick={() => handleAddToRoutine(exercise)}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Add Exercise"
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <nav className="mt-3">
                                        <ul className="pagination justify-content-center">
                                            {paginationItems()}
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <button className="btn btn-outline-light ml-3" onClick={getWorkouts}><h3>See my Workouts</h3></button>
                        {workouts.map(workout => (
                            <div className="card" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }} key={workout.id}>
                                <div className="card-body">
                                    <h5 className="card-title">{workout.name}</h5>
                                    <p className="card-text">Duration: {formatDuration(workout.duration)}</p>
                                    <p className="card-text">Exercises: {workout.exercises.length}</p>
                                    <Link to={`/workout-details/${workout.id}`} className="btn btn-outline-light rounded-pill text-orange border-orange">Details</Link>
                                    <i className="fas fa-trash-alt  mx-2 fs-4 mt-3" type="button" title="Delete workout" onClick={() => handleDelete(workout.id)}></i>

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};
