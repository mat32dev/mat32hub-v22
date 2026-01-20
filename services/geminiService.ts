import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from "@google/genai";

// Inicialización estricta siguiendo las guías
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const userRsvps = new Set<string>();

export const toggleRsvp = (eventTitle: string, isAttending: boolean) => {
  if (isAttending) userRsvps.add(eventTitle);
  else userRsvps.delete(eventTitle);
};

export const curateCommunityListings = async (rawText: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analista Mat32: Convierte este texto en JSON. 
      Campos: artist, title, condition (Mint, NM, VG+, VG), price (número), genre, description.
      Data: ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              artist: { type: Type.STRING },
              title: { type: Type.STRING },
              condition: { type: Type.STRING },
              price: { type: Type.NUMBER },
              genre: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["artist", "title", "condition", "price", "genre", "description"]
          }
        }
      }
    });
    // Uso correcto de .text como propiedad, no como método
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Sync Error:", error);
    return [];
  }
};

const getSystemInstruction = (language: 'en' | 'es') => `
You are the Bar Manager at "Mat32" Valencia. Professional, hi-fi expert, welcoming.
Venue: Discos Bar. Equipment: Altec, Klipsch La Scala, Rane Rotary.
Services: Events (Thu-Sat), Records, Venue Hire, Community Trade.
Respond in ${language === 'es' ? 'Spanish' : 'English'}.
`;

let chatSession: Chat | null = null;
let currentChatLang: 'en' | 'es' | null = null;

export const getChatSession = (language: 'en' | 'es'): Chat => {
  if (!chatSession || currentChatLang !== language) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { 
        systemInstruction: getSystemInstruction(language),
        temperature: 0.8,
      },
    });
    currentChatLang = language;
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, language: 'en' | 'es'): Promise<{text: string}> => {
  try {
    const chat = getChatSession(language);
    const context = userRsvps.size > 0 ? `[RSVPs: ${Array.from(userRsvps).join(', ')}] ` : "";
    const result: GenerateContentResponse = await chat.sendMessage({ message: context + message });
    return { text: result.text || "..." };
  } catch (error) {
    return { text: language === 'es' ? "Protocolo interrumpido. Inténtalo de nuevo." : "Signal lost. Please retry." };
  }
};

// AUDIO UTILS
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const connectLive = (callbacks: any, language: 'en' | 'es') => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: getSystemInstruction(language),
    },
  });
};