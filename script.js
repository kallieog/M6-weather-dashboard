//Get city name from user
//When they click search button
//Run function to turn city name into lat and lon
//Run function to get weather
//???? profit
var day = moment();
console.log(day)
var searchBtn = document.getElementById("search-btn");


function getLatLon(cityName) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&units=imperial&appid=d8950e537f838a84e87fb4660bfcfc5d").then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log(data)
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeather(lat, lon);

    })

}

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=d8950e537f838a84e87fb4660bfcfc5d`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data)
            displayWeather(data)

        })
    function displayWeather(data) {
        const { name } = data;
        const { description } = data.weather[0];
        const { temp, humidity } = data.main;
        console.log(name, description, temp, humidity)
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity " + humidity + "%";
    }


    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=d8950e537f838a84e87fb4660bfcfc5d`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data)
            const { date } = moment.unix(data.list[4].dt);
            const { description } = data.weather[0];
            const { temp, humidity } = data.main;
            console.log(name, description, temp, humidity)
            document.querySelector(".date1").innerText = date;
            document.querySelector(".description").innerText = description;
            document.querySelector(".temp").innerText = temp + "°F";
            document.querySelector(".humidity").innerText = "Humidity " + humidity + "%";
        })


}




searchBtn.addEventListener("click", function (event) {
    event.preventDefault()
    var city = document.getElementById("city-term").value;
    getLatLon(city)
})


