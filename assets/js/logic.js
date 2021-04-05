var currentQuestionIndex = 0;
var time = questions.length * 20;
var timerId;

var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

// SFX
var sfxRight = new Audio("assets/sfx/Yea.wav");
var sfxWrong = new Audio("assets/sfx/boo.mp4");

function startQuiz() {
  // hide the start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // reveal questions
  questionsEl.removeAttribute("class");

  // start the timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // show current questions
  var currentQuestion = questions[currentQuestionIndex];

  // update with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // clear previous question choices
  choicesEl.innerHTML = "";

  currentQuestion.choices.forEach(function(choice, i) {
    
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach click event listener
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  
  if (this.value !== questions[currentQuestionIndex].answer) {
    // if wrong take time off
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // show the new time
    timerEl.textContent = time;

    // play boo
    sfxWrong.play();

    feedbackEl.textContent = "Wrong!";
  } else {
    // play yea
    sfxRight.play();

    feedbackEl.textContent = "Correct!";
  }
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // go to next question
  currentQuestionIndex++;

  // check for another question
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // show new score
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // link to highscores
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// click button to submit initials
submitBtn.onclick = saveHighscore;



// click button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
