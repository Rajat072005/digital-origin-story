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
    <section className="relative h-[100svh] w-full overflow-hidden bg-transparent">
      {/* Spider-Verse Halftone / Ben-Day Dots Background Overlay - Reduced Noise */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.08]" style={{
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "4px 4px"
      }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/80 via-transparent to-[#020205]/90" />

      {mounted && (
        <div className="absolute inset-0"
          style={{ opacity: canvasReady ? 1 : 0, transition: "opacity 0.9s ease" }}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            camera={{ fov: 32, position: [0, 1.15, 4.2] }}
            className="absolute inset-0"
          >
            <fog attach="fog" args={["#05060c", 8, 16]} />
            <Scene isDecrypting={isDecrypting} mouse={mouse} />
            <Suspense fallback={null}><Environment preset="night" /></Suspense>
          </Canvas>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20">
        <HeroHUD showText={showText} />
        <AnimatePresence>{showBoot && <BootTerminal key="boot" />}</AnimatePresence>
        <AnimatePresence>
          {!showBoot && !isDecrypting && (
            <motion.div key="cta"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50">
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
// ── Pre-allocated vectors for performance ───────────────────────────────
const _camTarget = new THREE.Vector3();
const _lookAt = new THREE.Vector3();

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
  const pLight1 = useRef<THREE.PointLight>(null);
  const pLight2 = useRef<THREE.PointLight>(null);

  // Micro-stutter state for antigravity anomaly glitch
  const glitchY = useRef(0);
  const nextGlitch = useRef(performance.now() + 2000 + Math.random() * 3000);
  const glitchDecay = useRef(0);

  // Shockwave impact state
  const impactState = useRef({ recoil: 0, flash: 0 });

  useFrame((_, delta) => {
    const now = performance.now();
    const t = now * 0.001;
    const p = progress.current;

    // ── Dissolve progress with Shockwave freeze ─────────────────────────
    if (isDecrypting && p < 1) {
      let speed = 0.35;
      // 1-frame micro freeze / impact at ~80%
      if (p > 0.78 && p < 0.82) {
        speed = 0.04;
        impactState.current.recoil = 1.0; // Trigger recoil
        impactState.current.flash = 1.0;  // Trigger flash
      }
      progress.current = Math.min(1, p + delta * speed);
    }

    // Decay impact over 0.3s
    impactState.current.recoil = Math.max(0, impactState.current.recoil - delta * 3.3);
    impactState.current.flash = Math.max(0, impactState.current.flash - delta * 5.0);

    // ── Mouse parallax & Cursor Energy ──────────────────────────────────
    if (sceneGroup.current) {
      sceneGroup.current.rotation.y = THREE.MathUtils.lerp(sceneGroup.current.rotation.y, mouse.current.x * 0.04, 0.03);
      sceneGroup.current.rotation.x = THREE.MathUtils.lerp(sceneGroup.current.rotation.x, mouse.current.y * 0.02, 0.03);
    }

    // ── Reactive Lighting (Breathing & Realism) ─────────────────────────
    if (pLight1.current && pLight2.current) {
      const mouseEnergy = Math.abs(mouse.current.x) + Math.abs(mouse.current.y);
      const lightBreath = Math.sin(t * 1.5) * 0.3; // Soft breathing

      if (p > 0 && p < 1) {
        // Unstable flicker during reveal (using fast sine instead of expensive random)
        const flicker = Math.sin(t * 40) > 0.8 ? 1.5 : 0;
        const spike = impactState.current.flash * 8.0; // Cinematic exposure spike
        pLight1.current.intensity = 5 + flicker + spike + mouseEnergy + lightBreath;
        pLight2.current.intensity = 5 + flicker + spike + mouseEnergy - lightBreath;
      } else if (p >= 1) {
        // Post-reveal settle (calm, stable universe)
        pLight1.current.intensity = THREE.MathUtils.lerp(pLight1.current.intensity, 2.5 + mouseEnergy + lightBreath * 0.5, 0.05);
        pLight2.current.intensity = THREE.MathUtils.lerp(pLight2.current.intensity, 3.5 + mouseEnergy - lightBreath * 0.5, 0.05);
      } else {
        // Pre-reveal
        pLight1.current.intensity = 4.5 + mouseEnergy + lightBreath;
        pLight2.current.intensity = 5.5 + mouseEnergy - lightBreath;
      }
    }

    // ── ANOMALY ANTIGRAVITY ─────────────────────────────────────────────
    if (modelsGroup.current) {
      // Settle down float amplitude after reveal
      const isSettled = p >= 1;
      const floatAmp = isSettled ? 0.015 : 0.04;
      const smoothFloat = Math.sin(t * 1.5) * floatAmp;

      if (now > nextGlitch.current && p < 1) {
        glitchY.current = (Math.random() - 0.5) * 0.04;
        glitchDecay.current = 1.0;
        nextGlitch.current = now + 1800 + Math.random() * 3500;
      }
      glitchDecay.current = Math.max(0, glitchDecay.current - delta * 8);
      modelsGroup.current.position.y = smoothFloat + (glitchY.current * glitchDecay.current);
    }

    // ── Camera Dolly, Cinematic Breathing & Recoil ──────────────────────
    const settled = p >= 1 ? 0.3 : 1.0; // Calmer breathing post-reveal
    const breathX = Math.sin(t * 0.4) * 0.012 * settled;
    const breathY = Math.cos(t * 0.3) * 0.012 * settled;

    // Camera recoil backwards during impact, plus tiny vibration
    const recoilZ = impactState.current.recoil * 0.15;
    const vibration = Math.sin(t * 80) * impactState.current.recoil * 0.008;

    _camTarget.set(breathX, (isDecrypting ? 1.45 : 1.15) + breathY, (isDecrypting ? 2.5 : 4.2) + recoilZ);
    camera.position.lerp(_camTarget, isDecrypting ? 0.03 : 0.02);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.08 + breathX + vibration, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, _camTarget.y + mouse.current.y * 0.04 + vibration, 0.025);

    _lookAt.set(breathX * 0.5, (isDecrypting ? 1.4 : 1.1) + breathY * 0.5, 0);
    camera.lookAt(_lookAt);
  });

  return (
    <group ref={sceneGroup}>
      <ambientLight intensity={isDecrypting ? 0.6 : 0.8} />
      <spotLight position={[1.5, 3.5, 4]} angle={0.55} penumbra={0.8}
        intensity={isDecrypting ? 1.2 : 0.5} color="#eaf2ff" />
      <directionalLight position={[0, 3, 5]} intensity={0.4} color="#cfe0ff" />

      <pointLight ref={pLight1} position={[-3, 2.2, -3]} color="#ff2b5e" distance={12} decay={1.5} />
      <pointLight ref={pLight2} position={[3.2, 2.6, -3.2]} color="#3a7bff" distance={12} decay={1.5} />

      {/* Atmospheric Volumetric Haze & Lens FX */}
      <AtmosphericHaze progressRef={progress} />
      <LensDistortionOverlay progressRef={progress} />

      <OrbitalRings ringsRef={bgGroup} mouse={mouse} progressRef={progress} />
      <Shockwave progressRef={progress} />

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
   ATMOSPHERIC HAZE & LENS FX
   ========================================================================= */
function AtmosphericHaze({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const p = progressRef.current;
      materialRef.current.uniforms.uPulse.value = p > 0.78 && p < 0.9 ? 1.0 : 0.0;
    }
  });

  return (
    <mesh position={[0, 1.5, -6]}>
      <planeGeometry args={[25, 18]} />
      <shaderMaterial ref={materialRef}
        transparent depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uPulse: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime;
          uniform float uPulse;
          varying vec2 vUv;
          
          float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x),
                       mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y);
          }
          
          void main() {
            vec2 uv1 = vUv * 2.0 + vec2(uTime * 0.02, uTime * 0.015);
            vec2 uv2 = vUv * 1.5 - vec2(uTime * 0.01, uTime * 0.02);
            float n = noise(uv1) * 0.5 + noise(uv2) * 0.5;
            
            float dist = distance(vUv, vec2(0.5));
            float falloff = smoothstep(0.5, 0.0, dist);
            
            vec3 baseColor = vec3(0.06, 0.02, 0.15);
            float alpha = n * falloff * (0.2 + uPulse * 0.3);
            
            gl_FragColor = vec4(baseColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

function LensDistortionOverlay({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      const p = progressRef.current;
      let intensity = 0;
      if (p > 0.1 && p < 1.0) {
        intensity = Math.sin(p * Math.PI) * 0.8; // Peak at 0.5
        if (p > 0.78 && p < 0.85) intensity += 0.8; // Impact spike
      }
      materialRef.current.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <mesh position={[0, 0, -0.2]} renderOrder={999}>
      {/* Attach plane to camera so it acts as screen overlay */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef}
        transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ uIntensity: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`}
        fragmentShader={`
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv * 2.0 - 1.0;
            float d = length(p);
            float edge = smoothstep(0.4, 1.2, d);
            
            vec3 color = vec3(0.0);
            // Subtle RGB separation at screen edges
            if (p.x < 0.0) color += vec3(0.0, 1.0, 1.0) * edge * uIntensity * 0.06;
            else color += vec3(1.0, 0.0, 1.0) * edge * uIntensity * 0.06;
            
            gl_FragColor = vec4(color, uIntensity * edge * 0.2);
          }
        `}
      />
    </mesh>
  );
}

/* =========================================================================
   SHOCKWAVE
   ========================================================================= */
function Shockwave({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ring1.current || !ring2.current) return;
    const p = progressRef.current;
    if (p > 0.8 && p < 1) {
      const localP = (p - 0.8) / 0.2;
      const easeP = 1 - Math.pow(1 - localP, 3); // ease out cubic

      ring1.current.scale.setScalar(0.2 + easeP * 3.5);
      ring2.current.scale.setScalar(0.2 + easeP * 3.8);

      const alpha = (1 - localP) * 0.5;
      (ring1.current.material as THREE.MeshBasicMaterial).opacity = alpha;
      (ring2.current.material as THREE.MeshBasicMaterial).opacity = alpha * 0.8;

      ring1.current.visible = true;
      ring2.current.visible = true;
    } else {
      ring1.current.visible = false;
      ring2.current.visible = false;
    }
  });

  return (
    <group position={[0, 1.3, 0]}>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.02, 32, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.02, 32, 100]} />
        <meshBasicMaterial color="#ff007f" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* =========================================================================
   ORBITAL RINGS
   ========================================================================= */
function OrbitalRings({
  ringsRef,
  mouse,
  progressRef
}: {
  ringsRef: React.RefObject<THREE.Group | null>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  progressRef: React.MutableRefObject<number>;
}) {
  const rings = [1.8, 2.4, 3.1, 4.0];
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (!ringsRef.current) return;

    // Group tilt based on mouse
    ringsRef.current.rotation.x = THREE.MathUtils.lerp(ringsRef.current.rotation.x, mouse.current.y * 0.08, 0.03);
    ringsRef.current.rotation.y = THREE.MathUtils.lerp(ringsRef.current.rotation.y, mouse.current.x * 0.12, 0.03);

    // Cinematic Idle: Glitch only rarely pre-reveal, almost never post-reveal
    const isGlitch = p < 1 ? Math.random() > 0.995 : Math.random() > 0.999;
    const impactBloom = (p > 0.78 && p < 0.85) ? 1.5 : 1.0; // Bloom boost on impact

    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      // Asynchronous slow breathing parallax
      mesh.rotation.z = Math.sin(t * 0.3 + i) * 0.02;

      // Delay inner ring from mouse for layered parallax
      if (i === 0) {
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, mouse.current.y * -0.03, 0.02);
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, mouse.current.x * -0.03, 0.02);
      }

      // Glitch effect
      if (isGlitch) mesh.position.y = (Math.random() - 0.5) * 0.02;
      else mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0, 0.1);

      // Depth of Field Illusion:
      // Pre-decrypt: Background softer (outer rings dim).
      // Post-reveal: Avatar sharp, rings soften further to push focus forward.
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const settledFocus = p >= 1 ? 0.3 : 0.8; // Fade rings back into space after reveal
      const distFactor = 1.0 - (i / rings.length) * 0.4; // Outer rings are inherently softer

      const baseOpacity = 0.08 + (i * 0.02);
      const breath = Math.sin(t * 0.8 + i) * 0.02;

      mat.opacity = (baseOpacity + breath) * distFactor * settledFocus * impactBloom;
    });

    // Particles reaction
    if (particlesRef.current) {
      const energy = (Math.abs(mouse.current.x) + Math.abs(mouse.current.y)) * 0.1;
      particlesRef.current.rotation.z = t * 0.02 + energy;
      particlesRef.current.scale.setScalar(THREE.MathUtils.lerp(particlesRef.current.scale.x, 1 + energy, 0.05));
    }
  });

  return (
    <group ref={ringsRef} position={[0, 1.4, -3]}>
      {rings.map((r, i) => (
        <mesh key={i} ref={el => meshesRef.current[i] = el} rotation={[Math.PI / 2 + i * 0.12, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.003, 16, 160]} />
          <meshBasicMaterial color={i % 2 ? "#3a7bff" : "#ff2b5e"} transparent blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <group ref={particlesRef}>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return (
            <mesh key={`d${i}`} position={[Math.cos(a) * 3.5, Math.sin(a) * 3.5, 0]}>
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial color="#7aa9ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
            </mesh>
          );
        })}
      </group>
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
      className="absolute left-6 top-24 font-mono text-[11px] uppercase tracking-[0.3em] text-[#7aa9ff] md:left-10 md:top-28">
      {lines.map((l, i) => (
        <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.2 }} className="leading-relaxed">{l}
        </motion.div>
      ))}
    </motion.div>
  );
}

function HeroHUD({ showText }: { showText: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showText ? 0.15 : 0.6 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10 overflow-hidden">

      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.2em] text-[#00f0ff]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
            SYS.VER // 1610.A
          </div>
          <span className="text-[#ff007f] ml-3.5">ANOMALY DETECTED</span>
        </div>
        <div className="flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.2em] text-right text-[#00f0ff]">
          <span>[ TARGET LOCKED ]</span>
          <span className="opacity-50">COORDS: 40.71°N 74.00°W</span>
        </div>
      </div>

      {/* Center Reticles / Frame Guides */}
      <div className="absolute top-1/2 left-6 w-2 h-8 border-l border-[#00f0ff]/30 -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-6 w-2 h-8 border-r border-[#00f0ff]/30 -translate-y-1/2"></div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.2em] text-[#00f0ff]">
          <div className="flex gap-1.5 mb-1">
            <div className="w-8 h-[2px] bg-[#00f0ff]/40"></div>
            <div className="w-3 h-[2px] bg-[#ff007f]/60"></div>
            <div className="w-12 h-[2px] bg-[#00f0ff]/40"></div>
          </div>
          <span>STABILIZATION: 14%</span>
          <span className="opacity-50">AWAITING OVERRIDE</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5 items-end">
            <div className="w-16 h-[1px] bg-[#00f0ff]/40"></div>
            <div className="w-8 h-[1px] bg-[#ff007f]/40"></div>
            <div className="w-20 h-[1px] bg-[#00f0ff]/40"></div>
          </div>
          <div className="w-10 h-10 border border-[#ff007f]/30 rounded-full flex items-center justify-center relative">
            <div className="w-6 h-6 border-[1px] border-t-[#00f0ff] border-r-transparent border-b-[#00f0ff] border-l-transparent rounded-full animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute w-1 h-1 bg-[#ff007f] rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DecryptButton({ onClick }: { onClick: () => void }) {
  return (
    <SpiderCrawlButton onClick={onClick} data-cursor="hover" className="group flex flex-col items-center">
      {/* Floating Holographic Target Ring */}
      <div className="relative flex items-center justify-center mb-5 md:mb-8">
        <div className="w-16 h-16 border-[1px] border-[#00f0ff]/30 rounded-full animate-[spin_6s_linear_infinite] group-hover:border-[#00f0ff]/80 transition-colors duration-500" />
        <div className="absolute w-10 h-10 border-[1px] border-dashed border-[#ff007f]/40 rounded-full animate-[spin_4s_linear_infinite_reverse] group-hover:border-[#ff007f]/80 transition-colors duration-500" />
        <div className="absolute w-1.5 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff] group-hover:scale-150 group-hover:bg-white group-hover:shadow-[0_0_20px_#fff] transition-all duration-300" />
      </div>

      {/* Main Terminal Bar */}
      <div className="relative flex items-stretch border border-[#00f0ff]/20 bg-[#05050a]/80 backdrop-blur-md group-hover:border-[#00f0ff]/50 transition-all duration-500 overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        {/* Animated Scanline Background */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100" />

        {/* Left Warning Block */}
        <div className="relative z-10 flex items-center bg-[#00f0ff]/10 px-4 border-r border-[#00f0ff]/20 group-hover:bg-[#00f0ff]/20 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#00f0ff] group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Center Text */}
        <div className="relative z-10 px-8 py-3 flex flex-col items-center justify-center">
          <span className="font-display text-sm md:text-base tracking-[0.4em] text-white group-hover:text-[#00f0ff] transition-colors">INITIATE OVERRIDE</span>
          <span className="font-mono text-[8px] text-[#ff007f] tracking-[0.2em] mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">DIMENSIONAL_LOCK // ACTIVE</span>
        </div>

        {/* Right Status Block */}
        <div className="relative z-10 flex flex-col justify-center gap-1.5 bg-[#00f0ff]/5 px-4 border-l border-[#00f0ff]/20 group-hover:bg-[#00f0ff]/10 transition-colors">
          <div className="w-5 h-[2px] bg-[#00f0ff]/40 group-hover:bg-[#00f0ff] transition-colors" />
          <div className="w-3 h-[2px] bg-[#ff007f]/40 group-hover:bg-[#ff007f] transition-colors" />
          <div className="w-5 h-[2px] bg-[#00f0ff]/40 group-hover:bg-[#00f0ff] transition-colors" />
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </SpiderCrawlButton>
  );
}

function AvatarTypography() {
  // Adding extremely subtle micro-imperfections inline (CSS animations could be used, but framer-motion keyframes are reliable here)
  const jitterOffset = {
    x: [0, -1, 1, 0, 0, 2, -1, 0],
    y: [0, 1, -1, 0, 0, -1, 1, 0],
  };

  return (
    <motion.div key="avatar-ui" 
      initial={{ opacity: 0, filter: "blur(12px)" }} 
      animate={{ opacity: 1, filter: "blur(0px)" }} 
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-between px-6 md:px-20 pointer-events-none">
      
      <motion.div className="max-w-[45%] pl-4 md:pl-10"
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#00f0ff] mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ff007f] animate-pulse opacity-80"></span>
          Identity // 001
        </div>
        <motion.h1 
          animate={jitterOffset}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
          className="relative font-display text-5xl md:text-[5.5rem] font-black italic leading-[0.85] tracking-tighter text-white uppercase"
          style={{ textShadow: "4px 4px 0px rgba(255,0,127,0.7), -3px -3px 0px rgba(0,240,255,0.7)" }}>
          <ScrambleText text="RAJAT" /><br /><ScrambleText text="TREHAN" delay={0.25} />
          {/* Micro-cyan layer desync */}
          <motion.span aria-hidden 
            animate={{ x: [0, 2, -1, 0], opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-0 left-0 text-[#00f0ff] mix-blend-screen pointer-events-none z-[-1] blur-[1px]">
            RAJAT<br/>TREHAN
          </motion.span>
        </motion.h1>
      </motion.div>

      <motion.div className="max-w-[45%] text-right pr-4 md:pr-10"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div animate={jitterOffset} transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }} className="flex flex-col items-end">
          <MaskedSlide text="FULL STACK & A.I" className="font-display text-3xl md:text-[4rem] font-black italic tracking-tighter text-white uppercase leading-[0.85]" />
          <MaskedSlide text="DEVELOPER" delay={0.15} className="font-display text-3xl md:text-[4rem] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff007f] uppercase leading-[0.85]" style={{ filter: "drop-shadow(0px 0px 15px rgba(0,240,255,0.3))" }} />
        </motion.div>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.5em] text-[#ff007f] flex items-center justify-end gap-2">
          Variant // 1610
          <span className="w-2 h-2 bg-[#00f0ff] animate-pulse opacity-80"></span>
        </div>
      </motion.div>
      
    </motion.div>
  );
}

const CIPHER = "!@#$%&*<>?/\\{}[]=+-_^~";
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(() =>
    text.split("").map((c) => c === " " ? " " : CIPHER[Math.floor(Math.random() * CIPHER.length)]).join("")
  );
  const [isScrambling, setIsScrambling] = useState(true);

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
        if (t >= 1) {
          setDisplay(text);
          setIsScrambling(false);
          clearInterval(iv);
        }
      }, 45);
    }, delay * 1000);
    return () => { clearTimeout(wait); clearInterval(iv); };
  }, [text, delay]);
  return <span className={isScrambling ? "font-mono" : ""}>{display}</span>;
}

function MaskedSlide({ text, delay = 0, className, style }: { text: string; delay?: number, className?: string, style?: React.CSSProperties }) {
  // If no className provided, fallback to the massive bold title default
  const classes = className || "font-display text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white";
  return (
    <div className="relative overflow-hidden pr-8 pb-4 pt-2 -mr-19 -mb-4 -mt-2">
      <motion.div initial={{ y: "150%" }} animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.7, 0, 0.2, 1] }}
        className={classes}
        style={style}>
        {text}
      </motion.div>
    </div>
  );
}
