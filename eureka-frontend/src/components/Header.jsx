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

    // Chat State
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatUser, setChatUser] = useState(null); // The user we are chatting with
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const stompClientRef = useRef(null);

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
        if (setNotifications) {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }
    };

    const handlePrivateMessage = (msg) => {
        // Msg structure: { sender: "...", content: "...", timestamp: "..." }
        // If we are in a game (Quiz/Waiting) or Buddies page (has own chat), don't pop up
        const isGame = location.pathname.includes('/quiz') ||
            location.pathname.includes('/waiting') ||
            location.pathname.includes('/buddies');

        if (isGame) return;

        if (chatUser === msg.sender && showChatModal) {
            // Already open with this user, just append
            setChatMessages(prev => [...prev, { sender: msg.sender, content: msg.content, type: 'received' }]);
        } else {
            // New chat or different user
            setChatUser(msg.sender);
            setChatMessages(prev => [...prev, { sender: msg.sender, content: msg.content, type: 'received' }]);
            setShowChatModal(true);
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !stompClientRef.current || !chatUser) return;

        const msg = {
            sender: userName,
            to: chatUser,
            content: messageInput,
            timestamp: new Date().toISOString()
        };

        stompClientRef.current.send("/app/chat.private", {}, JSON.stringify(msg));
        setChatMessages(prev => [...prev, { sender: userName, content: messageInput, type: 'sent' }]);
        setMessageInput("");
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

            {/* Global Chat Modal */}
            <Modal show={showChatModal} onHide={() => setShowChatModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chat with {chatUser}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="d-flex flex-column gap-2">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.type === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-2 rounded ${msg.type === 'sent' ? 'bg-primary text-white' : 'bg-light border'}`} style={{ maxWidth: '75%' }}>
                                    <small className="d-block fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                                        {msg.sender === userName ? 'You' : msg.sender}
                                    </small>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    />
                    <Button variant="primary" onClick={sendMessage}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserHeader;
