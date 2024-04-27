import * as THREE from "../../node_modules/three/build/three.module.js";
import { createMultiMaterialObject } from "../../node_modules/three/examples/jsm/utils/SceneUtils.js";
import { gsap } from "../../node_modules/gsap/gsap-core.js";

export default class Wormhole {
   constructor(scene, library, parameters) {
      this.scene = scene;
      this.library = library;
      this.parameters = parameters;
   }

   generate() {
      class CustomSinCurve extends THREE.Curve {
         constructor(scale = 1) {
            super();

            this.scale = scale;
         }

         getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = -t * 3000 - 3.5;
            const ty = Math.sin(-1 * Math.PI * t);
            const tz = 0;

            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
         }
      }

      this.shape = new CustomSinCurve(10);

      this.library.textures.wormhole.galaxy[0].wrapS = THREE.RepeatWrapping;
      this.library.textures.wormhole.galaxy[0].wrapT = THREE.MirroredRepeatWrapping;
      this.library.textures.wormhole.galaxy[0].repeat.set(40, 2);

      this.wireframedStarsSpeederMaterial = new THREE.MeshBasicMaterial({
         map: this.library.textures.wormhole.galaxy[0],
         transparent: false,
         //  opacity: this.parameters.wormhole.wireframedStarsSpeeder.material.opacity,
         blending: THREE.AdditiveBlending,
         side: THREE.BackSide,
         wireframe: true,
      });

      this.library.textures.wormhole.galaxy[1].wrapS = THREE.RepeatWrapping;
      this.library.textures.wormhole.galaxy[1].wrapT = THREE.MirroredRepeatWrapping;
      this.library.textures.wormhole.galaxy[1].repeat.set(1, 2);

      this.auraSpeederMaterial = new THREE.MeshBasicMaterial({
         map: this.library.textures.wormhole.galaxy[1],
         transparent: false,
         opacity: this.parameters.wormhole.auraSpeeder.material.opacity,
         blending: THREE.AdditiveBlending,
         side: THREE.DoubleSide,
      });

      this.library.textures.wormhole.galaxy[2].wrapS = THREE.RepeatWrapping;
      this.library.textures.wormhole.galaxy[2].wrapT = THREE.MirroredRepeatWrapping;
      this.library.textures.wormhole.galaxy[2].repeat.set(20, 2);

      this.nebulaSpeederMaterial = new THREE.MeshBasicMaterial({
         map: this.library.textures.wormhole.galaxy[2],
         transparent: false,
         opacity: this.parameters.wormhole.nebulaSpeeder.material.opacity,
         blending: THREE.AdditiveBlending,
         side: THREE.BackSide,
      });

      this.library.textures.wormhole.galaxy[3].wrapS = THREE.RepeatWrapping;
      this.library.textures.wormhole.galaxy[3].wrapT = THREE.MirroredRepeatWrapping;
      this.library.textures.wormhole.galaxy[3].repeat.set(10, 2);

      this.starsSpeederMaterial = new THREE.MeshBasicMaterial({
         map: this.library.textures.wormhole.galaxy[3],
         transparent: false,
         opacity: this.parameters.wormhole.starsSpeeder.material.opacity,
         blending: THREE.AdditiveBlending,
         side: THREE.BackSide,
      });

      this.library.textures.wormhole.galaxy[4].wrapS = THREE.RepeatWrapping;
      this.library.textures.wormhole.galaxy[4].wrapT = THREE.MirroredRepeatWrapping;
      this.library.textures.wormhole.galaxy[4].repeat.set(20, 2);

      this.clusterSpeederMaterial = new THREE.MeshBasicMaterial({
         map: this.library.textures.wormhole.galaxy[4],
         transparent: false,
         opacity: this.parameters.wormhole.clusterSpeeder.material.opacity,
         blending: THREE.AdditiveBlending,
         side: THREE.BackSide,
      });

