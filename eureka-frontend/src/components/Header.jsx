import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Dropdown } from 'react-bootstrap';
import WebSocketComponent from "./WebSocketComponent";

const UserHeader = (props) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate(); // eslint-disable-line
    const location = useLocation(); // eslint-disable-line
    const userName = props.userName;
    const notifications = props.notifications || [];
    const setNotifications = props.setNotifications;
    const stompClientRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!userName) navigate('/login', { replace: true });
    }, [userName, navigate]);

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
    }, [userName, setNotifications]);

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

            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-academia-charcoal/90 border-b border-dark-academia-gold/30 shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                    {/* Brand */}
                    <div
                        onClick={() => navigate('/home', { state: { userName: userName } })}
                        className="cursor-pointer flex items-center group"
                    >
                        <div className="w-10 h-10 border-2 border-dark-academia-gold rounded-full flex items-center justify-center mr-3 group-hover:bg-dark-academia-gold/20 transition-all duration-500">
                            <i className="fa fa-graduation-cap text-dark-academia-gold text-lg"></i>
                        </div>
                        <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-academia-gold tracking-widest uppercase m-0 group-hover:text-white transition-colors duration-300">
                            Eureka
                        </h1>
                    </div>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex space-x-8">
                        {['Home', 'Practice', 'Buddies', 'Leaderboard', 'Streams'].map((item) => (
                            <a
                                key={item}
                                onClick={() => navigate(`/${item.toLowerCase()}`, { state: { userName: userName } })}
                                className="text-gray-400 hover:text-dark-academia-gold font-sans text-sm font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dark-academia-gold transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">

                        {/* Notifications */}
                        <Dropdown>
                            <Dropdown.Toggle
                                as="div"
                                className="cursor-pointer relative text-dark-academia-gold hover:text-white transition-colors p-2"
                                id="dropdown-notif"
                            >
                                <i className="fa fa-bell text-xl"></i>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="end" className="bg-dark-academia-midnight border border-dark-academia-gold/30 shadow-glass rounded-lg mt-2 min-w-[320px] max-h-[400px] overflow-y-auto">
                                <div className="px-4 py-2 border-b border-white/10 text-dark-academia-gold font-serif text-sm">Notifications</div>
                                {notifications.length === 0 ? (
                                    <Dropdown.Item disabled className="text-gray-500 italic text-sm">No new missives</Dropdown.Item>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                            {notif.type === 'POKE' ? (
                                                <div>
                                                    <div className="flex items-center text-dark-academia-gold mb-1">
                                                        <i className="fa fa-hand-point-right mr-2"></i>
                                                        <span className="font-bold text-sm">Challenged!</span>
                                                    </div>
                                                    <div className="text-gray-300 text-xs font-sans leading-relaxed">{notif.text}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-gray-200 text-sm">{notif.data?.player1 || 'Opponent'}</span>
                                                        <span className="text-xs text-dark-academia-gold/70">Buzzer</span>
                                                    </div>
                                                    <div className="text-gray-400 text-xs mb-2">Has initiated a duel.</div>
                                                    {notif.data?.secretCode && (
                                                        <button
                                                            className="w-full py-1 bg-dark-academia-gold/90 hover:bg-dark-academia-gold text-black text-xs font-bold uppercase tracking-wider rounded transition-colors"
                                                            onClick={() => joinBuzzer(notif.data.secretCode, notif.id)}
                                                        >
                                                            Accept Duel
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* User Profile */}
                        <Dropdown>
                            <Dropdown.Toggle
                                as="div"
                                className="cursor-pointer flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                id="dropdown-user"
                            >
                                <div className="w-8 h-8 rounded-full border border-dark-academia-gold/50 flex items-center justify-center bg-white/5">
                                    <i className="fa fa-user text-dark-academia-gold text-sm"></i>
                                </div>
                                <span className="font-serif hidden md:inline-block">{userName}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="end" className="bg-dark-academia-midnight border border-dark-academia-gold/30 shadow-glass rounded-lg mt-2 w-48">
                                <Dropdown.Item
                                    className="text-gray-300 hover:bg-white/10 hover:text-dark-academia-gold px-4 py-2 transition-colors"
                                    onClick={() => navigate('/profile', { state: { userName: userName } })}
                                >
                                    <i className="fa fa-scroll mr-2 text-xs"></i> Profile
                                </Dropdown.Item>

                                {userName === 'mahir817' && (
                                    <Dropdown.Item
                                        className="text-gray-300 hover:bg-white/10 hover:text-dark-academia-gold px-4 py-2 transition-colors"
                                        onClick={() => navigate('/questions', { state: { userName: userName } })}
                                    >
                                        <i className="fa fa-feather-alt mr-2 text-xs"></i> Admin
                                    </Dropdown.Item>
                                )}

                                <div className="h-px bg-white/10 my-1"></div>

                                <Dropdown.Item
                                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300 px-4 py-2 transition-colors"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    <i className="fa fa-sign-out-alt mr-2 text-xs"></i> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-dark-academia-gold text-xl focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-dark-academia-midnight/95 backdrop-blur-xl border-b border-dark-academia-gold/30 shadow-2xl z-40 animate-fade-in-down">
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {['Home', 'Practice', 'Buddies', 'Leaderboard', 'Streams'].map((item) => (
                                <a
                                    key={item}
                                    onClick={() => {
                                        navigate(`/${item.toLowerCase()}`, { state: { userName: userName } });
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-dark-academia-gold font-sans text-lg font-bold tracking-widest uppercase cursor-pointer border-b border-white/5 pb-2"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}

export default UserHeader;
