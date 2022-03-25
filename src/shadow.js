import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "./OrbitControls";
import "./styles.css";

function init() {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const scene = new THREE.Scene();
  const gui = new GUI();

  window.enbaledFog = false;

  if (window.enbaledFog) scene.fog = new THREE.FogExp2(0xffffff, 0.2);

  const plane = getPlane(20);
  const box = getBox(1, 1, 1);
  const pointLight = getPointLight(1);
  const sphere = getSphere(0.05);

  pointLight.position.y = 2;

  box.position.y = box.geometry.parameters.height / 2;
  plane.name = "plane-1";
  plane.rotation.x = Math.PI / 2;

  pointLight.add(sphere);
  scene.add(box);
  scene.add(plane);
  scene.add(pointLight);

  gui.add(pointLight, "intensity", 0, 10);
  gui.add(pointLight.position, "y", 0, 10);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 5;
  camera.position.x = 1;
  camera.position.y = 2;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const render = new THREE.WebGLRenderer();

  render.shadowMap.enabled = true;
  render.setSize(innerWidth, innerHeight);
  render.setClearColor("rgb(120,120,120)");
  document.getElementById("webgl").appendChild(render.domElement);
  new OrbitControls(camera, render.domElement);
  update(render, scene, camera);
  return scene;
}

function update(render, scene, camera) {
  render.render(scene, camera);

  requestAnimationFrame(() => update(render, scene, camera));
}

function getPointLight(intensity) {
  const light = new THREE.PointLight("#ffffff", intensity);
  light.castShadow = true;
  return light;
}

function getBox(w, h, d) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)"
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
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
    color: "rgb(120,120,120)",
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

window.scene = init();
