import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  Activity,
  Send,
  Stethoscope,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { WebRTCService, TeleconsultMessage } from '../../services/webrtcService';

interface PatientTeleconsultViewProps {
  roomId: string;
  patientName?: string;
  onExit?: () => void;
}

export const PatientTeleconsultView: React.FC<PatientTeleconsultViewProps> = ({
  roomId,
  patientName = 'Patient',
  onExit,
}) => {
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [signalingStatus, setSignalingStatus] = useState<string>('connecting');

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<TeleconsultMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const service = new WebRTCService({
      onLocalStream: (stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
      onRemoteStream: (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      onConnectionStateChange: (state) => {
        setConnectionState(state);
      },
      onSignalingStateChange: (state) => {
        setSignalingStatus(state);
      },
      onChatMessage: (msg) => {
        setChatMessages(prev => [...prev, msg]);
      },
      onPeerLeft: () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      },
    });

    setWebrtcService(service);
    service.start(roomId, 'patient', patientName).catch(err => {
      console.error('Failed to start patient WebRTC session:', err);
    });

    return () => {
      service.stop();
    };
  }, [roomId, patientName]);

  const handleToggleAudio = () => {
    if (webrtcService) {
      const active = webrtcService.toggleAudio();
      setIsAudioEnabled(active);
    }
  };

  const handleToggleVideo = () => {
    if (webrtcService) {
      const active = webrtcService.toggleVideo();
      setIsVideoEnabled(active);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !webrtcService) return;
    webrtcService.sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              MediChamber • Patient Teleconsultation
            </h1>
            <p className="text-xs text-slate-400">
              Room: <span className="text-cyan-400 font-mono">{roomId}</span> • Follow-Up Video Call
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{connectionState === 'connected' ? `Live (${formatTime(callDuration)})` : 'Connecting to Doctor...'}</span>
          </div>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clinic</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Video Call Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Remote Doctor Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {connectionState !== 'connected' && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-900/50 border border-cyan-700 flex items-center justify-center text-cyan-300 mb-3 animate-pulse">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Connecting with Doctor...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Please make sure your camera and microphone are allowed. The doctor will appear here automatically.
              </p>
            </div>
          )}

          {/* Local Patient Video Floating */}
          <div className="absolute bottom-4 right-4 w-36 sm:w-48 aspect-video rounded-xl bg-slate-900 border-2 border-white/20 shadow-2xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-slate-200">
              You ({patientName})
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center text-slate-400 text-xs">
                Camera Off
              </div>
            )}
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Doctor Consultation Chat</span>
              </span>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No messages yet. Chat messages from your doctor will appear here.
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl ${
                      msg.senderRole === 'patient'
                        ? 'bg-cyan-950 border border-cyan-800 text-cyan-100 ml-4'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-300">{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="break-words leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={chatBottomRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-800 flex space-x-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message to your doctor..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <footer className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure End-to-End Encrypted Consultation</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleAudio}
            className={`p-3 rounded-xl border transition-all ${
              isAudioEnabled ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-xl border transition-all ${
              isVideoEnabled ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-xl border transition-all ${
              showChat ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 border border-rose-500 shadow-md"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Consultation</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Duration: <span className="text-white font-mono">{formatTime(callDuration)}</span>
        </div>
      </footer>
    </div>
  );
};
