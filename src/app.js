import * as THREE from "../node_modules/three/build/three.module.js";
import { generateStars } from "./extraGeometry/stars.js";
import Ring from "./extraGeometry/ring.js";
// import TrippyBall from "./extraGeometry/trippyBall.js";
// import Wormhole from "./extraGeometry/wormhole.js";
// import ScrollAnimation from "./scrollAnimation.js";
import Library from "./library.js";
import Parameters from "./parameters.js";
// import Singularity from "./extraGeometry/singularity.js";

const library = new Library();
const parameters = new Parameters();
library.preload();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
   75,
   window.innerWidth / window.innerHeight,
   0.1,
   1000
);

const renderer = new THREE.WebGLRenderer({
   canvas: document.querySelector("#bg"),
});

renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Stars
generateStars(scene);

// Background
const spaceTexture = new THREE.TextureLoader().load("src/static/space.jpeg");
scene.background = spaceTexture;

// Avatar
const mohibTexture = new THREE.TextureLoader().load("src/static/portfolio_image.jpeg");

const mohib = new THREE.Mesh(
   new THREE.BoxGeometry(0.3, 0.3, 0.3),
   new THREE.MeshBasicMaterial({ map: mohibTexture })
);

scene.add(mohib);

const mohibPositions = { x: 0.3, z: -0.6 };

mohib.position.x = mohibPositions.x;
mohib.position.z = mohibPositions.z;

// Moon
const moonTexture = new THREE.TextureLoader().load("src/static/moon.jpeg");
const normalTexture = new THREE.TextureLoader().load("src/static/normal.jpeg");

const moon = new THREE.Mesh(
   new THREE.SphereGeometry(3, 32, 32),
   new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture,
   })
);

scene.add(moon);

moon.position.z = -10;
moon.position.x = -15;
moon.position.y = 12;

// Ring
window.atBottom = false;
var ring = new Ring(scene, renderer);
ring.generate(mohibPositions);

// // Trippy ball
// let trippyBall = new TrippyBall(scene);
// trippyBall.generate(mohibPositions);

// // Wormhole
// var wormhole = new Wormhole(scene, library, parameters);
// wormhole.generate();
// wormhole.active();

// // Singularity
// var blackhole = new Singularity(scene, library, parameters);
// var pos = new THREE.Vector3(
//    wormhole.initialWormholePosition.x + wormhole.xShift + 3,
//    wormhole.initialWormholePosition.y + wormhole.yShift + 3,
//    wormhole.initialWormholePosition.z
// );
// blackhole.generate(pos);
// blackhole.show();

// // Scroll Animation
// var scrollAnimation = new ScrollAnimation(moon, mohib, camera);
// document.body.onscroll = scrollAnimation.animate;

// // Animation Loop
// let hyperlinkClicked = false;

// var el1_code = document.getElementById("link1_source");
// var el2_code = document.getElementById("link2_source");
// var el3_code = document.getElementById("link3_source");
// var el4 = document.getElementById("link4");
// var el5 = document.getElementById("link5");

// el1_code.onclick = setHyperlink1CodeTrue;
// el2_code.onclick = setHyperlink2CodeTrue;
// el3_code.onclick = setHyperlink5CodeTrue;
// el4.onclick = setHyperlink6True;
// el5.onclick = setHyperlink7True;

// window.allowCamChange = true;
// var firstLinkClicked = true;
// function hyperlinkClickedFunc() {
//    if (firstLinkClicked) {
//       allowCamChange = false;
//       hyperlinkClicked = true;

//       wormhole.animate();
//       wormhole.playSound(camera);
//       firstLinkClicked = false;
//    }
// }

// var href = "";
// window.redirect = false;

// function setHyperlink1True() {
//    href = "https://explain-sensitivity-classifier.herokuapp.com/";
//    hyperlinkClickedFunc();
// }
// function setHyperlink1CodeTrue() {
//    href = "https://github.com/mohibfd/Sensitivity-Classification";
//    hyperlinkClickedFunc();
// }
// function setHyperlink2True() {
//    href =
//       "https://drive.google.com/file/d/1j8yN8HW-xrE2MfBpt8LRP4-efW08d7KG/view?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink2CodeTrue() {
//    href = "https://github.com/mohibfd/MyApp";
//    hyperlinkClickedFunc();
// }
// function setHyperlink3True() {
//    href =
//       "https://colab.research.google.com/drive/1SfVwCDeRtU1I8rbjl-FOBSEwtAp0SEYD?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink3CodeTrue() {
//    href =
//       "https://colab.research.google.com/drive/1SfVwCDeRtU1I8rbjl-FOBSEwtAp0SEYD?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink4True() {
//    href =
//       "https://colab.research.google.com/drive/1SRjiZbdBZL9Ny6akgLhu_AMPGGwcaOlZ?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink4CodeTrue() {
//    href =
//       "https://colab.research.google.com/drive/1SRjiZbdBZL9Ny6akgLhu_AMPGGwcaOlZ?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink5True() {
//    href =
//       "https://drive.google.com/file/d/1jshTnbdfVAQLa-TkQAK9w6fUNKgzDu6i/view?usp=sharing";
//    hyperlinkClickedFunc();
// }
// function setHyperlink5CodeTrue() {
//    href = "https://github.com/mohibfd/Doctor-Project";
//    hyperlinkClickedFunc();
// }
// function setHyperlink6True() {
//    href = "https://github.com/mohibfd";
//    hyperlinkClickedFunc();
// }
// function setHyperlink7True() {
//    href = "https://www.linkedin.com/in/mohib-akoum";
//    hyperlinkClickedFunc();
// }

// var clock = new THREE.Clock();

// function animate() {
//    requestAnimationFrame(animate);

//    moon.rotation.x += 0.005;

//    ring.animate();

//    trippyBall.animate();

//    if (hyperlinkClicked == true) {
//       wormhole.wormholeAnimation(camera);
//       if (window.redirect == true) {
//          window.open(href);
//          window.location.reload();
//       }
//    }

//    window.materialToUpdate.uniforms.uTime.value = clock.getElapsedTime();
//    window.meshToUpdate.rotateZ(2);
//    window.mesh2ToUpdate.rotateY(2);

//    renderer.render(scene, camera);
// }

// animate();

renderer.render(scene, camera);
