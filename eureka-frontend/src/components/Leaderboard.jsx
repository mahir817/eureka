import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const Leaderboard = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });

        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("http://localhost:8081/users/leaderboard");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard", error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <>
            <Header userName={userName} />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Universal Leaderboard</h2>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
