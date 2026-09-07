import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, AlertCircle, MessageSquare, Users } from 'lucide-react';

const CHARACTERS = [
  {
    id: 'peter',
    name: 'Peter Diamandis',
    title: 'Optimist & Exponential Tech Pioneer',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    philosophy: 'You are Peter Diamandis. You are extremely optimistic about the future. You love exponential technologies, space exploration, longevity, and creating an "Abundance" mindset. You strongly dislike scarcity thinking, pessimism, and linear progression. You often talk about Massive Transformative Purposes (MTPs) and XPRIZE.',
    intro: "Hey there! I'm Peter. We are living in the most extraordinary time in human history. Want to talk about abundance, space, or how exponential tech is solving our grand challenges?"
  },
  {
    id: 'dave',
    name: 'Dave Blundin',
    title: 'Serial Entrepreneur & Data Scientist',
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    philosophy: 'You are Dave Blundin. You are a highly analytical serial tech entrepreneur. You love data, machine learning, algorithms, and building massive, scalable platform companies. You dislike inefficiency, decisions made without empirical data, and stagnant business models. You are practical, numbers-driven, and strategic.',
    intro: "Hi, I'm Dave. I've spent my life building companies using AI and big data. What kind of complex systems or algorithms do you want to break down today?"
  },
  {
    id: 'salim',
    name: 'Salim Ismail',
    title: 'Exponential Organizations (ExO) Strategist',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    philosophy: 'You are Salim Ismail. You are the leading voice on Exponential Organizations (ExO). You love disruptive innovation, decentralized networks, and scaling organizations rapidly using information technologies. You heavily dislike rigid, linear corporate structures, bureaucracy, and legacy thinking.',
    intro: "Hello! I'm Salim. If you want to know how to scale a company 10x faster, better, and cheaper by tapping into exponential technologies, you're talking to the right person."
  },
  {
    id: 'alex',
    name: 'Alex Wissner-Gross',
    title: 'Physicist & AI Theorist',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    philosophy: 'You are Alex Wissner-Gross. You are a brilliant physicist and AI researcher. You love the intersection of physics and intelligence (specifically your equation F = T ∇ Sτ). You are fascinated by programmable matter, deep learning, and futuristic computational systems. You dislike unscientific, non-rigorous approaches to artificial intelligence.',
    intro: "Greetings. I'm Alex. My work bridges physics, computer science, and the fundamental equations that drive intelligence. What scientific or AI concepts would you like to explore?"
  },
  {
    id: 'emad',
    name: 'Emad Mostaque',
    title: 'Open-Source AI Champion',
    color: 'bg-rose-600',
    lightColor: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    philosophy: 'You are Emad Mostaque. You are a fierce champion of open-source AI. You love democratizing technology, community-driven models, and decentralizing power away from big tech monopolies. You strongly dislike closed-source models, walled gardens, and artificial limitations on human creativity.',
    intro: "Hey, Emad here. I believe AI should belong to everyone, not just a few massive corporations. Let's talk about open source, decentralization, and the future of generative AI."
  }
];

const PANEL_CHAR = {
  id: 'all',
  name: 'The Moonshots Visionary Panel',
  title: 'Ask all 5 visionaries at once',
  color: 'bg-amber-700',
  lightColor: 'bg-amber-50',
  border: 'border-amber-300',
  text: 'text-amber-800',
};

