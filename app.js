window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

const icon = document.querySelector("i.fa.fa-microphone");
const saveButton = document.querySelector("i.fa.fa-download");
let paragraph = document.createElement("p");
let container = document.querySelector(".text-box");
container.appendChild(paragraph);
const sound = document.querySelector(".sound");

icon.addEventListener("click", () => {
  sound.play();
  dictate();
});

saveButton.addEventListener("click", () => {
  saveFunction();
});
const saveFunction = () => {
  const file = new Blob([paragraph.textContent], { type: "text/plain" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(file);
  anchor.download = "save.txt";

  anchor.click();
};

const dictate = () => {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;

    paragraph.textContent = speechToText;
    console.log(paragraph.textContent);

    if (event.results[0].isFinal) {
      if (speechToText.includes("what is the time")) {
        speak(getTime);
      }
      if (speechToText.includes("what is today's date")) {
        speak(getDate);
      }
      if (speechToText.includes("what is the weather in")) {
        getTheWeather(speechToText);
      }
    }
  };
};

const speak = (action) => {
  utterThis = new SpeechSynthesisUtterance(action());
  synth.speak(utterThis);
};

const getTime = () => {
  const time = new Date(Date.now());
  return `the time is ${time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;
};

const getDate = () => {
  const time = new Date(Date.now());
  return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${
      speech.split(" ")[5]
    }&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (weather) {
      if (weather.cod === "404") {
        utterThis = new SpeechSynthesisUtterance(
          `I cannot find the weather for ${speech.split(" ")[5]}`
        );
        synth.speak(utterThis);
        return;
      }
      utterThis = new SpeechSynthesisUtterance(
        `the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`
      );
      synth.speak(utterThis);
    });
};
