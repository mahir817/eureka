import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Using the existing endpoint structure found in oldLoginForm
            const response = await axios.get(`http://localhost:8081/users/login`, {
                params: {
                    username: username,
                    password: password
                }
            });

            if (response.status === 200) {
                // Successful login
                navigate('/home', { replace: true, state: { userName: username } });
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.status === 401) {
                setErrorMsg("Invalid username or password");
            } else {
                setErrorMsg("Login failed. Check backend connection.");
            }
        }
    };

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h6 className="section-title text-center text-primary text-uppercase">Login To Eureka</h6>
                    <h1 className="mb-5">Enter The <span className="text-primary text-uppercase">Quiz Arena</span></h1>
                </div>
                <div className="row g-5">
                    <div className="col-lg-6 offset-lg-3">
                        <div className="wow fadeInUp" data-wow-delay="0.2s">
                            <form onSubmit={handleLogin}>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="username">Username</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <div className="col-12 text-danger">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Login</button>
                                    </div>

                                    <div className="col-12 text-center">
                                        <Link to="/signup">Don't have an account? Register now!</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
