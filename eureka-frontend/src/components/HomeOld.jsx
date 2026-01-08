import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Carousel from "../img/carousel-1.jpg";
import Header from "./Header";
import { useRef } from "react";
import axios from "axios";
import Login from "./Login";
import WebSocketComponent from "./WebSocketComponent";

const Home = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = useState({});
  const userName = state?.userName;

  const [showNotification, setShowNotification] = useState(false);
  const [quizRequest, setQuizRequest] = useState({});
  const [gameState, setGameState] = useState({
    isCreator: false,
    buzzerStarted: false,
    buzzer: {},
    questions : [],
    qind : 0,
    qlen : 0
  });

  const startPageRef = useRef(null);
  const waitingPageRef = useRef(null);
  const MainPageRef = useRef(null);

  const visible = (ref) => {
    if (ref && ref.current && ref.current.style.display === "none")
    ref.current.style.display = "block";
  };
  const invisible = (ref) => {
    if (ref && ref.current && ref.current.style.display === "block")
    ref.current.style.display = "none";
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  const BeginBuzzer = async () =>{
    await axios.get(`http://localhost:8081/buzzers/begin/${gameState.buzzer['buzzer_id']}`);
  }

  const onMessageReceived = (message) => {
    if (message["player1"] == userName) {
      setGameState((prevState) => ({
        ...prevState,
        isCreator: true,
      }));
      console.log(gameState.isCreator);
      return;
    }
    setShowNotification(true);
    setQuizRequest(message);

    setTimeout(() => {
      setShowNotification(false);
    }, 20000);
  };

  const onGameJoined = async (message) => {
    await setGameState((prevState) => ({
      ...prevState,
      buzzerStarted: true,
      buzzer: message,
    }));
    console.log(message)
    if (message["player1"] == userName) visible(startPageRef);
    else visible(waitingPageRef);
  };

  const onGameBegan = (message) => {
    const fetchBuzzer = async () => {
      const response = await axios.get(
        `http://localhost:8081/buzzers/${message['buzzer_id']}`
      );
      const data = await response["data"];
      console.log(data);
      data["userName"] = userName;
      console.log(data);
      navigate("/quiz", {replace:true, state:data});
    };
    fetchBuzzer();
  };

  useEffect(() => {
    if (!userName) navigate("/login", { replace: true });
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:8081/users/username/${userName}`
      );
      const data = await response["data"];
      console.log(data);
      setUser(data);
    };
    fetchUser();
  }, []);

  return (
    <>
      {userName && (
        <WebSocketComponent
          userName={userName}
          onMessageReceived={onMessageReceived}
          onGameBegan={onGameBegan}
          onGameJoined={onGameJoined}
        />
      )}

      {!gameState.buzzerStarted && <Header userName={userName} />}

      {!gameState.buzzerStarted && (
        <div
          className="container-fluid page-header mb-5 p-0"
          style={{ backgroundImage: `url(${Carousel})` }}
        >
          <div className="container-fluid page-header-inner py-5">
            <div className="container text-center pb-5">
              <h1 className="display-3 text-white animated slideInDown">
                {user["name"]}
              </h1>
              <p className="text-white animated slideInDown">
                username: {user["username"]}
              </p>
              <h3 className="text-white animated slideInDown">
                {user["stream"]} {user["profession"]} from {user["institute"]} -{" "}
                {user["graduation_year"]} Batch{" "}
              </h3>
              <hr />
              <h2 className="text-white">Ratings: {user["ratings"]}</h2>
              <h2 className="text-white">Brain Coins: {user["brain_coins"]}</h2>
              <h2></h2>
            </div>
          </div>
        </div>
      )}

      <div ref={waitingPageRef} style={{ display: "none" }}>
      <div className="container-xxl py-5">
              <div className="container">
                  <div className="text-center wow fadeInUp" data-wow-delay="0.1s"
                      style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                      <h6 className="section-title text-center text-primary text-uppercase">
                          Buzzer Round ID: {gameState.buzzer['buzzer_id']}
                      </h6>
                      <br />
                      <h1 className="mb-5">
                          Take a look at your 
                          <span className="text-primary text-uppercase"> Opponent</span>
                      </h1>
                      <h3 className="text-muted">Wait for the creator to start! be ready for Buzzer quiz!</h3>
                      <br />
                  </div>
                    <div className="row g-4" id="target">
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s"
                          style={{visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp"}}>
                          <a className="service-item rounded">
                              <div className="service-icon bg-transparent border rounded p-1">
                                  <div
                                      className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                      <i className="fa fa-user fa-2x text-primary"></i>
                                  </div>
                              </div>
                              <h5 className="mb-3 text-muted">{gameState.buzzer["player1"]} (creator)</h5>
                              <h6 className="mb-3"> {gameState.buzzer["player1Profession"]} @ {gameState.buzzer["player1Institute"]}</h6>
                              <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {gameState.buzzer["player1Ratings"]}
                              </h5>
                              <p className="text-body mb-0">
                                    User {gameState.buzzer["player1"]}{" "}
                                    <b className="text-muted">
                                      ({gameState.buzzer["player1Profession"]} at{" "}
                                      {gameState.buzzer["player1Institute"]})
                                    </b>{" "}
                                    with ratings
                                    <b> {gameState.buzzer["player1Ratings"]}</b> 
                              </p>
                          </a>
                      </div>
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s"
                      style={{visibility: "visible", animationDelay: "0.4s", animationName: "fadeInUp"}}>
                      <a className="service-item rounded">
                          <h5>Rules And Instructions</h5>
                          <p className="alert-danger mb-0 mt-2">
                            <ul className="text-start mt-2">
                                <li>Don't refresh the screen during the buzzer round under any circumstances</li>
                                <li><b>Penalty</b> marking will be followed</li>
                            </ul>
                          </p>
                          <p className="alert-success mb-0 mt-2">
                            <ul className="text-start mt-2">
                                <li>The one who created the buzzer round can only start it</li>
                                <li>Whoever gives buzzer <b>first</b> will be considered for scoring</li>
                                <li>Score is dependant on the time taken to answer the question and each question can be answered by <b>any one</b> of the two players</li>
                                <li>Ranking will be calculated fairly using <b>Elo Algorithm</b></li>
                            </ul>
                          </p>
                      </a>
                      </div>
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.2s"
                      style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                      <a className="service-item rounded">
                          <div className="service-icon bg-transparent border rounded p-1">
                              <div
                                  className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                  <i className="fa fa-user fa-2x text-primary"></i>
                              </div>
                          </div>
                          <h5 className="mb-3 text-muted">{gameState.buzzer["player2"]}</h5>
                          <h6 className="mb-3"> {gameState.buzzer["player2Profession"]} @ {gameState.buzzer["player2Institute"]}</h6>
                          <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {gameState.buzzer["player2Ratings"]}
                          </h5>
                          <p className="text-body mb-0">
                                User {gameState.buzzer["player2"]}{" "}
                                <b className="text-muted">
                                  ({gameState.buzzer["player2Profession"]} at{" "}
                                  {gameState.buzzer["player2Institute"]})
                                </b>{" "}
                                with ratings
                                <b> {gameState.buzzer["player2Ratings"]}</b> 
                          </p>
                      </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div ref={startPageRef} style={{ display: "none" }}>
          <div className="container-xxl py-5">
              <div className="container">
                  <div className="text-center wow fadeInUp" data-wow-delay="0.1s"
                      style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                      <h6 className="section-title text-center text-primary text-uppercase">
                          Buzzer Round ID: {gameState.buzzer['buzzer_id']}
                      </h6>
                      <br />
                      <h1 className="mb-5">
                          Take a look at your 
                          <span className="text-primary text-uppercase"> Opponent</span>
                      </h1>
                  <button onClick={BeginBuzzer} className="btn btn-success col-md-12 text-center py-2 px-5 mt-2">START</button>
                      <br/>
                      <br/>

                  </div>
                    <div className="row g-4" id="target">
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s"
                          style={{visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp"}}>
                          <a className="service-item rounded">
                              <div className="service-icon bg-transparent border rounded p-1">
                                  <div
                                      className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                      <i className="fa fa-user fa-2x text-primary"></i>
                                  </div>
                              </div>
                              <h5 className="mb-3 text-muted">{gameState.buzzer["player1"]} (creator)</h5>
                              <h6 className="mb-3"> {gameState.buzzer["player1Profession"]} @ {gameState.buzzer["player1Institute"]}</h6>
                              <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {gameState.buzzer["player1Ratings"]}
                              </h5>
                              <p className="text-body mb-0">
                                    User {gameState.buzzer["player1"]}{" "}
                                    <b className="text-muted">
                                      ({gameState.buzzer["player1Profession"]} at{" "}
                                      {gameState.buzzer["player1Institute"]})
                                    </b>{" "}
                                    with ratings
                                    <b> {gameState.buzzer["player1Ratings"]}</b> 
                              </p>
                          </a>
                      </div>
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s"
                      style={{visibility: "visible", animationDelay: "0.4s", animationName: "fadeInUp"}}>
                      <a className="service-item rounded">
                          <h5>Rules And Instructions</h5>
                          <p className="alert-danger mb-0 mt-2">
                            <ul className="text-start mt-2">
                                <li>Don't refresh the screen during the buzzer round under any circumstances</li>
                                <li><b>Penalty</b> marking will be followed</li>
                            </ul>
                          </p>
                          <p className="alert-success mb-0 mt-2">
                            <ul className="text-start mt-2">
                                <li>The one who created the buzzer round can only start it</li>
                                <li>Whoever gives buzzer <b>first</b> will be considered for scoring</li>
                                <li>Score is dependant on the time taken to answer the question and each question can be answered by <b>any one</b> of the two players</li>
                                <li>Ranking will be calculated fairly using <b>Elo Algorithm</b></li>
                            </ul>
                          </p>
                      </a>
                      </div>
                      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.2s"
                      style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                      <a className="service-item rounded">
                          <div className="service-icon bg-transparent border rounded p-1">
                              <div
                                  className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                  <i className="fa fa-user fa-2x text-primary"></i>
                              </div>
                          </div>
                          <h5 className="mb-3 text-muted">{gameState.buzzer["player2"]}</h5>
                          <h6 className="mb-3"> {gameState.buzzer["player2Profession"]} @ {gameState.buzzer["player2Institute"]}</h6>
                          <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {gameState.buzzer["player2Ratings"]}
                          </h5>
                          <p className="text-body mb-0">
                                User {gameState.buzzer["player2"]}{" "}
                                <b className="text-muted">
                                  ({gameState.buzzer["player2Profession"]} at{" "}
                                  {gameState.buzzer["player2Institute"]})
                                </b>{" "}
                                with ratings
                                <b> {gameState.buzzer["player2Ratings"]}</b> 
                          </p>
                      </a>
                      </div>
                  </div>
                  <br/>
              </div>
          </div>
      </div>

      {!gameState.buzzerStarted && showNotification && (
        <Notification notification={quizRequest} userName={userName} />
      )}
    </>
  );
};

const Notification = (props) => {
  const notification = props.notification;
  const userName = props.userName;

  const joinBuzzer = () => {
    const buzzer_id = notification["buzzer_id"];
    const join = async () => {
      const response = await axios.get(
        `http://localhost:8081/buzzers/join/${buzzer_id}/${userName}`
      );
      const data = await response["data"];
      console.log(data);
    };
    join();
  };

  return (
    <>
      <div
        className="container-fluid booking pb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="bg-white shadow" style={{ padding: 35 + "px" }}>
            <div className="row g-2">
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-12">
                    <h6>
                      User {notification["player1"]}{" "}
                      <b className="text-muted">
                        ({notification["player1Profession"]} at{" "}
                        {notification["player1Institute"]})
                      </b>{" "}
                      with ratings
                      <b> {notification["player1Ratings"]}</b> has started a
                      buzzer round with
                      <span> {notification["count"]} questions</span> on topic
                      <b> {notification["category"]}</b> (
                      <span>{notification["difficulty"]} level</span>)
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={joinBuzzer}>
                  Click here to join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
