import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";
import logo from "../../img/Logo1.webp";

export const Footer = () => (
    <footer className="footer mt-auto py-3 text-center text-white p-3 fs-6">
        <div className="d-flex justify-content-center">
            {/* <img src={logo} alt="Logo" width="200" height="200" className="d-inline-block align-text-top rounded-circle mx-2" /> */}
        </div>
        <p className="text-white text-center mt-1 mb-2 fw-bold"> ABA Fitness Company</p>
        <p>
            Copyright 2024 <i className="far fa-registered"></i> |
            <Link to="/" className="ms-2 text-white ml-2"> ABA Fitness |</Link>
            <Link to="/privacy-policy" className="ms-2 text-white ml-2"> Privacy Policy | </Link>
            <Link to="/conditions-terms" className="ms-2 text-white ml-2"> Terms and conditions | </Link>
            <Link to="/contact" className="ms-2 text-white ml-2"> Contact </Link>
        </p>
    </footer>
);