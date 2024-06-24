import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const Workouts = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showExercises, setShowExercises] = useState(false);
    const [showRoutineExercises, setShowRoutineExercises] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState("");
    const [selectedReps, setSelectedReps] = useState("");
    const [selectedSets, setSelectedSets] = useState("");
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [routineName, setRoutineName] = useState("Rutina 1");
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
                const data = await response.json();
                setExercises(data);
            } catch (error) {
                console.error("Error al obtener los ejercicios de la API:", error);
            }
        };

        fetchExercises();
    }, []);

    const saveRoutineToDatabase = async () => {
        try {
            // Aquí debes realizar la lógica para enviar la rutina a tu base de datos
            // Puedes utilizar fetch u otra librería como Axios para hacer la petición POST

            const response = await fetch('https://miniature-happiness-7vvqqw6ppxj6hwwpg-3001.app.github.dev/workouts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega cualquier otro encabezado necesario, como tokens de autenticación
                },
                body: JSON.stringify({
                    routineName: routineName,
                    exercises: routineExercises,
                    totalDuration: calculateTotalRoutineDuration(), // Asegúrate de enviar la duración total
                    userId: user_id
                    // Otros datos que necesites enviar a la base de datos
                }),
            });

            if (response.ok) {
                // Aquí puedes manejar la respuesta si es exitosa
                alert('Rutina guardada exitosamente en la base de datos');
                // Puedes también redirigir al usuario o realizar otras acciones después de guardar
            } else {
                throw new Error('Error al guardar la rutina en la base de datos');
            }
        } catch (error) {
            console.error('Error al intentar guardar la rutina:', error);
            alert('Error al guardar la rutina. Por favor, intenta de nuevo más tarde.');
        }
    };


    useEffect(() => {
        if (!store.isLogin) {
            navigate('/');
        }
    }, [store.isLogin, navigate]);

    const handleAddExerciseClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleBodyPartChange = (event) => {
        setSelectedBodyPart(event.target.value);
        setSelectedExercise(null);
    };

    const handleEquipmentChange = (event) => {
        setSelectedEquipment(event.target.value);
        setSelectedExercise(null);
    };

    const handleRepsChange = (event) => {
        setSelectedReps(event.target.value);
    };

    const handleSetsChange = (event) => {
        setSelectedSets(event.target.value);
    };

    const handleAddToRoutine = (exercise) => {
        if (!selectedReps || !selectedSets) {
            alert("Especificar número de repeticiones y series.");
            return;
        }

        setRoutineExercises([...routineExercises, { ...exercise, reps: selectedReps, sets: selectedSets }]);
        setSelectedBodyPart("");
        setSelectedEquipment("");
        setSelectedReps("");
        setSelectedSets("");
    };

    // Filtrar ejercicios según la parte del cuerpo y el equipo seleccionados
    useEffect(() => {
        if (selectedBodyPart && selectedEquipment) {
            const filtered = exercises.filter(exercise =>
                exercise.bodyPart === selectedBodyPart.toLowerCase() && exercise.equipment === selectedEquipment.toLowerCase()
            );
            setFilteredExercises(filtered);
            console.log("Ejercicios filtrados:", filtered); // Mensaje de depuración
        } else {
            setFilteredExercises([]);
            console.log("Sin filtro aplicado, ejercicios filtrados:", []); // Mensaje de depuración
        }
    }, [selectedBodyPart, selectedEquipment, exercises]);

    // Filtrar las opciones de body part y capitalizar la primera letra
    const bodyPartOptions = Array.from(new Set(exercises
        .map(exercise => exercise.bodyPart.toLowerCase())
        .filter(bodyPart =>
            ["back", "upper legs", "lower legs", "upper arms", "chest", "shoulders", "cardio"].includes(bodyPart)
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

    const selectExercise = (exercise) => {
        setSelectedExercise(exercise);
    };

    const handleNameChange = (event) => {
        setRoutineName(event.target.value);
    };

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
    };

    const toggleShowExercises = () => {
        setShowExercises(!showExercises);
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
            // Agregar el tiempo de descanso entre series
            totalSeconds += (routineExercises.length - 1) * 30;
        }

        return Math.max(totalSeconds, 0); // Asegurar que la duración no sea negativa
    }

    function calculateTotalDuration(exercise) {
        const totalSets = parseInt(exercise.sets, 10);
        const totalReps = parseInt(exercise.reps, 10);
        return totalSets * totalReps * 2; // Cada repetición dura 2 segundos
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
        const maxPageNumbers = 5; // Máximo de páginas visibles
        const middlePage = Math.ceil(maxPageNumbers / 2); // Página central para centrar las páginas visibles
        let startPage = currentPage <= middlePage ? 1 : currentPage - middlePage + 1;
        startPage = Math.max(startPage, 1);
        const endPage = Math.min(startPage + maxPageNumbers - 1, pageNumbers);

        const items = [];

        // Mostrar flechas solo si hay más de 5 páginas
        if (pageNumbers > maxPageNumbers) {
            // Botón de retroceso
            items.push(
                <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                </li>
            );

            // Páginas visibles
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>
                            {i}
                        </button>
                    </li>
                );
            }

            // Botón de avance
            items.push(
                <li key="next" className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                </li>
            );
        }

        return items;
    }

    // Paginación
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

    return (
        <div className="container">
            {store.isLogin ? (
                <div className="container">
                    <h3 className="text-white text-start mt-2">Mis workouts!</h3>
                    <div className="card text-center bg-dark text-white">
                        <div className="card-header justify-content-around d-flex align-items-center">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={routineName}
                                    onChange={handleNameChange}
                                    onBlur={toggleEditName}
                                    className="form-control"
                                />
                            ) : (
                                <>
                                    <h2 className="d-inline">{routineName}</h2>
                                    <i
                                        className="fas fa-pencil-alt"
                                        onClick={toggleEditName}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <button className="btn btn-outline-light ml-3" onClick={toggleShowExercises}>
                                        Buscar ejercicios
                                    </button>
                                    <button className="btn btn-outline-light ml-3" onClick={toggleShowRoutineExercises}>
                                        Ver rutina ({routineExercises.length})
                                    </button>
                                </>
                            )}
                            <h6 className="mt-2">Total ejercicios: {routineExercises.length}</h6>
                            <h6 className="mt-2">Duración total: {formatDuration(calculateTotalRoutineDuration())}</h6>
                            <button className="btn btn-success ml-3" onClick={saveRoutineToDatabase}>
                                Guardar Rutina
                            </button>
                        </div>
                        <div className="card-body">
                            {showRoutineExercises && (
                                <div className="mb-4">
                                    <h4 className="text-white">Ejercicios en la rutina:</h4>
                                    <ul className="list-group">
                                        {routineExercises.map((exercise, index) => (
                                            <li key={index} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">

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
                                    <div className="d-flex flex-column p-4 bg-dark border border-secondary">
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
                                    </div>
                                    <div className="ml-4" style={{ width: '50%' }}>
                                        <h6 className="text-white mx-5">Ejercicios disponibles:</h6>
                                        <ul className="list-group mx-5">
                                            {currentExercises.map((exercise, index) => (
                                                <li key={index} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
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
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {/* Paginación */}
                                        <nav className="mt-3">
                                            <ul className="pagination justify-content-center">
                                                {paginationItems()}
                                            </ul>
                                        </nav>
                                    </div>
                                    {selectedExercise && (
                                        <div className="mx-5 d-flex align-items-center">
                                            <img
                                                src={selectedExercise.gifUrl}
                                                alt={selectedExercise.name}
                                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            {selectedExercise && (
                                <div className="mt-4">
                                    <h4 className="text-white">Ejercicio seleccionado:</h4>
                                    <p className="text-white">{selectedExercise.name}</p>
                                    <div>
                                        <img
                                            src={selectedExercise.gifUrl}
                                            alt={selectedExercise.name}
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', marginRight: '10px' }}
                                        />
                                        <span className="text-white">Ver animación</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>Debes iniciar sesión para ver esta página</div>
            )}
        </div>
    );




};