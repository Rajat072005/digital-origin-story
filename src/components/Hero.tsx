import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import { Leva, useControls } from "leva";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

useGLTF.preload("/models/spiderman_optimized.glb");
useGLTF.preload("/models/avatar_mcu.glb");

type Phase = "boot" | "spider" | "burst" | "avatar";
type ModelGroupProps = ThreeElements["group"];

export function Hero() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [mounted, setMounted] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    const t = setTimeout(() => setPhase("spider"), 1400);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
    };
  }, []);

  const handleDecrypt = () => {
    if (phase !== "spider") return;
    setPhase("burst");
    setTimeout(() => setPhase("avatar"), 2200);
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#0a0a0a]">
      {/* Radial gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, #0d1530 0%, #060611 55%, #020205 100%)",
        }}
      />
      {/* Vignette + flash overlays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <AnimatePresence>
        {phase === "burst" && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, times: [0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>

      {/* R3F Canvas */}
      {mounted && (
        <>
        <Leva collapsed />
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          camera={{ fov: 32, position: [0, 1.2, 4.2] }}
          className="absolute inset-0"
        >
          <color attach="background" args={["#0a0a0a"]} />
          <fog attach="fog" args={["#05060c", 6, 14]} />

          <Scene phase={phase} mouse={mouse} />

          <Suspense fallback={null}>
            <Environment preset="night" />
          </Suspense>
        </Canvas>
        </>
      )}

      {/* UI overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
        {/* Boot terminal */}
        <AnimatePresence>
          {phase === "boot" && <BootTerminal />}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {phase === "spider" && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="pointer-events-auto absolute bottom-[14svh] left-1/2 -translate-x-1/2"
            >
              <DecryptButton onClick={handleDecrypt} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final typography */}
        <AnimatePresence>
          {phase === "avatar" && <AvatarTypography />}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =========================================================================
   R3F SCENE
   ========================================================================= */

function Scene({
  phase,
  mouse,
}: {
  phase: Phase;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  // Camera framing per phase
  useFrame(() => {
    const target =
      phase === "avatar"
        ? new THREE.Vector3(0, 1.55, 2.0) // tighter MCU
        : new THREE.Vector3(0, 1.15, 4.2);
    camera.position.lerp(target, 0.04);
    // subtle parallax
    camera.position.x += (mouse.current.x * 0.12 - (camera.position.x - target.x)) * 0.02;
    camera.lookAt(0, phase === "avatar" ? 1.55 : 1.15, 0);
  });

  return (
    <>
      {/* Three-point lighting */}
      <ambientLight intensity={0.85} />
      {/* Key */}
      <KeyLight phase={phase} />
      {/* Rim — neon red + blue */}
      <pointLight
        position={[-3, 2.2, -3]}
        intensity={phase === "avatar" ? 4 : 6}
        color="#ff2b5e"
        distance={12}
      />
      <pointLight
        position={[3.2, 2.6, -3.2]}
        intensity={phase === "avatar" ? 4 : 7}
        color="#3a7bff"
        distance={12}
      />
      {/* Fill */}
      <directionalLight position={[0, 3, 5]} intensity={0.6} color="#cfe0ff" />

      <OrbitalRings phase={phase} mouse={mouse} />

      <Suspense fallback={null}>
        {(phase === "spider" || phase === "burst" || phase === "boot") && (
          <SpiderManModel isCrackingNeck={phase === "burst"} />
        )}
        {phase === "burst" && <DisintegrationBurst />}
        {phase === "avatar" && <AvatarModel />}
      </Suspense>
    </>
  );
}

function KeyLight({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    const target =
      phase === "avatar" ? 1.6 : phase === "burst" ? 3.5 : 0.55;
    ref.current.intensity += (target - ref.current.intensity) * 0.08;
  });
  return (
    <spotLight
      ref={ref}
      position={[1.5, 3.5, 4]}
      angle={0.55}
      penumbra={0.8}
      intensity={0.55}
      color="#eaf2ff"
      castShadow={false}
    />
  );
}

/* ---------------- Orbital rings ---------------- */

function OrbitalRings({
  phase,
  mouse,
}: {
  phase: Phase;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.04;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.12,
      0.04,
    );
    const targetScale = phase === "burst" ? 1.25 : 1;
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.06,
    );
  });

  const rings = [1.8, 2.4, 3.1, 4.0];

  return (
    <group ref={group} position={[0, 1.4, -3]}>
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
      {/* dotted halo */}
      {Array.from({ length: 80 }).map((_, i) => {
        const a = (i / 80) * Math.PI * 2;
        return (
          <mesh key={`d${i}`} position={[Math.cos(a) * 3.5, Math.sin(a) * 3.5, 0]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#7aa9ff" transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------------- Spider-Man ---------------- */

function SpiderManModel(props: ModelGroupProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/spiderman_optimized.glb");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    console.log("Spider-Man Animations Array:", names);
    console.log("Spider-Man Raw Animations:", animations);
    console.log("Spider-Man Scene:", scene);

    if (names && names.length > 0) {
      console.log("Attempting to play:", names[0]);
      actions[names[0]]?.reset().play();
    } else {
      console.error("CRITICAL ERROR: No animations found in Spider-Man GLB!");
    }
  }, [actions, animations, names, scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
    </group>
  );
}

/* ---------------- Avatar (MCU) ---------------- */

function AvatarModel(props: ModelGroupProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/avatar_mcu.glb");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    console.log("Avatar Animations Array:", names);
    console.log("Avatar Raw Animations:", animations);
    console.log("Avatar Scene:", scene);

    if (names && names.length > 0) {
      console.log("Attempting to play:", names[0]);
      actions[names[0]]?.reset().play();
    } else {
      console.error("CRITICAL ERROR: No animations found in Avatar GLB!");
    }
  }, [actions, animations, names, scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
    </group>
  );
}

/* ---------------- Disintegration burst ---------------- */

function DisintegrationBurst() {
  const count = 1200;
  const ref = useRef<THREE.Points>(null);
  const startRef = useRef<number>(performance.now());

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread roughly along Spider-Man's volume
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.7;
      positions[i * 3 + 1] = 0.4 + Math.random() * 1.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 1.6;
      velocities[i * 3 + 1] = (Math.random() - 0.2) * 1.4;
      velocities[i * 3 + 2] = -1.2 - Math.random() * 2.2; // blow backwards
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const geom = ref.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const t = (performance.now() - startRef.current) / 1000;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 0] = positions[i * 3 + 0] + velocities[i * 3 + 0] * t * 0.6;
      posAttr.array[i * 3 + 1] = positions[i * 3 + 1] + velocities[i * 3 + 1] * t * 0.6 - 0.4 * t * t;
      posAttr.array[i * 3 + 2] = positions[i * 3 + 2] + velocities[i * 3 + 2] * t * 0.6;
    }
    posAttr.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - t / 1.8);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#5fb6ff"
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
    <motion.div
      key="boot"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#7aa9ff] md:left-10 md:top-10"
    >
      {lines.map((l, i) => (
        <motion.div
          key={l}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18, delay: i * 0.18, ease: "easeOut" }}
          className="leading-relaxed"
        >
          {l}
        </motion.div>
      ))}
    </motion.div>
  );
}

function DecryptButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className="group relative cursor-none overflow-hidden border border-[#5fb6ff]/40 bg-[#0a0a0a]/60 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.4em] text-[#cfe2ff] backdrop-blur-md transition hover:border-[#5fb6ff] hover:text-white"
      style={{
        boxShadow:
          "0 0 24px rgba(95,182,255,0.25), inset 0 0 14px rgba(95,182,255,0.12)",
      }}
    >
      <span className="relative z-10">[ Initialize Decryption ]</span>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#5fb6ff]/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </button>
  );
}

function AvatarTypography() {
  return (
    <motion.div
      key="avatar-ui"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex items-center justify-between px-6 md:px-20"
    >
      <div className="max-w-[42%]">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7aa9ff]/80">
          Identity // 001
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
          <ScrambleText text="RAJAT" />
          <br />
          <ScrambleText text="TREHAN" delay={0.25} />
        </h1>
      </div>
      <div className="max-w-[42%] text-right">
        <MaskedSlide text="FULL STACK" />
        <MaskedSlide text="DEVELOPER" delay={0.18} />
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/80">
          Variant // 001
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Cipher / scramble text ---------------- */

const CIPHER = "!@#$%&*<>?/\\{}[]=+-_^~";
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(() =>
    text
      .split("")
      .map((c) => (c === " " ? " " : CIPHER[Math.floor(Math.random() * CIPHER.length)]))
      .join(""),
  );
  useEffect(() => {
    let raf = 0;
    let interval = 0;
    const startAt = performance.now() + delay * 1000;
    const duration = 800;
    let locked: boolean[] = new Array(text.length).fill(false);

    const wait = setTimeout(() => {
      // Rapid symbol cycling for 0.8s, progressively locking letters.
      interval = window.setInterval(() => {
        const now = performance.now();
        const t = Math.min(1, (now - startAt) / duration);
        const lockCount = Math.floor(t * text.length);
        locked = locked.map((_, i) => i < lockCount);
        const out = text
          .split("")
          .map((c, i) => {
            if (locked[i] || c === " ") return c;
            return CIPHER[Math.floor(Math.random() * CIPHER.length)];
          })
          .join("");
        setDisplay(out);
        if (t >= 1) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, 45);
    }, delay * 1000);

    return () => {
      clearTimeout(wait);
      clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);
  return <span className="font-mono">{display}</span>;
}

function MaskedSlide({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, delay, ease: [0.7, 0, 0.2, 1] }}
        className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-5xl"
      >
        {text}
      </motion.div>
    </div>
  );
}
