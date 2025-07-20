document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const result = document.getElementById("result");
  const scoreBox = document.getElementById("score");
  const highScoreBox = document.getElementById("highScore");
  const playerNameInput = document.getElementById("playerName");
  const leaderboardList = document.getElementById("leaderboardList");

  let startTime = null;
  let running = false;
  let interval = null;
  let score = 0;
  let playerName = "";

  // הגדרת transition חלק לרקע הגוף
  document.body.style.transition = "background-color 1.5s ease";

  updateLeaderboard();

  startBtn.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
      alert("אנא הזן שם שחקן לפני תחילת המשחק.");
      return;
    }

    result.textContent = "";
    result.className = "";
    timerDisplay.textContent = "";

    stopBtn.disabled = true;
    startBtn.disabled = true;

    let countdown = 3;

    function showCountdown(num) {
      timerDisplay.textContent = num;
      timerDisplay.style.color = "#0078D4";
      timerDisplay.style.fontSize = "7em";
      timerDisplay.style.fontWeight = "bold";
      timerDisplay.style.transition = "transform 0.5s ease";
      timerDisplay.style.transform = "scale(1.5)";
      setTimeout(() => {
        timerDisplay.style.transform = "scale(1)";
      }, 400);
    }

    showCountdown(countdown);

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        showCountdown(countdown);
      } else {
        clearInterval(countdownInterval);
        timerDisplay.style.color = "#333";
        timerDisplay.style.fontSize = "5em";
        timerDisplay.style.fontWeight = "bold";
        timerDisplay.textContent = "0.00";

        stopBtn.disabled = false;

        startTime = Date.now();
        running = true;

        interval = setInterval(() => {
          const now = Date.now();
          const elapsed = ((now - startTime) / 1000).toFixed(2);
          timerDisplay.textContent = elapsed;
        }, 10);
      }
    }, 1000);
  });

  stopBtn.addEventListener("click", () => {
    if (!running) return;

    clearInterval(interval);
    running = false;

    const finalTime = parseFloat(timerDisplay.textContent);
    let points = 0;
    let bgColor = "";
    let resultTextColor = ""; // נבחר לפי מצב התוצאה

    if (finalTime === 10.00) {
      points = 100;
      result.textContent = "בול! 🎯 100 נקודות!";
      result.className = "success score-anim";
      bgColor = "#4CAF50"; // ירוק בהיר
      resultTextColor = "#2e7d32"; // ירוק כהה לטקסט
    } else if (finalTime > 10.00 && finalTime <= 10.75) {
      if (finalTime <= 10.25) {
        points = 50;
      } else if (finalTime <= 10.50) {
        points = 25;
      } else {
        points = 10;
      }
      result.textContent = `תוצאה: ${finalTime} שניות – ${points} נקודות`;
      result.className = "score-mid";
      bgColor = "#FFEB3B"; // צהוב
      resultTextColor = "#b37400"; // כתום כהה/צהוב לטקסט
    } else {
      result.textContent = `פספסת! ${finalTime} ❌`;
      result.className = "fail";
      bgColor = "#F44336"; // אדום
      resultTextColor = "#fff"; // לבן לטקסט על אדום
    }

    score += points;
    scoreBox.textContent = score;

    const bestScore = updatePlayerHighScore(playerName, score);
    highScoreBox.textContent = bestScore;
    updateLeaderboard();

    startBtn.disabled = false;
    stopBtn.disabled = true;

    document.body.style.backgroundColor = bgColor;
    result.style.color = resultTextColor;

    setTimeout(() => {
      document.body.style.backgroundColor = "#f0f0f0";
      setTimeout(() => {
        result.style.color = "#000";
      }, 500);
    }, 3000);
  });

  function updatePlayerHighScore(name, currentScore) {
    const saved = JSON.parse(localStorage.getItem("scores")) || {};
    if (!saved[name] || currentScore > saved[name]) {
      saved[name] = currentScore;
      localStorage.setItem("scores", JSON.stringify(saved));
    }
    return saved[name];
  }

  function updateLeaderboard() {
  const saved = JSON.parse(localStorage.getItem("scores")) || {};
  const sorted = Object.entries(saved).sort((a, b) => b[1] - a[1]);

  leaderboardList.innerHTML = "";
  sorted.forEach(([name, score], index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${name}: ${score} נק'`;
    leaderboardList.appendChild(li);
  });
}
});
