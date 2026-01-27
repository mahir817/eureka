import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";


const Buddies = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [newFriendName, setNewFriendName] = useState("");
    const [notifications, setNotifications] = useState([]);

    // WebSocket Client
    const stompClientRef = useRef(null);

    // Battle State
    const [showCreate, setShowCreate] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [category, setCategory] = useState("Mixed");
    const [streamData, setStreamData] = useState({});
    const [selectedStream, setSelectedStream] = useState("Computer Science");
    const [difficulty, setDifficulty] = useState("Easy");
    const [count, setCount] = useState(10);


    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        fetchFriends();
        fetchRequests();

        const fetchStreams = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/questions/streams`);
                const data = response.data;
                setStreamData(data);
                if (Object.keys(data).length > 0) setSelectedStream(Object.keys(data)[0]);
            } catch (e) { console.error(e); }
        };
        fetchStreams();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/friends/${userName}`);
            setFriends(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/friends/requests/${userName}`);
            setRequests(res.data);
        } catch (e) { console.error(e); }
    };

    const addFriend = async () => {
        if (!newFriendName) return;
        try {
            await axios.post(`http://localhost:8081/friends/add/${userName}/${newFriendName}`);
            alert("Friend request sent!");
            setNewFriendName("");
            fetchFriends(); // Refresh friends in case auto-accept (backend default is PENDING now though)
        } catch (e) {
            alert(e.response?.data || "Error adding friend");
        }
    };

    const acceptRequest = async (sender) => {
        try {
            await axios.post(`http://localhost:8081/friends/accept/${userName}/${sender}`);
            fetchRequests();
            fetchFriends();
        } catch (e) { console.error(e); }
    }

    const onMessageReceived = (message) => {
        // Invitations
        const newNotif = {
            id: Date.now(),
            type: 'INVITE',
            data: message,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const onGameJoined = async (message) => {
        message["userName"] = userName;
        navigate("/waiting", { replace: true, state: message });
    };

    // WebSocket Client Handling
    const onClientAvailable = (client) => {
        stompClientRef.current = client;
    };

    // Poke Logic
    const pokeUser = async (friend) => {
        try {
            await axios.post('http://localhost:8081/notifications/poke', {
                sender: userName,
                recipient: friend.username
            });
            alert(`You poked ${friend.name}!`);
        } catch (e) {
            console.error(e);
            alert("Failed to poke.");
        }
    };

    // Battle Logic
    const initiateBattle = (friend) => {
        setSelectedFriend(friend);
        setShowCreate(true);
    };

    const sendInvite = async () => {
        let catToSend = category;
        if (category === "Mixed") catToSend = "%25";

        const response = await axios.get(`http://localhost:8081/buzzers/create/${userName}?categoryLike=${catToSend}&difficulty=${difficulty}&count=${count}&stream=${selectedStream}`);
        const buzzer = response.data;

        await axios.post(`http://localhost:8081/friends/invite/${userName}/${selectedFriend.username}/${buzzer.id}`);

        setShowCreate(false);
        const newNotif = {
            id: Date.now(),
            type: 'WAITING',
            text: `Invite sent to ${selectedFriend.username}! Wait for them to join.`,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    return (
        <>
            <Header
                userName={userName}
                notifications={notifications}
                setNotifications={setNotifications}
                onMessageReceived={onMessageReceived} // Header will call this
                onGameJoined={onGameJoined} // Header will call this
                onClientAvailable={onClientAvailable} // Header will pass client back
                onPrivateMessage={() => { }} // Ignored in Buddies now
            />

            <div className="container mt-5">
                <h2>Buddies</h2>
                <div className="d-flex mb-4">
                    <input
                        className="form-control w-50"
                        placeholder="Enter friend's username"
                        value={newFriendName}
                        onChange={e => setNewFriendName(e.target.value)}
                    />
                    <button className="btn btn-primary ms-2" onClick={addFriend}>Add Friend</button>
                </div>

                <div className="row">
                    {/* Friends Column */}
                    <div className="col-md-8">
                        <h4 className="border-bottom pb-2">My Friends</h4>
                        <div className="row mt-3">
                            {friends.map(friend => (
                                <div className="col-md-6 mb-3" key={friend.username}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="mb-0">{friend.name}</h5>
                                                <span className="badge bg-secondary">{friend.ratings}</span>
                                            </div>
                                            <p className="text-muted small mb-1">@{friend.username}</p>
                                            <p className="small">{friend.profession}</p>

                                            <div className="d-grid gap-2">
                                                <button className="btn btn-sm btn-danger" onClick={() => initiateBattle(friend)}>
                                                    Battle <i className="fa fa-skull"></i>
                                                </button>
                                                <button className="btn btn-sm btn-warning text-dark" onClick={() => pokeUser(friend)}>
                                                    Poke <i className="fa fa-hand-point-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {friends.length === 0 && <p className="text-muted">No friends yet.</p>}
                        </div>
                    </div>

                    {/* Requests Column */}
                    <div className="col-md-4">
                        <h4 className="border-bottom pb-2">Requests</h4>
                        <div className="mt-3">
                            {requests.map(req => (
                                <div className="card shadow-sm mb-3" key={req.username}>
                                    <div className="card-body p-3">
                                        <h6 className="mb-1">{req.name}</h6>
                                        <p className="text-muted small mb-2">@{req.username}</p>
                                        <button className="btn btn-sm btn-success w-100" onClick={() => acceptRequest(req.username)}>
                                            Accept Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {requests.length === 0 && <p className="text-muted">No pending requests.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Battle Modal */}
            {showCreate && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Battle with {selectedFriend?.name}</h5>
                                <button className="btn-close" onClick={() => setShowCreate(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Stream</label>
                                    <select className="form-select" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                                        {Object.keys(streamData).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Category</label>
                                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="Mixed">Mixed</option>
                                        {streamData[selectedStream]?.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Difficulty</label>
                                    <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Questions</label>
                                    <input type="number" className="form-control" value={count} onChange={e => setCount(e.target.value)} min="5" max="30" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={sendInvite}>Send Invite</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Buddies;
