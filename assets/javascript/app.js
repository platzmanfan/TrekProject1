//TODO, Higher Order:
//-Future search implementation
//-Eventbrite AJAX call
//-Directions AJAX call
//-User database implementation
//More??

//TODO: Remove testing console logs

//Firebase setup
//TODO: Test that this is the correct firebase database config
//TODO: Change firebase config away from default database info seen here
// var config = {
//   apiKey: "AIzaSyAkTkwBmhAnNRYp-ONq1FQXI1JWG_Pi4AU",
//   authDomain: "myapp-487ea.firebaseapp.com",
//   databaseURL: "https://myapp-487ea.firebaseio.com",
//   projectId: "myapp-487ea",
//   storageBucket: "myapp-487ea.appspot.com",
//   messagingSenderId: "1009809046291",
//   appId: "1:1009809046291:web:d9e25b1e0175b57f5bf8e6"
// };

// firebase.initializeApp(config);

//Globals
//var database = firebase.database();

var destinationCity;
var originCity;
var tripDate;
var daysText = [];

//Functions

//Get todays date and create array with strings for 7 days out
function getDays() {
  var startingDay = moment().format("dddd , MMMM Do");
  daysText.push(startingDay);

  for (var i = 1; i < 7; i++) {
    var nextday = moment().add(i, "days");
    nextday = nextday.format("dddd, MMMM Do");
    daysText.push(nextday);
  }

  //console.log(daysText);
}

//Get icon string from forecast data and returns associated icon class
function iconClass(icondata) {
  var temp = icondata;
  var _iconClass;

  //If Weather is Clear, Wind or Fog return Sun Icon
  if (icondata === ("clear-day" || "clear-night" || "wind" || "fog")) {
    _iconClass = "fas fa-sun fa-lg amber-text";
  }
  //IF Weather is Rain, Return Rain Icon
  else if (icondata === "rain") {
    _iconClass = "fas fa-cloud-rain fa-lg text-info";
  }
  //IF Weather is Snow or Sleet, Return Snow Icon
  else if (icondata === ("snow" || "sleet")) {
    _iconClass = "fas fa-snowflake fa-lg text-info";
  }
  //IF Weather is cloudy, Return cloudy Icon
  else if (icondata === "cloudy") {
    _iconClass = "fas fa-cloud fa-lg text-info";
  }
  //IF Weather is partly-cloudy, Return Partly Cloudy Icon
  else if (icondata === ("partly-cloudy-day" || "partly-cloudy-night")) {
    _iconClass = "fas fa-cloud-sun fa-lg text-info";
  } else {
    _iconClass = "";
  }
  return _iconClass;
  //
}



//TODO: fill out this function (note that directions is an array of strings of variable size)
function createDirectionsCard(destinationCity, originCity, directions)
{
  console.log(originCity)
}

//TODO: fill out this function (events is an array of event objects with properties title, address, description, start time, and image)
function createEventsCard(destinationCity, events)
{
  console.log(events)
}

//Create Weather Card and Append to page
function createWeatherCard(destination, forecastResults) {
  //Get days
  getDays();

  //Update Destination city, todays date and weather
  $("#destination-city").text(destination);
  $("#todays-date").text(daysText[0]);
  $("#day0-weatherOverview").text(forecastResults[0].summary);
  $("#day0-tmp").text(
    Math.floor(forecastResults[0].temperatureHigh) +
      " / " +
      Math.floor(forecastResults[0].temperatureLow)
  );

  //Create Table

  var newBody = $("");

  //Create row for each day in forcast results
  $("#dailyTempDisplay").empty();
  for (var i = 1; i < forecastResults.length - 1; i++) {
    var date = daysText[i];
    var tempHigh = Math.floor(forecastResults[i].temperatureHigh);
    var tempLow = Math.floor(forecastResults[i].temperatureLow);
    var icon = forecastResults[i].icon;

    var tableRow = $("<tr>");

    var dateCol = $("<td>")
      .addClass("font-weight-normal align-middle")
      .text(date);

    var tempCol = $("<td>").addClass("float-right font-weight-normal");
    var tempContent = $("<p>")
      .addClass("mb-1")
      .text(tempHigh);
    tempCol.append(tempContent);

    var iconCol = $("<td>").addClass("float-right mr-3");
    var iconContent = $("<i>").addClass(iconClass(icon));
    iconCol.append(iconContent);

    tableRow.append(dateCol, tempCol, iconCol);
    $("#dailyTempDisplay").append(tableRow);
  }
}

