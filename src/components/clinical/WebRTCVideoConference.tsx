import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  Camera,
  MessageSquare,
  Maximize2,
  Minimize2,
  PhoneOff,
  Link,
  Check,
  Activity,
  Users,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { WebRTCService, TeleconsultMessage } from '../../services/webrtcService';
import { Patient, Doctor } from '../../types';

interface WebRTCVideoConferenceProps {
  roomId: string;
  patient: Patient;
  doctor: Doctor;
  onClose: () => void;
  onAddClinicalNote?: (note: string) => void;
  onAddClinicalImage?: (imageUrl: string, label: string) => void;
  initialMode?: 'docked' | 'pip' | 'fullscreen';
}

export const WebRTCVideoConference: React.FC<WebRTCVideoConferenceProps> = ({
  roomId,
  patient,
  doctor,
  onClose,
  onAddClinicalNote,
  onAddClinicalImage,
  initialMode = 'docked',
}) => {
  const [mode, setMode] = useState<'docked' | 'pip' | 'fullscreen'>(initialMode);
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);

  // Media states
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Connection and signaling states
  const [signalingStatus, setSignalingStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [peerConnectionState, setPeerConnectionState] = useState<RTCPeerConnectionState>('new');
  const [remotePeer, setRemotePeer] = useState<{ id: string; role: string; name: string } | null>(null);

  // Chat & Snapshots
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<TeleconsultMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);
  const [snapshotLabel, setSnapshotLabel] = useState('Patient clinical exam');
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedPatientActive, setSimulatedPatientActive] = useState(false);

  // DOM Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format call duration
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Initialize WebRTC service
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
        setPeerConnectionState(state);
      },
      onSignalingStateChange: (state) => {
        setSignalingStatus(state);
      },
      onChatMessage: (msg) => {
        setChatMessages(prev => [...prev, msg]);
      },
      onPeerJoined: (peer) => {
        setRemotePeer(peer);
      },
      onPeerLeft: () => {
        setRemotePeer(null);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      },
    });

    setWebrtcService(service);

    service.start(roomId, 'doctor', doctor.name).catch(err => {
      console.error('Failed to start WebRTC session:', err);
    });

    return () => {
      service.stop();
    };
  }, [roomId, doctor.name]);

  // Scroll chat to bottom when message arrives
  useEffect(() => {
    if (showChat) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

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

  const handleToggleScreenShare = async () => {
    if (!webrtcService) return;
    if (isScreenSharing) {
      await webrtcService.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      const stream = await webrtcService.startScreenShare();
      if (stream) {
        setIsScreenSharing(true);
      }
    }
  };

  const handleCaptureSnapshot = () => {
    if (webrtcService && remoteVideoRef.current) {
      const dataUrl = webrtcService.captureSnapshot(remoteVideoRef.current);
      if (dataUrl) {
        setSnapshotPreview(dataUrl);
        setSnapshotLabel(`Teleconsult exam snapshot - ${new Date().toLocaleTimeString()}`);
      }
    }
  };

  const handleSaveSnapshot = () => {
    if (snapshotPreview) {
      if (onAddClinicalImage) {
        onAddClinicalImage(snapshotPreview, snapshotLabel);
      }
      if (onAddClinicalNote) {
        onAddClinicalNote(`[Video Teleconsultation Snapshot] ${snapshotLabel}`);
      }
      setSnapshotPreview(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !webrtcService) return;
    webrtcService.sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const handleCopyPatientLink = () => {
    const patientUrl = `${window.location.origin}/?teleconsult=${encodeURIComponent(roomId)}&role=patient&patientId=${encodeURIComponent(patient.id)}`;
    navigator.clipboard.writeText(patientUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOpenPatientTab = () => {
    const patientUrl = `${window.location.origin}/?teleconsult=${encodeURIComponent(roomId)}&role=patient&patientId=${encodeURIComponent(patient.id)}`;
    window.open(patientUrl, '_blank');
  };

  const handleSimulatePatient = () => {
    if (webrtcService) {
      webrtcService.simulateRemotePeer(patient.name);
      setSimulatedPatientActive(true);
    }
  };

  // Connection badge helper
  const getConnectionBadge = () => {
    if (peerConnectionState === 'connected' || simulatedPatientActive) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>P2P Connected ({formatTime(callDuration)})</span>
        </span>
      );
    }
    if (signalingStatus === 'connected') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Waiting for Patient...</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-xs">
        <span className="w-2 h-2 rounded-full bg-rose-400" />
        <span>Connecting Signaling...</span>
      </span>
    );
  };

  // PiP mode container style
  if (mode === 'pip') {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
        <div className="relative aspect-video bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-2 right-2 w-24 h-16 object-cover rounded-lg border border-white/30 shadow-md"
          />
          <div className="absolute top-2 left-2 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white/90 drop-shadow-sm bg-black/40 px-1.5 py-0.5 rounded">
              {formatTime(callDuration)}
            </span>
          </div>
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <button
              onClick={() => setMode('docked')}
              className="p-1 rounded bg-black/60 hover:bg-black/90 text-white transition-colors"
              title="Expand to Docked Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              title="End Call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="p-2.5 bg-slate-900/95 flex items-center justify-between text-xs text-white">
          <div className="truncate">
            <p className="font-bold truncate text-slate-100">{patient.name}</p>
            <p className="text-[10px] text-slate-400">Remote Follow-Up Call</p>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleToggleAudio}
              className={`p-1.5 rounded-lg border transition-colors ${
                isAudioEnabled ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-rose-500 text-white border-rose-600'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleToggleVideo}
              className={`p-1.5 rounded-lg border transition-colors ${
                isVideoEnabled ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-rose-500 text-white border-rose-600'
              }`}
            >
              {isVideoEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCaptureSnapshot}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 transition-colors"
              title="Capture Clinical Snapshot"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen or Docked layout
  const isFullscreen = mode === 'fullscreen';

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col'
          : 'bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col mb-6'
      }
    >
      {/* Top Header bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                WebRTC Teleconsultation Room
              </h3>
              {getConnectionBadge()}
            </div>
            <p className="text-xs text-slate-400">
              Patient: <span className="text-slate-200 font-semibold">{patient.name}</span> ({patient.age}y, {patient.gender}) • Blood: {patient.bloodGroup}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center space-x-2">
          {/* Quick invite / simulation helper */}
          <button
            onClick={handleCopyPatientLink}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
            title="Copy patient direct follow-up link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Patient Link'}</span>
          </button>

          <button
            onClick={handleOpenPatientTab}
            className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 items-center space-x-1.5 transition-colors"
            title="Open patient portal in test tab to verify dual-stream P2P video"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Patient Tab</span>
          </button>

          {!remotePeer && !simulatedPatientActive && (
            <button
              onClick={handleSimulatePatient}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
              title="Instantly test teleconsultation video without a second device"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Patient</span>
            </button>
          )}

          {/* Mode Switchers */}
          <button
            onClick={() => setMode('pip')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Minimize to Picture-in-Picture"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMode(isFullscreen ? 'docked' : 'fullscreen')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold border border-rose-500 flex items-center space-x-1.5 transition-colors shadow-sm"
            title="End Video Consultation"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className={`relative flex-1 bg-black flex overflow-hidden ${isFullscreen ? 'min-h-[500px]' : 'h-[360px] sm:h-[420px]'}`}>
        {/* Remote Video Stream */}
        <div className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Overlay when waiting for remote peer */}
          {peerConnectionState !== 'connected' && !simulatedPatientActive && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Waiting for Patient to Connect...
              </h4>
              <p className="text-xs text-slate-300 max-w-md mb-4">
                Share the direct teleconsultation link with <span className="font-semibold text-cyan-300">{patient.name}</span>, or click below to simulate patient connection for instant testing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={handleCopyPatientLink}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
                >
                  <Link className="w-4 h-4" />
                  <span>{copiedLink ? 'Invite Copied!' : 'Copy Patient Invite Link'}</span>
                </button>
                <button
                  onClick={handleSimulatePatient}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Simulate Remote Patient</span>
                </button>
              </div>
            </div>
          )}

          {/* Remote Patient HUD info */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none flex flex-col space-y-1">
            <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center space-x-2 shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold">{patient.name}</span>
              <span className="text-[10px] text-slate-300 px-1.5 py-0.5 rounded bg-white/10">Remote</span>
            </div>
            {patient.chronicConditions && patient.chronicConditions.length > 0 && (
              <div className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-amber-300">
                ⚠️ {patient.chronicConditions.join(', ')}
              </div>
            )}
          </div>

          {/* Self Local Video overlay (PiP inside video container) */}
          <div className="absolute top-3 right-3 z-20 w-32 sm:w-44 aspect-video rounded-xl bg-slate-900 border-2 border-white/20 shadow-2xl overflow-hidden transition-transform hover:scale-105">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-slate-200 backdrop-blur-xs">
              You ({doctor.name.split(' ')[0]})
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center text-slate-400 text-[10px]">
                Camera Off
              </div>
            )}
          </div>
        </div>

        {/* In-Call Chat Sidebar */}
        {showChat && (
          <div className="w-72 sm:w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>In-Call Consultation Chat</span>
              </span>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No chat messages yet.<br />Send a note or instructions to the patient.
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl ${
                      msg.senderRole === 'doctor'
                        ? 'bg-cyan-950/70 border border-cyan-800/80 text-cyan-100 ml-4'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-200 mr-4'
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
                placeholder="Type a message or advice..."
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

      {/* Bottom Control Bar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Vital & Diagnostic indicators */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">Live Video Consultation</span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] font-mono text-cyan-400">{formatTime(callDuration)}</span>
        </div>

        {/* Center: Essential Call Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              isAudioEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
            }`}
            title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Video toggle */}
          <button
            onClick={handleToggleVideo}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              isVideoEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
            }`}
            title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* Screen share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen (Reports/Charts)'}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Clinical Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold border border-cyan-500/80 flex items-center space-x-1.5 transition-all shadow-md hover:shadow-cyan-500/20"
            title="Take a clinical examination photo of the patient stream"
          >
            <Camera className="w-4 h-4 text-cyan-200" />
            <span>Capture Snapshot</span>
          </button>

          {/* Chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              showChat
                ? 'bg-cyan-600 text-white border-cyan-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Toggle In-Call Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* End Call */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 transition-all shadow-md"
            title="End Video Call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Security & EMR tag */}
        <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted WebRTC P2P</span>
        </div>
      </div>

      {/* Snapshot Preview & Note Modal */}
      {snapshotPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Save Teleconsultation Examination Snapshot</span>
              </h4>
              <button
                onClick={() => setSnapshotPreview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={snapshotPreview}
                  alt="Clinical Snapshot"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Clinical Examination Note / Label
                </label>
                <input
                  type="text"
                  value={snapshotLabel}
                  onChange={e => setSnapshotLabel(e.target.value)}
                  placeholder="e.g. Throat inspection, rash on forearm, conjunctival pallor..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                This image will be appended directly to the patient's consultation record and clinical findings notes.
              </p>
            </div>
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setSnapshotPreview(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnapshot}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm"
              >
                Attach to Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
