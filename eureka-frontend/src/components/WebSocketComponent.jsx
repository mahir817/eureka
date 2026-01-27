import { useEffect, useRef } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WebSocketComponent = ({ userName, onMessageReceived, onGameJoined, onClientAvailable, onPrivateMessage }) => {
  const alreadyConnectedRef = useRef(false);

  useEffect(() => {
    if (alreadyConnectedRef.current) return;

    const connect = () => {
      const socket = new SockJS('http://localhost:8081/websocket');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        if (onClientAvailable) onClientAvailable(stompClient);

        stompClient.subscribe('/all/messages', function (message) {
          console.log(message.body);
          if (onMessageReceived) onMessageReceived(JSON.parse(message.body));
        });

        // joined result buzzered began
        stompClient.subscribe(`/func/joined/${userName}`, function (message) {
          if (onGameJoined) onGameJoined(JSON.parse(message.body));
          console.log(message.body);
        });

        // Private Messaging
        stompClient.subscribe(`/topic/private/${userName}`, function (message) {
          console.log("Private msg:", message.body);
          if (onPrivateMessage) onPrivateMessage(JSON.parse(message.body));
        });


      });
    };
    connect();
    alreadyConnectedRef.current = true;
  }, []);

  return null;
};

export default WebSocketComponent;
