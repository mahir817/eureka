import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Dropdown, Badge, Modal, Button, Form } from 'react-bootstrap';
import WebSocketComponent from "./WebSocketComponent";

const UserHeader = (props) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const userName = props.userName;
    const notifications = props.notifications || [];
    const setNotifications = props.setNotifications;
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!userName) navigate('/login', { replace: true });
    }, []);

    // Load initial notifications from DB
    useEffect(() => {
        if (userName) {
            axios.get(`http://localhost:8081/notifications/${userName}`)
                .then(res => {
                    const mapped = res.data.map(n => ({
                        id: n.id,
                        type: n.type,
                        text: n.message,
                        data: n.data ? JSON.parse(n.data) : { sender: n.sender },
                        timestamp: n.timestamp
                    }));
                    if (setNotifications) setNotifications(mapped);
                })
                .catch(e => console.error("Failed to load notifications", e));
        }
    }, [userName]);

    const joinBuzzer = (code, notifId) => {
        const join = async () => {
            await axios.get(
                `http://localhost:8081/buzzers/join/${code}/${userName}`
            );
        };
        join();
        if (setNotifications) {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }
    };

    const handlePrivateMessage = (msg) => {
        if (props.onPrivateMessage) props.onPrivateMessage(msg);

        let newNotif = null;

        if (msg.type === 'POKE') {
            newNotif = {
                id: msg.id,
                type: 'POKE',
                text: msg.message,
                data: { sender: msg.sender },
                timestamp: msg.timestamp
            };
        } else if (msg.sender && msg.content) {
            // Legacy Chat Message - Ignore
            return;
        }

        if (newNotif && setNotifications) {
            setNotifications(prev => [newNotif, ...prev]);
        }
    };

    return (
        <>
            {userName && (
                <WebSocketComponent
                    userName={userName}
                    onClientAvailable={(client) => {
                        stompClientRef.current = client;
                        if (props.onClientAvailable) props.onClientAvailable(client);
                    }}
                    onMessageReceived={(msg) => {
                        if (props.onMessageReceived) props.onMessageReceived(msg);
                    }}
                    onGameJoined={(msg) => {
                        if (props.onGameJoined) props.onGameJoined(msg);
                    }}
                    onPrivateMessage={handlePrivateMessage}
                />
            )}

            <div className="container-fluid bg-dark px-0">
                <div className="row gx-0">
                    <div className="col-lg-3 bg-dark d-none d-lg-block">
                        <a onClick={() => navigate('/home', { state: { userName: userName } })} className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center" style={{ cursor: 'pointer' }}>
                            <h1 className="m-0 text-primary text-uppercase">Eureka</h1>
                        </a>
                    </div>
                    <div className="col-lg-9">
                        <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
                            <a onClick={() => navigate('/home', { state: { userName: userName } })} className="navbar-brand d-block d-lg-none" style={{ cursor: 'pointer' }}>
                                <h1 className="m-0 text-primary text-uppercase">Eureka</h1>
                            </a>
                            <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                                <div className="navbar-nav mr-auto py-0">
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/home', { state: { userName: userName } })}>Home</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/practice', { state: { userName: userName } })}>Practice</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/buddies', { state: { userName: userName } })}>Buddies</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/leaderboard', { state: { userName: userName } })}>Leaderboard</a>
                                    <a className="nav-item nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/streams', { state: { userName: userName } })}>Streams</a>
                                </div>
                                <div className="d-flex align-items-center">

                                    {/* Notifications Dropdown */}
                                    <Dropdown className="me-3">
                                        <Dropdown.Toggle variant="secondary" id="dropdown-notif" className="position-relative">
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
                                                        {notif.type === 'POKE' ? (
                                                            <div>
                                                                <small className="fw-bold text-warning"><i className="fa fa-hand-point-right"></i> Poke!</small>
                                                                <div className="text-muted small">{notif.text}</div>
                                                            </div>
                                                        ) : notif.type === 'WAITING' ? (
                                                            <div className="small text-muted">{notif.text}</div>
                                                        ) : (
                                                            <div>
                                                                <small>
                                                                    <b>{notif.data?.player1 || 'Someone'}</b><br />
                                                                    has started a buzzer round.<br />
                                                                </small>
                                                                {notif.data?.secretCode && (
                                                                    <button
                                                                        className="btn btn-sm btn-primary w-100 mt-1"
                                                                        onClick={() => joinBuzzer(notif.data.secretCode, notif.id)}
                                                                    >
                                                                        Join
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    {/* User Dropdown */}
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-user">
                                            <i className="fa fa-user me-2"></i> {userName}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item onClick={() => navigate('/profile', { state: { userName: userName } })}>
                                                Profile
                                            </Dropdown.Item>

                                            {userName === 'mahir817' && (
                                                <Dropdown.Item onClick={() => navigate('/questions', { state: { userName: userName } })}>
                                                    Questions (Admin)
                                                </Dropdown.Item>
                                            )}

                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => window.location.href = '/login'} className="text-danger">
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
