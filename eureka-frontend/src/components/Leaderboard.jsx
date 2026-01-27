import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const Leaderboard = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('global'); // 'global' or 'friends'

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        setUsers([]); // Clear previous data
        fetchLeaderboard();
    }, [view]);

    const fetchLeaderboard = async () => {
        try {
            let url = "http://localhost:8081/users/leaderboard";
            if (view === 'friends') {
                url = `http://localhost:8081/friends/leaderboard/${userName}`;
            }
            const response = await axios.get(url);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
        }
    };

    return (
        <>
            <Header userName={userName} />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Leaderboard</h2>

                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                        <button type="button" className={`btn ${view === 'global' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('global')}>
                            Global Ranking
                        </button>
                        <button type="button" className={`btn ${view === 'friends' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('friends')}>
                            Friends Ranking
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Ratings</th>
                                <th>Brain Coins</th>
                                <th>Institute</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className={user.username === userName ? "table-primary" : ""}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>@{user.username}</td>
                                    <td>{user.ratings}</td>
                                    <td>{user.brain_coins}</td>
                                    <td>{user.institute}</td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
