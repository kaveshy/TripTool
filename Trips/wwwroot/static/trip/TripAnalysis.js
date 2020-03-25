"use strict";
var tripData = [];
var currentIndex = 0;
var timeout;
var map;
var marker;
var orientationCount = 0;
var playRate = 1;
var interval;
var phoneRenderer;
var tripGraph;
$(document).ready(function () {
    var offsetH = 364;
    phoneRenderer = new PhoneRenderer(offsetH);
    phoneRenderer.addLightsToScene();
    phoneRenderer.addFloorToScene();
    //phoneRenderer.addPhoneToScene("~/TripTool/wwwroot/lib/bootstrap/models/", onLoaded);
    phoneRenderer.addPhoneToScene("../models/", onLoaded);
    $("#trip-details").height(window.innerHeight - offsetH - 60);
    $("#trip-details").show();
    $("#renderer").hide();
    tripGraph = new TripGraph($("#graph").get(0));
    setupEventListeners();
    
});
function setupEventListeners() {
    $("#btnEnter").click(function () {
        onLoaded();
    });
    $("#list").bind("change", function () {
        tripGraph.updateGraph();
    });
    $("#step-backward").click(function () {
        stepBack();
    });
    $("#stop").click(function () {
        stopPlay();
    });
    $("#step-forward").click(function () {
        stepForward();
    });
    $("#play").click(function () {
        play(1);
    });
    $("#play5").click(function () {
        play(5);
    });
    $("#play10").click(function () {
        play(10);
    });
    $("#trip-details-tab").click(function () {
        $("#trip-details").show();
        $("#renderer").hide();
    });
    $("#renderer-tab").click(function () {
        $("#trip-details").hide();
        $("#renderer").show();
    });

    var mouseDown;
    $("#graph")
        .mousedown(function () {
        mouseDown = true;
    })
        .mousemove(function (e) {
        if (mouseDown) {
            handleMouseInput(e);
        }
    })
        .mouseup(function () {
        mouseDown = false;
    })
        .mouseout(function () {
        mouseDown = false;
    })
        .click(function (e) {
        handleMouseInput(e);
    });
    $(document).keydown(function (event) {
        var key = event.which;
        switch (key) {
            case 37:
                stepBack();
                break;
            case 39:
                stepForward();
                break;
        }
    });
}
function initMap() {
    var latlng = new google.maps.LatLng(-30.5595, 22.9375);
    map = new google.maps.Map(document.getElementById("google-map"), {
        center: latlng,
        zoom: 16
    });
}
function handleMouseInput(e) {
    currentIndex = tripGraph.eventIdAtPosition(e.pageX);
    tripGraph.updateGraph();
    moveSelection();
}
function onLoaded() {
    phoneRenderer.phonegroup.rotation.x = -1.5708;
    phoneRenderer.renderScene();
    var prams2 = getAllParameters();
    var prams = getAllParametersBTN();
    if (prams != undefined) {
        var id = getTripID(prams);
        var prod = getIsProd(prams);
        console.log("Trip Id: " + id + " Prod: " + prod);
        if (id != undefined) {
            loadTrip(id, prod);
        }
        else {
            console.error("Invalid parameters. Try something like: ?id=0 or  ?id=0&prod=true id issue");
        }
    }
    else {
        console.error("Invalid parameters. Try adding something like: ?id=0 or  ?id=0&prod=true");
    }
}

function onLoadTrip() {
    var Id = document.getElementById("TripID").value;
    var Prod = "true";
    if (Id != undefined) {
        loadTrip(id, Prod);
    } else {

    }
}

function getAllParametersBTN() {
    var Id = document.getElementById("TripID").value;
    var Param = "?id="+ Id + "&prod=true";
    var url = Param;
    var urlParts = url.split("?");
    if (urlParts.length > 1) {
        var params = urlParts[1];
        var paramParts = params.split("&");
        return paramParts;
    }
}

