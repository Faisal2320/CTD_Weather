import countriesStates from "./countries_states.js";
// ===========================================================================

// ===========================================================================
const params = new URLSearchParams({
  latitude: 32.3264, // Default coordinates for United States
  longitude: -86.91117, // Default coordinates for United States
  daily:
    "sunrise,sunset,precipitation_sum,temperature_2m_min,temperature_2m_max",
  hourly: "temperature_2m,precipitation_probability,wind_speed_10m",
  timezone: "auto",
  forecast_days: "1",
});
document.addEventListener("DOMContentLoaded", function () {
  populateCountriesInput();
  populateStatesInput("United States"); // Default state population
  getWeatherData();
});
// ===========================================================================
// Global variables to store weather data
// These will be used to populate the table later
var hourlyTime = [];
var hourlyTemp = [];
var hourlyPrecProb = [];
var hourlyWind = []; /* converted form km/h to as m/s */

function getWeatherData() {
  fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      updateGlobVarTime(data.hourly.time.slice(0, 24));
      updateGlobVarTemp(data.hourly.temperature_2m.slice(0, 24));
      updateGlobVarHrPrecProb(
        data.hourly.precipitation_probability.slice(0, 24)
      );
      updateGlobVarWind(data.hourly.precipitation_probability.slice(0, 24));
      updateDailySunrise(data.daily.sunrise[0]);
      updateDailySunset(data.daily.sunset[0]);
      updateDailyPrec(data.daily.precipitation_sum[0]);
      updateMinMaxTemp(
        data.daily.temperature_2m_min[0],
        data.daily.temperature_2m_max[0]
      );
      populateHourlyWeatherTable();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function updateGlobVarTime(timeArray) {
  hourlyTime = timeArray.map((time) => {
    return formatTime(time.split("T")[1]);
  });
}
function updateGlobVarTemp(tempArray) {
  hourlyTemp = tempArray;
}
function updateGlobVarHrPrecProb(precProbArray) {
  hourlyPrecProb = precProbArray;
}
function updateGlobVarWind(windArray) {
  hourlyWind = windArray.map((speed) => {
    return ((speed * 1000) / 3600).toFixed(2); // Convert km/h to m/s
  });
}
let sunriseTd = document.getElementById("sunrise");
let sunsetTd = document.getElementById("sunset");
let avgTempTd = document.getElementById("avgtemperature");
let avgPrecTd = document.getElementById("avgprecipitation");
function updateDailySunrise(sunrise) {
  sunriseTd.innerText = formatTime(sunrise.split("T")[1]);
}
function updateDailySunset(sunset) {
  sunsetTd.innerText = formatTime(sunset.split("T")[1]);
}
function updateMinMaxTemp(min, max) {
  // Update the average temperature cell with an image and the min/max temperatures
  let space = `\&nbsp\&nbsp\&nbsp\&nbsp\&nbsp`;
  avgTempTd.innerHTML = `<img src="images/png/cold.png"></img> ${min} \u2103 ${space} <img src="images/png/hot.png"></img>${max} \u2103`;
}
function updateDailyPrec(prec) {
  avgPrecTd.innerText = `${prec} mm`;
}

// formatTime function to convert time from 24-hour format to 12-hour format with am/pm
// Example: "14:30" becomes "2:30 pm"
// This function is used to format the time displayed in the hourly weather table
// It takes a time string in the format "HH:MM" and returns it in the format "H:MM am/pm"
// If the hour is less than 12, it appends "am"; if it is
function formatTime(time) {
  let h = time.split(":")[0];
  let m = time.split(":")[1];
  if (parseInt(h) < 12) {
    return `${time} am`;
  } else if (parseInt(h) == 12) {
    return `${time} pm`;
  } else {
    return `${parseInt(h) - 12}:${m} pm`;
  }
}

function populateHourlyWeatherTable() {
  // Populate the hourly weather table with the global variables
  // Clear the previous table rows
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = ""; // Clear previous rows
  let space = `\&nbsp\&nbsp\&nbsp\&nbsp`;
  // Create a header row
  for (let index = 0; index < hourlyTime.length; index++) {
    let timeTd = document.createElement("td");
    timeTd.innerText = hourlyTime[index];
    // -------------------------------------------
    // select an png based on the temperature
    let tempImage = "";
    if (hourlyTemp[index] < 21) {
      tempImage = `<img src="images/png/cold.png"></img>`;
    } else {
      tempImage = `<img src="images/png/hot.png"></img>`;
    }
    let tempTd = document.createElement("td");
    tempTd.innerHTML = `${tempImage}${space}${hourlyTemp[index]} \u2103`;
    // -------------------------------------------
    // Select Image for precipitation probability
    // If the probability is greater than or equal to 45%, show a rain image
    // If the probability is less than 45%, show no image
    let rainImage = "";
    if (hourlyPrecProb[index] >= 45) {
      rainImage = `<img src="images/png/rain.png"></img>`;
    }
    let precProbTd = document.createElement("td");
    precProbTd.innerHTML = `${hourlyPrecProb[index]} % ${space} ${rainImage}`;
    // ---------------------------------------------------
    // Select Image for wind speed
    // If the wind speed is greater than or equal to 3.5 m/s, show a wind image
    let windImage = "";
    if (hourlyWind[index] >= 3.5) {
      windImage = `<img src="images/png/windColor.png"></img>`;
    }
    let windTd = document.createElement("td");
    windTd.innerHTML = `${hourlyWind[index]} m/s ${space}${windImage}`;
    // ---------------------------------------------------
    // Create a table row and append the cells

    let tr = document.createElement("tr");
    tr.appendChild(timeTd);
    tr.appendChild(tempTd);
    tr.appendChild(precProbTd);
    tr.appendChild(windTd);
    tbody.appendChild(tr);
  }
  // tbody.innerHTML = rows;
}

// ===========================================================================

function getUserLocation() {
  console.log("Getting Usr Location...");
  // check if latitude and longitude are already stored
  if (!localStorage.getItem("latitude") && !localStorage.getItem("longitude")) {
    // if not, get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
        console.log("User Location for the first time: ", position);

        // Update the URL parameters with the user's coordinates
        // This will allow the weather data to be fetched based on the coodinates
        // this function takes the coordinates as a string in the format "latitude,longitude"
        updateUrlCoords(
          `${position.coords.latitude},${position.coords.longitude}`
        );
      }, showError);
    } else {
      document.getElementById("message").innerHTML =
        "Geolocation is not supported by this browser.";
    }
  }
  // if latitude and longitude are stored, use them
  else {
    updateUrlCoords(
      `${localStorage.getItem("latitude")},${localStorage.getItem("longitude")}`
    );
  }
}

