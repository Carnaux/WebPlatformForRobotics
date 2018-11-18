//let OBJLoader = require('../libs/OBJLoader.js');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.background = new THREE.Color("rgb(225,228,233)");

camera.position.z = 5;


const light = new THREE.AmbientLight(0x404040, 1.5); // soft white light
scene.add(light);

let size = 10;
let divisions = 10;
let gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer();
let container = document.getElementById("canvas-container");
let w = window.innerWidth;
let h = window.innerHeight;
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

let Arm = BuildArm();

scene.add(Arm);

animate();

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}

function BuildArm() {
  let gltfLoader = new THREE.GLTFLoader();
  let arm = new THREE.Object3D();
  let base = new THREE.Object3D();
  let motor1 = new THREE.Object3D();
  let motor1_1 = new THREE.Object3D();
  let motor2 = new THREE.Object3D();

  gltfLoader.load("src/models/motor.glb", function (gltf) {
    let eixo1 = new THREE.Mesh();
    let eixo2 = new THREE.Mesh();
    let eixo3 = new THREE.Mesh();
    motor1.copy(gltf.scene.children[2]);
    motor1_1.copy(gltf.scene.children[2]);
    motor2.copy(gltf.scene.children[2]);

    let geometry = gltf.scene.children[3].geometry;
    let material = gltf.scene.children[3].material;
    eixo1 = new THREE.Mesh(geometry, material);
    eixo2 = new THREE.Mesh(geometry, material);
    eixo3 = new THREE.Mesh(geometry, material);

    motor1.add(eixo1);
    motor1_1.add(eixo2);
    motor2.add(eixo1);
    motor1.position.y += 0.5;
    motor1_1.position.y -= 0.5;


  });

  let gearSet1 = new THREE.Object3D();
  gltfLoader.load("src/models/gear8.glb", function (gltf) {
    let gear8 = new THREE.Mesh();
    gear8.copy(gltf.scene);
    gear8.position.set(0.4, 1.6, 0.25);
    gear8.rotation.z = Math.PI / 2;
    gearSet1.copy(gear8);
  });

  gltfLoader.load("src/models/gear1.glb", function (gltf) {
    let gear8_16 = new THREE.Mesh();
    gear8_16.copy(gltf.scene);
    gear8_16.position.set(0.25, 1.6, 0.53);
    gear8_16.rotation.z = Math.PI / 2;
    gearSet1.copy(gear8_16);
  });

  gltfLoader.load("src/models/gear40.glb", function (gltf) {
    let gear24 = new THREE.Mesh();
    gear24.copy(gltf.scene);
    gear24.position.set(0.1, 1.6, 0.85);
    gear24.rotation.z = Math.PI / 2;
    gearSet1.copy(gear24);
  });

  base.add(motor1);
  base.add(motor1_1);
  base.rotation.z = Math.PI / 2;
  base.position.y = 0.5;

  arm.add(base);
  console.log(gearSet1);
  return arm;
}