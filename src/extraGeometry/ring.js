import * as THREE from "three";

export default class Ring {
   constructor(scene, renderer) {
      this.scene = scene;
      this.renderer = renderer;
      this.clock = new THREE.Clock();
      this.time = 3.3;
      this.count = 0;
   }

   generate(mohibPositions) {
      this.saturnSys = new THREE.Group();
      this.saturnSysAxis = new THREE.Vector3(0, 1, 0);

      this.saturnSys.rotation.z = THREE.MathUtils.degToRad(-37);
      this.saturnSys.position.x = mohibPositions.x;
      this.saturnSys.position.z = mohibPositions.z;

      const vertex = `
      uniform vec2 uvScale;
      varying vec2 vUv;

      void main() {

        vUv = uvScale * uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

      }
      `;

      const fragment = `
      uniform float time;

      uniform float fogDensity;
      uniform vec3 fogColor;

      uniform sampler2D texture1;
      uniform sampler2D texture2;

      varying vec2 vUv;

      void main(void) {

        vec2 position = -1.0 + 2.0 * vUv;

        vec4 noise = texture2D(texture1, vUv);
        vec2 T1 = vUv + vec2(1.5, - 1.5) * time * 0.02;
        vec2 T2 = vUv + vec2(- 0.5, 2.0) * time * 0.01;

        T1.x += noise.x * 2.0;
        T1.y += noise.y * 2.0;
        T2.x -= noise.y * 0.2;
        T2.y += noise.z * 0.2;

        float p = texture2D(texture1, T1 * 2.0).a;

        vec4 color = texture2D(texture2, T2 * 2.0);
        vec4 temp = color * (vec4(p, p, p, p) * 2.0) + (color * color - 0.1);

        if (temp.r > 1.0) {
          temp.bg += clamp(temp.r - 2.0, 0.0, 100.0);
        }
        if (temp.g > 1.0) {
          temp.rb += temp.g - 1.0;
        }
        if (temp.b > 1.0) {
          temp.rg += temp.b - 1.0;
        }

        gl_FragColor = temp;

        float depth = gl_FragCoord.z / gl_FragCoord.w;
        const float LOG2 = 1.442695;
        float fogFactor = exp2(-fogDensity * fogDensity * depth * depth * LOG2);
        fogFactor = 1.0 - clamp(fogFactor, 0.0, 1.0);

        gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);

      }
      `;

      const textureLoader = new THREE.TextureLoader();

      this.uniforms = {
         fogDensity: { value: 0.05 },
         fogColor: { value: new THREE.Vector3(0, 0, 0) },
         time: { value: 1.0 },
         uvScale: { value: new THREE.Vector2(3.0, 1.0) },
         texture1: { value: textureLoader.load("src/static/textures/lava/cloud.png") },
         texture2: {
            value: textureLoader.load("src/static/textures/lava/lavatile.jpeg"),
         },
      };

      this.uniforms["texture1"].value.wrapS = this.uniforms["texture1"].value.wrapT =
         THREE.RepeatWrapping;
      this.uniforms["texture2"].value.wrapS = this.uniforms["texture2"].value.wrapT =
         THREE.RepeatWrapping;

      const material = new THREE.ShaderMaterial({
         uniforms: this.uniforms,
         vertexShader: vertex,
         fragmentShader: fragment,
      });

      this.lavalPlanet = new THREE.Mesh(new THREE.SphereGeometry(), material);
      this.saturnSys.add(this.lavalPlanet);

      let saturnRingGeom = new THREE.BufferGeometry();
      var vertices = [];
      var angularVelocity = [];
      this.numberOfDots = 50000;
      const colors = [];
      const color = new THREE.Color();

      for (let i = 0; i < this.numberOfDots; i++) {
         let r = THREE.MathUtils.randFloat(1.5, 4);
         let angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
         let x = Math.cos(angle) * r;
         let y = THREE.MathUtils.randFloat(0, Math.PI / 10);
         let z = Math.sin(angle) * r;
         let v = new THREE.Vector3(x, y, z);
         angularVelocity.push(THREE.MathUtils.randFloat(0.1, Math.PI));
         vertices.push(v);

         const vx = x / angle - 0.5;
         const vy = y / angle - 0.5;
         const vz = z / angle - 0.5;

         color.setRGB(vx, vy, vz);

         colors.push(color.r, color.g, color.b);
      }

      saturnRingGeom.setFromPoints(vertices);

      saturnRingGeom.setAttribute(
         "angularVelocity",
         new THREE.BufferAttribute(new Float32Array(angularVelocity), 3)
      );

      saturnRingGeom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      saturnRingGeom.computeBoundingSphere();

      let ring_material = new THREE.PointsMaterial({
         size: 0.01,
         vertexColors: true,
      });

      this.saturnRing = new THREE.Points(saturnRingGeom, ring_material);

      this.saturnSys.add(this.saturnRing);

      this.scene.add(this.saturnSys);
   }

   animate() {
      const delta = this.clock.getDelta();

      this.uniforms["time"].value += delta * 10;
      this.lavalPlanet.rotation.y += 0.0625 * delta;
      this.lavalPlanet.rotation.x += 0.1 * delta;

      this.time += delta * 0.5;
      this.saturnSys.position.set(Math.cos(this.time) * 5, 0, Math.sin(this.time) * 8);
      for (let i = 0; i < this.numberOfDots; i++) {
         if (window.atBottom == false) {
            let pos = this.saturnRing.geometry.getAttribute("position");
            const v = new THREE.Vector3();
            v.fromBufferAttribute(pos, i);

            v.angularVelocity =
               this.saturnRing.geometry.attributes.angularVelocity.array[i];
            v.applyAxisAngle(this.saturnSysAxis, v.angularVelocity * delta);
            this.saturnRing.geometry.attributes.angularVelocity.array[i] =
               v.angularVelocity;
            this.saturnRing.geometry.attributes.position.array[i * 3] = v.x;
            this.saturnRing.geometry.attributes.position.array[i * 3 + 2] = v.z;
            this.saturnRing.geometry.attributes.position.needsUpdate = true;
         } else {
            if (i % 2 == 0)
               this.saturnRing.geometry.attributes.position.array[i * 3] +=
                  THREE.MathUtils.randFloatSpread(1) * this.count * 4;
            this.saturnRing.geometry.attributes.position.array[i * 3 + 1] +=
               THREE.MathUtils.randFloatSpread(1) * this.count;
            this.saturnRing.geometry.attributes.position.array[i * 3 + 2] +=
               THREE.MathUtils.randFloatSpread(1) * this.count * 4;
            this.saturnRing.geometry.attributes.position.needsUpdate = true;
            this.count += 0.000000025;
         }
      }
   }
}