function showError(error) {
  let message = document.getElementById("message");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      message.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      message.innerHTML = "An unknown error occurred.";
      break;
  }
}

// Update the URL parameters with the user's coordinates
// This will allow the weather data to be fetched based on the coodinates
// this function takes the coordinates as a string in the format "latitude,longitude"
function updateUrlCoords(coords = null) {
  if (coords) {
    let [latitude, longitude] = coords.split(",");
    params.set("latitude", parseFloat(latitude));
    params.set("longitude", parseFloat(longitude));
  } else {
    console.error(
      "Please select a state :error from function updateUrlCoords:"
    );
    return;
  }
}
// ===========================================================================
function populateCountriesInput() {
  let countrySelect = document.getElementById("countries");
  Object.keys(countriesStates)
    .sort()
    .forEach((country) => {
      let option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      // Set the default selected country to "United States"
      // This will ensure that the United States is selected by default when the page loads
      country == "United States" ? (option.selected = true) : null;
      countrySelect.appendChild(option);
    });
}
function populateStatesInput(country) {
  let firstOption = document.createElement("option");
  // Create a default option for the states select input
  firstOption.value = "0";
  firstOption.textContent = "Select State";

  let stateSelect = document.getElementById("states");
  stateSelect.innerHTML = ""; // Clear previous options
  // Append the default option to the states select input
  // This will ensure that the user is prompted to select a state
  stateSelect.appendChild(firstOption);
  const statesObj = countriesStates[country];

  if (statesObj && typeof statesObj === "object") {
    Object.keys(countriesStates[country])
      .sort()
      .forEach((state, index) => {
        let option = document.createElement("option");
        // Set the value of the option to the latitude and longitude of the state
        option.value = `${countriesStates[country][state].Latitude},${countriesStates[country][state].Longitude}`;
        option.textContent = state;
        index == 0 ? (option.selected = true) : null; // Select the first state by default

        stateSelect.appendChild(option);
      });
  }
}

let countrySelect = document.getElementById("countries");
countrySelect.addEventListener("change", function () {
  populateStatesInput(countrySelect.value); // Hide the paragraph when a country is selected
  hideParagraph(); // Hide the paragraph when a country is selected
  ButtonPrimary();
  let stateSelect = document.getElementById("states");

  if (countrySelect.value != "0") {
    updateUrlCoords(stateSelect.value);
    getWeatherData();
  }
});

let stateSelect = document.getElementById("states");
stateSelect.addEventListener("change", function (e) {
  //ensure that the state is selected

  if (e.target.value !== "0") {
    updateUrlCoords(this.value);
    getWeatherData();
  }
});
function clearSelection() {
  countrySelect.value = "0"; // Reset country selection
  populateStatesInput("0"); // Clear state selection
}
// ===========================================================================
// Get the user's location and fetch weather data when the button is clicked
let button = document.getElementById("localWeather");
button.addEventListener("click", function () {
  this.classList.remove("btn-primary");
  this.classList.add("btn-success");
  desplayMessage(); // Show the paragraph which says showing your town weather
  // Clear the country & states selection
  clearSelection(); // Clear the country selection
  getUserLocation(); // Get the user's location and updates teh URL parameters
  getWeatherData();
});
function desplayMessage() {
  let message = document.getElementById("message");
  message.classList.remove("d-none");
  message.classList.add("d-block");
}
function hideParagraph() {
  let message = document.getElementById("message");
  message.classList.remove("d-block");
  message.classList.add("d-none");
}

function ButtonPrimary() {
  button.classList.remove("btn-success");
  button.classList.add("btn-primary");
}

// ===========================================================================
/*
//

(01)    [Done] list of countries and states show have an option of Select Country and Select State
 
(02)    [Done] when the user clicks on My Town Weather, remove country and state selects
      [Done]  d-block and d-none paragraph the best way is function call 
(03)    About page 
        add Seven Days Weather Forecast

(04)    the main page of video
(06)    wather 
*/
