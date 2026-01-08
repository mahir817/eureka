import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import QuizSocketComponent from './QuizSocketComponent';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buzzer = location.state;
  const userName = buzzer['userName'];
  const player1 = buzzer['player1'];
  const player2 = buzzer['player2'];
  const questions = buzzer['questions'];
  const questionsLength = buzzer['questions'].length;
  const TimeForEachQuestion = 30;
  
  const [buzzerMsg, setBuzzerMsg] = useState({});
  const [showBuzzerMsg, setShowBuzzerMsg] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TimeForEachQuestion); 
  const timelineWidth = (timeLeft / TimeForEachQuestion) * 100 + "%";

  const[player1Score, setPlayer1Score] = useState(0);
  const[player2Score, setPlayer2Score] = useState(0);
  const[questionIndex, setQuestionIndex] = useState(0);

  const onGameBuzzered = (message) =>{
    console.log(message);
    const msg = {};
    msg['at'] = message['buzzeredAt'];
    msg['by'] = message['buzzeredBy'];
    msg['score'] = message['score'];
    msg['correct'] = message['correct'];
    msg['userName'] = userName;

    setBuzzerMsg({msg});
    console.log(buzzerMsg);
    setShowBuzzerMsg(true);

    setPlayer1Score(message['player1Score']);
    setPlayer2Score(message['player2Score']);

    nextQuestion();

    setTimeout(() => {
      setShowBuzzerMsg(false);
    }, 2000);

  }

  const onGameResult = (message) =>{
    message['userName'] = userName;
    message['buzzer'] = buzzer;
    navigate("/result", {replace:true, state:message});
  }

  const BuzzerIt = async (optionText) => {
    const correct = (optionText === questions[questionIndex]['answer']);
    const score = timeLeft;
    await axios.post(`http://localhost:8081/buzzers/buzzer/${buzzer['id']}/${userName}?score=${score}&correct=${correct}&questionIndex=${questionIndex}`);
  }

  const nextQuestion = () => {
    const getResult = async () => {
        await axios.post(
            `http://localhost:8081/buzzers/result/${buzzer['id']}`
        );
    };
    console.log(questionIndex);
    if(questionIndex === (questionsLength-1)){
        getResult();
        return;
    }

    setQuestionIndex(prevQuestionIndex => {
        const newIndex = prevQuestionIndex + 1;
        if (newIndex === questionsLength) {
            getResult();
            return prevQuestionIndex; 
        }
        return newIndex;
    });
    

    setTimeLeft(TimeForEachQuestion);
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const passQuestion = async() => {
        await axios.post(`http://localhost:8081/buzzers/${buzzer['id']}/questionpassed/${questionIndex}`);
    }
    if (!timeLeft) {
        passQuestion();
        nextQuestion();
        return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);


  return (
    <>
    {userName && (
        <QuizSocketComponent
          userName={userName}
          onGameBuzzered={onGameBuzzered}
          onGameResult={onGameResult}
        />
    )}

    <div className="col-sm-2 wow fadeIn" data-wow-delay="0.1s" style={{position: 'absolute', top: 0, right: 0}}>
        <div className="border rounded p-1">
            <div className="border rounded text-center p-1">
                <i className="fa fa-clock fa-2x text-primary mb-1"></i>
                <h2 className="mb-1 text-dark">
                {timeLeft} </h2>
            </div>
        </div>
    </div>

    <div className="container-xxl py-5" id="donations">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h6 className="section-title text-center text-primary text-uppercase">{player1['username']} vs {player2['username']}</h6>
                    <h2 className="text-center">Question <span className="text-primary text-uppercase">{questionIndex + 1}</span></h2>
                </div>
            <div className="row g-4">
            <div className="col-lg-12 col-md-6">
                <div className="rounded shadow">
                    <div className="text-center p-4 mt-3">

                        {showBuzzerMsg && 
                            <p className={(
                                (buzzerMsg['msg']['by'] === userName && buzzerMsg['msg']['correct']==="correct") 
                                || 
                                (buzzerMsg['msg']['by'] != userName && buzzerMsg['msg']['correct']==="incorrect") 
                            ) ? "py-2 alert-success" : "py-2 alert-danger"}>
                                {(buzzerMsg['msg']['by']===buzzerMsg['msg']['userName']) ? "You" : buzzerMsg['msg']['by']} got it <b>{buzzerMsg['msg']['correct']}</b> for <b>{buzzerMsg['msg']['score']}</b> points at {buzzerMsg['msg']['at']}!!
                            </p>
                        }

                        <div className="d-flex justify-content-around  wow fadeInUp" data-wow-delay="0.1s">
                            <h6 className="fw-bold flex-grow-1 alert-success mx-3 px-3 py-2 me">{(userName === player1['username']) ? "Your " : player1['username']} Score : {player1Score}</h6>
                            <h6 className='fw-bold flex-grow-1 alert-success px-3 mx-3 py-2'>{(userName === player2['username']) ? "Your " : player2['username']} Score : {player2Score}</h6>
                        </div>
                    </div>
                </div>
            </div> 

          </div>
       </div>
       <br/> 
    <div className="row g-4">
        <div className="col-lg-12 col-md-6">
            <div className="rounded shadow">
                <div className='w-100 h-1' style={{height: 3+'px'}}>
                    <div className="h-100 bg-primary"
                        style={{ width: timelineWidth}}>
                    </div>
                </div>
                <div className='text-center p-4 mt-3 wow fadeInUp' data-wow-delay="0.1s">
                    <h3>{questions[questionIndex]['text']}</h3>
                </div>
            </div>
            <div className='container w-100 mt-5'>
                <div className='row mt-5'>
                    <div className='col-sm text-center'>
                        <button className="btn py-3 btn-primary w-100 animated slideInLeft"
                        onClick={() => BuzzerIt(questions[questionIndex]['options'][0])}>
                            {questions[questionIndex]['options'][0]}
                        </button>
                    </div>
                    <div className='col-sm text-center'>
                        <button className="btn py-3 btn-primary w-100 animated slideInRight"
                        onClick={() => BuzzerIt(questions[questionIndex]['options'][1])}>
                            {questions[questionIndex]['options'][1]}
                        </button>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-sm text-center'>
                        <button className="btn py-3 btn-primary w-100 animated slideInLeft"
                        onClick={() => BuzzerIt(questions[questionIndex]['options'][2])}>
                            {questions[questionIndex]['options'][2]}
                        </button>
                    </div>
                    <div className='col-sm text-center'>
                        <button className="btn py-3 btn-primary w-100 animated slideInRight"
                        onClick={() => BuzzerIt(questions[questionIndex]['options'][3])}>
                            {questions[questionIndex]['options'][3]} 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </>
  );
};


export default Quiz;
