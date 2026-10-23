/**
 * WebRTC Teleconsultation Peer-to-Peer Service
 * Provides full audio/video conferencing, WebSocket signaling, screen sharing,
 * snapshot capture, and connection diagnostics.
 */

export interface TeleconsultMessage {
  id: string;
  sender: string;
  senderRole: 'doctor' | 'patient';
  text: string;
  timestamp: string;
}

export interface WebRTCCallbacks {
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onSignalingStateChange?: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onChatMessage?: (message: TeleconsultMessage) => void;
  onPeerJoined?: (peer: { id: string; role: string; name: string }) => void;
  onPeerLeft?: (peerId: string) => void;
  onError?: (error: string) => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private ws: WebSocket | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private originalVideoTrack: MediaStreamTrack | null = null;

  private roomId: string = '';
  private clientId: string = '';
  private userRole: 'doctor' | 'patient' = 'doctor';
  private userName: string = '';
  private callbacks: WebRTCCallbacks = {};

  private isInitiator: boolean = false;
  private isAudioMuted: boolean = false;
  private isVideoMuted: boolean = false;
  private simulatedAnimationId: number | null = null;

  private iceServers: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  constructor(callbacks: WebRTCCallbacks = {}) {
    this.callbacks = callbacks;
    this.clientId = 'peer_' + Math.random().toString(36).substring(2, 9);
  }

