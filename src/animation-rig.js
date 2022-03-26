import * as THREE from "three";
import { GUI } from "dat.gui";
import { Noise } from "noisejs";
import { OrbitControls } from "./OrbitControls";
import "./styles.css";
const noise = new Noise();

function init() {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const gui = new GUI();

  window.enbaledFog = false;

  if (window.enbaledFog) scene.fog = new THREE.FogExp2(0xffffff, 0.2);

  const plane = getPlane(100);
  const boxGrid = getBoxGrid(20, 2.5);
  // const ambientLight = getAmbientLight(1);
  const light = getDirectionLight(1);
  const sphere = getSphere(0.05);
  const helper = new THREE.CameraHelper(light.shadow.camera);
  light.position.y = 8;

  boxGrid.name = "boxGrid";
  plane.name = "plane-1";
  plane.rotation.x = Math.PI / 2;

  light.add(sphere);
  scene.add(boxGrid);
  scene.add(plane);
  scene.add(light);
  scene.add(helper);
  // scene.add(ambientLight);

  gui.add(light, "intensity", 0, 10);
  // gui.add(light.position, "y", 0, 10);
  // gui.add(light.position, "x", 0, 10);
  // gui.add(light, "penumbra", 0, 1);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  const cameraYPosition = new THREE.Group();
  const cameraZPosition = new THREE.Group();
  const cameraYRotation = new THREE.Group();
  const cameraXRotation = new THREE.Group();
  const cameraZRotation = new THREE.Group();

  cameraZRotation.name = "cameraZRotation";
  cameraYPosition.name = "cameraYPosition";
  cameraZPosition.name = "cameraZPosition";
  cameraXRotation.name = "cameraXRotation";
  cameraYRotation.name = "cameraYRotation";

  cameraZRotation.add(camera);
  cameraYPosition.add(cameraZRotation);
  cameraZPosition.add(cameraYPosition);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);
  scene.add(cameraYRotation);

  cameraXRotation.rotation.x = -Math.PI / 2;
  cameraYPosition.position.y = 1;
  cameraZPosition.position.z = 100;

  gui.add(cameraZPosition.position, "z", 0, 100);
  gui.add(cameraYRotation.rotation, "y", -Math.PI, Math.PI);
  gui.add(cameraXRotation.rotation, "x", -Math.PI, Math.PI);
  gui.add(cameraZRotation.rotation, "z", -Math.PI, Math.PI);

  // camera.position.z = 5;
  // camera.position.x = 1;
  // camera.position.y = 2;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  const render = new THREE.WebGLRenderer();

  render.shadowMap.enabled = true;
  render.setSize(innerWidth, innerHeight);
  render.setClearColor("rgb(25,120,120)");
  document.getElementById("webgl").appendChild(render.domElement);
  const controls = new OrbitControls(camera, render.domElement);
  update(render, scene, camera, controls, clock);
  return scene;
}

function update(render, scene, camera, controls, clock) {
  render.render(scene, camera);

  controls.update();

  const timeElapsed = clock.getElapsedTime();

  var cameraXRotation = scene.getObjectByName("cameraXRotation");
  if (cameraXRotation.rotation.x < 0) {
    cameraXRotation.rotation.x += 0.01;
  }

  var cameraZPosition = scene.getObjectByName("cameraZPosition");
  cameraZPosition.position.z -= 0.25;

  var cameraZRotation = scene.getObjectByName("cameraZRotation");
  cameraZRotation.rotation.z =
    noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;

  var boxGrid = scene.getObjectByName("boxGrid");
  boxGrid.children.forEach(function (child, index) {
    var x = timeElapsed + index;
    child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
    child.position.y = child.scale.y / 2;
  });

  requestAnimationFrame(() => update(render, scene, camera, controls, clock));
}

function getPointLight(intensity) {
  const light = new THREE.PointLight("#ffffff", intensity);
  light.castShadow = true;
  return light;
}

function getSpotLight(intensity) {
  const light = new THREE.SpotLight("#ffffff", intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionLight(intensity) {
  const light = new THREE.DirectionalLight("#ffffff", intensity);
  light.castShadow = true;

  light.shadow.camera.left = -40;
  light.shadow.camera.top = -40;
  light.shadow.camera.right = -40;
  light.shadow.camera.bottom = -40;

  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;

  return light;
}

function getAmbientLight(intensity) {
  const light = new THREE.AmbientLight("rgb(10, 30, 50)", intensity);
  return light;
}
function getBox(w, h, d) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(36,100,36)"
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function getBoxGrid(count, gap) {
  const group = new THREE.Group();
  gap = gap + 1;
  for (let i = 0; i <= count; i++) {
    const box = getBox(1, 3, 1);
    box.position.x = i * gap;
    box.position.y = box.geometry.parameters.height / 2;
    group.add(box);
    for (let j = 0; j <= count; j++) {
      const box = getBox(1, 3, 1);
      box.position.x = i * gap;
      box.position.y = box.geometry.parameters.height / 2;
      box.position.z = j * gap;
      group.add(box);
    }
  }

  group.position.x = -(gap * (count - 1)) / 2;
  group.position.z = -(gap * (count - 1)) / 2;

  return group;
}

function getSphere(size) {
  const geometry = new THREE.SphereGeometry(size, 24, 24);
  const material = new THREE.MeshBasicMaterial({
    color: "rgb(255,255,255)"
  });
  return new THREE.Mesh(geometry, material);
}

function getPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(36,50,120)",
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

window.scene = init();
