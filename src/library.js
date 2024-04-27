import * as THREE from "../node_modules/three/build/three.module.js";

export default class Library {
   constructor() {
      this.source = {
         textures: {
            blackhole: {
               baseUrl: "src/static/textures/blackhole/",
               pool: [{ type: "disk", src: "disk.jpg" }],
            },
            wormhole: {
               baseUrl: "src/static/textures/wormhole/",
               pool: [
                  { type: "galaxy", src: "galaxy1.jpg" },
                  { type: "galaxy", src: "galaxy2.jpg" },
                  { type: "galaxy", src: "galaxy3.jpg" },
                  { type: "galaxy", src: "galaxy4.jpg" },
                  { type: "galaxy", src: "galaxy5.jpeg" },
               ],
            },
         },
      };

      this.textures = {
         blackhole: {
            disk: [],
         },
         wormhole: {
            galaxy: [],
         },
      };
   }

   preload() {
      for (const textureSourceType of Object.keys(this.source.textures)) {
         for (const textureObject of this.source.textures[textureSourceType].pool) {
            const currentTexture = new THREE.TextureLoader().load(
               `${this.source.textures[textureSourceType].baseUrl}${textureObject.src}`
            );
            currentTexture.premultiplyAlpha = true;

            this.textures[textureSourceType][textureObject.type].push(currentTexture);
         }
      }
   }
}
