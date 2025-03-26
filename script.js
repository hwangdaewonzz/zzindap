
const today = new Date();
const day = today.getDate();
let answer = "";

if (day === 26) answer = "연기";
else if (day === 27) answer = "모래";
else {
  const pool = ["고양이", "커피", "게임", "학교", "무지개", "자전거"];
  const index = day % pool.length;
  answer = pool[index];
}

const relatedWords = {
  "연기": ["흡연", "불", "냄새", "연기자"],
  "모래": ["해변", "사막", "흙", "알갱이"]
};

function checkGuess() {
  const guess = document.getElementById("guess").value.trim();
  const status = document.getElementById("status");
  const history = document.getElementById("history");

  if (!guess) return;

  if (guess === answer) {
    status.innerText = `정답입니다! 오늘의 정답은 "${answer}"`;
  } else {
    let score = 0;
    if (relatedWords[answer]) {
      score = relatedWords[answer].includes(guess) ? 80 : Math.floor(Math.random() * 50);
    } else {
      score = Math.floor(Math.random() * 50);
    }

    const li = document.createElement("li");
    li.innerText = `입력한 단어: ${guess} - 유사도: ${score}`;
    history.prepend(li);
    status.innerText = `"${guess}"는 정답이 아닙니다.`;
  }

  document.getElementById("guess").value = "";
}
