//Get city name from user
//When they click search button
//Run function to turn city name into lat and lon
//Run function to get weather
//???? profit
var day = moment().format("dddd, MMM Do, YYYY");
console.log(day)
var searchBtn = document.getElementById("search-btn");
var cityArr = JSON.parse(localStorage.getItem("cityArr"))||[]


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
            if (!cityArr.includes(data.name)){

                cityArr.push(data.name)
                localStorage.setItem("cityArr", JSON.stringify(cityArr))
                buildMenu()
            }
            
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
            var forecastArray = []
            console.log(data)
            for (var i = 0; i< data.list.length; i++){
                
                var targetTime = data.list[i].dt_txt.split(" ")[1]
                
                if(targetTime==="12:00:00"){
                    forecastArray.push(data.list[i])
                }
                
                
            }
            for (var i = 0; i < forecastArray.length; i++){
                var date = moment.unix(forecastArray[i].dt).format("ddd")
                console.log(date)
                var column = $("<div>").addClass("col-2 card")
                var header = $("<h3>").addClass("card-header").text(date)
                var temp = $("<p>").addClass("card-text").text(forecastArray[i].main.temp) 
                // var description = $("<p>").addClass("card-text").text(forecastArray.weather.description)
                $("#forecast").append(column.append(header, temp,))
            }
        })


}

function buildMenu (){
    for (var i = 0; i<cityArr.length; i++){
        var li = $("<li>").addClass("list-group-item")
            
        $(".list-group").append(li)
    }
}
buildMenu()


searchBtn.addEventListener("click", function (event) {
    event.preventDefault()
    var city = document.getElementById("city-term").value;
    getLatLon(city)
})


