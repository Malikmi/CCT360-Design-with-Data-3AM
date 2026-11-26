
let scenes = document.getElementsByClassName("scene");
let dots = document.getElementsByClassName("dot");
let thoughts = document.getElementsByClassName("thought");

let clock = document.getElementById("clock");
let bigClock = document.getElementById("bigClock");
let hint = document.getElementById("hint");
let glow = document.getElementById("glow");

let lidTop = document.getElementById("lidTop");
let lidBottom = document.getElementById("lidBottom");

let light = document.getElementById("light");
let foundText = document.getElementById("found");

let spiral = document.getElementById("spiral");
let calmFill = document.getElementById("calmFill");

let lungs = document.getElementById("lungs");
let breathText = document.getElementById("breathText");
let breathCount = document.getElementById("breathCount");

let dawn = document.getElementById("dawn");
let sun = document.getElementById("sun");
let curtainL = document.getElementById("curtainL");
let curtainR = document.getElementById("curtainR");
let ending = document.getElementById("ending");
let realTime = document.getElementById("realTime");
let again = document.getElementById("again");

let scene = 0;              
let minutes = 3 * 60 + 7;   
let holding = false;        
let mouseY = 0;
let lastX = 0;
let lastY = 0;

let eyesOpen = 0;           
let foundCount = 0;         
let found = [false, false, false, false, false, false, false];
let stillTime = 0;          
let noise = 0;              
let wordCount = 0;       
let lungSize = 0;           
let breaths = 0;            
let curtainOpen = 0;        
let finished = false;

let worries = ["tomorrow", "why", "deadline", "rent", "should've", "what if",
               "texts", "too late", "again", "grades", "everyone", "enough?"];

let hints = ["hold anywhere to open your eyes",
             "move to look around the room",
             "stay still",
             "hold to breathe in, let go to breathe out",
             "drag the curtains open"];

// -the clock -
function showTime() {
  let h = Math.floor(minutes / 60);
  let m = minutes - h * 60;
  if (m < 10) {
    m = "0" + m;
  }
  clock.innerHTML = h + ":" + m;
  bigClock.innerHTML = h + ":" + m;
}

// time keeps going even if you do nothing: +1 minute every 12 seconds
setInterval(addMinute, 12000);

function addMinute() {
  if (finished === false) {
    minutes++;
    showTime();
  }
}
function goTo(number) {
  scenes[scene].className = "scene";
  scene = number;
  scenes[scene].className = "scene active";

  hint.innerHTML = hints[scene];

  // lights up the dots up to this scene
  for (let i = 0; i < dots.length; i++) {
    if (i <= scene) {
      dots[i].className = "dot on";
    } else {
      dots[i].className = "dot";
    }
  }

  // jump the clock forward
  if (scene === 1) {
    minutes = 3 * 60 + 12;
  } else if (scene === 2) {
    minutes = 3 * 60 + 41;
  } else if (scene === 3) {
    minutes = 4 * 60 + 26;
  } else if (scene === 4) {
    minutes = 5 * 60 + 38;
  }
  showTime();
}
window.addEventListener("mousedown", function (event) {
  holding = true;
  lastX = event.clientX;
  lastY = event.clientY;
});

window.addEventListener("mouseup", function () {
  holding = false;
});

window.addEventListener("mousemove", function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  let moveX = mouseX - lastX;
  let moveY = mouseY - lastY;
  if (moveX < 0) {
    moveX = -moveX;
  }
  if (moveY < 0) {
    moveY = -moveY;
  }
  let speed = moveX + moveY;

  if (scene === 1) {
    moveLight();
  } else if (scene === 2) {
    spiralMove(speed);
  } else if (scene === 4 && holding === true) {
    dragCurtains(speed);
  }

  lastX = mouseX;
  lastY = mouseY;
});

window.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    event.preventDefault();
    holding = true;
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key === " ") {
    holding = false;
  }
});


// - SCENE 0: hold to open your eyes -
function updateEyes() {
  if (holding === true) {
    eyesOpen = eyesOpen + 0.012;    
  } else {
    eyesOpen = eyesOpen - 0.025;    
  }

  if (eyesOpen < 0) {
    eyesOpen = 0;
  }

  // eyelid covers 46% of the screen when closed, 0% when open
  let lidHeight = 46 - eyesOpen * 46;
  lidTop.style.height = lidHeight + "%";
  lidBottom.style.height = lidHeight + "%";

  if (eyesOpen >= 1) {
    goTo(1);
  }
}

// - SCENE 1: the flashlight -
function moveLight() {
  light.style.left = (mouseX - 130) + "px";
  light.style.top = (mouseY - 130) + "px";
}

for (let i = 0; i < thoughts.length; i++) {
  thoughts[i].addEventListener("mousemove", function () {
    if (found[i] === false) {
      found[i] = true;
      foundCount++;
      thoughts[i].style.color = "#f3b66d";
      thoughts[i].style.zIndex = "2";   
      foundText.innerHTML = foundCount + " / " + thoughts.length + " thoughts";

      if (foundCount === thoughts.length) {
        hint.innerHTML = "too many thoughts.";
        setTimeout(goToSpiral, 2200);
      }
    }
  });
}

function goToSpiral() {
  goTo(2);
}


