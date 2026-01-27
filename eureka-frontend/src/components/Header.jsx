import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dropdown, Badge } from 'react-bootstrap';

const UserHeader = (props) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const userName = props.userName;
    const notifications = props.notifications || [];
    const setNotifications = props.setNotifications;

    useEffect(() => {
        if (!userName) navigate('/login', { replace: true });
    }, []);

    const joinBuzzer = (code, notifId) => {
        const join = async () => {
            await axios.get(
                `http://localhost:8081/buzzers/join/${code}/${userName}`
            );
        };
        join();
        // remove notification
        if (setNotifications) {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }
    };

    return (
        <>
            <div className="container-fluid bg-dark px-0">
                <div className="row gx-0">
                    <div className="col-lg-3 bg-dark d-none d-lg-block">
                        <a href="index.php" className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center">
                            <h1 className="m-0 text-primary text-uppercase">Eureka</h1>
                        </a>
                    </div>
                    <div className="col-lg-9">
                        <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
                            <a href="index.php" className="navbar-brand d-block d-lg-none">
                                <h1 className="m-0 text-primary text-uppercase">Eureka</h1>
                            </a>
                            <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                                <div className="navbar-nav mr-auto py-0">
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/home', { state: { userName: userName } })}>Home</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/questions', { state: { userName: userName } })}>Questions</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/practice', { state: { userName: userName } })}>Practice</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/buddies', { state: { userName: userName } })}>Buddies</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/leaderboard', { state: { userName: userName } })}>Leaderboard</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/streams', { state: { userName: userName } })}>Streams</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile', { state: { userName: userName } })}>Profile</a>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Dropdown className="me-3">
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="position-relative">
                                            <i className="fa fa-bell"></i>
                                            {notifications.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu align="end" style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <Dropdown.Item disabled>No new notifications</Dropdown.Item>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div key={notif.id} className="p-2 border-bottom">
                                                        {notif.type === 'WAITING' ? (
                                                            <div className="small text-muted">{notif.text}</div>
                                                        ) : (
                                                            <div>
                                                                <small>
                                                                    <b>{notif.data.player1}</b> ({notif.data.player1Profession})<br />
                                                                    has started a buzzer round.<br />
                                                                    Topic: {notif.data.category}
                                                                </small>
                                                                <button
                                                                    className="btn btn-sm btn-primary w-100 mt-1"
                                                                    onClick={() => joinBuzzer(notif.data.secretCode, notif.id)}
                                                                >
                                                                    Join
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <button className="btn btn-primary rounded-0 py-4 px-md-5 d-none d-lg-block" onClick={() => window.location.href = '/login'}>Logout<i className="fa fa-arrow-right ms-3"></i></button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserHeader;
