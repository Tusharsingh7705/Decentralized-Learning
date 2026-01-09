// src/pages/learner/LearnerSessionRoom.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import axios from "axios";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
  FiUpload,
  FiClock,
  FiShare2,
  FiDownload,
  FiStar,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { motion } from "framer-motion";

/*
  LEARNER SESSION ROOM
  - Manual start (camera/mic permission)
  - Stopwatch timer
  - Notes + Chat restored
  - WebRTC: socket.io + simple-peer
*/

const SIGNALING_SERVER_URL =
  process.env.REACT_APP_SIGNALING_URL || "http://localhost:4000";
const ROOM_ID = "session-room-demo-123";
const SESSION_ID = "session-123";

export default function LearnerSessionRoom({ learner, provider }) {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState([
    { id: 1, title: "Session Slides", url: "#" },
  ]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [escrowStatus, setEscrowStatus] = useState("FUNDED");
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [providerFullscreen, setProviderFullscreen] = useState(false);

  // Stopwatch
  useEffect(() => {
    if (!sessionStarted) return;
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [sessionStarted]);

  // Socket.io connection
  useEffect(() => {
    async function init() {
      socketRef.current = io(SIGNALING_SERVER_URL, {
        transports: ["websocket"],
      });

      socketRef.current.on("chat-message", (msg) => {
        setChatMessages((m) => [...m, msg]);
      });

      socketRef.current.on("signal", ({ from, data }) => {
        if (peerRef.current) peerRef.current.signal(data);
      });

      socketRef.current.emit("join-room", {
        roomId: ROOM_ID,
        userId: learner?.id || "learner-demo",
      });

      socketRef.current.on("start-peer", ({ initiator }) => {
        if (sessionStarted) startPeer(initiator);
      });

      setConnected(true);
    }
    init();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      stopLocalStream();
      if (peerRef.current) peerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Peer setup
  const startPeer = useCallback((initiator = false) => {
    if (peerRef.current) peerRef.current.destroy();
    const p = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStreamRef.current,
    });

    p.on("signal", (data) => {
      socketRef.current.emit("signal", { roomId: ROOM_ID, data });
    });

    p.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });

    p.on("error", (err) => console.error("Peer error:", err));
    peerRef.current = p;
  }, []);

  // Manual Start
  async function startSession() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      setMicOn(true);
      setCamOn(true);
      setSessionStarted(true);
      startPeer(true);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("Please allow camera/microphone access and retry.");
    }
  }

  function stopSession() {
    stopLocalStream();
    if (peerRef.current) peerRef.current.destroy();
    setSessionStarted(false);
    setElapsedSeconds(0);
  }

  function toggleMic() {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    });
  }

  function toggleCam() {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setCamOn(t.enabled);
    });
  }

  async function startStopShare() {
    if (sharing) {
      const cam = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = cam.getVideoTracks()[0];
      peerReplaceTrack(videoTrack);
      localVideoRef.current.srcObject = cam;
      localStreamRef.current = cam;
      setSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        peerReplaceTrack(screenTrack);
        localVideoRef.current.srcObject = screenStream;
        localStreamRef.current = screenStream;
        setSharing(true);
        screenTrack.onended = async () => {
          const cam = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: micOn,
          });
          const videoTrack = cam.getVideoTracks()[0];
          peerReplaceTrack(videoTrack);
          localVideoRef.current.srcObject = cam;
          localStreamRef.current = cam;
          setSharing(false);
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  }

  function peerReplaceTrack(newTrack) {
    if (!peerRef.current) return;
    const pc = peerRef.current._pc;
    if (!pc) return;
    const senders = pc.getSenders();
    const videoSender = senders.find(
      (s) => s.track && s.track.kind === "video"
    );
    if (videoSender) videoSender.replaceTrack(newTrack);
    else pc.addTrack(newTrack, localStreamRef.current);
  }

  function toggleRecording() {
    if (recording) stopRecording();
    else startRecording();
  }

  function startRecording() {
    if (!localStreamRef.current && !remoteVideoRef.current?.srcObject) {
      alert("No media to record");
      return;
    }
    const streamToRecord =
      localStreamRef.current || remoteVideoRef.current.srcObject;
    const recorder = new MediaRecorder(streamToRecord, {
      mimeType: "video/webm; codecs=vp9",
    });
    const chunks = [];
    recorder.ondataavailable = (e) => e.data && chunks.push(e.data);
    recorder.onstop = () => console.log("recording finished");
    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setRecording(false);
  }

  function sendMessage() {
    if (!messageText.trim()) return;
    const msg = {
      id: Date.now(),
      from: learner?.name || "Learner",
      text: messageText.trim(),
      time: new Date().toISOString(),
    };
    socketRef.current.emit("chat-message", { roomId: ROOM_ID, msg });
    setChatMessages((m) => [...m, { ...msg, self: true }]);
    setMessageText("");
  }

  async function handleFileUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    try {
      const res = await axios.post("/api/uploads/resource", fd);
      const newRes = {
        id: Date.now(),
        title: f.name,
        url: res?.data?.url || "#",
      };
      setResources((r) => [...r, newRes]);
    } catch (err) {
      console.error("Upload failed", err);
      setResources((r) => [...r, { id: Date.now(), title: f.name, url: "#" }]);
    }
  }

  async function releasePayment() {
    try {
      await axios.post(`/api/escrow/release`, { sessionId: SESSION_ID });
      setEscrowStatus("RELEASED");
    } catch {
      setEscrowStatus("DISPUTE");
    }
  }

  async function raiseDispute() {
    await axios.post(`/api/escrow/dispute`, { sessionId: SESSION_ID });
    setEscrowStatus("DISPUTE");
  }

  function stopLocalStream() {
    if (!localStreamRef.current) return;
    localStreamRef.current.getTracks().forEach((t) => t.stop());
  }

  function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  const fadeUp = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  };

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold">
            Live Session — {provider?.name || "Provider"}
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-3 items-center">
            <FiClock />
            <strong className={sessionStarted ? "text-green-600" : ""}>
              {formatTime(elapsedSeconds)}
            </strong>
            <span className="text-xs">
              {sessionStarted ? "(Running)" : "(Not Started)"}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800">
              {escrowStatus}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {!sessionStarted ? (
            <button
              onClick={startSession}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-semibold flex items-center gap-2"
            >
              <FiVideo /> Start Session
            </button>
          ) : (
            <>
              <button
                onClick={stopSession}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold flex items-center gap-2"
              >
                <FiPhoneOff /> End Session
              </button>
              <button
                onClick={() => setRatingOpen(true)}
                className="px-3 py-1 rounded-md bg-amber-400 text-amber-900 flex items-center gap-2"
              >
                <FiStar /> Rate
              </button>
              <button
                onClick={raiseDispute}
                className="px-3 py-1 rounded-md border border-red-400 text-red-500"
              >
                Raise Dispute
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-cols-3 gap-4 p-4">
        {/* Left side */}
        <section className="col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black rounded-lg overflow-hidden relative min-h-[240px]">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute left-3 bottom-3 bg-black/40 text-white px-3 py-1 rounded">
                {learner?.name || "You"}
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden relative min-h-[240px]">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute left-3 bottom-3 bg-black/40 text-white px-3 py-1 rounded">
                {provider?.name || "Provider"}
              </div>
              <button
                onClick={() => setProviderFullscreen(true)}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition"
                title="Expand to fullscreen"
              >
                <FiMaximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <motion.div {...fadeUp} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded shadow">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMic} 
                disabled={!sessionStarted} 
                className={`p-3 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-700 transition ${!sessionStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={micOn ? "Mute" : "Unmute"}
              >
                {micOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
              </button>
              <button 
                onClick={toggleCam} 
                disabled={!sessionStarted} 
                className={`p-3 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-700 transition ${!sessionStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={camOn ? "Turn off camera" : "Turn on camera"}
              >
                {camOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
              </button>
              <button 
                onClick={startStopShare} 
                disabled={!sessionStarted} 
                className={`px-4 py-3 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition ${!sessionStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <FiShare2 size={18} /> 
                <span className="text-sm font-medium">{sharing ? "Stop Share" : "Share Screen"}</span>
              </button>
              <button 
                onClick={toggleRecording} 
                disabled={!sessionStarted} 
                className={`px-4 py-3 rounded-md border transition ${recording ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-slate-50"} ${!sessionStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className="text-sm font-medium">{recording ? "⏹ Stop Recording" : "⏺ Record"}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Hourly Rate: <strong className="text-slate-900 dark:text-slate-100">{provider?.hourlyRate ?? "0.02 ETH"}</strong>
              </div>
              <button 
                onClick={releasePayment} 
                disabled={!sessionStarted} 
                className={`px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-medium transition ${!sessionStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Release Payment
              </button>
            </div>
          </motion.div>

          {/* Notes + Transcript - PERFECTLY ALIGNED */}
          <div className="grid grid-cols-2 gap-3">
            {/* Notes Box */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col max-h-[280px]">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <h4 className="font-semibold text-sm">Notes</h4>
              </div>
              <div className="flex-1 p-3 min-h-0">
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  className="w-full h-[120px] p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                  placeholder="Write session notes here..." 
                />
              </div>
              <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 flex-shrink-0">
                <button className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium">
                  Save
                </button>
                <button className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium">
                  Export
                </button>
              </div>
            </div>

            {/* Transcript Box */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col max-h-[280px]">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <h4 className="font-semibold text-sm">Transcript</h4>
              </div>
              <div className="flex-1 p-3 min-h-0 overflow-auto">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-300 space-y-1.5 h-full overflow-auto">
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">{provider?.name}:</strong> Welcome to your session...
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">{learner?.name}:</strong> Great! Let's begin.
                  </p>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 flex-shrink-0">
                <button className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1">
                  <FiDownload size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Chat & Resources */}
        <aside className="col-span-1 flex flex-col gap-4">
          {/* Chat */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded shadow flex flex-col h-[48%]">
            <h4 className="font-semibold mb-2">Chat</h4>
            <div className="flex-1 overflow-auto space-y-2 mb-2">
              {chatMessages.map((m) => (
                <div key={m.id} className={`p-2 rounded ${m.self ? "bg-indigo-50" : "bg-slate-100"}`}>
                  <div className="text-xs text-slate-500">
                    {m.from} • {new Date(m.time).toLocaleTimeString()}
                  </div>
                  <div className="mt-1">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 p-2 rounded border bg-transparent outline-none" placeholder="Type a message..." />
              <button onClick={sendMessage} className="px-3 py-2 rounded bg-indigo-600 text-white">
                Send
              </button>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded shadow flex flex-col h-[52%]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Resources</h4>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <FiUpload />
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <div className="flex-1 overflow-auto space-y-2">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-slate-500">Uploaded by Provider</div>
                  </div>
                  <a className="px-2 py-1 rounded border text-sm" href={r.url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Rating Modal */}
      {ratingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded p-6 w-[420px]">
            <h3 className="text-lg font-semibold mb-3">Rate your session</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className={`p-2 rounded ${rating >= n ? "bg-amber-400 text-amber-900" : "border"}`}>
                  {n} ★
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRatingOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={() => { setRatingOpen(false); alert(`You rated ${rating}★`); }} className="px-3 py-1 rounded bg-indigo-600 text-white">Submit</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Provider Fullscreen Modal */}
      {providerFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain"
            />
            <div className="absolute left-6 bottom-6 bg-black/60 text-white px-4 py-2 rounded-lg text-lg">
              {provider?.name || "Provider"}
            </div>
            <button
              onClick={() => setProviderFullscreen(false)}
              className="absolute top-6 right-6 p-3 bg-black/60 hover:bg-black/80 text-white rounded-lg transition flex items-center gap-2"
            >
              <FiMinimize2 size={24} />
              <span className="text-sm font-medium">Exit Fullscreen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
