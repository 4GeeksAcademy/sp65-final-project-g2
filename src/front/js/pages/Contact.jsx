import React from "react";
import { useEffect } from "react";

export const Contact = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container mt-3 text-center">
            <div className="row justify-content-center" >
                <div className="col-md-6">
                    <h2 className="mb-4 text-white" >Contact</h2>
                    <p className="text-white">
                        Do you have any questions or comments? We're here to help. Please contact us using the information below:
                    </p>
                    <div className="card mt-5 mb-5" style={{backgroundColor: "rgba(1, 6, 16, 0.000)"}}>
                        <div className="card-body" >
                            <h5 className="card-title text-white">Contact Information</h5>
                            <ul className="list-group list-group-flush" style={{backgroundColor: "rgba(1, 6, 16, 0.000)"}}>
                                <li className="list-group-item text-white" style={{backgroundColor: "rgba(1, 6, 16, 0.000)"}}><strong>Email:</strong> <a href="mailto:contact@example.com">contact@abafitness.com</a></li>
                                <li className="list-group-item text-white" style={{backgroundColor: "rgba(1, 6, 16, 0.000)"}}><strong>Phone:</strong> +34 679 657 912</li>
                                <li className="list-group-item text-white" style={{backgroundColor: "rgba(1, 6, 16, 0.000)"}}><strong>Address:</strong> 4Geeks Academy, Madrid, Spain</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;