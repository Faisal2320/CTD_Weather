let btn = document.getElementById("showWeather");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  getUserLocation();
  getWeatherData();
});

// below are the search parameters for the weather API
// Default coordinates are set to United States, which will be updated based on user location
const params = new URLSearchParams({
  latitude: 32.3264, // Default coordinates for United States
  longitude: -86.91117, // Default coordinates for United States
  daily:
    "sunrise,sunset,precipitation_sum,temperature_2m_min,temperature_2m_max",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  forecast_days: "1",
});
// The API endpoint for fetching weather data
function getWeatherData() {
  fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      // Display the weather information
      const { daily } = data;
      daily.time.forEach((time, index) => {
        console.log("index: ", index);
        const date = new Date(time);
        const sunriseTime = new Date(daily.sunrise[index]);
        const sunsetTime = new Date(daily.sunset[index]);
        const minTemp = daily.temperature_2m_min[index];
        const maxTemp = daily.temperature_2m_max[index];
        const precipitation = daily.precipitation_sum[index];
        // Update the HTML elements with the weather data
        let li = document.getElementById("lihead");
        li.innerHTML = `<strong>${date.toDateString()}</strong>`;

        let sunrise = document.getElementById("sunrise");
        sunrise.innerHTML = `Sunrise: ${sunriseTime.toLocaleTimeString()}`;

        let sunset = document.getElementById("sunset");
        sunset.innerHTML = `Sunset: ${sunsetTime.toLocaleTimeString()}`;

        let temp = document.getElementById("temperature");
        temp.innerHTML = `Min Temp: ${minTemp}°C | Max Temp: ${maxTemp}°C`;

        let rain = document.getElementById("rain");
        rain.innerHTML = `Precipitation: ${precipitation}mm`;
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      document.getElementById("message").innerHTML =
        "Error fetching weather data. Please try again later.";
    });
}

// This function retrieves the user's location using the Geolocation API
// If the location is not available, it will use the stored latitude and longitude from localStorage

function getUserLocation() {
  // check if latitude and longitude are already stored
  if (!localStorage.getItem("latitude") && !localStorage.getItem("longitude")) {
    // if not, get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem("latitude", position.coords.latitude);
          localStorage.setItem("longitude", position.coords.longitude);
          console.log("User Location for the first time: ", position);
          updateUrlCoords(
            `${position.coords.latitude},${position.coords.longitude}`
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
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
// This function updates the URL parameters with the coordinates
// It takes a string of coordinates in the format "latitude,longitude"

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
