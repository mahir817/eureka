import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendToAll } from '../js/webSocket';
import axios from 'axios';
import WebSocketComponent from './WebSocketComponent';


const Home = () => {
    const [user, setUser] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();
    const userName = state?.userName;
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [count, setCount] = useState(10);

  useEffect(() => {
    if (!userName) navigate('/login', { replace: true });
    const fetchUser = async () => {
      const response = await axios.get(`http://localhost:8081/users/username/${userName}`);
      const data = await response['data'];
      setUser(data);
    };
    fetchUser();
  },[]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const handleSubmit = () => {
    const url = `http://localhost:8081/buzzers/create/${userName}?category=${category}&difficulty=${difficulty}&count=${count}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          console.log('Buzzer round created successfully');
        } else {
          console.log('Error creating buzzer round');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onMessageReceived = (message) => {
    console.log(message);
  };

  return (
    <>
      <div>
        <h2>Welcome {userName}!!</h2>
        <h3>User Info:</h3>
        <p>Name: {user.name}</p>
        <p>Profession: {user.profession}</p>
        <p>Graduation Year: {user.graduation_year}</p>
        <p>Institute: {user.institute}</p>
        <p>Stream: {user.stream}</p>
        <p>Ratings: {user.ratings}</p>
        <p>Brain Coins: {user.brain_coins}</p>
      </div>

      {userName && (
        <button onClick={() => sendToAll(userName, 'Hello from React!')}>
          Send message to all
        </button>
      )}

      {userName && (
        <WebSocketComponent userName={userName} onMessageReceived={onMessageReceived} />
      )}

        {userName && (
          <div>
            <h3>Create Buzzer Round:</h3>
              <div>
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                />
              </div>
              <div>
                <label htmlFor="difficulty">Difficulty:</label>
                <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label htmlFor="count">Count:</label>
                <input
                  type="number"
                  id="count"
                  value={count}
                  onChange={handleCountChange}
                />
              </div>
              <button onClick={handleSubmit}>Create</button>


              
          </div>
        )}

    </>
  );
};

export default Home;
