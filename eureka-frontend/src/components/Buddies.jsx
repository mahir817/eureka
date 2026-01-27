import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import WebSocketComponent from "./WebSocketComponent";

const Buddies = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [friends, setFriends] = useState([]);
    const [newFriendName, setNewFriendName] = useState("");
    const [notifications, setNotifications] = useState([]);

    // Buzzer creation state
    const [showCreate, setShowCreate] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [category, setCategory] = useState("Mixed"); // Default Mixed
    const [streamData, setStreamData] = useState({});
    const [selectedStream, setSelectedStream] = useState("Computer Science"); // Default to first?
    const [difficulty, setDifficulty] = useState("Easy");
    const [count, setCount] = useState(10);


    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        fetchFriends();

        const fetchStreams = async () => {
            const response = await axios.get(
                `http://localhost:8081/questions/streams`
            );
            const data = await response["data"];
            setStreamData(data);
            // set default stream
            if (Object.keys(data).length > 0) setSelectedStream(Object.keys(data)[0]);
        };
        fetchStreams();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/friends/${userName}`);
            setFriends(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const addFriend = async () => {
        if (!newFriendName) return;
        try {
            await axios.post(`http://localhost:8081/friends/add/${userName}/${newFriendName}`);
            alert("Friend added!");
            setNewFriendName("");
            fetchFriends();
        } catch (e) {
            alert(e.response?.data || "Error adding friend");
        }
    };

    const onMessageReceived = (message) => {
        // reuse notification logic or simplify
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

    const initiateBattle = (friend) => {
        setSelectedFriend(friend);
        setShowCreate(true);
    };

    const sendInvite = async () => {
        // Create buzzer first
        // Fix Category Logic here: pass empty string for Mixed if specific logic needed, or just %25
        let catToSend = category;
        if (category === "Mixed") catToSend = "%25";

        const response = await axios.get(`http://localhost:8081/buzzers/create/${userName}?categoryLike=${catToSend}&difficulty=${difficulty}&count=${count}&stream=${selectedStream}`);
        const buzzer = response.data;

        // Invite friend
        await axios.post(`http://localhost:8081/friends/invite/${userName}/${selectedFriend.username}/${buzzer.id}`);

        setShowCreate(false);
        // We should probably auto-join or wait?
        // Reuse join logic? The creator joins automatically as player1?
        // Wait, regular flow: create -> return buzzer. Buzzer has state ACTIVE? No wait..
        // Controller createBuzzer: sets state ACTIVE.

        // Wait, for standard game, after create, user waits.
        // onMessageReceived (msg["player1"] == userName) handles the "Waiting" message.
        // We can simulate that or just let WebSocket handle it.
        // The backend `createBuzzer` does NOT send a websocket message.
        // The `shareOnline` sends message to ALL.
        // `invite` sends message to FRIEND.

        // We need to navigate user to Waiting page?
        // usually Home.jsx doesn't navigate on create. It shows "Wait for opponent".
        // But here we want a clearer flow.

        // Let's manually trigger the "Waiting" notification or just alert user.
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
            {userName && (
                <WebSocketComponent
                    userName={userName}
                    onMessageReceived={onMessageReceived}
                    onGameJoined={onGameJoined}
                />
            )}
            <Header userName={userName} notifications={notifications} setNotifications={setNotifications} />

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
                    {friends.map(friend => (
                        <div className="col-md-4 mb-3" key={friend.username}>
                            <div className="card shadow-sm">
                                <div className="card-body text-center">
                                    <h5>{friend.name}</h5>
                                    <p className="text-muted">@{friend.username}</p>
                                    <p>{friend.profession} at {friend.institute}</p>
                                    <p>Rating: {friend.ratings}</p>
                                    <button className="btn btn-danger w-100" onClick={() => initiateBattle(friend)}>
                                        Battle <i className="fa fa-skull"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {friends.length === 0 && <p>No friends yet. Add some!</p>}
                </div>
            </div>

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
