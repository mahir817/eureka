import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state;
    const userName = message['userName'];
    const buzzer = message['buzzer'];

    const toHome = () =>{
        navigate('/home', {replace : true , state:{ userName: userName }})
    }

    return (
        <>
            <div className="container-xxl py-5">
                <button onClick={toHome}>Home</button>
              <div className="container">
                  <div className="text-center wow fadeInUp" data-wow-delay="0.1s"
                      style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                      <h6 className="section-title text-center text-primary text-uppercase">
                          Buzzer: {buzzer['id']} 
                      </h6>
                      <h5>
                      {buzzer['category']} (<span className='text-primary'>{buzzer['difficulty']}</span> level)
                      </h5>
                      <br />
                      {(message['winner'] === 'draw') ?
                        <div className='mb-2'>
                        <h1>It's a 
                        <span className="text-primary text-uppercase"> Draw!!😯</span> </h1>
                        </div>
                       :
                      (message['winner'] === userName) ?
                           <div className='mb-2'>
                           <h1>{userName}
                           <span className="text-success text-uppercase"> Won!!✨</span> </h1>
                           </div>
                      : 
                           <div className='mb-2'>
                           <h1>{userName}
                           <span className="text-danger text-uppercase"> Lost😓</span> </h1>
                           </div>
                      }
                          
                      <br />
                  </div>
                    <div className="row g-4" id="target">
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.2s"
                          style={{visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp"}}>
                          <a className="service-item rounded">
                                  <h5 className="mb-3 text-white rounded mx-auto py-2 w-50 bg-secondary">Score: {message['player1Score']}</h5>
                              <div className="service-icon bg-transparent border rounded p-1">
                                  <div
                                      className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                      <i className="fa fa-user fa-2x text-primary"></i>
                                  </div>
                              </div>
                              <h5 className="mb-3 text-muted">{buzzer["player1"]['username']} (creator)</h5>
                              <h6 className="mb-3"> {buzzer["player1"]['profession']} @ {buzzer["player1"]['institute']}</h6>
                              <h5 className='py-2 rounded alert-danger'> Old Ratings - {message['player1RatingsOld']} <i className="fa fa-star text-light"></i></h5>
                              <h5 className='py-2 rounded alert-success mt-2'> New Ratings - {message['player1RatingsNew']} <i className="fa fa-star text-warning"></i></h5>
                          </a>
                      </div>

                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.2s"
                        style={{visibility: "visible", animationDelay: "0.1s", animationName: "fadeInUp"}}>
                        <a className="service-item rounded">
                            <h5 className="mb-3 text-white rounded mx-auto py-2 w-50 bg-secondary">Score: {message['player2Score']}</h5>
                            <div className="service-icon bg-transparent border rounded p-1">
                                  <div
                                      className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                                      <i className="fa fa-user fa-2x text-primary"></i>
                                  </div>
                            </div>
                            <h5 className="mb-3 text-muted">{buzzer["player2"]['username']}</h5>
                            <h6 className="mb-3"> {buzzer["player2"]['profession']} @ {buzzer["player2"]['institute']}</h6>
                            <h5 className='py-2 rounded alert-danger'> Old Ratings - {message['player2RatingsOld']} <i className="fa fa-star text-light"></i></h5>
                            <h5 className='py-2 rounded alert-success mt-2'> New Ratings - {message['player2RatingsNew']} <i className="fa fa-star text-warning"></i></h5>
                        </a>
                       </div>
                      
                  </div>
              </div>
          </div>
        </>
    );
}

export default Result;


    // "player1RatingsNew"
    // "player2RatingsNew"
    // "player1Score"
    // "player2Score"
    // "winner"
    // "EndedAt"
    // "buzzer_id"
    // "player1RatingsOld"
    // "player2RatingsOld"
