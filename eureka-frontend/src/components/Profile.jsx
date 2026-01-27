import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [user, setUser] = useState({});

    // Edit State
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({});

    // Delete State
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/users/username/${userName}`
            );
            setUser(response.data);
            setEditData(response.data); // Initialize edit form
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8081/users/${user.id}`, editData);
            alert("Profile updated successfully!");
            setShowEdit(false);
            fetchUser();
        } catch (e) {
            alert("Error updating profile");
            console.error(e);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/users/${user.id}`);
            alert("Account deleted. Goodbye!");
            navigate("/login");
        } catch (e) {
            alert("Error deleting account");
            console.error(e);
        }
    };

    return (
        <>
            <Header userName={userName} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-lg mb-4">
                            <div className="card-header bg-primary text-white text-center py-4 position-relative">
                                <h2 className="mb-0">{user.name}</h2>
                                <p className="mb-0 text-white-50">@{user.username}</p>
                                <button className="btn btn-sm btn-light position-absolute top-0 end-0 m-3" onClick={() => setShowEdit(true)}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
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
                            </div>
                        </div>

                        {/* Analytics Section */}
                        <Analytics userName={userName} />

                        <div className="d-grid gap-2 mt-4 mb-5">
                            <button className="btn btn-outline-info" onClick={() => navigate('/buddies', { state: { userName: userName } })}>
                                View Buddies
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/leaderboard', { state: { userName: userName } })}>
                                Check Leaderboard
                            </button>
                            <button className="btn btn-outline-danger mt-3" onClick={() => setShowDelete(true)}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEdit && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button className="btn-close" onClick={() => setShowEdit(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Name</label>
                                    <input className="form-control" value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label>Profession</label>
                                    <input className="form-control" value={editData.profession || ''} onChange={e => setEditData({ ...editData, profession: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label>Institute</label>
                                    <input className="form-control" value={editData.institute || ''} onChange={e => setEditData({ ...editData, institute: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label>Stream</label>
                                    <input className="form-control" value={editData.stream || ''} onChange={e => setEditData({ ...editData, stream: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label>Graduation Year</label>
                                    <input className="form-control" type="number" value={editData.graduation_year || ''} onChange={e => setEditData({ ...editData, graduation_year: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDelete && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Delete Account</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowDelete(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete My Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;

const Analytics = ({ userName }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/buzzers/stats/${userName}`);
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, [userName]);

    if (!stats) return <div className="text-center p-3">Loading statistics...</div>;

    const winPercentage = stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;
    const lossPercentage = stats.totalGames > 0 ? (stats.losses / stats.totalGames) * 100 : 0;
    // Draw would be remainder, but let's just show win/loss pie for simplicity or Win/Loss/Draw bar which is easier with CSS

    return (
        <div className="card shadow-lg">
            <div className="card-header bg-dark text-white text-center py-3">
                <h4 className="mb-0">Performance Analytics</h4>
            </div>
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-5 text-center mb-3 mb-md-0">
                        <div className="position-relative d-inline-block" style={{ width: '150px', height: '150px' }}>
                            <div className="rounded-circle border border-5 border-light shadow-sm d-flex align-items-center justify-content-center"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: `conic-gradient(#28a745 ${winPercentage}%, #dc3545 ${winPercentage}% ${winPercentage + lossPercentage}%, #ffc107 ${winPercentage + lossPercentage}% 100%)`
                                }}>
                                <div className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center" style={{ width: '80%', height: '80%' }}>
                                    <h3 className="mb-0 fw-bold">{stats.winRate}%</h3>
                                    <small className="text-muted">Win Rate</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-light">
                                    <h4 className="fw-bold mb-0">{stats.totalGames}</h4>
                                    <small className="text-muted">Total Games</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-success text-white">
                                    <h4 className="fw-bold mb-0">{stats.wins}</h4>
                                    <small className="text-white-50">Wins</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-danger text-white">
                                    <h4 className="fw-bold mb-0">{stats.losses}</h4>
                                    <small className="text-white-50">Losses</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-warning text-dark">
                                    <h4 className="fw-bold mb-0">{stats.draws}</h4>
                                    <small className="text-black-50">Draws</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