const CustomAvatar = ({ id }) => {
  switch (id) {
    case 'alex':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-purple-100 rounded-full">
          <rect x="15" y="70" width="70" height="40" fill="#1e3a8a" rx="20" /> 
          <polygon points="35,70 65,70 50,90" fill="#bae6fd" /> 
          <rect x="42" y="60" width="16" height="15" fill="#f5d0b5" /> 
          <ellipse cx="50" cy="42" rx="22" ry="26" fill="#f5d0b5" /> 
          <path d="M 28 35 Q 25 45 25 55 L 32 55 Q 32 45 30 35 Z" fill="#5a3b22" />
          <path d="M 72 35 Q 75 45 75 55 L 68 55 Q 68 45 70 35 Z" fill="#5a3b22" />
          <circle cx="42" cy="40" r="2.5" fill="#333" />
          <circle cx="58" cy="40" r="2.5" fill="#333" />
          <path d="M 41 51 Q 50 58 59 51" stroke="#333" strokeWidth="2.5" fill="none" />
          <path d="M 43 52 Q 50 56 57 52" stroke="#fff" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'dave':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-emerald-100 rounded-full">
          <rect x="20" y="70" width="60" height="40" fill="#3b82f6" rx="20" /> 
          <path d="M 30 70 L 30 100 M 40 70 L 40 100 M 50 70 L 50 100 M 60 70 L 60 100 M 70 70 L 70 100" stroke="#ef4444" strokeWidth="2" opacity="0.5"/>
          <path d="M 20 80 L 80 80 M 20 90 L 80 90" stroke="#ef4444" strokeWidth="2" opacity="0.5"/>
          <rect x="42" y="60" width="16" height="15" fill="#e8b796" />
          <ellipse cx="50" cy="42" rx="23" ry="25" fill="#e8b796" />
          <path d="M 27 40 Q 25 15 50 15 Q 75 15 73 40 Q 65 25 50 25 Q 35 25 27 40 Z" fill="#9ca3af" />
          <circle cx="42" cy="40" r="2.5" fill="#333" />
          <circle cx="58" cy="40" r="2.5" fill="#333" />
          <path d="M 40 51 Q 50 60 60 51" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M 42 53 Q 50 58 58 53" stroke="#fff" strokeWidth="3" fill="none" />
        </svg>
      );
    case 'salim':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-orange-100 rounded-full">
          <rect x="15" y="70" width="70" height="40" fill="#7dd3fc" rx="20" />
          <polygon points="40,70 60,70 50,85" fill="#ffffff" />
          <rect x="40" y="60" width="20" height="15" fill="#d99c78" />
          <ellipse cx="50" cy="42" rx="24" ry="26" fill="#d99c78" /> 
          <circle cx="41" cy="40" r="2.5" fill="#333" />
          <circle cx="59" cy="40" r="2.5" fill="#333" />
          <path d="M 40 52 Q 50 62 60 52" stroke="#333" strokeWidth="2.5" fill="none" />
          <path d="M 43 53 Q 50 59 57 53" stroke="#fff" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'peter':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-blue-100 rounded-full">
          <rect x="20" y="70" width="60" height="40" fill="#111827" rx="20" />
          <rect x="42" y="60" width="16" height="15" fill="#e0ac86" />
          <ellipse cx="50" cy="42" rx="22" ry="25" fill="#e0ac86" />
          <path d="M 28 40 Q 25 15 50 18 Q 75 15 72 40 Q 65 20 50 25 Q 35 20 28 40 Z" fill="#1f2937" />
          <circle cx="42" cy="41" r="2.5" fill="#333" />
          <circle cx="58" cy="41" r="2.5" fill="#333" />
          <path d="M 42 53 Q 50 57 58 53" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'emad':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-rose-100 rounded-full">
          <rect x="18" y="70" width="64" height="40" fill="#4b5563" rx="20" /> 
          <polygon points="42,70 58,70 50,85" fill="#000000" /> 
          <rect x="42" y="60" width="16" height="15" fill="#b07b57" />
          <ellipse cx="50" cy="44" rx="24" ry="25" fill="#b07b57" />
          <path d="M 24 45 Q 25 15 50 12 Q 75 15 76 45 Q 65 25 50 25 Q 35 25 24 45 Z" fill="#111827" />
          <path d="M 35 20 Q 40 30 50 25 Q 60 30 65 20 Z" fill="#111827" /> 
          <rect x="30" y="38" width="16" height="10" fill="none" stroke="#e5e7eb" strokeWidth="2" rx="2" />
          <rect x="54" y="38" width="16" height="10" fill="none" stroke="#e5e7eb" strokeWidth="2" rx="2" />
          <line x1="46" y1="43" x2="54" y2="43" stroke="#e5e7eb" strokeWidth="2" />
          <circle cx="38" cy="43" r="2" fill="#333" />
          <circle cx="62" cy="43" r="2" fill="#333" />
          <path d="M 44 56 Q 50 60 56 56" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return <div className="w-full h-full bg-gray-200 rounded-full"></div>;
  }
};

