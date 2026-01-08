import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import WaitingSocketComponent from "./WaitingSocketComponent";
import ChatBox from "./ChatBox";

const Waiting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state;
  const userName = message['userName'];
  const buzzerId = message['buzzer_id'];
  const [socketClient, setSocketClient] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  const BeginBuzzer = async () => {
    await axios.get(`http://localhost:8081/buzzers/begin/${message['buzzer_id']}`);
  }


  const onGameBegan = (message) => {
    const fetchBuzzer = async () => {
      const response = await axios.get(
        `http://localhost:8081/buzzers/${buzzerId}`
      );
      const data = await response["data"];
      data["userName"] = userName;
      console.log(data);
      navigate("/quiz", { replace: true, state: data });
    };
    fetchBuzzer();
  };

  return (
    <>
      {userName && (
        <WaitingSocketComponent
          userName={userName}
          onGameBegan={onGameBegan}
          setSocketClient={setSocketClient}
        />
      )}

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s"
            style={{ visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp" }}>
            <h6 className="section-title text-center text-primary text-uppercase">
              Buzzer Round ID: {message['buzzer_id']}
            </h6>
            <br />
            <h1 className="mb-5">
              Take a look at your
              <span className="text-primary text-uppercase"> Opponent</span>
            </h1>

            {(userName === message["player1"]) ?
              <button onClick={BeginBuzzer} className="btn btn-success col-md-12 mb-5 text-center py-2 px-5 mt-2">START</button>
              :
              <h3 className="text-muted">Wait for the creator to start! be ready for Buzzer quiz!</h3>
            }

          </div>

          <div className="row mb-5">
            <div className="col-md-8 offset-md-2">
              <ChatBox socketClient={socketClient} userName={userName} buzzerId={buzzerId} />
            </div>
          </div>

          <div className="row g-4" id="target">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s"
              style={{ visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp" }}>
              <a className="service-item rounded">
                <div className="service-icon bg-transparent border rounded p-1">
                  <div
                    className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                    <i className="fa fa-user fa-2x text-primary"></i>
                  </div>
                </div>
                <h5 className="mb-3 text-muted">{message["player1"]} (creator)</h5>
                <h6 className="mb-3"> {message["player1Profession"]} @ {message["player1Institute"]}</h6>
                <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {message["player1Ratings"]}
                </h5>
                <p className="text-body mb-0">
                  User {message["player1"]}{" "}
                  <b className="text-muted">
                    ({message["player1Profession"]} at{" "}
                    {message["player1Institute"]})
                  </b>{" "}
                  with ratings
                  <b> {message["player1Ratings"]}</b>
                </p>
              </a>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s"
              style={{ visibility: "visible", animationDelay: "0.4s", animationName: "fadeInUp" }}>
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
              style={{ visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp" }}>
              <a className="service-item rounded">
                <div className="service-icon bg-transparent border rounded p-1">
                  <div
                    className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                    <i className="fa fa-user fa-2x text-primary"></i>
                  </div>
                </div>
                <h5 className="mb-3 text-muted">{message["player2"]}</h5>
                <h6 className="mb-3"> {message["player2Profession"]} @ {message["player2Institute"]}</h6>
                <h5> Ratings - <i className="fa fa-dollar-sign text-primary"></i> {message["player2Ratings"]}
                </h5>
                <p className="text-body mb-0">
                  User {message["player2"]}{" "}
                  <b className="text-muted">
                    ({message["player2Profession"]} at{" "}
                    {message["player2Institute"]})
                  </b>{" "}
                  with ratings
                  <b> {message["player2Ratings"]}</b>
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default Waiting;
