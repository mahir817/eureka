import React, { useState, useEffect } from 'react';

const ChatBox = ({ socketClient, userName, buzzerId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (socketClient && socketClient.connected) {
            const subscription = socketClient.subscribe(`/all/chat/${buzzerId}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages(prev => [...prev, msg]);
            });
            return () => subscription.unsubscribe();
        }
    }, [socketClient, buzzerId]);

    const sendMessage = () => {
        if (input.trim() && socketClient && socketClient.connected) {
            const msg = { sender: userName, content: input, timestamp: new Date().toLocaleTimeString() };
            socketClient.send(`/app/chat/${buzzerId}`, {}, JSON.stringify(msg));
            setInput('');
        }
    };

    return (
        <div className="card shadow h-100">
            <div className="card-header bg-info text-white">
                <i className="fa fa-comments me-2"></i> Real-time Chat
            </div>
            <div className="card-body" style={{ height: '300px', overflowY: 'auto' }}>
                {messages.map((m, index) => (
                    <div key={index} className={`mb-2 ${m.sender === userName ? 'text-end' : 'text-start'}`}>
                        <div className={`d-inline-block p-2 rounded ${m.sender === userName ? 'bg-primary text-white' : 'bg-light border'}`}>
                            <small className="d-block text-muted" style={{ fontSize: '0.7em' }}>{m.sender} @ {m.timestamp}</small>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="card-footer">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