  public setCallbacks(callbacks: WebRTCCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Initializes local media and connects to the WebRTC signaling server
   */
  public async start(roomId: string, role: 'doctor' | 'patient', userName: string): Promise<MediaStream> {
    this.roomId = roomId;
    this.userRole = role;
    this.userName = userName;

    // 1. Get local audio/video stream (or synthetic fallback)
    const stream = await this.acquireLocalMedia();
    this.localStream = stream;
    this.callbacks.onLocalStream?.(stream);

    // 2. Connect to WebSocket signaling server
    this.connectSignaling();

    return stream;
  }

  /**
   * Acquire camera and mic stream with graceful synthetic fallback
   */
  private async acquireLocalMedia(): Promise<MediaStream> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        return stream;
      }
    } catch (err) {
      console.warn('Physical camera/mic access denied or unavailable, initializing clinical synthetic stream:', err);
    }

    // Fallback: create synthetic canvas video stream & audio oscillator for simulated/sandboxed environments
    return this.createSyntheticStream(this.userName, this.userRole);
  }

  /**
   * Generates a realistic synthetic video stream (e.g. for testing or when camera permission is restricted)
   */
  public createSyntheticStream(label: string, role: 'doctor' | 'patient'): MediaStream {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;

    let frame = 0;
    const draw = () => {
      frame++;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (role === 'doctor') {
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#0e7490');
      } else {
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#4338ca');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Avatar circle
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 30;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = role === 'doctor' ? '#06b6d4' : '#6366f1';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Avatar icon text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(role === 'doctor' ? '👨‍⚕️' : '🧑‍💼', cx, cy);

      // Vital pulse line (ECG simulation)
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      const pulseY = canvas.height - 70;
      for (let x = 20; x < canvas.width - 20; x += 3) {
        const offset = (x + frame * 3) % 200;
        let y = pulseY;
        if (offset > 80 && offset < 90) y -= (offset - 80) * 2;
        else if (offset >= 90 && offset < 100) y += (offset - 90) * 3;
        else if (offset >= 100 && offset < 110) y -= 15;
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Info banner
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(label || (role === 'doctor' ? 'Dr. Consultant' : 'Patient Remote'), cx, cy + 105);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`${role.toUpperCase()} TELECONSULTATION • LIVE STREAM`, cx, cy + 130);

      // Timestamp
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(new Date().toLocaleTimeString(), cx, canvas.height - 25);

      this.simulatedAnimationId = requestAnimationFrame(draw);
    };

    draw();

    const videoStream = canvas.captureStream(30);

    // Audio context for silent audio track
    let audioStream: MediaStream | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.0001; // virtually silent
        osc.connect(gainNode);
        const dst = audioCtx.createMediaStreamDestination();
        gainNode.connect(dst);
        osc.start();
        audioStream = dst.stream;
      }
    } catch {
      // Audio context might be restricted
    }

    const combined = new MediaStream();
    videoStream.getVideoTracks().forEach(t => combined.addTrack(t));
    if (audioStream) {
      audioStream.getAudioTracks().forEach(t => combined.addTrack(t));
    }

    return combined;
  }

  /**
   * Connects to WebSocket signaling server
   */
  private connectSignaling() {
    this.callbacks.onSignalingStateChange?.('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/webrtc`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.callbacks.onSignalingStateChange?.('connected');
        // Join the teleconsultation room
        this.sendMessage({
          type: 'join',
          roomId: this.roomId,
          clientId: this.clientId,
          role: this.userRole,
          name: this.userName,
        });
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleSignalingMessage(data);
        } catch (err) {
          console.error('Error handling incoming signaling packet:', err);
        }
      };

      this.ws.onclose = () => {
        this.callbacks.onSignalingStateChange?.('disconnected');
      };

      this.ws.onerror = (err) => {
        console.warn('Signaling WebSocket error:', err);
        this.callbacks.onSignalingStateChange?.('error');
      };
    } catch (err) {
      console.error('Failed to construct signaling WebSocket:', err);
      this.callbacks.onSignalingStateChange?.('error');
    }
  }

  /**
   * Handles WebRTC protocol exchange: joined, peer-joined, offer, answer, candidate, chat
   */
  private async handleSignalingMessage(data: any) {
    const { type } = data;

    switch (type) {
      case 'joined':
        // If there are existing peers in the room, initiate the WebRTC call
        if (data.peers && data.peers.length > 0) {
          this.isInitiator = true;
          await this.initiateCall();
        }
        break;

      case 'peer-joined':
        this.callbacks.onPeerJoined?.(data.peer);
        // We are the existing peer, wait for offer or initiate
        if (!this.peerConnection) {
          this.isInitiator = true;
          await this.initiateCall();
        }
        break;

      case 'peer-left':
        this.callbacks.onPeerLeft?.(data.peerId);
        this.closePeerConnection();
        break;

      case 'offer':
        await this.handleOffer(data.offer);
        break;

      case 'answer':
        await this.handleAnswer(data.answer);
        break;

      case 'candidate':
        await this.handleCandidate(data.candidate);
        break;

      case 'chat':
        this.callbacks.onChatMessage?.({
          id: data.id || Math.random().toString(),
          sender: data.senderName || data.senderRole,
          senderRole: data.senderRole,
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        break;

      default:
        break;
    }
  }

  /**
   * Initializes RTCPeerConnection instance with tracks and ICE listeners
   */
  private createPeerConnection() {
    if (this.peerConnection) return this.peerConnection;

    const pc = new RTCPeerConnection(this.iceServers);

    // Track state changes
    pc.onconnectionstatechange = () => {
      this.callbacks.onConnectionStateChange?.(pc.connectionState);
    };

    // Send ICE candidates to remote peer via signaling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage({
          type: 'candidate',
          roomId: this.roomId,
          candidate: event.candidate,
        });
      }
    };

    // Receive remote tracks
    pc.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
      this.remoteStream.addTrack(event.track);
      this.callbacks.onRemoteStream?.(this.remoteStream);
    };

    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection = pc;
    return pc;
  }

  /**
   * Initiator creates and sends SDP Offer
   */
  private async initiateCall() {
    try {
      const pc = this.createPeerConnection();
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);

      this.sendMessage({
        type: 'offer',
        roomId: this.roomId,
        offer,
      });
    } catch (err: any) {
      console.error('Failed to create/send WebRTC offer:', err);
      this.callbacks.onError?.(err?.message || 'Failed to initiate video call');
    }
  }

  /**
   * Receiver handles SDP Offer and responds with SDP Answer
   */
  private async handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      const pc = this.createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      this.sendMessage({
        type: 'answer',
        roomId: this.roomId,
        answer,
      });
    } catch (err: any) {
      console.error('Failed to handle offer and generate answer:', err);
      this.callbacks.onError?.(err?.message || 'Error negotiating WebRTC connection');
    }
  }

  /**
   * Handles SDP Answer from receiver
   */
  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (err: any) {
      console.error('Failed to set remote description answer:', err);
    }
  }

  /**
   * Adds received ICE candidate
   */
  private async handleCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (this.peerConnection && candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.warn('Failed to add received ICE candidate:', err);
    }
  }

  /**
   * Sends JSON payload over WebSocket signaling
   */
  private sendMessage(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  /**
   * Sends text chat message to peer
   */
  public sendChatMessage(text: string) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: TeleconsultMessage = {
      id: Math.random().toString(36).substring(7),
      sender: this.userName,
      senderRole: this.userRole,
      text,
      timestamp,
    };

    // Broadcast over WebSocket signaling
    this.sendMessage({
      type: 'chat',
      roomId: this.roomId,
      ...msg,
    });

    // Notify local callback
    this.callbacks.onChatMessage?.(msg);
  }

  /**
   * Toggles audio mute/unmute
   */
  public toggleAudio(): boolean {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        this.isAudioMuted = !this.isAudioMuted;
        audioTracks.forEach(t => (t.enabled = !this.isAudioMuted));
        return !this.isAudioMuted;
      }
    }
    return false;
  }

  /**
   * Toggles video on/off
   */
  public toggleVideo(): boolean {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        this.isVideoMuted = !this.isVideoMuted;
        videoTracks.forEach(t => (t.enabled = !this.isVideoMuted));
        return !this.isVideoMuted;
      }
    }
    return false;
  }

  /**
   * Starts desktop/screen sharing and replaces the video track on peer connection
   */
  public async startScreenShare(): Promise<MediaStream | null> {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('Screen sharing not supported by browser');
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      this.screenStream = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];

      if (this.peerConnection) {
        const senders = this.peerConnection.getSenders();
        const videoSender = senders.find(s => s.track && s.track.kind === 'video');
        if (videoSender) {
          this.originalVideoTrack = videoSender.track;
          await videoSender.replaceTrack(screenTrack);
        }
      }

      screenTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (err: any) {
      console.warn('Screen share canceled or failed:', err);
      return null;
    }
  }

  /**
   * Restores camera track from screen share
   */
  public async stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }

    if (this.peerConnection && this.originalVideoTrack) {
      const senders = this.peerConnection.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender) {
        await videoSender.replaceTrack(this.originalVideoTrack);
      }
      this.originalVideoTrack = null;
    }
  }

  /**
   * Takes a high-resolution snapshot from video element
   */
  public captureSnapshot(videoElement: HTMLVideoElement | null): string | null {
    if (!videoElement) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.92);
    } catch (err) {
      console.error('Error capturing video snapshot:', err);
      return null;
    }
  }

  /**
   * Connects an internal simulated remote peer for immediate single-browser teleconsultation testing
   */
  public simulateRemotePeer(patientName: string) {
    if (!this.remoteStream) {
      const simStream = this.createSyntheticStream(patientName, 'patient');
      this.remoteStream = simStream;
      this.callbacks.onRemoteStream?.(simStream);
      this.callbacks.onConnectionStateChange?.('connected');
      this.callbacks.onPeerJoined?.({
        id: 'sim_patient_1',
        role: 'patient',
        name: patientName,
      });

      // Send initial greeting in chat
      setTimeout(() => {
        this.callbacks.onChatMessage?.({
          id: 'sim_msg_1',
          sender: patientName,
          senderRole: 'patient',
          text: `Hello Doctor, I can see and hear you clearly. Ready for the follow-up.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 1200);
    }
  }

  private closePeerConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
  }

  /**
   * Clean shutdown of media streams, WebSockets, and peer connections
   */
  public stop() {
    if (this.simulatedAnimationId !== null) {
      cancelAnimationFrame(this.simulatedAnimationId);
      this.simulatedAnimationId = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }

    this.closePeerConnection();

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'leave',
          roomId: this.roomId,
        });
      }
      this.ws.close();
      this.ws = null;
    }
  }
}
