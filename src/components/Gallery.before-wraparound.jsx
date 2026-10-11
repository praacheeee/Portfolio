import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  KeyboardControls,
  PointerLockControls,
  Text,
  useKeyboardControls,
} from "@react-three/drei";
import * as THREE from "three";

const exhibits = [
  { title: "FLOODSENSE", color: "#24556A", x: -4.5 },
  { title: "POTHOLE DETECTION", color: "#72533B", x: 0 },
  { title: "MENTORMIND", color: "#574269", x: 4.5 },
];

function Artwork({ title, color, x, onSelect }) {
  const artworkGroup = useRef();

  function handleArtworkClick(event) {
    event.stopPropagation();
    const canvas = document.querySelector("canvas");
    const rect = canvas?.getBoundingClientRect();
    const group = artworkGroup.current;

    if (!rect || !group) {
      onSelect?.(title, { left: event.clientX, right: event.clientX, top: event.clientY, bottom: event.clientY });
      return;
    }

    // Project the outer frame corners to screen coordinates for accurate anchoring.
    const corners = [
      [-1.575, 1.325, 0], [1.575, 1.325, 0],
      [-1.575, -1.325, 0], [1.575, -1.325, 0],
    ].map(([cx, cy, cz]) => {
      const point = group.localToWorld(new THREE.Vector3(cx, cy, cz));
      point.project(event.camera);
      return {
        x: rect.left + ((point.x + 1) / 2) * rect.width,
        y: rect.top + ((1 - point.y) / 2) * rect.height,
      };
    });

    onSelect?.(title, {
      left: Math.min(...corners.map((point) => point.x)),
      right: Math.max(...corners.map((point) => point.x)),
      top: Math.min(...corners.map((point) => point.y)),
      bottom: Math.max(...corners.map((point) => point.y)),
    });
  }

  return (
    <group ref={artworkGroup} position={[x, 2.35, -7.7]}>
      {/* Metallic frame */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[3.15, 2.65, 0.22]} />
        <meshStandardMaterial
          color="#a88a63"
          metalness={0.65}
          roughness={0.32}
        />
      </mesh>

      {/* Clickable artwork */}
      <mesh
        onClick={handleArtworkClick}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[2.92, 2.42]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          roughness={0.8}
        />
      </mesh>

      <Text
        position={[0, -1.65, 0.03]}
        fontSize={0.19}
        color="#e6d2b1"
        anchorX="center"
      >
        {title}
      </Text>

      <pointLight
        position={[0, 1.8, 1.5]}
        intensity={14}
        distance={5}
        color="#ffd9a4"
      />
    </group>
  );
}

function WireframeBox({ width, height, color }) {
  const barThickness = 0.032;
  const material = (
    <meshStandardMaterial
      color={color}
      roughness={0.2}
      metalness={0.95}
    />
  );

  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + barThickness, barThickness, barThickness]} />
        {material}
      </mesh>
      <mesh position={[0, -height / 2, 0]} castShadow>
        <boxGeometry args={[width + barThickness, barThickness, barThickness]} />
        {material}
      </mesh>
      <mesh position={[-width / 2, 0, 0]} castShadow>
        <boxGeometry args={[barThickness, height - barThickness, barThickness]} />
        {material}
      </mesh>
      <mesh position={[width / 2, 0, 0]} castShadow>
        <boxGeometry args={[barThickness, height - barThickness, barThickness]} />
        {material}
      </mesh>
    </group>
  );
}

function Sculpture3D({ className }) {
  const sculpture = useRef();
  const innerCoreRef = useRef();

  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });

  useFrame((state, delta) => {
    const d = drag.current;
    const object = sculpture.current;

    if (!object) return;

    if (!d.active) {
      // Continuous subtle rotation with momentum after dragging
      object.rotation.y += (0.15 + d.vx) * delta;
      object.rotation.x += d.vy * delta;

      const friction = Math.exp(-1.6 * delta);
      d.vx *= friction;
      d.vy *= friction;

      if (Math.abs(d.vx) < 0.001) d.vx = 0;
      if (Math.abs(d.vy) < 0.001) d.vy = 0;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.025;
      innerCoreRef.current.rotation.z += delta * 0.15;
    }
  });

  function startDrag(event) {
    event.stopPropagation();
    const d = drag.current;
    d.active = true;
    d.x = event.clientX;
    d.y = event.clientY;
    d.vx = 0;
    d.vy = 0;

    // Capture pointer so rotation continues even if cursor moves outside canvas
    event.target.setPointerCapture?.(event.pointerId);
    document.body.style.cursor = "grabbing";
  }

  function moveDrag(event) {
    const d = drag.current;
    const object = sculpture.current;

    if (!d.active || !object) return;
    event.stopPropagation();

    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;

    object.rotation.y += dx * 0.012;
    object.rotation.x += dy * 0.009;

    d.vx = THREE.MathUtils.clamp(dx * 0.065, -3, 3);
    d.vy = THREE.MathUtils.clamp(dy * 0.045, -2, 2);

    d.x = event.clientX;
    d.y = event.clientY;
  }

  function endDrag(event) {
    if (!drag.current.active) return;
    drag.current.active = false;
    event.target.releasePointerCapture?.(event.pointerId);
    document.body.style.cursor = "auto";
  }

  return (
    <group
      position={[0, 1.6, -1.5]}
      className={className}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <group ref={sculpture}>
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <icosahedronGeometry args={[0.82, 0]} />
          <meshStandardMaterial
            color="#1b1b1b"
            roughness={0.25}
            metalness={0.8}
            flatShading={true}
          />
        </mesh>

        <group ref={innerCoreRef} position={[0, -0.22, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color="#e2bf63"
              roughness={0.2}
              metalness={0.92}
              flatShading={true}
              emissive="#3d3000"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        <mesh position={[0.42, 0.35, -0.15]} rotation={[0.25, 0.45, 0.2]} castShadow>
          <boxGeometry args={[0.04, 1.7, 0.04]} />
          <meshStandardMaterial color="#e2bf63" roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh position={[-0.38, -0.45, 0.18]} rotation={[-0.2, -0.4, -0.25]} castShadow>
          <boxGeometry args={[0.035, 1.3, 0.035]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.85} />
        </mesh>

        <group position={[-0.05, 0.05, 0.05]} rotation={[0.3, 0.4, -0.6]}>
          <WireframeBox width={1.55} height={1.55} color="#e8ca6b" />
        </group>
        <group position={[0.05, -0.05, -0.05]} rotation={[-0.4, 0.3, 0.35]}>
          <WireframeBox width={1.4} height={1.4} color="#d4af37" />
        </group>
      </group>

      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.3, 1.0]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[0, -1.5, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.3, 1.1]} />
        <meshStandardMaterial color="#121212" roughness={0.85} metalness={0.2} />
      </mesh>

      <pointLight
        position={[0, 0.8, 1.2]}
        intensity={14}
        distance={5}
        color="#ffd9a4"
      />
    </group>
  );
}

