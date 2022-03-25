import * as THREE from "three";
import "./styles.css";

function init() {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const scene = new THREE.Scene();

  const plane = getPlane(4);
  const box = getBox(1, 1, 1);

  box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;

  scene.add(box);
  scene.add(plane);

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

  render.setSize(innerWidth, innerHeight);

  document.getElementById("webgl").appendChild(render.domElement);

  render.render(scene, camera);
}

function getBox(w, h, d) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  return new THREE.Mesh(geometry, material);
}

function getPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(geometry, material);
}

init();
