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

//Setup Firebase
var firebaseConfig = {
  apiKey: "AIzaSyD04RH4viytS6LGtxTYy0PUjxbqcHWEBj4",
  authDomain: "travel-helper-8baf0.firebaseapp.com",
  databaseURL: "https://travel-helper-8baf0.firebaseio.com",
  projectId: "travel-helper-8baf0",
  storageBucket: "travel-helper-8baf0.appspot.com",
  messagingSenderId: "318582410710",
  appId: "1:318582410710:web:b02b6fbb1c2c4a8016a877"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var destinationCity;
var originCity;
var tripDate;
var daysText = [];
var popularCities;

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

//Hide the wrapper
$('#wrapper').hide();

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

//Update slideshow with images
function updateSlideShow(images) {
  //console.log(images);

  var defaultImages=["https://media.gettyimages.com/photos/st-stephen-cathedral-in-vienna-austria-picture-id827407010?s=612x612",
                    "https://images.unsplash.com/photo-1519923041107-e4dc8d9193da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
                    "https://handluggageonly.co.uk/wp-content/uploads/2015/11/906073_10153728868514784_5225031761405831432_o.jpg",
                    "https://lh3.googleusercontent.com/proxy/EGGq6s43BUt2rtQZIep35ESOuX3ZFJ5Iw49MJiseAPDsE5PQwxPl3agWtK_dYfWw1awXUM5xPEh6rsfEtCBc9OynpcjcTb6Onc5BU4bCIxRHeF5TOhFteA",
                    "https://cdn2.wanderlust.co.uk/media/1115/articles-a-pretty-picture-is-not-enough-it-needs-to-be-original-photo-mike-baird1.jpg?anchor=center&mode=crop&width=1200&height=0&rnd=131455539260000000"]

  if(images.length===0)
  {
    images=defaultImages;
  }

  //for each image assign src to index
  for (var i = 0; i < images.length; i++) {
    var cardId = "#city-image-" + i;
    $(cardId).attr("src", images[i]);
  }
}

//Update Directions card with turn by turn to destination
function updateDirectionsCard(destinationCity, originCity, directions) {
  //Display Card
  $("#directions-card").removeClass("d-none");

  //Change Heading
  $("#directions-city").html("Directions from " + originCity.toUpperCase());

  //Get Table
  var directionsTable = $("#directions-table");

  //Append direction to Directions card table
  directions.forEach(element => {
    //Create table row
    var newRow = $("<tr>");

    var newCol = $("<td>")
      .addClass("font-weight-normal")
      .text(element);

    newRow.append(newCol);
    // append new table row
    directionsTable.append(newRow);
  });
}

//Update each event card with title, address, description, start time, and image
function updateEventsCard(destinationCity, events) {
  console.log(events);

  //Assign events to events card
  for (var i = 0; i < events.length; i++) {

    var currentEventHTML = '<div class="card mb-2">' +
      '<h5 class="card-header"id="card-' + i + '-title">Event Title</h5>' +
      '<div class="card-body">' +
      '<h5 id="card-' + i + '-des">Desciption</h5>' +
      '<p id="card-' + i + '-time">Date and Time</p>' +
      '<p id="card-' + i + '-address">Address</p>' +
      '<a id="card-' + i + '-link" class="btn btn-outline-dark btn-sm">View Venue</a>' +
      '</div>' +
      '</div>'
    $('#event-col-1').append(currentEventHTML);

    var titleId = "#card-" + i + "-title";
    var timeId = "#card-" + i + "-time";
    var addressId = "#card-" + i + "-address";
    var descId = "#card-" + i + "-des";
    var linkId ="#card-" + i+ "-link";
    var title = events[i].title;

    var address;
    //if no address available, place generic
    if (events[i].address == null) {
      address = "No address available";
    } else {
      address = events[i].address;
    }

    var desc;
    //if no desc, place generic
    if (events[i].description == null) {
      desc = "No description available";
    } else {
      desc = events[i].description;
    }

    var time;
    //if no time, place generic
    if (events[i].time == null) {
      time = "No time available";
    } else {
      time = events[i].time;
    }
    var venueURL;
    if (events[i].venueURL == null){
      
      venueURL = "No venue available";
    } else{
      venueURL = events[i].venueURL;
    }
    console.log(events[i])
    //Update HTML elements

    $(titleId).html(title);
    $(timeId).html(time);
    $(addressId).html(address);
    $(descId).html(desc);
    $(linkId).attr("href",venueURL).attr("target","_blank")
  
  }
}

//Create Weather Card and Append to page
function createWeatherCard(destination, forecastResults) {
  //Get days
  getDays();

  //Update Destination city, todays date and weather
  $("#destination-city").text("TREK TO " + destination.toUpperCase());
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

//This function should get called in the form addSearchToDatabase(destinationCity) in every valid search
function addSearchToDatabase(mySearch) {
  mySearch = mySearch.trim().toLowerCase();
  console.log(mySearch);
  var found = false;
  for (var i = 0; i < popularCities.length; i++) {
    if (popularCities[i].name === mySearch) {
      popularCities[i].count++;
      found = true;
      break;
    }
  }
  if (!found) {
    popularCities.push({
      name: mySearch,
      count: 1
    });
  }

  var updates = {};
  updates["popularCities/"] = popularCities;
  database.ref().update(updates);
}

//Returns the most city with the most searches currently.
function findMostPopularCity() {
  var currentMax = 0;
  var mostPopular = "";

  for (var i = 0; i < popularCities.length; i++) {
    if (popularCities[i].count > currentMax) {
      currentMax = popularCities[i].count;
      mostPopular = popularCities[i].name;
    }
  }
  //console.log(mostPopular);
  return mostPopular;
}

//Submit button on click event handler
//TODO: Add time input for future search. Need to solve time conversion issues between string and ms.
//Maybe use moment.js library?

$("#btn-submit").on("click", function () {
  event.preventDefault();
  //Empty Directions
  $("#directions-table").empty();
  $("#dailyTempDisplay").empty();
  $('#event-col-1').empty();

  $('#day0-weatherOverview').text("No data available");
  $('#day0-tmp').text("No data available");

  $("#destination-city").text("TREK TO " + "DESTINATION UNKNOWN");

  $("#directions-city").text("Directions from " + "ORIGIN UNKNOWN");

  $("#directions-card").hide();

  //TODO: add better input validation

  var destinationCity = "";
  var originCity = "";
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
  //console.log(originCity);
  //console.log(destinationCity);

  //TODO: add direitons ajax
  //Note: may need to be called only after acquiring latitude and longitude
  if (destinationCity.length > 0 && originCity.length > 0) {
    $("#directions-card").show();
    var directionsURL =
      "https://cors-anywhere.herokuapp.com/http://www.mapquestapi.com/directions/v2/route?key=Gx9QGTMeo5RatQTBAvX2JHdG9Au9KUkD&from=" +
      originCity +
      "&to=" +
      destinationCity;

    $.ajax({
      url: directionsURL,
      method: "GET"
    }).then(function (response) {
      //console.log(response);
      var steps = response.route.legs[0].maneuvers;
      var directions = [];
      for (var i = 0; i < steps.length; i++) {
        //console.log(steps[i].narrative);
        directions.push(steps[i].narrative);
      }
      updateDirectionsCard(destinationCity, originCity, directions);
    });
  }

  if (destinationCity.length > 0) {
    $('#wrapper').show();
    var timeString = "This Week";
    var eventsApiKey = "NvkjfRqn6GrLB7PF";
    var eventsQueryURL =
      "https://cors-anywhere.herokuapp.com/http://api.eventful.com/json/events/search?&app_key=" +
      eventsApiKey +
      "&location=" +
      destinationCity +
      "&date=" +
      timeString;

    //TODO: confirm that this api key is mine
    //TODO: any additional validation of city name??
    var weatherApiKey = "d5c1138b95b6df5cb3340a9ed55fd35b";
    var weatherQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      destinationCity +
      "&units=metric&appid=" +
      weatherApiKey;

    var pixabayApiKey = "15601799-1eeb362733cc8b4dd8f7e5c79";
    var pixabayQueryURL =
      "https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?key=" +
      pixabayApiKey +
      "&q=" +
      destinationCity +
      "&image_type=photo";

    //returns an array of image strings, maximum of 5
    $.ajax({
      url: pixabayQueryURL,
      method: "GET"
    }).then(function (response) {
      //console.log(response);
      var pictureList = response.hits;
      var pictureLinks = [];
      for (var i = 0; i < Math.min(5, pictureList.length); i++) {
        pictureLinks.push(pictureList[i].webformatURL);
      }
      updateSlideShow(pictureLinks);
    });

    $.ajax({
      url: eventsQueryURL,
      method: "GET"
    }).then(function (response) {
      var objResponse = JSON.parse(response);
      //console.log(objResponse);
      var events = [];

      for (var i = 0; i < objResponse.events.event.length; i++) {
        var current = objResponse.events.event[i];
        var event = {
          title: current.title,
          address: current.venue_address,
          description: current.description,
          time: current.start_time,
          image: current.image,
          venueURL: current.venue_url
        };
        events.push(event);
      }
      //console.log(events);
      updateEventsCard(destinationCity, events);
      $("html,body").animate({
          scrollTop: $("#scroll-target").offset().top
        },
        "slow"
      );
    });

    $.ajax({
      url: weatherQueryURL,
      method: "GET"
    }).then(function (response) {
      var results = response;

      var longitude = results.coord.lon;
      var latitude = results.coord.lat;
      //console.log(latitude + " " + longitude);
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
      }).then(function (response) {
        var results = response;
        var forecastDays = results.daily.data;

        //Update Weather Card
        createWeatherCard(destinationCity, forecastDays);

        //Slide page down to results AFTER ALL CARDS ARE UPDATED

        //Store data to firebase
        addSearchToDatabase(destinationCity);
      });
    });
  }
});

//Updates local info from database in real time
database.ref().on(
  "value",
  function (snapshot) {
    //console.log(snapshot.val());

    popularCities = snapshot.val().popularCities;
    //console.log(popularCities);
    console.log("most popular city is: " + findMostPopularCity());
  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);