// - SCENE 2: the spiral -
function spiralMove(speed) {
  if (speed > 6) {
    stillTime = 0;   

    let word = document.createElement("p");
    word.className = "echo";
    word.innerHTML = worries[Math.floor(Math.random() * worries.length)];
    word.style.left = mouseX + "px";
    word.style.top = mouseY + "px";
    word.style.fontSize = (16 + Math.min(speed, 80) / 2) + "px";
    spiral.appendChild(word);

    noise = noise + 1;
    wordCount++;

    if (wordCount === 15) {
      wordCount = 0;
      minutes++;
      showTime();
    }
  }
}

function updateSpiral() {
  stillTime = stillTime + 30;
  noise = noise * 0.97;   

  let red = Math.min(noise * 2, 60);
  spiral.style.backgroundColor = "rgb(" + (6 + red) + ",7,12)";

  let calm = stillTime / 3000;
  if (calm > 1) {
    calm = 1;
  }
  calmFill.style.width = calm * 100 + "%";

  if (calm === 1) {
    goTo(3);
  }
}

// - SCENE 3: breathe -
function updateBreath() {
  if (holding === true) {
    lungSize = lungSize + 0.008;     
    if (lungSize > 1) {
      lungSize = 1;
    }
  } else {
    if (lungSize === 1) {
      breaths++;
      breathCount.innerHTML = breaths + " / 3 breaths";
    }
    lungSize = lungSize - 0.01;
    if (lungSize < 0) {
      lungSize = 0;
    }
  }

  lungs.style.transform = "scale(" + (0.3 + lungSize * 0.7) + ")";

  document.body.style.backgroundColor = "rgb(" + (6 + breaths * 6) + "," + (7 + breaths * 6) + "," + (12 + breaths * 12) + ")";

  if (holding === true && lungSize < 1) {
    breathText.innerHTML = "breathe in…";
  } else if (holding === true) {
    breathText.innerHTML = "now let go";
  } else if (lungSize > 0) {
    breathText.innerHTML = "breathe out…";
  } else {
    breathText.innerHTML = "hold to breathe in";
  }

  if (breaths >= 3 && lungSize === 0) {
    goTo(4);
  }
}
// - SCENE 4: open the curtains -
function dragCurtains(speed) {
  curtainOpen = curtainOpen + speed / 900;
  if (curtainOpen > 1) {
    curtainOpen = 1;
  }
  updateMorning();
}
function updateMorning() {
  if (curtainOpen > 1) {
    curtainOpen = 1;
  }
  let width = 52 - curtainOpen * 44;
  curtainL.style.width = width + "%";
  curtainR.style.width = width + "%";

  dawn.style.opacity = curtainOpen;
  sun.style.top = (110 - curtainOpen * 75) + "%";
  glow.style.opacity = curtainOpen * 0.55;
  document.body.style.backgroundColor = "rgb(" + (24 + curtainOpen * 30) + "," + (25 + curtainOpen * 10) + "," + (48 - curtainOpen * 10) + ")";

  if (curtainOpen === 1 && finished === false) {
    finish();
  }
}

function finish() {
  finished = true;
  minutes = 6 * 60 + 12;
  showTime();
  hint.innerHTML = "";
  ending.style.opacity = 1;
  getWeather();

  let now = new Date();
  let hour = now.getHours();
  let min = now.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }

  if (hour >= 0 && hour < 5) {
    realTime.innerHTML = "it's actually " + hour + ":" + min + " where you are. go to sleep.";
  } else if (hour < 12) {
    realTime.innerHTML = "it's " + hour + ":" + min + " where you are. hope you slept.";
  } else {
    realTime.innerHTML = "it's " + hour + ":" + min + " where you are. tonight will be easier.";
  }
}

// -- weather API--
let apiURL = "https://api.open-meteo.com/v1/forecast?latitude=43.59&longitude=-79.64&current=temperature_2m,weather_code";
let weatherText = document.getElementById("weather");

async function getWeather() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    console.log(data);

    let temperature = Math.round(data.current.temperature_2m);
    let code = data.current.weather_code;

    let sky = "";
    if (code === 0) {
      sky = "clear skies";
    } else if (code <= 3) {
      sky = "a few clouds";
    } else if (code <= 48) {
      sky = "fog";
    } else if (code <= 67 || (code >= 80 && code <= 82)) {
      sky = "rain";
      dawn.style.background = "linear-gradient(#7d8597, #b8a9a4, #d9cbb0)";   // grey rainy sunrise
    } else if (code <= 77 || code === 85 || code === 86) {
      sky = "snow";
      dawn.style.background = "linear-gradient(#a9b8d6, #e4e2ea, #fbf3e4)";   // pale snowy sunrise
    } else {
      sky = "a storm";
      dawn.style.background = "linear-gradient(#4b5263, #8a7f86, #b9a58f)";   // dark stormy sunrise
    }

    //advice depending on the temperature
    let advice = "";
    if (temperature < 0) {
      advice = "wear a real coat today.";
    } else if (temperature < 12) {
      advice = "wear a jacket.";
    } else {
      advice = "it's a nice one.";
    }

    weatherText.innerHTML = "outside right now in mississauga: " + temperature + "°C and " + sky + ". " + advice;
  } catch (error) {
    console.error("Error:", error);
    weatherText.innerHTML = "the sky outside is still out there, even if we can't see it right now.";
  }
}

// start again from the beginning
again.addEventListener("click", function () {
  window.location.reload();
});


setInterval(update, 30);

function update() {
  if (scene === 0) {
    updateEyes();
  } else if (scene === 2) {
    updateSpiral();
  } else if (scene === 3) {
    updateBreath();
  } else if (scene === 4 && holding === true && curtainOpen < 1) {
    curtainOpen = curtainOpen + 0.004;
    updateMorning();
  }
}

showTime();
