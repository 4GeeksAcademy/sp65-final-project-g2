import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Custom Component
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom Pages
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Workouts } from "./pages/Workouts.jsx";
import { WorkoutDetails } from "./pages/WorkoutDetails.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import Exercises from './pages/Exercises.jsx';
import { Favorites } from "./pages/Favorites.jsx";
import { PrivacyPolicy } from "./pages/PrivacyPolicy.jsx";
import { ConditionsTerms } from "./pages/ConditionsTerms.jsx";
import Contact from "./pages/Contact.jsx";
import ChatBot from "./component/Chatbot.jsx";
import Chrono from "./component/Chrono.jsx";

// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Exercises />} path="/exercises" />
                        <Route element={<Workouts />} path="/workouts" />
                        <Route element={<WorkoutDetails />} path="/workout-details/:id" />
                        <Route element={<Favorites />} path="/favorites" />
                        <Route element={<PrivacyPolicy />} path="/privacy-policy" />
                        <Route element={<ConditionsTerms />} path="/conditions-terms" />
                        <Route element={<Contact />} path="/contact" />
                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <ChatBot />
                    <Chrono />
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
