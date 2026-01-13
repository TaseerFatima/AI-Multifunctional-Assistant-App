import { useState } from 'react';
import { Languages, Volume2, BookOpen, Trophy, Target, Clock, Star, TrendingUp, Mic, MicOff } from 'lucide-react';
import { translateText } from '../../utils/mockAI';
import { useRAG } from '../../context/RAGContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
];

const phrases = [
  { en: 'Hello, how are you?', category: 'Greetings' },
  { en: 'Thank you very much', category: 'Politeness' },
  { en: 'Where is the nearest restaurant?', category: 'Directions' },
  { en: 'I need help, please', category: 'Emergency' },
  { en: 'How much does this cost?', category: 'Shopping' },
  { en: 'Can you speak slower?', category: 'Communication' },
  { en: 'What time is it?', category: 'Time' },
  { en: 'I would like to order food', category: 'Food' },
  { en: 'Where can I find a taxi?', category: 'Transportation' },
  { en: 'Nice to meet you', category: 'Social' }
];

const lessons = [
  { title: 'Basic Greetings', level: 'Beginner', duration: '10 min', progress: 100 },
  { title: 'Food & Dining', level: 'Beginner', duration: '15 min', progress: 75 },
  { title: 'Travel Phrases', level: 'Intermediate', duration: '20 min', progress: 50 },
  { title: 'Business Communication', level: 'Advanced', duration: '30 min', progress: 25 }
];

export default function LanguageTutor() {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [text, setText] = useState('Hello, how are you?');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [listening, setListening] = useState(false);
  
  const { addToKnowledgeBase } = useRAG();

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    // Simulate translation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const translated = translateText(text, fromLang, toLang);
    setTranslation(translated);
    
    // Add to knowledge base
    addToKnowledgeBase({
      title: `Translation: ${fromLang} → ${toLang}`,
      text: `${text}\n\n${translated}`,
      type: 'language',
      timestamp: new Date().toLocaleString(),
      tags: [fromLang, toLang, 'translation']
    });
    
    setLoading(false);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    setListening(true);
    // Mock listening
    setTimeout(() => {
      setListening(false);
      setUserAnswer('This is what I heard...');
    }, 2000);
  };

  const checkAnswer = () => {
    if (userAnswer.toLowerCase() === text.toLowerCase()) {
      setScore(score + 10);
      setStreak(streak + 1);
      alert('Correct! 🎉');
    } else {
      setStreak(0);
      alert('Try again!');
    }
  };

  const loadPhrase = (phrase: string) => {
    setText(phrase);
  };

  const getFromLangName = () => {
    return languages.find(l => l.code === fromLang)?.name || 'English';
  };

  const getToLangName = () => {
    return languages.find(l => l.code === toLang)?.name || 'Spanish';
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            From Language
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setFromLang(lang.code)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  fromLang === lang.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            To Language
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setToLang(lang.code)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  toLang === lang.code
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Text to Translate ({getFromLangName()})
            </label>
            <button
              onClick={() => handleSpeak(text, fromLang)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
            placeholder="Enter text to translate..."
          />
          
          {/* Quick Phrases */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quick Phrases
            </label>
            <div className="flex flex-wrap gap-2">
              {phrases.slice(0, 5).map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => loadPhrase(phrase.en)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
                >
                  {phrase.en.substring(0, 15)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Translation ({getToLangName()})
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeak(translation.split('\n')[0] || '', toLang)}
                disabled={!translation}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(translation.split('\n')[0] || '')}
                disabled={!translation}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="w-full h-48 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg overflow-auto">
            {translation ? (
              <div className="space-y-4">
                {translation.split('\n').map((line, index) => (
                  <div key={index} className={`${
                    index === 0 ? 'text-xl font-semibold text-white' :
                    index === 1 ? 'text-3xl font-bold text-green-400 my-4' :
                    'text-slate-300 text-sm'
                  }`}>
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Translation will appear here...
              </div>
            )}
          </div>
          
          {/* Translation Info */}
          {translation && (
            <div className="mt-4 p-3 bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Languages className="w-4 h-4" />
                {text.split(' ').length} words translated
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            loading || !text.trim()
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Translating...
            </>
          ) : (
            <>
              <Languages className="w-5 h-5" />
              Translate Now
            </>
          )}
        </button>
        
        <button
          onClick={() => setPracticeMode(!practiceMode)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            practiceMode
              ? 'bg-green-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <Target className="w-5 h-5" />
          {practiceMode ? 'Exit Practice' : 'Start Practice'}
        </button>
        
        <button
          onClick={startListening}
          disabled={listening}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {listening ? (
            <>
              <MicOff className="w-5 h-5" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Voice Input
            </>
          )}
        </button>
      </div>

      {/* Practice Mode */}
      {practiceMode && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Practice Mode</h3>
              <p className="text-slate-400 text-sm">Test your translation skills</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{score}</div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{streak}</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-400 mb-2">Translate this:</div>
              <div className="text-xl text-white">{text}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Answer ({getToLangName()})
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                placeholder="Type the translation..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={checkAnswer}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Check Answer
              </button>
              <button
                onClick={() => {
                  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                  loadPhrase(randomPhrase.en);
                  setUserAnswer('');
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                Next Phrase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress & Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Stats */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Your Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Vocabulary</span>
                <span className="text-green-500">65%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Grammar</span>
                <span className="text-blue-500">42%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Pronunciation</span>
                <span className="text-purple-500">78%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Current Level</span>
              </div>
              <span className="font-semibold text-blue-400">Intermediate</span>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">Recommended Lessons</h3>
          </div>
          
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{lesson.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    lesson.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    lesson.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {lesson.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {lesson.progress}%
                  </div>
                </div>
                
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    style={{ width: `${lesson.progress}%` }}
                  ></div>
                </div>
                
                <button className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                  {lesson.progress === 100 ? 'Review' : 'Continue'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}