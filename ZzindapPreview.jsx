import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

export default function ZzindapPreview() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState("연기");
  const [isCorrect, setIsCorrect] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [startTime] = useState(Date.now());

  const relatedWords = ["담배", "불", "냄새", "연기자", "흡연"];

  const getSimilarity = (input) => {
    if (input === answer) return 100;
    if (relatedWords.includes(input)) return 70 + Math.floor(Math.random() * 20);
    return Math.floor(Math.random() * 50);
  };

  const handleGuess = () => {
    if (!guess.trim()) return;

    const similarity = getSimilarity(guess);
    const isCorrectGuess = guess === answer;
    if (isCorrectGuess) setIsCorrect(true);

    setHistory((prev) => {
      const newEntry = { word: guess, similarity, order: prev.length + 1 };
      const newHistory = [newEntry, ...prev];
      return newHistory.sort((a, b) => b.similarity - a.similarity);
    });
    setGuess("");
  };

  const getMaxSimilarity = () => {
    return history.reduce((max, h) => (h.similarity > max ? h.similarity : max), 0);
  };

  const getTimeTaken = () => {
    const diff = Date.now() - startTime;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours.toString().padStart(2, "0")}시간${minutes
      .toString()
      .padStart(2, "0")}분${seconds.toString().padStart(2, "0")}초`;
  };

  return (
    <div className={\`min-h-screen p-6 transition-all duration-500 \${darkMode ? "bg-zinc-950 text-red-100" : "bg-yellow-50 text-zinc-800"}\`}>
      {isCorrect && <Confetti numberOfPieces={500} gravity={0.2} recycle={false} />}
      <div className="max-w-md mx-auto p-6 bg-zinc-900 border border-red-600 shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-red-400 drop-shadow">🧠 찐답</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 border rounded-full border-red-400 hover:bg-red-800"
          >
            {darkMode ? "☀️ 밝게" : "🌙 어둡게"}
          </button>
        </div>

        {isCorrect ? (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-300 text-xl font-bold mb-4">
              🎉 정답입니다! 오늘의 정답은 "{answer}" 🎉
            </p>
            <div className="text-sm text-red-200 bg-zinc-800 p-3 rounded border border-red-500">
              <p>1번째 찐답을 풀었습니다!</p>
              <p>추측 횟수: {history.length}</p>
              <p>소요 시간: {getTimeTaken()}</p>
              <p>최대 유사도: {getMaxSimilarity()}</p>
            </div>
          </motion.div>
        ) : (
          <>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              placeholder="정답을 입력하세요..."
              className="w-full border border-red-500 bg-zinc-800 text-white p-2 rounded mb-3"
            />
            <button
              onClick={handleGuess}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              추측!
            </button>
          </>
        )}

        <div className="mt-6 space-y-2">
          {history.map((entry, i) => (
            <p key={i} className="text-sm">
              <span className="text-red-300">#{entry.order}</span> 입력: <strong>{entry.word}</strong> — 유사도: <strong>{entry.similarity}</strong>
            </p>
          ))}
        </div>

        <p className="mt-6 text-xs text-red-300 italic">
          하루에 한 문제만 출제됩니다. 유사도를 단서 삼아 정답을 추리해보세요. 정답을 맞춰야 게임이 끝나요.
        </p>
      </div>
    </div>
  );
}