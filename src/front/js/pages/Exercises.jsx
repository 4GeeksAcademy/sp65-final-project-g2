import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Pagination, Spinner, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Context } from "../store/appContext";
import "../../styles/exercises.css";
  
  export const Exercises = () => {

  useEffect(() => {
    if (!store.isLogin) {
      navigate('/');
    }
  }, []);
  
  const { store, actions } = useContext(Context);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const exercisesPerPage = 9;
  const location = useLocation();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=2000&offset=0', {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        });
        const data = await response.json();
        const filteredExercises = data.filter(exercise => exercise.id <= 1324);

        setExercises(filteredExercises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  const filteredExercises = exercises.filter(exercise => {
    return exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const maxPageNumbersToShow = 20;
  const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPageNumbersToShow / 2), totalPages - maxPageNumbersToShow + 1));
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
  const displayedPageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPageNumbers.push(i);
  }

  return (
    <Container className="mt-4 container">
      <h1 className='text-white text-center'>Exercises</h1>
      <Form className="mb-3 mt-3 col-12 col-md-6">
        <div className='d-flex justify-content-between'>
          <i className="fas fa-search text-white fs-3 mx-2 mt-1"></i>
          <Form.Control
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Form>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row className="d-flex">
            {currentExercises.map((exercise) => (
              <Col key={exercise.id} xs={12} md={6} lg={4} className="mb-4 d-flex">
                <ExerciseCard exercise={exercise} isFavorite={store.favorites.some(fav => fav.id === exercise.id)} actions={actions} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-4 pagination-container">
            <Pagination>
              {currentPage > 1 && (
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
              )}
              {startPage > 1 && (
                <>
                  <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                  <Pagination.Ellipsis disabled />
                </>
              )}
              {displayedPageNumbers.map(number => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
              {endPage < totalPages && (
                <>
                  <Pagination.Ellipsis disabled />
                  <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
                </>
              )}
              {currentPage < totalPages && (
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
              )}
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

const ExerciseCard = ({ exercise, isFavorite, actions }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={`exercise-card ${isFlipped ? 'flipped' : ''}`}>
      <Card className="front">
        <Card.Title className="text-center mx-3 mt-2 fw-bold">{capitalizeFirstLetter(exercise.name)}</Card.Title>

        <Card.Body className="d-flex flex-column">
          <div className="exercise-img-container">
            <Card.Img src={exercise.gifUrl} alt={exercise.name} className="exercise-img" />
          </div>
          <div className="exercise-info">
            <Card.Text><strong>Body Part:</strong> {exercise.bodyPart}</Card.Text>
            <Card.Text><strong>Target:</strong> {exercise.target}</Card.Text>
            <Card.Text><strong>Equipment:</strong> {exercise.equipment}</Card.Text>
            <div className="justify-content-around d-flex fixed-bottom mb-3">
              <i className="far fa-question-circle fs-2" onClick={handleFlip} title="+ Info" type="button"></i>
              {isFavorite ? (
                <i className="fas fa-heart float-end fa-lg pt-3 text-danger fs-2" type="button" onClick={() => actions.removeFavorite(exercise.id)} title="Remove Favorite"></i>
              ) : (
                <i className="far fa-heart float-end fa-lg pt-3 text-danger fs-2" type="button" onClick={() => actions.addFavorite(exercise)} title="Add Favorite"></i>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="back" onClick={handleFlip} type="button">
        <Card.Body>
          <Card.Title>Instructions</Card.Title>
          <ul>
            {exercise.instructions && exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))} 
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Exercises;
