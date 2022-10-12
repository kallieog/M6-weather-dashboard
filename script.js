//Get city name from user
//When they click search button
//Run function to turn city name into lat and lon
//Run function to get weather
//???? profit
var day = moment().format("dddd, MMM Do, YYYY");
console.log(day)
var searchBtn = document.getElementById("search-btn");
var cities = [];


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
            if (!cities.includes(data.name)){

                cities.push(data.name)
                localStorage.setItem("cityArr", JSON.stringify(cities))
                buildMenu()
            }
            
            displayWeather(data)

        })
    function displayWeather(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind
        console.log(name, description, temp, humidity, speed)
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind " + speed + "MPH";
    }


    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=d8950e537f838a84e87fb4660bfcfc5d`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            var forecastArray = []
            console.log(data)
            for (var i = 0; i< data.list.length; i++){
                
                var targetTime = data.list[i].dt_txt.split(" ")[1]
                
                if(targetTime==="12:00:00"){
                    forecastArray.push(data.list[i])
                }
                
                
            }
            $(".rmv").remove();
            for (var i = 0; i < forecastArray.length; i++){
                var date = moment.unix(forecastArray[i].dt).format("ddd")
                console.log(date)
                var column = $("<div>").addClass("col-2 card rmv")
                var header = $("<h3>").addClass("card-header rmv").text(date)
                var temp = $("<p>").addClass("card-text rmv").text(forecastArray[i].main.temp) 
                var icon = $(`<img src = https://openweathermap.org/img/wn/${forecastArray[i].weather[0].icon}@2x.png class="rmv"></img>`);
                var description = $("<p>").addClass("card-text rmv").text(forecastArray[i].weather[0].description)
                var humidity = $("<p>").addClass("card-text rmv").text( "Humidity " + forecastArray[i].main.humidity + "%");
                var speed = $("<p>").addClass("card-text rmv").text("Wind " + forecastArray[i].wind.speed + " MPH");
                $("#forecast").append(column.append(header, temp, icon, description, humidity, speed ))
                console.log(description)
            }
        })


}

function buildMenu (){
    $(".list-group-item").remove()
var cityArr = JSON.parse(localStorage.getItem("cityArr"));

    for (var i = 0; i<cityArr.length; i++){
      
        var li = $(`<a onclick="getLatLon(${JSON.stringify(cityArr[i])})"></a>`).addClass(`list-group-item ${[i]}`).text(cityArr[i]);
        $(".list-group").append(li);
        var item = document.getElementsByClassName(`${[i]}`);
        console.log(item);
        
    }
}



searchBtn.addEventListener("click", function (event) {
    event.preventDefault()
    var city = document.getElementById("city-term").value;
    getLatLon(city)
})


