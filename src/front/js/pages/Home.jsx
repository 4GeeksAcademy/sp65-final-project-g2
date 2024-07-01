import React from "react";
import "../../styles/home.css";
import SubirImagen from "../component/SubirImagen.jsx";
import rubiadef from "../../img/rubiadef.jpg";
import hombre from "../../img/hombre-bn.webp";
import { Link } from "react-router-dom";

const textStyle = {
	position: "absolute",
	top: "20%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	color: "white",
	textAlign: "center"
};

export const Home = () => {
	return (
		<div className="position-relative d-flex justify-content-center">
			{/* Contenedor de la imagen */}
			<div className="position-relative">
				{/* Usar la clase img-fluid para ajustar la imagen */}
				<img src={rubiadef} alt="Descripción de la imagen" className="img-fluid reduced-height" />
				{/* Texto superpuesto */}
				<div style={textStyle}>
					<h2 className="mt-3 text-orange">"Change your body, change your life" </h2>
					<ul className="mt-5 text-start text-info">
						<li> Join and access over 1300 exercises</li>
						<li> Choose which muscle group you want to exercise today</li>
						<li> Create your own daily and weekly routines</li>
						<li> 100% animated instructions</li>
						<li> Different difficulty levels</li>
						<li> From home or at the gym</li>
						<li> Age doesn't matter</li>
					</ul>
					<h2 className="mt-5 text-orange">Your transformation begins today.</h2>
					<Link to="/login">
						<button type="button" className="btn btn-blue btn-lg mt-3 rounded-pill text-orange border-orange text-bold">
							Join us now!
						</button>
					</Link>

				</div>
				{/* Todo esto va abajo de la imagen */}
				<div className="container-fluid d-flex justify-content-around mt-5">
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-heartbeat fs-5 text-danger"></i></div>
						<div className="text-center">
							<p className="smaller-text text-info mt-3">
								Improve your appearance and health with our exercises,
								feel how your quality of life significantly improves
							</p>
						</div>
					</div>
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-dumbbell fs-5 text-danger"></i></div>
						<div className="text-center">
							<p className="smaller-text text-info mt-3">
								Don't worry if you don't have a gym nearby, thanks to our wide variety of exercises,
								you can perform any workout at home with your own body weight.
							</p>
						</div>
					</div>
					<div className="text-white col-3 d-flex flex-column align-items-center">
						<div><i className="fa-solid fa-fire-flame-curved fs-5 text-danger"></i></div>
						<div className="text-center">
							<p className="smaller-text text-info mt-3">
								Track your calorie burn with our personalized routines. With proper nutrition
								and a calorie deficit, you can achieve your goals.
							</p>
						</div>
					</div>
				</div>
				{/* Linea separación */}
				<div className="row my-4 text-white">
					<div className="col">
						<hr className="separator" />
					</div>
				</div>
				{/* Siguiente bloque */}
				<div className="container mt-5">
					<div className="row">
						<div className="col text-center">
							<h2 className="text-orange mt-3">
								Enhance your body transformation with our personalized exercises</h2>
							<p className="lead text-info mt-5">We will help you organize your exercises. Become your own coach by
								designing workout routines for each day of the week. Sign up for free now and enjoy all our services.</p>
							<Link to="/signup" className="nav-link">
								<button className="btn btn-blue btn-lg mt-4 ms-2 rounded-pill text-orange border-orange text-bold">
									Register now!
								</button>


							</Link>
						</div>
						<div className="col-auto">
							{/* Imagen del hombre pequeña y alineada a la derecha */}
							<img src={hombre} alt="Hombre en ABA Fitness" className="img-fluid hombre-pequeno-derecha" />
						</div>
					</div>
					{/* Línea de separación */}
					<div className="row my-4 text-white">
						<div className="col">
							<hr className="separator" />
						</div>
					</div>
					{/* Carrusel */}
					<div id="carouselExampleControls" className="carousel slide mb-5" data-bs-ride="carousel">
						<div className="carousel-inner">
							<div className="carousel-item active ">
								<h6 className="text-info text-center"> "Since I started using ABA Fitness, my motivation has multiplied by 1000.<br />
									Going to the gym is no longer a sacrifice for me." </h6>
								<div className="d-flex justify-content-center">
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
								</div>
							</div>
							<div className="carousel-item">
								<h6 className="text-info text-center"> "I was tired of always doing the same exercises and not knowing how to perform them
									correctly.<br /> ABA Fitness solved both of these problems."</h6>
								<div className="d-flex justify-content-center">
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
								</div>
							</div>
							<div className="carousel-item">
								<h6 className="text-info text-center"> "Excellent app, highly recommended. It doesn't matter your level or age, <br />
									suitable for the whole family. They provide the tools, you set the pace." </h6>
								<div className="d-flex justify-content-center">
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
									<i className="fa fa-star text-center" style={{ color: 'orange' }}></i>
								</div>
							</div>
						</div>
						<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
							<span className="carousel-control-prev-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Previous</span>
						</button>
						<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
							<span className="carousel-control-next-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Next</span>
						</button>
					</div>

					

				</div>
			</div>
		</div>
	);
};
