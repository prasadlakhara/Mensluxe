gsap.from(".clip-top, .clip-bottom", 2, {
  delay: 1,
  height: "50vh",
  ease: "power4.inOut",
});

gsap.to(".marquee", 3.5, {
  delay: 0.75,
  top: "50%",
  ease: "power4.inOut",
});

gsap.from(".clip-top .marquee, .clip-bottom .marquee", 5, {
  delay: 1,
  left: "100%",
  ease: "power3.inOut",
});

gsap.from(".clip-center .marquee", 5, {
  delay: 1,
  left: "-50%",
  ease: "power3.inOut",
});

gsap.to(".clip-top", 2, {
  delay: 6,
  clipPath: "inset(0 0 100% 0)",
  ease: "power4.inOut",
});

gsap.to(".clip-bottom", 2, {
  delay: 6,
  clipPath: "inset(100% 0 0 0)",
  ease: "power4.inOut",
});

gsap.to(
  ".clip-top .marquee, .clip-bottom .marquee, .clip-center .marquee span",
  1,
  {
    delay: 6,
    opacity: 0,
    ease: "power2.inOut",
  }
);

// --  --  --  Mouse Cursor  --  --  --

// Invert Color and Size

// let title = document.querySelector(".title");
// let curs = document.querySelector(".cursor");

// document.addEventListener("mousemove", (e) => {
//   let x = e.pageX;
//   let y = e.pageY;
//   curs.style.left = x - 22 + "px";
//   curs.style.top = y - 22 + "px";
// });

// document.addEventListener("mouseleave", (e) => {
//   let x = e.pageX;
//   let y = e.pageY;
//   curs.style.left = x - 22 + "px";
//   curs.style.top = y - 22 + "px";
// });

// Circle Cursor

// set the starting position of the cursor outside of the screen
let clientX = 100;
let clientY = 100;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {
  // add listener to track the current mouse position
  document.addEventListener("mousemove", (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
  });

  // transform the innerCursor to the current mouse position
  // use requestAnimationFrame() for smooth performance
  const render = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    // if you are already using TweenMax in your project, you might as well
    // use TweenMax.set() instead
    // TweenMax.set(innerCursor, {
    //   x: clientX,
    //   y: clientY
    // });

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

initCursor();

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;

const initCanvas = () => {
  const canvas = document.querySelector(".cursor--canvas");
  const shapeBounds = {
    width: 75,
    height: 75,
  };
  paper.setup(canvas);
  const strokeColor = "rgba(0, 0, 0, 0.5)";
  const strokeWidth = 1;
  const segments = 8;
  const radius = 20;

  // we'll need these later for the noisy circle
  const noiseScale = 150; // speed
  const noiseRange = 4; // range of distortion
  let isNoisy = false; // state

  // the base shape for the noisy circle
  const polygon = new paper.Path.RegularPolygon(
    new paper.Point(0, 0),
    segments,
    radius
  );
  polygon.strokeColor = strokeColor;
  polygon.strokeWidth = strokeWidth;
  polygon.smooth();
  group = new paper.Group([polygon]);
  group.applyMatrix = false;

  const noiseObjects = polygon.segments.map(() => new SimplexNoise());
  let bigCoordinates = [];

  // function for linear interpolation of values
  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };

  // function to map a value from one range to another range
  const map = (value, in_min, in_max, out_min, out_max) => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };

  // the draw loop of Paper.js
  // (60fps with requestAnimationFrame under the hood)
  paper.view.onFrame = (event) => {
    // using linear interpolation, the circle will move 0.2 (20%)
    // of the distance between its current position and the mouse
    // coordinates per Frame
    lastX = lerp(lastX, clientX, 0.2);
    lastY = lerp(lastY, clientY, 0.2);
    group.position = new paper.Point(lastX, lastY);
  };
};

initCanvas();
