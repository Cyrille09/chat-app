import { useEffect, useRef } from "react";
import io from "socket.io-client";

const UseWebRTC = (roomId: string) => {
  const localStreamRef: any = useRef(null);
  const remoteStreamRef: any = useRef(null);
  const peerConnectionRef: any = useRef(null);
  const socketRef: any = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${process.env.baseUrl}`);

    const startWebRTC = async () => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      remoteStreamRef.current = new MediaStream();

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnectionRef.current.onicecandidate = (event: any) => {
        if (event.candidate) {
          socketRef.current.emit("candidate", roomId, event.candidate);
        }
      };

      peerConnectionRef.current.ontrack = (event: any) => {
        remoteStreamRef.current.addTrack(event.track);
      };

      localStreamRef.current.getTracks().forEach((track: any) => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });

      socketRef.current.emit("join-room", roomId);

      socketRef.current.on(
        "offer",
        async (socketId: string, description: any) => {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(description)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socketRef.current.emit("answer", roomId, answer);
        }
      );

      socketRef.current.on(
        "answer",
        async (socketId: string, description: any) => {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(description)
          );
        }
      );

      socketRef.current.on(
        "candidate",
        async (socketId: string, candidate: any) => {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error("Error adding received ice candidate", error);
          }
        }
      );

      socketRef.current.on("user-connected", async (socketId: string) => {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketRef.current.emit("offer", roomId, offer);
      });
    };

    startWebRTC();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  return { localStreamRef, remoteStreamRef };
};

export default UseWebRTC;
