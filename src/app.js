var THREE = require("three");
require("hammerjs")
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import CameraControls from 'camera-controls';
CameraControls.install({ THREE: THREE })

let stats;

let progressCounterTotal = 0;
let progressCounter = 0;

class Stage {
    constructor() {
        this.setupScene();
        this.setupLights();
        this.makeInteractive();

    }

    setupScene() {
        this.view3D = document.getElementById("view-3d");

        var body = document.body,
            html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        this.view3D.style.width = 100 + "%"
        this.view3D.style.height = height + "px";

        this.positionInfo = this.view3D.getBoundingClientRect();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.canvas = this.view3D;
        this.renderer.setSize(this.positionInfo.width, this.positionInfo.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000);
        this.view3D.appendChild(this.renderer.domElement);

        let perspective_camera = new THREE.PerspectiveCamera(45, this.positionInfo.width / this.positionInfo.height, .1, 300);

        this.defaultCameraPos = new THREE.Vector3(-10, 1.5, -2);
        this.camera = perspective_camera;
        this.camera.position.copy(this.defaultCameraPos);

        this.scene = new THREE.Scene();

        window.addEventListener('resize', () => this.onWindowResize(), false);

        document.addEventListener("visibilitychange", (evt) => {

        });

        this.lightColor = 0x2222ff;

        var gltf_loader = new GLTFLoader();
        gltf_loader.load("models/boat1.glb",
            (gltf) => {

                this.scene.add(gltf.scene);

                gltf.scene.traverse((child) => {
                    // this[child.name] = child;
                    console.log(child.name + "    " + child.isMesh)
                    if (child.isMesh) {
                        if (child.name === "frame3") {
                            let material = new THREE.MeshLambertMaterial({
                                color: 0xd7b656,
                                wireframe: false,
                                side: THREE.DoubleSide

                            });
                            child.material = material;
                        }
                        else if (child.name === "ww") {
                            let material = new THREE.MeshLambertMaterial({
                                color: 0x332f33,
                                wireframe: false,
                                side: THREE.DoubleSide

                            });
                            child.material = material;
                        }
                        else if (child.name === "hull" || child.name === "pPlane10") {
                            let material = new THREE.MeshLambertMaterial({
                                color: this.lightColor,
                                opacity: .35,
                                transparent: true,
                                side: THREE.DoubleSide,

                                emissive: 0x0000ff
                            });
                            child.material = material;
                        }
                        else if (child.name === "LED_bulb") {
                            let material = new THREE.MeshBasicMaterial({
                                color: 0xffffff,

                            });
                            child.material = material;
                        }
                        else if (child.name === "body_upper") {
                            let material = new THREE.MeshLambertMaterial({
                                color: 0xff2033,
                                transparent: true,
                                opacity: .4,
                                depthWrite: false,
                                depthTest: true,
                                side: THREE.DoubleSide,
                                emissive: 0xff0000

                            });
                            child.material = material;
                        }

                        else if (child.name === "text") {
                            let material = new THREE.MeshLambertMaterial({
                                color: 0xdddd00,
                                emissive: 0xdddd00

                            });
                            child.material = material;
                        }

                        else {
                            let material = new THREE.MeshLambertMaterial({
                                color: child.material.color,

                                side: THREE.DoubleSide11
                                // frustumCulled : false,

                            });
                            child.material = material;
                        }
                    }

                    if (child.name === "pCylinder21") {

                        this.wheel2 = child;
                        this.wheel2.position.set(.0153, 0.00155, .00213)
                    }
                    else if (child.name === "pCylinder22") {

                        this.wheel3 = child;
                        this.wheel3.position.set(.0153, 0.00155, -.00213)
                    }
                    else if (child.name === "pCylinder23") {

                        // font wheels

                        this.wheel1 = child;
                        this.wheel1.position.set(-.01985, 0.00155, 0)
                    }


                });

                this.animate();
            }, undefined,
            function (err) {
                console.error(err);
            }
        )

        let lightBulbsIntensity = 3;
        let lightBulbsDistance = 9;

        // let sphere = new THREE.SphereGeometry(.01, 20, 20)

        var light1 = new THREE.PointLight(this.lightColor, lightBulbsIntensity, lightBulbsDistance, 1.4);
        // light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        light1.position.set(0, .61, 0);
        this.scene.add(light1);

        var light2 = new THREE.PointLight(this.lightColor, lightBulbsIntensity, lightBulbsDistance, 1.4);
        // light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        light2.position.set(1.95, .66, 0);
        this.scene.add(light2);

        var light3 = new THREE.PointLight(this.lightColor, lightBulbsIntensity, lightBulbsDistance, 1.4);
        // light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        light3.position.set(-2.43, .98, 0);
        this.scene.add(light3);


        var lightWhite1 = new THREE.PointLight(0xffffff, 1, 3, 2);
        // light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        lightWhite1.position.set(0, .61, 0);
        this.scene.add(lightWhite1);

        var lightWhite2 = new THREE.PointLight(0xffffff, 1, 3, 2);
        // light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        lightWhite2.position.set(1.95, .66, 0);
        this.scene.add(lightWhite2);

        var lightWhite3 = new THREE.PointLight(0xffffff, 1, 3, 2);
        // light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })));
        lightWhite3.position.set(-2.43, .98, 0);
        this.scene.add(lightWhite3);


        //// start adding graphics
        // this.scene.add(new THREE.AxesHelper(100));

        this.textureLoader = new THREE.TextureLoader();

        this.controlClock = new THREE.Clock(true);
        this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);

