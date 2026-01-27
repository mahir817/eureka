import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const Streams = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [streamData, setStreamData] = useState({});

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });

        const fetchStreams = async () => {
            const response = await axios.get(
                `http://localhost:8081/questions/streams`
            );
            const data = await response["data"];
            setStreamData(data);
        };
        fetchStreams();
    }, []);

    return (
        <>
            <Header userName={userName} />
            <div className="container mt-5">
                <h2 className="text-center mb-5">Explore Streams</h2>
                <div className="row">
                    {Object.entries(streamData).map(([stream, categories]) => (
                        <div key={stream} className="col-lg-4 col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h4 className="card-title text-center text-primary">{stream}</h4>
                                    <hr />
                                    <h6 className="card-subtitle mb-2 text-muted text-center">Available Categories:</h6>
                                    <ul className="list-group list-group-flush">
                                        {categories.map((category, idx) => (
                                            <li key={idx} className="list-group-item text-center">{category}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer bg-white border-0 text-center pb-3">
                                    <button
                                        className="btn btn-outline-primary w-75"
                                        onClick={() => navigate('/home', { state: { userName: userName } })}
                                    >
                                        Go to Home to Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(streamData).length === 0 && <p className="text-center">Loading streams...</p>}
                </div>
            </div>
        </>
    );
};

export default Streams;
