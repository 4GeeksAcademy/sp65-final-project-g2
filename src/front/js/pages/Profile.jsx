import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import "../../styles/profile.css";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: store.user.first_name,
    last_name: store.user.last_name,
    email: store.user.email,
    gender: store.user.gender,
    weight: store.user.weight,
    height: store.user.height,
    birth_date: store.user.birth_date,
    is_active: store.user.is_active,
  });

  // Formatear la fecha de nacimiento de ISO a un formato más legible
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Función para calcular el índice de masa corporal (BMI)
  const calculateBMI = (weight, height) => {
    if (weight <= 0 || height <= 0) return "N/A";

    const heightInMeters = height / 100; // Convertir altura a metros
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1); // Redondear el BMI a un decimal
  };

  // Función para determinar el color del BMI según el rango
  const getBMIColor = (bmi) => {
    if (bmi <= 18.5) {
      return "#F7A926"; // Bajo peso
    } else if (bmi <= 24.9) {
      return "#4CAF50"; // Peso normal
    } else if (bmi <= 29.9) {
      return "#FFC107"; // Sobrepeso
    } else {
      return "#F44336"; // Obesidad
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        actions.setUser(data);
        actions.setCurrentUser(data.results);
        setIsEditing(false);
      } else {
        console.error("Error updating profile:", await response.json());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mt-4">
      {store.isLogin ? (
        <div>
          <div className="d-flex align-start">
            <h2 className="text-white">User Profile</h2>
            <i className="fas fa-edit fs-3 mx-5 mt-1" id="edit" onClick={handleEditClick} type="button" title="Edit Profile"></i>
          </div>
          {isEditing ?  <div className="card bg-dark text-white col-6">
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-control"
                      id="gender"
                      name="gender" // Añadir el nombre para que coincida con formData
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Hombre">Male</option>
                      <option value="Mujer">Female</option>
                      <option value="Sin definir">Others</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Birth Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* is_active es parte del formulario pero no se muestra al usuario */}
                  <button type="submit" className="btn btn-outline-light">
                    Save changes
                  </button>
                </form>
              </div>
            </div>
           : (
            <div className="card text-white" style={{ backgroundColor: "rgba(1, 6, 16, 0.000)" }}>
              <div className="card-body">
                <img src={store.user.profile_picture} alt="profile_pic" width="150" height="150" className="d-inline-block align-text-top rounded-circle mx-2 mb-5" />
                <p><strong>Name:</strong> {store.user.first_name}</p>
                <p><strong>Last Name:</strong> {store.user.last_name}</p>
                <p><strong>Email:</strong> {store.user.email}</p>
                <p><strong>Gender:</strong> {store.user.gender}</p>
                <p><strong>Weight:</strong> {store.user.weight} kg</p>
                <p><strong>Height:</strong> {store.user.height} cm</p>
                <p><strong>Birth Date:</strong> {formatDate(store.user.birth_date)}</p>
                <div>
                  <strong>BMI:</strong>{" "}
                  <span style={{ color: getBMIColor(calculateBMI(store.user.weight, store.user.height)), fontWeight: "bold" }}>
                    {calculateBMI(store.user.weight, store.user.height)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container text-center">
          <div className="alert alert-secondary col-6 d-flex justify-content-center mx-auto" role="alert">
            Session has expired
          </div>
          <Link to="/login">
            <button className="btn btn-outline-light">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};
