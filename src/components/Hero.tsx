import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import { SpiderCrawlButton } from "./SpiderCrawl";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

useGLTF.preload("/models/spiderman_optimized.glb");
useGLTF.preload("/models/avatar_mcu.glb");

type ModelGroupProps = ThreeElements["group"];

/* =========================================================================
   EARTH-1610 GLITCH DISSOLVE SHADER
   ─ Blocky floor-quantized noise → sharp comic-book tears (not smooth sand)
   ─ CMYK chromatic aberration: cyan / magenta split on glitch block edges
   ─ Depth strategy maintained: SM renderOrder=0, Avatar renderOrder=1
   ========================================================================= */
function setupDissolveMaterial(
  mat: THREE.Material,
  isAvatar: boolean,
  progressRef: React.MutableRefObject<number>
) {
  if (!isAvatar) {
    mat.transparent = false;
    mat.depthWrite = true;
  }
  mat.depthTest = true;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = { get value() { return progressRef.current; } };

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vWP;`)
      .replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xyz;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uProgress;
        varying vec3 vWP;

        // LOW-RES BLOCK QUANTIZE — creates sharp rectangular comic-book tears
        vec3 blockCoord(vec3 p, float res){ return floor(p * res) / res; }

        // Fast hash on quantized block coords → same value per whole block
        float blockHash(vec3 p){
          vec3 q = blockCoord(p, 15.0);
          return fract(sin(dot(q, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        // Secondary finer hash for CMYK color split decision
        float colorHash(vec3 p){
          vec3 q = blockCoord(p, 15.0);
          return fract(sin(dot(q, vec3(269.5, 183.3, 441.2))) * 93418.3);
        }`
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        float _p = clamp(uProgress, 0., 1.);

        // Y-axis scan with tapered hash (clean start/end)
        float _scan = _p * 3.2 - 0.15;
        float _hashScale = smoothstep(0.,0.08,_p) * smoothstep(1.,0.92,_p);
        // Blocky low-res hash: each 1/15 world-unit block gets same random value
        float _bHash = (blockHash(vWP) * 0.6 - 0.3) * _hashScale;
        float _val   = (vWP.y - _bHash) - _scan;

        ${isAvatar ? "if(_val > 0.) discard;" : "if(_val < 0.) discard;"}

        // CMYK CHROMATIC ABERRATION at the glitch frontier
        float _rim = 1. - smoothstep(0., 0.22, abs(_val));
        if(_rim > 0.05 && _p > 0.05 && _p < 0.95){
          // Per-block color decision: cyan or magenta
          float _cSel = colorHash(vWP);
          vec3  _glitchColor = _cSel > 0.5
            ? vec3(0.0, 1.0, 1.0)   // Cyan  — Earth-616
            : vec3(1.0, 0.0, 1.0);  // Magenta — anomaly rift
          // Hard-flash the block at high rim intensity (comic-book pop)
          float _flash = step(0.75, _rim) * step(0.5, _p) * step(_p, 0.95);
          gl_FragColor = mix(
            gl_FragColor,
            vec4(_glitchColor, 1.) * (2.2 + _flash * 1.8),
            _rim * 0.9
          );
        }`
      );
  };

  mat.customProgramCacheKey = () => `sv_glitch_${isAvatar ? "av" : "sp"}_v3`;
  mat.needsUpdate = true;
}

/* =========================================================================
   HERO
   ========================================================================= */
export function Hero() {
  const [showBoot, setShowBoot] = useState(true);
  const [isDecrypting, setDecrypting] = useState(false);
  const [showText, setShowText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    const tBoot = setTimeout(() => setShowBoot(false), 1600);
    const tReady = setTimeout(() => setCanvasReady(true), 300);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(tBoot); clearTimeout(tReady);
    };
  }, []);

  const handleDecrypt = () => {
    if (isDecrypting) return;
    setDecrypting(true);
    setTimeout(() => setShowText(true), 2000);
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#060610]">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 55% at 50% 45%,#0d1530 0%,#060611 55%,#020205 100%)"
      }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 90% 70% at 50% 50%,transparent 55%,rgba(0,0,0,0.75) 100%)"
      }} />

      {mounted && (
        <div className="absolute inset-0"
          style={{ opacity: canvasReady ? 1 : 0, transition: "opacity 0.9s ease" }}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            camera={{ fov: 32, position: [0, 1.15, 4.2] }}
            className="absolute inset-0"
          >
            <color attach="background" args={["#060610"]} />
            <fog attach="fog" args={["#05060c", 8, 16]} />
            <Scene isDecrypting={isDecrypting} mouse={mouse} />
            <Suspense fallback={null}><Environment preset="night" /></Suspense>
          </Canvas>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence>{showBoot && <BootTerminal key="boot" />}</AnimatePresence>
        <AnimatePresence>
          {!showBoot && !isDecrypting && (
            <motion.div key="cta"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto absolute bottom-[6svh] left-1/2 -translate-x-1/2">
              <DecryptButton onClick={handleDecrypt} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>{showText && <AvatarTypography key="text" />}</AnimatePresence>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE
   ========================================================================= */
const _camTarget = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _sVec = new THREE.Vector3();

function Scene({
  isDecrypting,
  mouse,
}: {
  isDecrypting: boolean;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  const progress = useRef(0);
  const sceneGroup = useRef<THREE.Group>(null);
  const modelsGroup = useRef<THREE.Group>(null);
  const bgGroup = useRef<THREE.Group>(null);

  // Micro-stutter state for antigravity anomaly glitch
  const glitchY = useRef(0);
  const nextGlitch = useRef(performance.now() + 2000 + Math.random() * 3000);
  const glitchDecay = useRef(0);

  useFrame((_, delta) => {
    const now = performance.now();
    const t = now * 0.001;

    // ── Dissolve progress ────────────────────────────────────────────────
    if (isDecrypting && progress.current < 1)
      progress.current = Math.min(1, progress.current + delta * 0.30);

    // ── Mouse parallax ────────────────────────────────────────────────────
    if (sceneGroup.current) {
      sceneGroup.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroup.current.rotation.y, mouse.current.x * 0.06, 0.04);
      sceneGroup.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroup.current.rotation.x, mouse.current.y * 0.04, 0.04);
    }

    // ── ANOMALY ANTIGRAVITY: smooth float + multiverse micro-stutter ──────
    if (modelsGroup.current) {
      const smoothFloat = Math.sin(t * 1.5) * 0.05;

      // Fire a glitch snap occasionally
      if (now > nextGlitch.current) {
        glitchY.current = (Math.random() - 0.5) * 0.04; // ±20mm snap
        glitchDecay.current = 1.0;
        nextGlitch.current = now + 1800 + Math.random() * 3500;
      }
      // Decay glitch offset rapidly (frame-skip feel: instant snap, fast recover)
      glitchDecay.current = Math.max(0, glitchDecay.current - delta * 8);
      const anomaly = glitchY.current * glitchDecay.current;

      modelsGroup.current.position.y = smoothFloat + anomaly;
    }

    // ── Camera dolly ─────────────────────────────────────────────────────
    _camTarget.set(0, isDecrypting ? 1.45 : 1.15, isDecrypting ? 2.5 : 4.2);
    camera.position.lerp(_camTarget, isDecrypting ? 0.032 : 0.022);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x, mouse.current.x * 0.1, 0.025);
    _lookAt.set(0, isDecrypting ? 1.4 : 1.1, 0);
    camera.lookAt(_lookAt);
  });

  return (
    <group ref={sceneGroup}>
      <ambientLight intensity={0.9} />
      <spotLight position={[1.5, 3.5, 4]} angle={0.55} penumbra={0.8}
        intensity={isDecrypting ? 1.8 : 0.55} color="#eaf2ff" />
      <directionalLight position={[0, 3, 5]} intensity={0.6} color="#cfe0ff" />
      <pointLight position={[-3, 2.2, -3]}
        intensity={isDecrypting ? 5 : 6} color="#ff2b5e" distance={12} />
      <pointLight position={[3.2, 2.6, -3.2]}
        intensity={isDecrypting ? 5 : 7} color="#3a7bff" distance={12} />

      <OrbitalRings ringsRef={bgGroup} mouse={mouse} />

      <group ref={modelsGroup}>
        <Suspense fallback={null}>
          <SpiderManModel progressRef={progress} />
          <AvatarModel progressRef={progress} />
        </Suspense>
      </group>
    </group>
  );
}

/* =========================================================================
   ORBITAL RINGS  (restored)
   ========================================================================= */
function OrbitalRings({
  ringsRef,
  mouse,
}: {
  ringsRef: React.RefObject<THREE.Group | null>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const rings = [1.8, 2.4, 3.1, 4.0];

  useFrame(() => {
    if (!ringsRef.current) return;
    // Pure mouse interactivity: tilt/pan rings based on mouse position (no auto spin/bounce)
    ringsRef.current.rotation.x = THREE.MathUtils.lerp(
      ringsRef.current.rotation.x,
      mouse.current.y * 0.35,
      0.05
    );
    ringsRef.current.rotation.y = THREE.MathUtils.lerp(
      ringsRef.current.rotation.y,
      mouse.current.x * 0.45,
      0.05
    );
    // Force static scale 1.0 (prevents automatic zooming in and out)
    ringsRef.current.scale.set(1.0, 1.0, 1.0);
  });

  return (
    <group ref={ringsRef} position={[0, 1.4, -3]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.12, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.006, 16, 160]} />
          <meshBasicMaterial
            color={i % 2 ? "#3a7bff" : "#ff2b5e"}
            transparent
            opacity={0.18 + i * 0.04}
          />
        </mesh>
      ))}
      {Array.from({ length: 80 }).map((_, i) => {
        const a = (i / 80) * Math.PI * 2;
        return (
          <mesh key={`d${i}`} position={[Math.cos(a) * 3.5, Math.sin(a) * 3.5, 0]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#7aa9ff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}




/* =========================================================================
   SPIDER-MAN  (renderOrder 0 — writes depth first)
   ========================================================================= */
export function SpiderManModel({
  progressRef, ...props
}: ModelGroupProps & { progressRef: React.MutableRefObject<number> }) {
  const { scene, animations } = useGLTF("/models/spiderman_optimized.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.renderOrder = 0;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => setupDissolveMaterial(m, false, progressRef));
    });
  }, [scene, progressRef]);

  useEffect(() => {
    const idle = "SK_1036_1036001_Lobby|Lobby_Half_Idle";
    const crack = "SK_1036_1036001_Lobby|Lobby_Half_Personality";
    if (actions[crack]) {
      const a = actions[crack]!;
      a.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 1).play();
      a.clampWhenFinished = true;
      setTimeout(
        () => actions[idle]?.reset().fadeIn(0.5).play(),
        a.getClip().duration * 1000 - 400
      );
    } else {
      actions[idle]?.reset().play();
    }
  }, [actions]);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} scale={1} position={[0.05, 0.15, 0.5]} />
    </group>
  );
}

/* =========================================================================
   AVATAR  (renderOrder 1 — only draws where SM was discarded)
   ========================================================================= */
function AvatarModel({
  progressRef, ...props
}: ModelGroupProps & {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/avatar_mcu.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.renderOrder = 1;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => setupDissolveMaterial(m, true, progressRef));
    });
  }, [scene, progressRef]);

  useEffect(() => {
    const anim = "mixamo.com.001";
    if (!actions[anim]) return;
    const action = actions[anim]!;
    // Hold perfectly still at the upright standing frame initially
    action.reset().play();
    action.time = 0.2;        // natural upright pose
    action.paused = true;
  }, [actions]);

  useFrame(() => {
    const anim = "mixamo.com.001";
    if (!actions[anim]) return;
    const action = actions[anim]!;

    // Instantly start avatar animation the split second Spider-Man is completely gone
    if (progressRef.current >= 1.0) {
      action.paused = false;
    } else {
      action.paused = true;
      action.time = 0.2; // Keep locked at standing upright pose
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={1.05} position={[0.04, 0, 0.07]} />
    </group>
  );
}

/* =========================================================================
   UI OVERLAYS
   ========================================================================= */
function BootTerminal() {
  const lines = [
    "> EARTH-1610 // BOOT SEQUENCE",
    "> DECRYPTING VARIANT_001 ...",
    "> NEURAL HANDSHAKE: OK",
    "> RENDERING IDENTITY ...",
  ];
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#7aa9ff] md:left-10 md:top-10">
      {lines.map((l, i) => (
        <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.2 }} className="leading-relaxed">{l}
        </motion.div>
      ))}
    </motion.div>
  );
}

function DecryptButton({ onClick }: { onClick: () => void }) {
  return (
    <SpiderCrawlButton onClick={onClick} data-cursor="hover"
      className="group relative cursor-none overflow-hidden border border-[#5fb6ff]/40 bg-[#0a0a0a]/60 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.4em] text-[#cfe2ff] backdrop-blur-md transition hover:border-[#5fb6ff] hover:text-white"
      style={{ boxShadow: "0 0 24px rgba(95,182,255,0.25),inset 0 0 14px rgba(95,182,255,0.12)" }}>
      <span className="relative z-10">[ Initialize Decryption ]</span>
      <span aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#5fb6ff]/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </SpiderCrawlButton>
  );
}

function AvatarTypography() {
  return (
    <motion.div key="avatar-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-between px-6 md:px-20">
      <div className="max-w-[42%]">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7aa9ff]/80">Identity // 001</div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
          <ScrambleText text="RAJAT" /><br /><ScrambleText text="TREHAN" delay={0.25} />
        </h1>
      </div>
      <div className="max-w-[42%] text-right">
        <MaskedSlide text="FULL STACK" />
        <MaskedSlide text="DEVELOPER" delay={0.18} />
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/80">Variant // 001</div>
      </div>
    </motion.div>
  );
}

const CIPHER = "!@#$%&*<>?/\\{}[]=+-_^~";
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(() =>
    text.split("").map((c) => c === " " ? " " : CIPHER[Math.floor(Math.random() * CIPHER.length)]).join("")
  );
  useEffect(() => {
    let iv = 0;
    const start = performance.now() + delay * 1000;
    const wait = setTimeout(() => {
      iv = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - start) / 800);
        const lock = Math.floor(t * text.length);
        setDisplay(text.split("").map((c, i) =>
          i < lock || c === " " ? c : CIPHER[Math.floor(Math.random() * CIPHER.length)]
        ).join(""));
        if (t >= 1) { setDisplay(text); clearInterval(iv); }
      }, 45);
    }, delay * 1000);
    return () => { clearTimeout(wait); clearInterval(iv); };
  }, [text, delay]);
  return <span className="font-mono">{display}</span>;
}

function MaskedSlide({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div initial={{ y: "110%" }} animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.7, 0, 0.2, 1] }}
        className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-5xl">
        {text}
      </motion.div>
    </div>
  );
}
