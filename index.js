const root = document.getElementById("root");

const createWeatherForecast = (list) => {
  console.log(list);
  const results = list.map((item, index) => {
    if (index % 3 !== 0) {
      return;
    }
    return `
    <div class="forecastItems">
      <p class="forecastItem date">${new Date(
        item.dt * 1000
      ).toLocaleString()}</p>
      <p class="forecastItem temperature">${Math.round(
        item.main.temp - 273.15
      )}&#8451</p> 
      <p class="forecastItem weather">${item.weather[0].main.toUpperCase()}</p>
      <p class="forecastItem icon"><img src="http://openweathermap.org/img/wn/${
        item.weather[0].icon
      }.png" alt=${item.weather[0].main}></p>
    </div>`;
  });
  console.log(results);
  root.insertAdjacentHTML(
    "beforeend",
    `<div class="allForecastItems">${results.join("")}</div>`
  );
};

const setInterface = (data) => {
  const { name, country } = data.city;
  const title = `<h1 class="title">Weather for ${name}, ${country}</h1>`;
  root.innerHTML = title;
  createWeatherForecast(data.list);
};

const success = async ({ coords }) => {
  console.log(coords);
  const { latitude, longitude } = coords;
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=10&appid=17a3e02a9cc47ed1eac90bc2f9c0012a`
  );
  setInterface(data);
  console.log(data);
};

const error = (error) => {
  root.innerHTML = `<h1>Sorry, you need to enable location services.</h1>`;
};

navigator.geolocation.getCurrentPosition(success, error);

document.getElementById("location").addEventListener("input", async (e) => {
  const userCoords = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=17a3e02a9cc47ed1eac90bc2f9c0012a`
  );
  console.log(userCoords.data);

  success({
    coords: {
      longitude: userCoords.data[0].lon,
      latitude: userCoords.data[0].lat,
    },
  });
});
