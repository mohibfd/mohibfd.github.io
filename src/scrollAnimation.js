export default class ScrollAnimation {
   constructor(moon, mohib, camera) {
      this.moon = moon;
      this.mohib = mohib;
      this.camera = camera;
      this.showScrollbar = true;
      this.time = 3.3;
      this.animate = this.animate.bind(this);
   }

   animate() {
      const element = document.documentElement;
      let direction = 1;
      let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st <= lastScrollTop) {
         direction = -1;
      }
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

      const t = document.body.getBoundingClientRect().top;
      this.moon.rotation.x += 0.05 * direction;
      this.moon.rotation.y += 0.075 * direction;
      this.moon.rotation.z += 0.05 * direction;

      this.mohib.rotation.y += 0.05 * direction;
      this.mohib.rotation.z += 0.05 * direction;

      if (window.allowCamChange == true) {
         this.camera.position.x = t * 0.003;
         this.camera.rotation.y = t * 0.0019;
         this.camera.position.z = t * -0.0065;
      }

      var bottom = element.scrollHeight - window.innerHeight - 100;

      if (this.showScrollbar) {
         const scrollContainer = document.getElementById("scrollContainer");
         scrollContainer.style.visibility = "hidden";
         scrollContainer.style.opacity = 0;
         scrollContainer.style.transition = "visibility 0s 2s, opacity 2s linear";
         this.showScrollbar = false;
      }
      if (element.scrollTop >= bottom) window.atBottom = true;
   }
}
