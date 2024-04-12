import { environments } from "./config/environment.js";

const location = document.getElementById("location");
const search = document.getElementById("search");

search.addEventListener("click", () => {
  const city = location.value;
  console.log(city);

  const API_KEY = environments.apiKey;
  const baseURL = "https://api.openweathermap.org/data/2.5/";
  const path = `weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_BR`;

  function main() {
    const url = `${baseURL}${path}`;
    fetch(url) //fetch serve para conectar com outras API
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }

  main();
});
