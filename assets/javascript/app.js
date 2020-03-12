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

  console.log(daysText);
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
    forecastResults[0].temperatureHigh +
      " / " +
      forecastResults[0].temperatureLow
  );

  //Create card for each day in forcast results

  for (var i = 1; i < forecastResults.length - 1; i++) {
    var date = daysText[i];
    var tempHigh = forecastResults[i].temperatureHigh;
    var tempLow = forecastResults[i].temperatureLow;
    var overview = forecastResults[i].summary;

    var newRow = $("<div>").addClass("row");

    var dateCol = $("<div>")
      .addClass("col-6")
      .text(date);
    var iconCol = $("<div>").addClass("col");
    var tempCol = $("<div>")
      .addClass("col")
      .text(tempHigh);

    newRow.append(dateCol, iconCol, tempCol);
    $("#dailyTempDisplay").append(newRow);
  }
}

//Submit button on click event handler
//TODO: Add time input for future search. Need to solve time conversion issues between string and ms.
//Maybe use moment.js library?

$("#btn-submit").on("click", function() {
  event.preventDefault();
  //TODO: add better input validation

  var destinationCity;
  var originCity;
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

  //TODO: add direitons ajax
  //Note: may need to be called only after acquiring latitude and longitude

  var directionsURL =
    "http://www.mapquestapi.com/directions/v2/route?key=Gx9QGTMeo5RatQTBAvX2JHdG9Au9KUkD&from=" +
    originCity +
    "&to=" +
    destinationCity;

  //TODO: confirm that this api key is mine
  //TODO: any additional validation of city name
  var weatherApiKey = "d5c1138b95b6df5cb3340a9ed55fd35b";
  var weatherQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    destinationCity +
    "&units=metric&appid=" +
    weatherApiKey;

  //TODO: Replace use of openweathermap with better geocoding api
  $.ajax({
    url: weatherQueryURL,
    method: "GET"
  }).then(function(response) {
    console.log(results);
    var results = response;
    console.log(results);
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
      console.log(forecastDays);
      //note: want temperatureHigh, temperatureLow, summary, icon
      // for (var i = 0; i < forecastDays.length; i++) {
      //   //test string
      //   var dailyForecast =
      //     "High: " +
      //     forecastDays[i].temperatureHigh +
      //     " Low: " +
      //     forecastDays[i].temperatureLow +
      //     " Summary: " +
      //     forecastDays[i].summary +
      //     " Icon: " +
      //     forecastDays[i].icon;
      //   console.log(dailyForecast);

      //   //Generates horizontal table
      //   //TODO: Integrate date and time into day
      //   var forecastHTML =
      //     "<tr><td>" +
      //     ["Day " + i] +
      //     "</td><td>" +
      //     forecastDays[i].temperatureHigh +
      //     "</td><td>" +
      //     forecastDays[i].temperatureLow +
      //     "</td><td>" +
      //     forecastDays[i].summary +
      //     "</td><td>" +
      //     forecastDays[i].icon +
      //     "</td></tr>";
      //   $(".weather").append(forecastHTML);
      // }
      createWeatherCard(destinationCity, forecastDays);
    });

    $(".weather").empty();
  });
});
