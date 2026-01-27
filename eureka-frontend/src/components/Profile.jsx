import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [user, setUser] = useState({});

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });

        const fetchUser = async () => {
            const response = await axios.get(
                `http://localhost:8081/users/username/${userName}`
            );
            setUser(response.data);
        };
        fetchUser();
    }, []);

    return (
        <>
            <Header userName={userName} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white text-center py-4">
                                <h2 className="mb-0">{user.name}</h2>
                                <p className="mb-0 text-white-50">@{user.username}</p>
                            </div>
                            <div className="card-body">
                                <div className="row text-center mb-4">
                                    <div className="col-6 border-end">
                                        <h3 className="text-warning display-4">{user.brain_coins}</h3>
                                        <p className="text-muted">Brain Coins</p>
                                    </div>
                                    <div className="col-6">
                                        <h3 className="text-success display-4">{user.ratings}</h3>
                                        <p className="text-muted">Global Rating</p>
                                    </div>
                                </div>

                                <h5 className="border-bottom pb-2 mb-3">Professional Info</h5>
                                <div className="row mb-3">
                                    <div className="col-sm-4 text-muted">Profession</div>
                                    <div className="col-sm-8 fw-bold">{user.profession}</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-4 text-muted">Institute</div>
                                    <div className="col-sm-8 fw-bold">{user.institute}</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-4 text-muted">Stream</div>
                                    <div className="col-sm-8 fw-bold">{user.stream}</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-4 text-muted">Graduation Year</div>
                                    <div className="col-sm-8 fw-bold">{user.graduation_year}</div>
                                </div>

                                <div className="d-grid gap-2 mt-5">
                                    <button className="btn btn-outline-info" onClick={() => navigate('/buddies', { state: { userName: userName } })}>
                                        View Buddies
                                    </button>
                                    <button className="btn btn-outline-secondary" onClick={() => navigate('/leaderboard', { state: { userName: userName } })}>
                                        Check Leaderboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
