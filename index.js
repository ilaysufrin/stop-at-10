import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config שלך
const firebaseConfig = {
  apiKey: "AIzaSyA1ukAMPGUoiNKr3KoOLOuTdjwsvcCPkBg",
  authDomain: "stop-at-10-6ead4.firebaseapp.com",
  projectId: "stop-at-10-6ead4",
  storageBucket: "stop-at-10-6ead4.firebasestorage.app",
  messagingSenderId: "569877730994",
  appId: "1:569877730994:web:162deafdf31832ec1fdbab",
  measurementId: "G-VP3LQV865Q"
};

// התחברות ל-Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

  document.body.style.transition = "background-color 1.5s ease";

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

  stopBtn.addEventListener("click", async () => {
    if (!running) return;

    clearInterval(interval);
    running = false;

    const finalTime = parseFloat(timerDisplay.textContent);
    let points = 0;
    let bgColor = "";
    let resultTextColor = "";

    if (finalTime === 10.00) {
      points = 100;
      result.textContent = "בול! 🎯 100 נקודות!";
      result.className = "success score-anim";
      bgColor = "#4CAF50";
      resultTextColor = "#2e7d32";
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
      bgColor = "#FFEB3B";
      resultTextColor = "#b37400";
    } else {
      result.textContent = `פספסת! ${finalTime} ❌`;
      result.className = "fail";
      bgColor = "#F44336";
      resultTextColor = "#fff";
    }

    score += points;
    scoreBox.textContent = score;

    const bestScore = await updatePlayerHighScore(playerName, score);
    highScoreBox.textContent = bestScore;

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

  async function updatePlayerHighScore(name, currentScore) {
    const userRef = doc(db, "scores", name);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists() || currentScore > docSnap.data().score) {
      await setDoc(userRef, {
        name: name,
        score: currentScore
      });
      return currentScore;
    }

    return docSnap.data().score;
  }

  function updateLeaderboardLive() {
    const scoresRef = collection(db, "scores");

    onSnapshot(scoresRef, (snapshot) => {
      const scores = [];
      snapshot.forEach(doc => {
        scores.push(doc.data());
      });

      scores.sort((a, b) => b.score - a.score);

      leaderboardList.innerHTML = "";
      scores.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score} נק'`;
        leaderboardList.appendChild(li);
      });
    });
  }

  // קריאה בזמן אמת עם סנכרון
  updateLeaderboardLive();
});