//Submit button on click event handler
//TODO: Add time input for future search. Need to solve time conversion issues between string and ms.
//Maybe use moment.js library?

$("#btn-submit").on("click", function() {
  event.preventDefault();
  //TODO: add better input validation

  var destinationCity="";
  var originCity="";
  if ($("#destination-input").val() != undefined) {
    destinationCity = $("#destination-input")
      .val()
      .trim();
  }
  if ($("#origin-input").val() != undefined) {
    originCity = $("#origin-input")
      .val()
      .trim();
  }
  //TODO: setup tripDate searching
  if ($("#time-input").val() != undefined) {
    tripDate = $("#date-input")
      .val()
      .trim();
  } else {
    //TODO: set tripDate equal to current time
  }
  console.log(originCity);
  console.log(destinationCity);

  //TODO delete this line after testing, forces origin city
  originCity="san francisco";

  //TODO: add direitons ajax
  //Note: may need to be called only after acquiring latitude and longitude
  if(destinationCity.length>0 && originCity.length>0)
  {
    var directionsURL =
    "https://cors-anywhere.herokuapp.com/http://www.mapquestapi.com/directions/v2/route?key=Gx9QGTMeo5RatQTBAvX2JHdG9Au9KUkD&from=" +
    originCity +
    "&to=" +
    destinationCity;


    $.ajax({
      url: directionsURL,
      method: "GET"
    }).then(function(response) {
      //console.log(response);
      var steps=response.route.legs[0].maneuvers;
      var directions=[];
      for(var i=0; i<steps.length; i++)
      {
        //console.log(steps[i].narrative);
        directions.push(steps[i].narrative);
      }
      createDirectionsCard(destinationCity, originCity, directions);
    });


  }


 
  if(destinationCity.length>0)
  {



  var timeString="This Week"
  var eventsApiKey="NvkjfRqn6GrLB7PF";
  var eventsQueryURL="https://cors-anywhere.herokuapp.com/http://api.eventful.com/json/events/search?&app_key=" + eventsApiKey 
                  + "&location=" + destinationCity + "&date=" + timeString;

  //TODO: confirm that this api key is mine
  //TODO: any additional validation of city name??
  var weatherApiKey = "d5c1138b95b6df5cb3340a9ed55fd35b";
  var weatherQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    destinationCity +
    "&units=metric&appid=" +
    weatherApiKey;


    var pixabayApiKey = "15601799-1eeb362733cc8b4dd8f7e5c79";
    var pixabayQueryURL = "https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?key=" + pixabayApiKey + "&q=" + destinationCity + "&image_type=photo";

    //returns an array of image strings, maximum of 5
    $.ajax({
      url: pixabayQueryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var pictureList=response.hits;
      var pictureLinks=[];
      for(var i=0; i<Math.min(5,pictureList.length); i++)
      {
        pictureLinks.push(pictureList[i].webformatURL);
      }
      //console.log(pictureLinks);
    });


  $.ajax({
    url: eventsQueryURL,
    method: "GET"
  }).then(function(response) {
    var objResponse=JSON.parse(response);
    //console.log(objResponse);
    var events=[];

    for(var i=0; i<objResponse.events.event.length; i++)
    {
      var current=objResponse.events.event[i];
      var event={
        title: current.title,
        address: current.venue_address,
        description: current.description,
        time: current.start_time,
        image: current.image
      }
      events.push(event);
    }
    //console.log(events);
    createEventsCard(destinationCity, events);
  });


  
  $.ajax({
    url: weatherQueryURL,
    method: "GET"
  }).then(function(response) {
    var results = response;

    var longitude = results.coord.lon;
    var latitude = results.coord.lat;
    console.log(latitude + " " + longitude);
    var forecastApiKey = "b03c701ae13c94ebdf444f913a4567d9";
    var forecastQueryURL =
      "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" +
      forecastApiKey +
      "/" +
      latitude +
      "," +
      longitude;
    $.ajax({
      url: forecastQueryURL,
      method: "GET"
    }).then(function(response) {
      var results = response;
      var forecastDays = results.daily.data;

      //Update Weather Card
      createWeatherCard(destinationCity, forecastDays);

      //Slide page down to results AFTER ALL CARDS ARE UPDATED
      $("html,body").animate(
        { scrollTop: $(".main-content").offset().top },
        "slow"
      );
    });
    //Commented out because weather class no longer exists in HTML, and empty is called elsewhere
    //$(".weather").empty();
  });
  }

});
