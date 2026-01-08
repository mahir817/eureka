import { useEffect, useRef } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const QuizSocketComponent = ({ userName, onGameResult ,onGameBuzzered}) => {
  const alreadyConnectedRef = useRef(false);

  useEffect(() => {
    if (alreadyConnectedRef.current) return;

    const connect = () => {
      const socket = new SockJS('http://localhost:8081/websocket');
      const stompClient = Stomp.over(socket);
  
      stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);


        // joined result buzzered began
        stompClient.subscribe(`/func/result/${userName}`, function(message) {
          console.log(message.body);
          onGameResult(JSON.parse(message.body));
        });

        stompClient.subscribe(`/func/buzzered/${userName}`, function(message) {
          console.log(message.body);
          onGameBuzzered(JSON.parse(message.body));
        });
      });
    };
    connect();
    alreadyConnectedRef.current = true; 
  }, []);

  return null;
};

export default QuizSocketComponent;