      this.wormholeGeometry = new THREE.TubeGeometry(this.shape, 800, 5, 12, false);
      this.wormholeTubeMesh = createMultiMaterialObject(this.wormholeGeometry, [
         this.wireframedStarsSpeederMaterial,
         this.auraSpeederMaterial,
         this.nebulaSpeederMaterial,
         this.starsSpeederMaterial,
         this.clusterSpeederMaterial,
      ]);

      this.xShift = -20;
      this.yShift = 25;
      this.wormholeTubeMesh.position.x = this.xShift;
      this.wormholeTubeMesh.position.y = this.yShift;
      this.zAxis = new THREE.Vector3(0, 0, 1);
      this.zAngle = Math.PI / 2.85;
      this.wormholeTubeMesh.rotateZ(this.zAngle);

      this.inWormhole = false;
      this.firstTimeInWormhole = true;
      this.steps = 150;
      this.initialWormholePosition = this.shape.getPoint(0);
      this.initialWormholePosition.applyAxisAngle(this.zAxis, this.zAngle);
      this.initialWormholeCameraLooking = this.shape.getPoint(
         1 / this.parameters.wormhole.speed
      );
      this.initialWormholeCameraLooking.applyAxisAngle(this.zAxis, this.zAngle);
      this.wormholeCount = 0;
      this.enteringAnimation = true;
      this.lookingX;
      this.lookingY;
      this.lookingZ;
      this.transitionSteps = this.steps / 2;
      this.cameraPositionIndex = 0;

      this.savedCamera = {
         xDiff: 0,
         yDiff: 0,
         zDiff: 0,
         lookingX: 0,
         lookingY: 0,
         lookingZ: 0,
      };

