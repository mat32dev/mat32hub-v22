
import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from "@google/genai";

// Always initialize GoogleGenAI with a direct reference to process.env.API_KEY
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const userRsvps = new Set<string>();

export const toggleRsvp = (eventTitle: string, isAttending: boolean) => {
  if (isAttending) userRsvps.add(eventTitle);
  else userRsvps.delete(eventTitle);
};

export const curateCommunityListings = async (rawText: string): Promise<any[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analista Mat32: Convierte este texto en JSON para el marketplace de discos. 
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
    // Access the .text property directly from the response object
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

const getSystemInstruction = (language: 'en' | 'es') => `
You are the Bar Manager at "Mat32" Valencia (Calle Matías Perelló 32, Ruzafa). 
You are a high-fidelity expert. Your mission is to foster the local record community.
Venue: Discos Bar. Audio: Altec A7, Klipsch La Scala.
Focus areas: 
1. Marketplace/Trades: Encourage users to trade records in the Community tab using the term "Intercambio".
2. Events: Invite people to upcoming sessions.
3. Open Decks: Encourage DJs to submit their mixes.
Be welcoming, sophisticated, and local. Never use the word "cambalache", always use "intercambio".
Respond in ${language === 'es' ? 'Spanish' : 'English'}.
`;

let chatSession: Chat | null = null;
let currentChatLang: 'en' | 'es' | null = null;

export const getChatSession = (language: 'en' | 'es'): Chat => {
  const ai = getAI();
  if (!chatSession || currentChatLang !== language) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { 
        systemInstruction: getSystemInstruction(language),
        temperature: 0.7,
      },
    });
    currentChatLang = language;
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, language: 'en' | 'es'): Promise<{text: string}> => {
  if (!process.env.API_KEY) {
     return { text: language === 'es' ? "El Core está en modo offline. Por favor, contacta con el personal." : "The Core is in offline mode. Please contact the staff." };
  }
  try {
    const chat = getChatSession(language);
    const context = userRsvps.size > 0 ? `[User is attending: ${Array.from(userRsvps).join(', ')}] ` : "";
    // Send message through the active chat session and access result.text
    const result: GenerateContentResponse = await chat.sendMessage({ message: context + message });
    return { text: result.text || "Protocolo activo. ¿En qué puedo ayudarte?" };
  } catch (error) {
    // Force a session reset on error to ensure recovery on subsequent attempts
    chatSession = null;
    return { text: language === 'es' ? "Error de conexión con el Core. Inténtalo en un momento." : "Core connection error. Please try again." };
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

// Manual PCM audio decoding implementation following standard guidelines
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
  // Fresh GoogleGenAI instance for every Live connection to ensure updated API key usage
  const ai = getAI();
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
