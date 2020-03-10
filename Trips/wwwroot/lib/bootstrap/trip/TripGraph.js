"use strict";
var colorArray = [
    "#6666FF",
    "#50ffb0",
    "#50ccb0",
    "#5099b0",
    "#9990FF",
    "#bb70FF",
    "#dd50FF",
    "#ff30FF",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF"
];
var graphLinePadding = 10;
var TripGraph = (function () {
    function TripGraph(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        if (this.context) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    TripGraph.prototype.updateGraph = function () {
        var selectedKeys = getSelectedKeys();
        var canvas = $("#graph").get(0);
        if (this.context) {
            var context = this.canvas.getContext("2d");
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var s = 0; s < selectedKeys.length; s++) {
                var color = $("#" + selectedKeys[s] + " input[type=color]").prop("value");
                var k = selectedKeys[s];
                if (k != undefined) {
                    if (k == "isPostTripEvent") {
                        this.drawGraphFillForBool(k, color + "90");
                    }
                    if (k == "motionType") {
                        this.drawGraphFillForInt(k, color + "90", 0, 1);
                    }
                }
            }
            for (var s = 0; s < selectedKeys.length; s++) {
                var color = $("#" + selectedKeys[s] + " input[type=color]").prop("value");
                var k = selectedKeys[s];
                if (k != undefined) {
                    if (k == "isPostTripEvent" || k == "motionType") {
                    }
                    else {
                        var line = this.drawGraphLine(k, color + "B0");
                        if (line)
                            this.drawGraphGuideForKey(k, line.min, line.max, color + "90");
                    }
                }
            }
        }
        drawPositionMarker();
    };
    TripGraph.prototype.drawGraphLine = function (key, color) {
        if (this.context) {
            var line = this.getLineForKey(key);
            this.context.beginPath();
            for (var i = 0; i < line.values.length; i++) {
                var y = this.canvas.height -
                    graphLinePadding * 2 -
                    ((line.values[i] - line.min) / (line.max - line.min)) *
                        (this.canvas.height - graphLinePadding * 2);
                var x = (i / line.values.length) * this.canvas.width;
                if (i == 0)
                    this.context.moveTo(x, y + graphLinePadding);
                else
                    this.context.lineTo(x, y + graphLinePadding);
            }
            this.context.lineWidth = 1.5;
            this.context.strokeStyle = color;
            this.context.stroke();
            return line;
        }
    };
    TripGraph.prototype.drawGraphFillForBool = function (key, color) {
        this.drawGraphFillForInt(key, color, 0, 1);
    };
    TripGraph.prototype.drawGraphFillForInt = function (key, color, min, max) {
        if (this.context) {
            var line = this.getLineForKey(key);
            this.context.beginPath();
            for (var i = 0; i < line.values.length; i++) {
                var y = this.canvas.height -
                    ((line.values[i] - line.min) / (line.max - line.min)) *
                        this.canvas.height;
                var x = (i / line.values.length) * this.canvas.width;
                if (i == 0)
                    this.context.moveTo(x, y);
                else
                    this.context.lineTo(x, y);
            }
            this.context.lineTo(this.canvas.width, 0);
            this.context.lineTo(this.canvas.width, this.canvas.height);
            this.context.lineTo(0, this.canvas.height);
            this.context.closePath();
            this.context.fillStyle = color;
            this.context.fill();
            return line;
        }
    };
    TripGraph.prototype.drawGraphGuideForKey = function (key, min, max, color) {
        switch (key) {
            case "maxPhoneRotationChange":
                this.drawGraphGuide(1, min, max, color);
                break;
        }
    };
    TripGraph.prototype.drawGraphGuide = function (height, min, max, color) {
        if (this.context) {
            var y = this.canvas.height -
                graphLinePadding * 2 -
                ((height - min) / (max - min)) *
                    (this.canvas.height - graphLinePadding * 2);
            this.context.moveTo(0, y + graphLinePadding);
            this.context.lineTo(this.canvas.width, y + graphLinePadding);
            this.context.lineWidth = 1;
            this.context.strokeStyle = color;
            this.context.stroke();
        }
    };
    TripGraph.prototype.getLineForKey = function (key) {
        var line = {
            values: [],
            min: Number.MAX_VALUE,
            max: Number.NEGATIVE_INFINITY
        };
        for (var i = 0; i < tripData.length; i++) {
            var item = tripData[i];
            var value = item[key];
            if (typeof value == "boolean") {
                if (value == true)
                    value = 1.0;
                else {
                    value = 0.0;
                }
            }
            if (value == null) {
                if (line.values.length > 0) {
                    value = line.values[line.values.length - 1];
                    line.values.push(value);
                }
            }
            else {
                line.values.push(value);
            }
            line.values.push(value);
            line.min = Math.min(value, line.min);
            line.max = Math.max(value, line.max);
        }
        if (line.min == line.max)
            line.max += 1;
        return line;
    };
    TripGraph.prototype.eventIdAtPosition = function (pageX) {
        var offset = this.canvas.getBoundingClientRect();
        var eventId = ((pageX - offset.left) / this.canvas.width) * tripData.length;
        return Math.round(eventId);
    };
    return TripGraph;
}());
