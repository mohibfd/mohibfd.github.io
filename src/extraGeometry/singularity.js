import * as THREE from "../../node_modules/three/build/three.module.js";
import { gsap } from "../../node_modules/gsap/gsap-core.js";

const shader = {};

async function getShaders() {
   shader.vert = await fetch("../shaders/singularity/vertex.glsl").then((x) => x.text());
   shader.frag = await fetch("../shaders/singularity/fragment.glsl").then((x) =>
      x.text()
   );
}

await getShaders();

export default class Singularity {
   constructor(scene, library, parameters) {
      this.scene = scene;
      this.library = library;
      this.parameters = parameters;

      this.textureSeen = [];
      this.giant = null;
      this.clock = new THREE.Clock();
   }

   generate(position) {
      const currentCoordinateVector = position;

      const blackholeDiskGeometry = new THREE.RingGeometry(5.45, 20, 32);
      const blackholeDiskMaterial = this._getRandomBlackHoleShaderMaterial();
      const blackholeDiskMesh = new THREE.Mesh(
         blackholeDiskGeometry,
         blackholeDiskMaterial
      );

      //   blackholeDiskMesh.scale.set(1000, 1000, 1000);
      blackholeDiskMesh.position.set(
         currentCoordinateVector.x,
         currentCoordinateVector.y,
         currentCoordinateVector.z
      );
      blackholeDiskMesh.rotation.x = THREE.MathUtils.degToRad(Math.PI * 25);
      blackholeDiskMesh.rotation.y = THREE.MathUtils.degToRad(Math.PI * -10);

      window.materialToUpdate = blackholeDiskMaterial;
      window.materialToUpdate.uniforms.uTime.value = this.clock.getElapsedTime();

      window.meshToUpdate = blackholeDiskMesh;
      window.meshToUpdate.rotateZ(2);

      const points = [];
      for (let i = 0; i < 10; i++) {
         points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
      }
      const blackholeGeometry = new THREE.LatheGeometry(points);
      const blackholeMaterial = new THREE.MeshBasicMaterial({
         color: 0x000000,
         transparent: false,

         side: THREE.DoubleSide,
         opacity: 0,
      });
      const blackholeMesh = new THREE.Mesh(blackholeGeometry, blackholeMaterial);

      blackholeMesh.scale.set(0.5, 0.5, 0.5);
      blackholeMesh.position.set(
         currentCoordinateVector.x,
         currentCoordinateVector.y,
         currentCoordinateVector.z
      );

      blackholeMesh.rotation.z = THREE.MathUtils.degToRad(-37);

      window.mesh2ToUpdate = blackholeMesh;

      const randomBlackhole = {
         disk: {
            geometry: blackholeDiskGeometry,
            texture: null,
            material: blackholeDiskMaterial,
            mesh: blackholeDiskMesh,
         },
         blackhole: {
            geometry: blackholeGeometry,
            texture: null,
            material: blackholeMaterial,
            mesh: blackholeMesh,
         },
      };

      this.blackhole = randomBlackhole;
   }

   show() {
      this.scene.add(this.blackhole.disk.mesh, this.blackhole.blackhole.mesh);
      //   this.scene.add(this.blackhole.blackhole.mesh);

      gsap
         .timeline()
         .to(this.blackhole.disk.material, { duration: 3, opacity: 1 }, 0)
         .to(this.blackhole.blackhole.material, { duration: 3, opacity: 1 }, 0);
   }

   _getRandomBlackHoleShaderMaterial() {
      return new THREE.ShaderMaterial({
         precision: "lowp",
         vertexShader: shader.vert,
         fragmentShader: shader.frag,
         uniforms: {
            uTime: { value: 0 },
            uTexture: { value: this.library.textures.blackhole.disk[0] },
            fogColor: { value: new THREE.Color(0x000000) },
            fogNear: { value: 300 },
            fogFar: { value: 60000 },
         },
         side: THREE.DoubleSide,
         fog: true,
      });
   }
}