function CameraTransition({ progress }) {
  const start = useRef(new THREE.Vector3(0, 1.65, 5));
  const destination = useRef(new THREE.Vector3(0, 1.65, 0.8));
  const previousProgress = useRef(0);

  useFrame(({ camera }) => {
    // Set the exact entry position once, then release the camera for navigation.
    if (progress >= 1) {
      if (previousProgress.current < 1) {
        camera.position.copy(destination.current);
        camera.lookAt(0, 1.65, -7);
      }
      // Important: once the entry animation completes, leave the camera
      // orientation alone so PointerLockControls can control the view.
      previousProgress.current = progress;
      return;
    }

    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(start.current, destination.current, eased);
    camera.lookAt(0, 1.65, -7);
    previousProgress.current = progress;
  });

  return null;
}

function Movement({ enabled }) {
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    if (!enabled) return;

    const keys = getKeys();

    forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.current.y = 0;
    forward.current.normalize();

    right.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.current.y = 0;
    right.current.normalize();

    direction.current.set(0, 0, 0);

    if (keys.forward) direction.current.add(forward.current);
    if (keys.backward) direction.current.sub(forward.current);
    if (keys.left) direction.current.sub(right.current);
    if (keys.right) direction.current.add(right.current);

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      camera.position.addScaledVector(direction.current, 4 * delta);
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -7.8, 7.8);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -8.1, 7.8);
    camera.position.y = 1.65;
  });

  return null;
}

function GalleryScene({ onSelect, transitionProgress, exhibitionActive }) {
  return (
    <>
      <color attach="background" args={["#090909"]} />
      <fog attach="fog" args={["#090909", 14, 27]} />

      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#d8d9e3", "#21160f", 0.7]} />

      {/* Gallery floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#292725" roughness={0.3} metalness={0.22} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -9]}>
        <boxGeometry args={[18, 5, 0.3]} />
        <meshStandardMaterial color="#191817" />
      </mesh>

      {/* Side walls */}
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 2.5, 0]}>
          <boxGeometry args={[0.3, 5, 18]} />
          <meshStandardMaterial color="#141312" />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[18, 0.3, 18]} />
        <meshStandardMaterial color="#0c0c0c" />
      </mesh>

      {/* Warm architectural lights */}
      {[-6, -2, 2, 6].map((x) => (
        <pointLight
          key={x}
          position={[x, 3.8, -5]}
          intensity={12}
          distance={9}
          color="#e8bd86"
        />
      ))}

      {/* Project exhibits */}
      {exhibits.map((item) => (
        <Artwork key={item.title} {...item} onSelect={onSelect} />
      ))}

      {/* Central Interactive Sculpture */}
      <Sculpture3D className="sculpture-canvas" />

      <CameraTransition progress={transitionProgress} />
      <Movement enabled={exhibitionActive} />
      <PointerLockControls enabled={exhibitionActive} />
    </>
  );
}

export default function Gallery({ onSelect, transitionProgress = 0, exhibitionActive = false }) {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["KeyW", "ArrowUp"] },
        { name: "backward", keys: ["KeyS", "ArrowDown"] },
        { name: "left", keys: ["KeyA", "ArrowLeft"] },
        { name: "right", keys: ["KeyD", "ArrowRight"] },
      ]}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 1.65, 5],
          fov: 70,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <GalleryScene
          onSelect={onSelect}
          transitionProgress={transitionProgress}
          exhibitionActive={exhibitionActive}
        />
      </Canvas>
    </KeyboardControls>
  );
}