        // this.addHullLights();
        this.addGround();

    }

    resetCamera() {
        this.control.reset();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.render();
    }

    addGround() {
        const loader = new THREE.TextureLoader();

        this.groundTexture = loader.load('textures/grasslight-big.jpg');
        this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
        this.groundTexture.repeat.set(50, 50);
        this.groundTexture.anisotropy = 10;

        this.groundMaterial = new THREE.MeshLambertMaterial({ map: this.groundTexture });

        this.ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200, 200, 200), this.groundMaterial);
        this.ground.position.y = 0;
        this.ground.rotation.x = - Math.PI / 2;
        // mesh.receiveShadow = true;
        this.scene.add(this.ground);


    }

    render(time) {

        this.cameraControls.update(this.controlClock.getDelta());

        this.groundTexture.offset.x -= .0021;
        this.ground.material.needsUpdate = true;


        this.wheel1.rotation.y -= .031;
        this.wheel2.rotation.y -= .031;
        this.wheel3.rotation.y -= .031;


        // this.control.update();
        this.renderer.render(this.scene, this.camera);
    }

    increaseProgress() {
        progressCounter++;
        if (progressCounter == progressCounterTotal) {
            // finished codes
        }
    }

    setupLights() {

        // let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        // dirLight.color.setRGB(1, 1, 1);
        // dirLight.position.set(-19.2, 160, 150);
        // this.scene.add(dirLight);

        // let dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
        // dirLight2.color.setRGB(1, 1, 1);
        // dirLight2.position.set(19.2, 160, -150);
        // this.scene.add(dirLight2);

        let light = new THREE.HemisphereLight(0xffffff, 0xffffff, .2);
        light.position.set(-20, 200, 20);
        this.scene.add(light);
    }

    // library parts
    makeInteractive() {
        this.ham = new Hammer(this.view3D, {
            domEvents: true,
        });

        this.ham.on("tap", e => {
            this.onDocumentMouseClick(e);
        });

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.clickableObjects = [];
    }

    setupActionListener(object, type, callback) {
        if (type === "click") {
            object.clickCallback = callback;
            this.clickableObjects.push(object);
        }
    }

    onDocumentMouseClick(event) {
        this.mouse.x = (event.center.x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.center.y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.clickableObjects);

        if (intersects.length > 0) {
            let selectedObject = intersects[0].object;
            selectedObject.clickCallback({});
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    addHullLights() {

        var hullLightIntenstiy = 3;

        var hullLightLeft1 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.5, .5);
        hullLightLeft1.position.set(0, .3, -.32);
        hullLightLeft1.rotation.set(-.6, 0, 0)
        this.scene.add(hullLightLeft1);

        var hullLightLeftHelper1 = new RectAreaLightHelper(hullLightLeft1);
        // hullLightLeft1.add( hullLightLeftHelper1 );

        var hullLightRight1 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.5, .5);
        hullLightRight1.position.set(0, .3, .35);
        hullLightRight1.rotation.set(-.6 - Math.PI / 2, 0, 0)
        this.scene.add(hullLightRight1);

        var hullLightRightHelper1 = new RectAreaLightHelper(hullLightRight1);
        // hullLightRight1.add( hullLightRightHelper1 );

        var hullLightBottom1 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.5, .5);
        hullLightBottom1.position.set(0, .1, 0);
        hullLightBottom1.rotation.set(-Math.PI / 2, 0, 0)
        this.scene.add(hullLightBottom1);

        var hullLightBottomHelper1 = new RectAreaLightHelper(hullLightBottom1);
        // hullLightBottom1.add( hullLightBottomHelper1 );


        /// front
        var hullLightLeft2 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.5, .5);
        hullLightLeft2.position.set(-2.5, .29, -.28);
        hullLightLeft2.rotation.set(-.6, .11, 0)
        this.scene.add(hullLightLeft2);

        var hullLightLeftHelper2 = new RectAreaLightHelper(hullLightLeft2);
        // hullLightLeft2.add( hullLightLeftHelper2 );

        var hullLightRight2 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.5, .5);
        hullLightRight2.position.set(-2.5, .29, .28);
        hullLightRight2.rotation.set(-.6 - Math.PI / 2, .11, 0)
        this.scene.add(hullLightRight2);

        var hullLightRightHelper2 = new RectAreaLightHelper(hullLightRight2);
        // hullLightRight2.add( hullLightRightHelper2 );

        var hullLightBottom2 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy + .1, 2, .5);
        hullLightBottom2.position.set(-2.3, .16, 0);
        hullLightBottom2.rotation.set(-Math.PI / 2, .07, 0)
        this.scene.add(hullLightBottom2);

        var hullLightBottomHelper2 = new RectAreaLightHelper(hullLightBottom2);
        // hullLightBottom2.add( hullLightBottomHelper2 );

        // back
        var hullLightLeft3 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.1, .5);
        hullLightLeft3.position.set(2.3, .3, -.32);
        hullLightLeft3.rotation.set(-.6, 0, 0)
        this.scene.add(hullLightLeft3);

        var hullLightLeftHelper1 = new RectAreaLightHelper(hullLightLeft3);
        // hullLightLeft3.add( hullLightLeftHelper1 );

        var hullLightRight3 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy, 2.1, .5);
        hullLightRight3.position.set(2.3, .3, .35);
        hullLightRight3.rotation.set(-.6 - Math.PI / 2, 0, 0)
        this.scene.add(hullLightRight3);

        var hullLightRightHelper3 = new RectAreaLightHelper(hullLightRight3);
        // hullLightRight3.add( hullLightRightHelper3 );

        var hullLightBottom3 = new THREE.RectAreaLight(0x0000ff, hullLightIntenstiy + .1, 2.5, .5);
        hullLightBottom3.position.set(2.3, .2, 0);
        hullLightBottom3.rotation.set(-Math.PI / 2, -.1, 0)
        this.scene.add(hullLightBottom3);

        var hullLightBottomHelper3 = new RectAreaLightHelper(hullLightBottom3);
        // hullLightBottom3.add( hullLightBottomHelper3 );

    }

    move() {

    }
}


function resetCamera() {
    stage.resetCamera();
}

let stage = new Stage();

export {
    resetCamera
}