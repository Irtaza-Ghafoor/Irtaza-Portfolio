import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      // Cap DPR: full devicePixelRatio (often 2-3 on high-DPI screens) renders
      // 4-9x the pixels every frame for no visible gain and starves scrolling.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      // handleResize() kills and rebuilds every ScrollTrigger timeline, so it
      // must NOT run on the height-only `resize` events mobile browsers fire
      // while scrolling (address bar collapsing) — that would freeze the page.
      // Only react to real width changes, debounced.
      let loadedCharacter: THREE.Object3D | null = null;
      let lastWidth = window.innerWidth;
      let resizeTimer: ReturnType<typeof setTimeout>;
      const onWindowResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (loadedCharacter)
            handleResize(renderer, camera, canvasDiv, loadedCharacter);
        }, 200);
      };

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          loadedCharacter = character;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            // Light up + start the intro right as the loading screen's exit
            // wipe finishes (150ms settle + 2000ms "Welcome" hold + 800ms wipe,
            // see Loading.tsx), so the hero reveals a lit, animating character.
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2950);
          });
          window.addEventListener("resize", onWindowResize);
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: any;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      // The character only lives in the hero area (Landing/About/WhatIDo).
      // Once the user scrolls past it, skip rendering entirely so the GPU is
      // free during the rest of the page. A ScrollTrigger is used (not
      // window.scrollY) because ScrollSmoother drives scrolling and the raw
      // scroll position isn't reliable. The same trigger drops a body class so
      // the fixed blurred glow circles stop compositing past the hero.
      let isVisible = true;
      const visTrigger = ScrollTrigger.create({
        trigger: ".career-section",
        start: "top top",
        onEnter: () => {
          isVisible = false;
          document.body.classList.add("hero-out");
        },
        onLeaveBack: () => {
          isVisible = true;
          document.body.classList.remove("hero-out");
        },
      });

      const animate = () => {
        requestAnimationFrame(animate);
        // Keep the clock advancing in small steps even while paused so the
        // animation mixer doesn't jump when the hero scrolls back into view.
        const delta = clock.getDelta();
        if (!isVisible) return;
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        visTrigger.kill();
        document.body.classList.remove("hero-out");
        scene.clear();
        renderer.dispose();
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onWindowResize);
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
