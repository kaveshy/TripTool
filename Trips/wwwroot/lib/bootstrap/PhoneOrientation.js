"use strict";
var graphLine1 = [];
var graphLine2 = [];
var maxGraphPoints = 600;
var phoneRenderer;
$(document).ready(function () {
    phoneRenderer = new PhoneRenderer(260);
    phoneRenderer.addLightsToScene();
    phoneRenderer.addFloorToScene();
    phoneRenderer.addPhoneToScene("models/", onLoadedModel);
    layoutGraphCanvas();
});
function onLoadedModel() {
    startWebSocket();
}
function startWebSocket() {
    var str = document.location.href;
    var ws = new WebSocket(str.replace("http", "ws") + "get/websocket");
    ws.onopen = function () {
        ws.send("Hi");
        console.log("WebSocket did open");
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        update(received_msg);
    };
    ws.onclose = function () {
        console.log("WebSocket connection closed");
    };
}
function layoutGraphCanvas() {
    var canvas = $("#graph").get(0);
    if (canvas.getContext) {
        var context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}
function update(json) {
    var data = JSON.parse(json);
    var quaternion = new THREE.Quaternion(data.Orientation.X, data.Orientation.Y, data.Orientation.Z, data.Orientation.W).normalize();
    var mViaQuaternion = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
    var eulerAngles = new THREE.Euler().setFromRotationMatrix(mViaQuaternion, "XYZ");
    phoneRenderer.phonegroup.rotation.x = eulerAngles.x - 1.5708;
    phoneRenderer.phonegroup.rotation.y = eulerAngles.y;
    phoneRenderer.phonegroup.rotation.z = eulerAngles.z;
    phoneRenderer.phoneModel.position.x = -data.Acceleration.X;
    phoneRenderer.phoneModel.position.y = -data.Acceleration.Y;
    phoneRenderer.phoneModel.position.z = -data.Acceleration.Z;
    phoneRenderer.renderScene();
    if (graphLine1.length > maxGraphPoints) {
        graphLine1 = graphLine1.slice(graphLine1.length - maxGraphPoints, graphLine1.length - 1);
        graphLine2 = graphLine2.slice(graphLine2.length - maxGraphPoints, graphLine2.length - 1);
    }
    graphLine1.push(data.RotationAmount);
    graphLine2.push(Math.abs(data.Acceleration.X) +
        Math.abs(data.Acceleration.Y) +
        Math.abs(data.Acceleration.Z));
    redrawGraph();
}
function redrawGraph() {
    var canvas = $("#graph").get(0);
    if (canvas.getContext) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        var y = canvas.height - (1 / 4) * canvas.height - 10;
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.lineWidth = 1;
        context.strokeStyle = "#FFFFFF66";
        context.stroke();
        drawGraphLine(context, graphLine2, "#aaaaFF80");
        drawGraphLine(context, graphLine1, "#FFFFFF");
    }
    function drawGraphLine(context, lineData, color) {
        context.beginPath();
        for (var i = 0 - lineData.length; i < lineData.length; i++) {
            var y = canvas.height - (lineData[i] / 4) * canvas.height - 10;
            var x = ((i + (maxGraphPoints - lineData.length)) / maxGraphPoints) *
                canvas.width;
            if (i == 0) {
                context.moveTo(x, y);
            }
            else {
                context.lineTo(x, y);
            }
        }
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
    }
}