      this.scene.add(this.wormholeTubeMesh);
   }

   async animate() {
      this.wormholeTimeline = gsap.timeline();

      // initial massive boost at wormhole enter
      this.wormholeTimeline
         .to(this.starsSpeederMaterial, { duration: 7, opacity: 1 }, 0)
         .to(
            this.wireframedStarsSpeederMaterial,
            { duration: 7, ease: "expo.out", opacity: 1 },
            0
         )
         .to(this.auraSpeederMaterial, { duration: 7, ease: "expo.out", opacity: 1 }, 0)
         .to(this, { duration: 7, ease: "expo.out", speed: 2000 }, 0);

      // adding speed and noises
      this.wormholeTimeline
         .to(this.clusterSpeederMaterial, { duration: 6, opacity: 1 }, 7)
         .to(this.auraSpeederMaterial, { duration: 2, opacity: 0 }, 7)
         .to(this, { duration: 6, speed: 2000 }, 7);

      // adding speed and nebula distorded
      this.wormholeTimeline
         .to(this.nebulaSpeederMaterial, { duration: 6, opacity: 1 }, 13)
         .to(this.clusterSpeederMaterial, { duration: 6, opacity: 0 }, 13)
         .to(this.auraSpeederMaterial, { duration: 6, opacity: 0.7 }, 13)
         .to(this, { duration: 6, speed: 1800 }, 13);

      return this.wormholeTimeline.then(() => true);
   }

   wormholeAnimation(camera) {
      this.camera = camera;
      if (this.inWormhole == true) this.updatePositionInWormhole();
      else this.movingToWormhole();
   }

   playSound(camera) {
      const listener = new THREE.AudioListener();
      camera.add(listener);
      const audioLoader = new THREE.AudioLoader();
      const sound = new THREE.Audio(listener);

      audioLoader.load("src/static/audio/wormhole.mp3", function (buffer) {
         sound.setBuffer(buffer);
         sound.setLoop(true);
         sound.setVolume(0.3);
         sound.play();
      });
   }

   updatePositionInWormhole() {
      if (this.firstTimeInWormhole) {
         this.firstTimeInWormhole = false;
      } else if (this.cameraPositionIndex == 130) {
         window.redirect = true;
      }
      this.cameraPositionIndex++;

      const wormholeCameraPosition = this.shape.getPoint(
         this.cameraPositionIndex / this.parameters.wormhole.speed
      );

      wormholeCameraPosition.applyAxisAngle(this.zAxis, this.zAngle);
      this.camera.position.x = wormholeCameraPosition.x + this.xShift;
      this.camera.position.y = wormholeCameraPosition.y + this.yShift;
      this.camera.position.z = wormholeCameraPosition.z;

      var wormholeCameraLooking = this.shape.getPoint(
         (this.cameraPositionIndex + 1) / this.parameters.wormhole.speed
      );
      wormholeCameraLooking.applyAxisAngle(this.zAxis, this.zAngle);
      wormholeCameraLooking.x += this.xShift;
      wormholeCameraLooking.y += this.yShift;

      this.camera.lookAt(wormholeCameraLooking);
   }

   adjustAnimation() {
      if (this.wormholeCount >= this.steps) {
         this.inWormhole = true;
         this.updatePositionInWormhole();
         return;
      }

      if (this.enteringAnimation == true) {
         this.savedCamera.xDiff =
            (this.initialWormholePosition.x + this.xShift - this.camera.position.x) /
            this.transitionSteps;
         this.savedCamera.yDiff =
            (this.initialWormholePosition.y + this.yShift - this.camera.position.y) /
            this.transitionSteps;
         this.savedCamera.zDiff =
            (this.initialWormholePosition.z - this.camera.position.z) /
            this.transitionSteps;

         this.lookingX =
            (this.initialWormholeCameraLooking.x +
               this.xShift -
               this.savedCamera.lookingX) /
            this.transitionSteps;
         this.lookingY =
            (this.initialWormholeCameraLooking.y +
               this.yShift -
               this.savedCamera.lookingY) /
            this.transitionSteps;
         this.lookingZ =
            (this.initialWormholeCameraLooking.z - this.savedCamera.lookingZ) /
            this.transitionSteps;

         this.enteringAnimation = false;
      }

      this.camera.position.x += this.savedCamera.xDiff;
      this.camera.position.y += this.savedCamera.yDiff;
      this.camera.position.z += this.savedCamera.zDiff;

      this.savedCamera.lookingX += this.lookingX;
      this.savedCamera.lookingY += this.lookingY;
      this.savedCamera.lookingZ += this.lookingZ;

      let zChange1 = this.camera.position.z;
      let zChange2 = this.savedCamera.lookingZ;
      const min_acceptable = 10 ** -10;
      if (zChange1 <= this.initialWormholePosition.z + min_acceptable) {
         this.camera.position.z = 0;
      } else {
         this.camera.position.z += this.savedCamera.zDiff;
      }
      if (zChange2 <= this.initialWormholePosition.z) {
         this.savedCamera.lookingZ = 0;
      } else {
         this.savedCamera.lookingZ += this.lookingZ;
      }

      this.camera.lookAt(
         this.savedCamera.lookingX,
         this.savedCamera.lookingY,
         this.savedCamera.lookingZ
      );
      this.wormholeCount += 1;
   }
   movingToWormhole() {
      if (this.wormholeCount >= this.steps - this.transitionSteps) {
         this.adjustAnimation();
         return;
      }
      this.savedCamera.xDiff =
         (this.initialWormholePosition.x + this.xShift - this.camera.position.x) /
         (this.steps - this.wormholeCount);
      this.savedCamera.yDiff =
         (this.initialWormholePosition.y + this.yShift - this.camera.position.y) /
         (this.steps - this.wormholeCount);
      this.savedCamera.zDiff =
         (this.initialWormholePosition.z - this.camera.position.z) /
         (this.steps - this.wormholeCount);

      this.camera.position.x += this.savedCamera.xDiff;
      this.camera.position.y += this.savedCamera.yDiff;
      this.camera.position.z += this.savedCamera.zDiff;

      this.savedCamera.lookingX = this.camera.position.x + this.savedCamera.xDiff;
      this.savedCamera.lookingY = this.camera.position.y + this.savedCamera.yDiff;
      this.savedCamera.lookingZ = this.camera.position.z + this.savedCamera.zDiff;

      this.camera.lookAt(
         this.savedCamera.lookingX,
         this.savedCamera.lookingY,
         this.savedCamera.lookingZ
      );

      this.wormholeCount += 1;
   }

   active() {
      this.active = true;
   }
}
