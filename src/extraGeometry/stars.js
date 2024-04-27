import * as THREE from "three";

export function generateStars(scene) {
   function getStarsGeometry() {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
         "position",
         new THREE.Float32BufferAttribute(getStarsRandomVertices(), 3)
      );
      return geometry;
   }

   function getStarsRandomVertices(verticesNumber = 250) {
      const vertices = [];
      for (let i = 0; i < verticesNumber; i++) {
         const x = THREE.MathUtils.randFloatSpread(100);
         const y = THREE.MathUtils.randFloatSpread(100);
         const z = THREE.MathUtils.randFloatSpread(100);
         vertices.push(x, y, z);
      }
      return vertices;
   }

   function getStarsMaterial(index) {
      const starSprite = new THREE.TextureLoader().load(
         "src/static/stars/star" + index + ".png"
      );
      const starMaterial = new THREE.PointsMaterial({
         size: 1,
         sizeAttenuation: true,
         map: starSprite,
         alphaTest: 0.5,
         transparent: true,
      });
      return starMaterial;
   }

   function getStars(index) {
      const stars = new THREE.Points(getStarsGeometry(), getStarsMaterial(index));
      return stars;
   }
   for (let i = 1; i < 8; i++) {
      scene.add(getStars(i));
   }
}
