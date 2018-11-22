let objects = [];
let labels = [];

var ObjectsData;

let mouse = {
  x: 0,
  y: 0
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.background = new THREE.Color("rgb(225,228,233)");

camera.position.z = 5;
let raycaster = new THREE.Raycaster();

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

ObjectsData = createData();

let Arm = BuildArm();

document.addEventListener("mousemove", onDocumentMouseMove, false);
console.log(labels[0]);
animate();

function animate() {
  requestAnimationFrame(animate);
  updateData(ObjectsData);
  controls.update();
  hoverObjects();

  renderer.render(scene, camera);
}

function onDocumentMouseMove(e) {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
}

function BuildArm() {
  let arm = new THREE.Group();
  let base = new THREE.Group();
  let elbow = new THREE.Group();
  let motor1 = new THREE.Group();
  let motor1_1 = new THREE.Group();
  let motor2 = new THREE.Group();
  let gear8 = new THREE.Mesh();
  let gear8_16 = new THREE.Mesh();
  let gear24 = new THREE.Mesh();

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("src/models/");
  var url = "motor.mtl";
  mtlLoader.load(url, function(materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("src/models/");
    objLoader.load("motor.obj", function(object) {
      object.children[0].name = ObjectsData.base.motor1.name;
      motor1.copy(object);
      object.children[0].name = ObjectsData.base.motor1_1.name;
      motor1_1.copy(object);
      object.children[0].name = ObjectsData.elbow.motor2.name;
      motor2.copy(object);

      motor1.rotation.z = Math.PI / 2;
      motor1_1.rotation.z = Math.PI / 2;

      motor2.rotation.x = Math.PI / 2;

      motor2.rotation.z = Math.PI / 2;

      motor1.position.x += 0.4;
      motor1_1.position.x -= 0.6;
      motor2.position.x = -0.2;

      motor1.position.y += 0.3;
      motor1_1.position.y += 0.3;
      motor2.position.y = 2;

      motor2.position.z = 0.85;

      base.add(motor1);
      base.add(motor1_1);

      elbow.add(motor2);

      scene.add(motor1);
      scene.add(motor1_1);
      scene.add(motor2);
      scene.add(base);
      scene.add(elbow);

      objects.push(motor1);
      objects.push(motor1_1);
      objects.push(motor2);
    });
  });

  // var mtlLoader = new THREE.MTLLoader();
  // mtlLoader.setPath('src/models/');
  // var url = "motor.mtl";
  // mtlLoader.load(url, function (materials) {

  //   materials.preload();

  //   var objLoader = new THREE.OBJLoader();
  //   objLoader.setMaterials(materials);
  //   objLoader.setPath('src/models/');
  //   objLoader.load('motor.obj', function (object) {

  //   });

  // });

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("src/models/");
  var url = "gear8.mtl";
  mtlLoader.load(url, function(materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("src/models/");
    objLoader.load("gear8.obj", function(object) {
      gear8.copy(object);
      gear8.position.set(0.3, 1.4, 0.25);
      gear8.name = ObjectsData.gearSet1.gear8_1.name;

      gear8.rotation.z = Math.PI / 2;

      base.add(gear8);
      scene.add(gear8);

      objects.push(gear8);
    });
  });

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("src/models/");
  var url = "gear8_16.mtl";
  mtlLoader.load(url, function(materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("src/models/");
    objLoader.load("gear8_16.obj", function(object) {
      gear8_16.copy(object);
      gear8_16.position.set(0.15, 1.4, 0.55);
      gear8_16.name = ObjectsData.gearSet1.gear8_16.name;

      gear8_16.rotation.z = Math.PI / 2;

      base.add(gear8_16);
      scene.add(gear8_16);

      objects.push(gear8_16);
    });
  });

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("src/models/");
  var url = "gear24.mtl";
  mtlLoader.load(url, function(materials) {
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("src/models/");
    objLoader.load("gear24.obj", function(object) {
      gear24.copy(object);
      gear24.position.set(0, 1.4, 0.85);
      gear24.name = ObjectsData.gearSet1.gear24.name;

      gear24.rotation.z = Math.PI / 2;

      gear24.add(elbow);

      base.add(gear24);
      scene.add(gear24);

      objects.push(gear24);
    });
  });

  let labelMotor1 = CreateLabel(ObjectsData.base.motor1);
  labelMotor1.position.set(0.8, -0.8, 0);
  motor1.add(labelMotor1);
  let label1 = {
    name: "motor1",
    label: labelMotor1
  };
  labels.push(label1);

  let labelMotor1_1 = CreateLabel(ObjectsData.base.motor1_1);
  motor1_1.add(labelMotor1_1);
  labelMotor1_1.position.set(0.8, 0.6, 0);
  let label1_1 = {
    name: "motor1_1",
    label: labelMotor1_1
  };
  labels.push(label1_1);

  let labelMotor2 = CreateLabel(ObjectsData.elbow.motor2);
  motor2.add(labelMotor2);
  labelMotor2.position.set(0, -0.8, 0);
  let label2 = {
    name: "motor2",
    label: labelMotor2
  };
  labels.push(label2);

  arm.add(base);

  return arm;
}

function CreateLabel(obj) {
  let name = "Name: " + obj.name;
  let voltage = "Voltage: " + obj.voltage;
  let RPM = "RPM: " + obj.RPM;

  var canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  var ctx = canvas.getContext("2d");
  ctx.font = "20pt Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(name, 128, 44);
  if (obj.voltage != undefined) {
    ctx.fillText(voltage, 128, 94);
    ctx.fillText(RPM, 128, 144);
  } else {
    ctx.fillText(RPM, 128, 94);
  }

  var tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  var spriteMat = new THREE.SpriteMaterial({
    map: tex
  });
  var sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(0, 0, 0);

  let txtElements = {
    ctx: ctx,
    sprite: sprite
  };
  return sprite;
}

function hoverObjects() {
  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects, true);
  if (intersects.length > 0) {
    for (let i = 0; i < labels.length; i++) {
      if (intersects[0].object.name == labels[i].name) {
        labels[i].label.visible = true;
      }
    }

    // if (intersects[0].object.name == "motor1") {
    //   labels[0].visible = false;
    // }
    // if (intersects[0].object.name == "motor1_1") {
    // }
  } else {
    for (let i = 0; i < labels.length; i++) {
      labels[i].label.visible = false;
    }
  }
}

function createData() {
  let Data = {
    base: {
      motor1: {
        name: "motor1",
        RPM: 0,
        voltage: 0
      },
      motor1_1: {
        name: "motor1_1",
        RPM: 0,
        voltage: 0
      }
    },
    gearSet1: {
      gear8_1: {
        name: "gear8_1",
        RPM: 0
      },
      gear8_16: {
        name: "gear8_16",
        RPM: 0
      },
      gear24: {
        name: "gear24",
        RPM: 0
      }
    },
    elbow: {
      motor2: {
        name: "motor2",
        RPM: 0,
        voltage: 0
      }
    }
  };
  return Data;
}

function updateData(Data) {
  Data.base.motor1.voltage = involt.pin.A[0];
}
