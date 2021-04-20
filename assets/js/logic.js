// variables for Quiz
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
var sfxRight = new Audio("assets/sfx/yea.wav");
var sfxWrong = new Audio("assets/sfx/boo.mp4");

function startQuiz() {
  // Dont show start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // reveal questions
  questionsEl.removeAttribute("class");

  // Timer start
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // display current questions
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

    // attach click listener
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  
  if (this.value !== questions[currentQuestionIndex].answer) {
    // if wrong take time off
    time -= 20;

    if (time < 0) {
      time = 0;
    }

    // display new time
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

  // looks for another question
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // display the end screen
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

  // did the time run out of time
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

    // save localstorage
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

// click button to insert initials
submitBtn.onclick = saveHighscore;



// click button to start
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
