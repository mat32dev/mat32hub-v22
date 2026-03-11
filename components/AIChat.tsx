
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Disc, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import { sendMessageToGemini, connectLive, encode, decode, decodeAudioData } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const AIChat: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveSessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    setMessages([{ role: 'model', text: t('chat.welcome') }]);
  }, [language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const response = await sendMessageToGemini(userMsg.text, language);
    setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    setIsLoading(false);
  };

  const startLiveSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const callbacks = {
        onopen: () => {
          setIsLive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e: any) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
            // Fix: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput` as per guidelines
            liveSessionPromiseRef.current?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          const audioBase64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64 && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            audioSourcesRef.current.add(source);
            source.onended = () => audioSourcesRef.current.delete(source);
          }
          if (msg.serverContent?.interrupted) {
            audioSourcesRef.current.forEach(s => s.stop());
            audioSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsLive(false),
        onerror: (e: any) => console.error("Live Error", e)
      };

      liveSessionPromiseRef.current = connectLive(callbacks, language);
    } catch (e) {
      console.error("Failed to start live session", e);
      alert("Microphone access is required for Voice Mode.");
    }
  };

  const stopLiveSession = () => {
    // Fix: Close session using resolved promise to ensure clean resource release
    liveSessionPromiseRef.current?.then(session => session.close());
    setIsLive(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-[400px] h-[550px] bg-mat-800 border border-mat-700 shadow-2xl flex flex-col overflow-hidden animate-fade-in rounded-[2.5rem]">
          <div className="bg-mat-900 p-6 border-b-2 border-mat-500 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-mat-800 border-2 border-mat-700 flex items-center justify-center rounded-full ${isLive ? 'border-mat-500 animate-pulse' : ''}`}>
                <Disc className={`w-6 h-6 text-mat-500 ${isLive || isLoading ? 'animate-spin-slow' : ''}`} />
              </div>
              <div>
                 <h3 className="font-black text-mat-cream uppercase tracking-widest text-[10px]">Mat32 Assistant</h3>
                 <span className="text-[8px] text-mat-500 flex items-center gap-1 uppercase font-black">
                   <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-mat-700'}`}></span>
                   {isLive ? 'Voice Protocol Active' : 'Online'}
                 </span>
              </div>
            </div>
            <button onClick={() => { stopLiveSession(); setIsOpen(false); }} className="text-gray-500 hover:text-mat-cream transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#141211]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-mat-500 text-white rounded-[1.5rem] rounded-tr-none shadow-lg font-bold' 
                    : 'bg-mat-800 text-gray-200 border border-mat-700 rounded-[1.5rem] rounded-tl-none shadow-xl font-light italic'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLive && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 rounded-full text-mat-500 font-black text-[9px] uppercase tracking-widest animate-pulse">
                   <Volume2 className="w-4 h-4" /> Real-time Streaming...
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-mat-800 border border-mat-700 p-4 rounded-xl rounded-tl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-mat-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-mat-900 border-t border-mat-800 flex items-center gap-4">
            <button 
              onClick={isLive ? stopLiveSession : startLiveSession}
              className={`p-4 rounded-2xl transition-all shadow-lg ${isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-mat-800 text-mat-500 border border-mat-700 hover:border-mat-500'}`}
              title="Voice Mode"
            >
              {isLive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to the Manager..."
                className="w-full bg-mat-800 text-mat-cream text-xs px-5 py-4 focus:outline-none border-2 border-mat-700 focus:border-mat-500 transition-all placeholder-gray-600 rounded-2xl"
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || isLive}
              className="p-4 bg-mat-500 hover:bg-mat-400 text-white disabled:opacity-30 transition-all rounded-2xl shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-mat-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-mat-400 transition-all hover:scale-110 border-4 border-mat-900 group"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};