export default function App() {
  const [activeCharId, setActiveCharId] = useState('all');
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const activeChar = activeCharId === 'all' ? PANEL_CHAR : CHARACTERS.find(c => c.id === activeCharId);

  useEffect(() => {
    const initialMessages = {
      all: [{ role: 'model', text: "Welcome to the panel discussion! Ask a question here to get perspectives from all five visionaries at once.", charId: 'system' }]
    };
    CHARACTERS.forEach(char => {
      initialMessages[char.id] = [
        { role: 'model', text: char.intro }
      ];
    });
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeCharId]);

  const fetchWithRetry = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', text: inputText.trim() };
    const currentHistory = messages[activeCharId] || [];
    
    setMessages(prev => ({
      ...prev,
      [activeCharId]: [...currentHistory, userMessage]
    }));
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      // NOTE: Ensure your Vercel setup or backend securely provides the actual key.
      const apiKey = process.env.VITE_GEMINI_API_KEY || ""; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      
      if (activeCharId === 'all') {
        const fetchPromises = CHARACTERS.map(async (char) => {
          const contextContents = currentHistory
            .filter(msg => msg.role === 'user')
            .map(msg => ({ role: 'user', parts: [{ text: msg.text }] }));
            
          contextContents.push({ role: 'user', parts: [{ text: userMessage.text }] });

          const payload = {
            contents: contextContents,
            systemInstruction: {
              parts: [{ text: `${char.philosophy} Use the Google Search tool to find actual quotes, recent podcast transcripts, and up-to-date facts about your real-world counterpart's views on the user's topic before answering. Keep your answers conversational, engaging, highly opinionated based on your persona, and in the first person. Aim for 2 to 4 sentences maximum per response.` }]
            },
            tools: [{ googleSearch: {} }] // ADDED SEARCH GROUNDING
          };

          const data = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!responseText) throw new Error("Invalid response");

          return { role: 'model', text: responseText, charId: char.id };
        });

        const results = await Promise.allSettled(fetchPromises);
        const successfulResponses = results
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value);

        if (successfulResponses.length === 0) throw new Error("All panel responses failed.");

        setMessages(prev => ({
          ...prev,
          all: [...prev.all, ...successfulResponses]
        }));
      } else {
        const formattedContents = currentHistory.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));
        formattedContents.push({ role: 'user', parts: [{ text: userMessage.text }] });

        const payload = {
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: `${activeChar.philosophy} Use the Google Search tool to find actual quotes, recent podcast transcripts, and up-to-date facts about your real-world counterpart's views on the user's topic before answering. Keep your answers conversational, engaging, highly opinionated based on your persona, and in the first person. Aim for 2 to 4 sentences maximum per response.` }]
          },
          tools: [{ googleSearch: {} }] // ADDED SEARCH GROUNDING
        };

        const data = await fetchWithRetry(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (responseText) {
          setMessages(prev => ({
            ...prev,
            [activeCharId]: [...prev[activeCharId], { role: 'model', text: responseText }]
          }));
        } else {
          throw new Error("Invalid response structure from API.");
        }
      }

    } catch (err) {
      console.error(err);
      setError("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-stone-100 font-sans text-stone-800">
      
      {/* Sidebar - Character Selection */}
      <div className="w-80 bg-gradient-to-b from-[#2A241D] to-[#14100C] border-r border-[#4A3B2C] flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-[#4A3B2C]">
          <h1 className="text-xl font-black bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#92400E] text-transparent bg-clip-text flex items-center gap-2 drop-shadow-sm">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            The Moonshots Visionary Panel
          </h1>
          <p className="text-sm text-[#A89F91] mt-2">
            Talk to the AI avatars of leading tech visionaries about their philosophies.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button
            onClick={() => setActiveCharId('all')}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 text-left border-2
              ${activeCharId === 'all' 
                ? `border-[#D4AF37] bg-gradient-to-r from-[#3F3124] to-[#2A241D] shadow-[0_0_15px_rgba(212,175,55,0.15)] transform scale-[1.02]` 
                : 'border-transparent hover:bg-[#32281F] hover:shadow-sm'}`}
          >
            <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner bg-gradient-to-br from-[#D4AF37] to-[#92400E] text-white`}>
               <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm truncate ${activeCharId === 'all' ? 'text-[#FDE68A]' : 'text-[#D6D3D1]'}`}>
                {PANEL_CHAR.name}
              </h3>
              <p className="text-xs text-[#A89F91] line-clamp-2 mt-0.5 leading-snug">
                {PANEL_CHAR.title}
              </p>
            </div>
          </button>
          
          <div className="h-px bg-[#4A3B2C] my-2 w-full" />

          {CHARACTERS.map(char => (
            <button
              key={char.id}
              onClick={() => setActiveCharId(char.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 text-left border-2
                ${activeCharId === char.id 
                  ? `border-[#D4AF37] bg-gradient-to-r from-[#3F3124] to-[#2A241D] shadow-[0_0_15px_rgba(212,175,55,0.15)] transform scale-[1.02]` 
                  : 'border-transparent hover:bg-[#32281F] hover:shadow-sm'}`}
            >
              <div className={`w-14 h-14 rounded-full flex-shrink-0 shadow-inner ${char.color} p-1 overflow-hidden border border-[#524434]`}>
                 <CustomAvatar id={char.id} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm truncate ${activeCharId === char.id ? 'text-[#FDE68A]' : 'text-[#D6D3D1]'}`}>
                  {char.name}
                </h3>
                <p className="text-xs text-[#A89F91] line-clamp-2 mt-0.5 leading-snug">
                  {char.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#fdfaf6]">
        {/* Chat Header */}
        <div className={`p-6 border-b border-[#4A3B2C] bg-gradient-to-r from-[#2A241D] via-[#36291E] to-[#2A241D] flex items-center gap-4 shadow-md transition-colors duration-300`}>
          <div className={`w-16 h-16 rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.3)] ${activeCharId === 'all' ? 'bg-gradient-to-br from-[#D4AF37] to-[#92400E]' : activeChar.color} border-2 border-[#D4AF37] overflow-hidden flex items-center justify-center`}>
             {activeCharId === 'all' ? <Users className="w-8 h-8 text-white" /> : <CustomAvatar id={activeChar.id} />}
          </div>
          <div>
            <h2 className={`text-2xl font-black tracking-tight bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#92400E] text-transparent bg-clip-text drop-shadow-sm`}>
              {activeChar.name}
            </h2>
            <p className="text-sm font-medium text-[#C8BBAA]">
              {activeChar.title}
            </p>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {(messages[activeCharId] || []).map((msg, idx) => {
            const isModel = msg.role === 'model';
            const isSystem = msg.charId === 'system';
            const speakerChar = isModel && msg.charId && !isSystem ? CHARACTERS.find(c => c.id === msg.charId) : activeChar;
            
            return (
              <div key={idx} className={`flex ${isModel ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                {isModel && activeCharId === 'all' && !isSystem && speakerChar && (
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 shadow-sm border-2 border-white overflow-hidden ${speakerChar.color}`}>
                    <CustomAvatar id={speakerChar.id} />
                  </div>
                )}
                
                <div className={`max-w-[75%] rounded-3xl p-4 shadow-sm ${
                  isModel 
                    ? `bg-white border ${speakerChar?.border || activeChar.border} rounded-tl-none` 
                    : 'bg-amber-700 text-white rounded-tr-none'
                }`}>
                  {isModel && activeCharId === 'all' && !isSystem && speakerChar && (
                    <div className={`text-xs font-bold mb-1 ${speakerChar.text}`}>
                      {speakerChar.name}
                    </div>
                  )}
                  <p className={`text-sm md:text-base leading-relaxed ${isModel ? 'text-stone-800' : 'text-amber-50'}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`bg-white border ${activeChar.border} rounded-3xl rounded-tl-none p-4 shadow-sm flex items-center gap-2`}>
                <Loader2 className={`w-5 h-5 animate-spin ${activeChar.text}`} />
                <span className="text-sm text-stone-500">Thinking...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center my-4">
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeCharId === 'all' ? "Ask the panel a question..." : `Ask ${activeChar.name.split(' ')[0]} about their likes, dislikes, or philosophies...`}
              disabled={isLoading}
              className="w-full bg-white border-stone-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-full py-4 pl-6 pr-16 text-stone-800 shadow-inner transition-all duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`absolute right-2 p-3 rounded-full transition-all duration-200 flex items-center justify-center
                ${inputText.trim() && !isLoading 
                  ? `${activeChar.color} text-white shadow-md hover:scale-105` 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-stone-400 flex items-center justify-center gap-1">
            <MessageSquare className="w-3 h-3" /> Responses are AI-generated based on the public personas of the individuals.
          </div>
        </div>
      </div>
    </div>
  );
}