function getAllParameters() {
    var url = window.location.href;
    var urlParts = url.split("?");
    if (urlParts.length > 1) {
        var params = urlParts[1];
        var paramParts = params.split("&");
        return paramParts;
    }
}
function getTripID(params) {
    var id;
    params.forEach(function (element) {
        var splits = element.split("=");
        if (splits.length > 1) {
            if (splits[0] == "id") {
                id = splits[1];
            }
        }
    });
    return id;
}
function getIsProd(params) {
    var id = false;
    params.forEach(function (element) {
        var splits = element.split("=");
        if (splits.length > 1) {
            if (splits[0] == "prod") {
                id = splits[1] == "true";
            }
        }
    });
    return id;
}
function loadTrip(id, prod) {
    var route = "get/tripdetails/";
    if (prod)
        route += "prod/";
    $.get(route + id)
        .done(function (data) {
        console.log("Trip details call done");
        layoutTripDetails(data);
    })
        .fail(function () {
        console.log("Trip details call error");
    })
        .always(function () {
        console.log("Trip details call finished");
    });
    var eventsRoute = "get/tripevents/";
    if (prod)
        eventsRoute += "prod/";
    console.log("Get: " + eventsRoute);
    $.get(eventsRoute + id)
        .done(function (data) {
        console.log("Trip events call done");
        consume(data);
    })
        .fail(function () {
        console.log("Trip events call error");
    })
        .always(function () {
        console.log("Trip events call finished");
    });
}
function layoutTripDetails(data) {
    var tripDetails = JSON.parse(data);
    var platform = "Unknown";
    if (tripDetails.platform == 1)
        platform = "iOS";
    if (tripDetails.platform == 2)
        platform = "Android";
    var content = "<b>" + platform + "</b>";
    content += "<b> - " + Math.round(tripDetails.distance * 10) / 10 + "km </b>";
    content += "</br>";
    if (tripDetails.summary.validForPayback == true) {
        content += "</br>Valid";
        content += "</br>Score: " + tripDetails.summary.score;
        content += "</br>True Score: " + tripDetails.summary.trueScore;
        content += "</br>Star Score: " + tripDetails.summary.starScore;
    }
    else {
        content += "</br>Invalid</br>" + tripDetails.summary.validityReason;
    }
    content += "</br>";
    content +=
        "</br>" +
            FormatPenalty(tripDetails.summary.harshBrakesPerKilometerPenaltyDetails);
    content +=
        "</br>" +
            FormatPenalty(tripDetails.summary.rapidAccelerationsPerKilometerPenaltyDetials);
    content +=
        "</br>" + FormatPenalty(tripDetails.summary.phoneDisturbancePenaltyDetails);
    content +=
        "</br>" + FormatPenalty(tripDetails.summary.nightRatioPenaltyDetails);
    content +=
        "</br>" + FormatPenalty(tripDetails.summary.speedRatioPenaltyDetails);
    $("#trip-details").html(content);
}
function FormatPenalty(obj) {
    return obj.title + " " + Math.round(obj.penaltyDisplayPercent * 100) + "%";
}
function consume(data) {
    
    try {
        tripData = JSON.parse(data);
        console.log(tripData.length + " events");
        tripData = getProcessedData(tripData);
        var keys = getOrderedKeys(tripData[0]);
        populateList(keys);
        populateMap();
        tripGraph.updateGraph();
        moveSelection();
        $("#loader").fadeOut("slow");
    }
    catch (error) {
        $("#loading-message").text("Loading Failed");
    }
}
function getProcessedData(data) {
    var lastSpeed = 0.0;
    var lastTime = new Date();
    for (var i = 0; i < data.length; i++) {
        var e = data[i];
        delete e["eventGroupId"];
        delete e["locale"];
        e.accelMag_d = Math.abs(e.accelX) + Math.abs(e.accelY) + Math.abs(e.accelZ);
        e.accelAve_d = (e.accelX + e.accelY + e.accelZ) / 3;
        e.accelY = e.accelY * -9.8;
        if (i >= 0 && e.gpsSpeed != null) {
            var diff = Math.abs(lastTime.getTime() - new Date(e.gpsDateTime).getTime());
            if (!isNaN(diff)) {
                e.gpsAcceleration_d = (e.gpsSpeed - lastSpeed) / (diff / 1000);
            }
            else {
                e.gpsAcceleration_d = null;
            }
            lastSpeed = e.gpsSpeed;
            lastTime = new Date(e.gpsDateTime);
        }
        else {
            e.gpsAcceleration_d = null;
        }
        if (e.motionType == 5)
            e.motionType = 0;
        else
            e.motionType = 1;
    }
    data[0].gpsAcceleration_d = 3;
    data[1].gpsAcceleration_d = -3;
    data[0].accelY = 3;
    data[1].accelY = -3;
    return data;
}
function getOrderedKeys(event) {
    return Object.keys(event).sort();
}
function getSelectedKeys() {
    
    var items = $("#list").children();
    var selectedKeys = [];
    for (var i = 0; i < items.length; i++) {
        var checkbox = $(items[i])
            .find("input[type=checkbox]")
            .get(0);
        if ($(checkbox).prop("checked") == true) {
            selectedKeys.push($(items[i]).attr("id"));
        }
        
    }
    return selectedKeys;
}
function populateList(items) {
    var _loop_1 = function (i) {
        var key = items[i];
        if (key == "id" ||
            key == "lat" ||
            key == "lon" ||
            key == "harshEvent" ||
            key == "speedLimitTomTomLineId" ||
            key == "tripId" ||
            key == "bearingDeviation" ||
            key == "correctedEventTime")
            return "continue";
        var checked = readCookie(checkedCookieName(key));
        if (checked == "true")
            checked = "checked";
        else
            checked = "";
        var color = readCookie(colorCookieName(key));
        if (color == null)
            color = colorArray[i];
        $("#list").append('<div id="' +
            key +
            '" class="legend-item"><input type="color" value="' +
            color +
            '"><input type="checkbox" ' +
            checked +
            "><label>" +
            key +
            "</label><span></span></div>");
        $("#" + key + " input[type=color]").bind("change", function () {
            var value = $("#" + key + " input[type=color]").prop("value");
            document.cookie = colorCookieName(key) + "=" + value;
        });
        $("#" + key + " input[type=checkbox]").bind("change", function () {
            var value = $("#" + key + " input[type=checkbox]").prop("checked");
            document.cookie = checkedCookieName(key) + "=" + value;
        });
    };
    for (var i = 0; i < items.length; i++) {
        _loop_1(i);
    }
}
function colorCookieName(key) {
    return key + "_color";
}
function checkedCookieName(key) {
    return key + "_checked";
}
function populateMap() {
    var path = [];
    for (var i = 0; i < tripData.length; i++) {
        var eventRow = tripData[i];
        if (eventRow.lat != null && eventRow.lon != null) {
            var o = {
                lat: eventRow.lat,
                lng: eventRow.lon
            };
            path.push(o);
        }
    }
    var line = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#68ccff",
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    line.setMap(map);
}
function moveSelection() {
    if (tripData.length > currentIndex && currentIndex >= 0) {
        if ($("#phoneOrientations input[type=checkbox]").prop("checked") == true) {
            var extraOrientations = tripData[currentIndex].phoneOrientations;
            if (extraOrientations.length > 0)
                startPhoneOrientationInterval(extraOrientations);
        }
        else {
            endPhoneOrientationInterval();
            phoneRenderer.setPhoneOrientation(new THREE.Quaternion(tripData[currentIndex].rotationX, tripData[currentIndex].rotationY, tripData[currentIndex].rotationZ, tripData[currentIndex].rotationW));
            phoneRenderer.renderScene();
        }
        updateSelectedValues();
        if (tripData[currentIndex].lat != null &&
            tripData[currentIndex].lon != null) {
            var latlong = new google.maps.LatLng(tripData[currentIndex].lat, tripData[currentIndex].lon);
            map.setCenter(latlong);
            if (marker != null)
                marker.setMap(null);
            marker = new google.maps.Marker({
                position: latlong,
                map: map
            });
        }
    }
    else {
        currentIndex = Math.max(0, currentIndex);
        currentIndex = Math.min(tripData.length - 1, currentIndex);
    }
}
function startPhoneOrientationInterval(extraOrientations) {
    endPhoneOrientationInterval();
    setPhoneOrientationFrom(extraOrientations[0]);
    interval = setInterval(function () {
        setPhoneOrientationFrom(extraOrientations[orientationCount]);
        if (orientationCount >= extraOrientations.length - 1) {
            endPhoneOrientationInterval();
        }
        else {
            orientationCount++;
        }
    }, 1000 / playRate / extraOrientations.length);
}
function endPhoneOrientationInterval() {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
    orientationCount = 1;
}
function setPhoneOrientationFrom(extraOrientations) {
    if (extraOrientations != undefined) {
        phoneRenderer.setPhoneOrientation(new THREE.Quaternion(extraOrientations.x, extraOrientations.y, extraOrientations.z, extraOrientations.w));
        phoneRenderer.renderScene();
    }
}
function drawPositionMarker() {
    var canvas = $("#graph").get(0);
    if (canvas.getContext) {
        var context = canvas.getContext("2d");
        context.beginPath();
        var x = (currentIndex / tripData.length) * canvas.width;
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.stroke();
    }
}
function updateSelectedValues() {
    var items = $("#list").children();
    for (var i = 0; i < items.length; i++) {
        $(items[i])
            .find("span")
            .text("");
    }
    var selectedKeys = getSelectedKeys();
    for (var i = 0; i < selectedKeys.length; i++) {
        var eventRow = tripData[currentIndex];
        var key = selectedKeys[i];
        if (key) {
            var value = eventRow[key];
            $("#" + key + " span").text(getFormatedValue(value, key));
        }
    }
}
function getFormatedValue(value, key) {
    if (typeof value == "number")
        value = parseFloat(value.toFixed(4));
    if (value == null) {
        value = "null";
    }
    else if (key == "gpsSpeed") {
        value = value * 3.6;
        value = parseFloat(value.toFixed(1));
        value = value + " km/h";
    }
    else if (key == "gpsAcceleration_d") {
        value = parseFloat(value.toFixed(1));
        value = value + " m/s";
    }
    else if (key == "accelY") {
        value = parseFloat(value.toFixed(1));
        value = value + " m/s";
    }
    else if (key == "eventDateTime" ||
        key == "gpsDateTime" ||
        key == "insertedTime" ||
        key == "correctedEventTime") {
        var date = new Date(value);
        var m = date.getMonth() + 1;
        value =
            date.getFullYear() +
                "/" +
                m +
                "/" +
                date.getDay() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds();
    }
    else if (key == "phoneOrientations") {
        value = value.length;
    }
    return value;
}
function stepBack() {
    currentIndex = Math.max(currentIndex - 1, 0);
    tripGraph.updateGraph();
    moveSelection();
}
function stepForward() {
    currentIndex = Math.min(currentIndex + 1, tripData.length - 1);
    tripGraph.updateGraph();
    moveSelection();
}
function stopPlay() {
    playRate = 1;
    clearInterval(timeout);
}
function play(rate) {
    playRate = rate;
    clearInterval(timeout);
    timeout = setInterval(stepForward, 1000 / rate);
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ")
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
