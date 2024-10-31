import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useConnectAndHoldSocket(url: string, path: string, query: Record<string, string>) {
  const socketRef = useRef(
    io(`${url}`, {
      autoConnect: false,
      path,
      query,
      transports: ['websocket'],
      reconnection: false,
    }),
  );

  useEffect(() => {
    const socket = socketRef.current;
    socket.connect();

    // ping with server, if not responded disconnect and then
    // retry another connection
    async function ping() {
      try {
        await socket.timeout(1500).emitWithAck('ping');
      } catch (e) {
        console.error(e);
        socket.disconnect();
        socket.connect();
      }
    }

    const handle = setInterval(ping, 5000);

    return () => {
      clearInterval(handle);
      socket.disconnect();
      console.debug('socket cleaned up');
    };
  }, []);

  return socketRef;
}
