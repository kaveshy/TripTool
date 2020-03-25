"use strict";
var PhoneRenderer = (function () {
    function PhoneRenderer(offsetH) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.phoneModel = {};
        this.phonegroup = new THREE.Group();
        this.modelPath = "";
        var r = $("#renderer");
        var width = r.width();
        if (width == undefined)
            width = 100;
        var height = window.outerHeight - offsetH;
        this.renderer.setSize(width, window.innerHeight - offsetH);
        this.renderer.setClearColor(0x555555, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        $("#renderer").append(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
        this.camera.position.z = 33;
        this.camera.position.y = 10;
        this.camera.lookAt(0, 0, 0);
    }
    PhoneRenderer.prototype.addLightsToScene = function () {
        this.scene.add(this.getDirectionalLight());
        this.scene.add(this.getAmbiantLight());
        this.scene.add(this.getAmbiantLight());
    };
    PhoneRenderer.prototype.getDirectionalLight = function () {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.17, 100);
        directionalLight.position.set(0, 40, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.radius = 5;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        return directionalLight;
    };
    PhoneRenderer.prototype.getAmbiantLight = function () {
        return new THREE.AmbientLight(0xdddddd);
    };
    PhoneRenderer.prototype.addFloorToScene = function () {
        var floorGeo = new THREE.PlaneGeometry(100, 30, 32);
        var floorMat = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -1.5708;
        floor.position.set(0, -7.5, 0);
        floor.receiveShadow = true;
        this.scene.add(floor);
    };
    PhoneRenderer.prototype.addPhoneToScene = function (path, onLoaded) {
        var _this = this;
        this.onLoaded = onLoaded;
        this.modelPath = path;
        var loader = new THREE.OBJLoader();
        loader.load(this.modelPath + "phone.obj", function (o) { return _this.onLoadedPhone(o); }, null, null);
    };
    PhoneRenderer.prototype.setPhoneOrientation = function (quaternion) {
        quaternion.normalize();
        var mViaQuaternion = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
        var eulerAngles = new THREE.Euler().setFromRotationMatrix(mViaQuaternion, "XYZ");
        this.phonegroup.rotation.x = eulerAngles.x - 1.5708;
        this.phonegroup.rotation.y = eulerAngles.y;
        this.phonegroup.rotation.z = eulerAngles.z;
    };
    PhoneRenderer.prototype.onLoadedPhone = function (o) {
        var _this = this;
        this.phoneModel = o;
        var material = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.4,
            dithering: true
        });
        this.phoneModel.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.castShadow = true;
            }
        });
        this.phonegroup.add(this.phoneModel);
        this.scene.add(this.phonegroup);
        var loader = new THREE.OBJLoader();
        loader.load(this.modelPath + "screen.obj", function (o) { return _this.onLoadedScreen(o); }, null, null);
    };
    PhoneRenderer.prototype.onLoadedScreen = function (o) {
        var texture = new THREE.TextureLoader().load(this.modelPath + "screen_tex.png");
        texture.anisotropy = 16;
        var material = new THREE.MeshStandardMaterial({
            color: 0x002222,
            roughness: 0.4,
            emissive: "#ffffee",
            emissiveMap: texture
        });
        o.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        this.phoneModel.add(o);
        if (this.onLoaded != undefined)
            this.onLoaded();
    };
    PhoneRenderer.prototype.renderScene = function () {
        this.renderer.render(this.scene, this.camera);
    };
    return PhoneRenderer;
}());
