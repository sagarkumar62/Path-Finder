'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const rawUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanUrl = rawUrl.trim().replace(/\/+$/, '');
    const serverUrl = cleanUrl.replace(/\/api\/v1\/?$/, '');

    const socketInstance = io(serverUrl, {
      withCredentials: true,
      auth: { userId: user.id },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[SocketClient] Connected to server | Socket ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[SocketClient] Disconnected | Reason:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[SocketClient] Connection error:', error.message);
    });

    // Real-Time Progress Events & TanStack Query Invalidation
    const handleProgressEvent = (eventName: string, data: any) => {
      console.log(`[SocketClient] Real-time event received [${eventName}]:`, data);

      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['skill-gap'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    };

    const events = [
      'progress:updated',
      'progress:milestone-completed',
      'progress:milestone-started',
      'progress:phase-completed',
      'progress:summary-updated',
      'progress:skill-acquired',
    ];

    events.forEach((evt) => {
      socketInstance.on(evt, (data) => handleProgressEvent(evt, data));
    });

    setSocket(socketInstance);

    return () => {
      events.forEach((evt) => {
        socketInstance.off(evt);
      });
      socketInstance.disconnect();
    };
  }, [user, loading, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
