
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
  return (
    <group position={[x, 2.35, -7.7]}>
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
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(title);
        }}
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
        intensity={18}
        distance={6}
        color="#ffd9a4"
      />
    </group>
  );
}

function KineticSculpture({ onDraggingChange }) {
  const sculpture = useRef();

  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });

  useFrame((_, delta) => {
    const d = drag.current;
    const object = sculpture.current;

    if (!object || d.active) return;

    // Continuous, subtle rotation with momentum after dragging.
    object.rotation.y += (0.16 + d.vx) * delta;
    object.rotation.x += d.vy * delta;

    const friction = Math.exp(-1.6 * delta);
    d.vx *= friction;
    d.vy *= friction;

    // Prevent residual momentum from continuing indefinitely.
    if (Math.abs(d.vx) < 0.001) d.vx = 0;
    if (Math.abs(d.vy) < 0.001) d.vy = 0;
  });

  function startDrag(event) {
    event.stopPropagation();

    const d = drag.current;
    d.active = true;
    d.x = event.nativeEvent.clientX;
    d.y = event.nativeEvent.clientY;
    d.vx = 0;
    d.vy = 0;

    onDraggingChange(true);
    document.body.style.cursor = "grabbing";
  }

  function moveDrag(event) {
    const d = drag.current;
    const object = sculpture.current;

    if (!d.active || !object) return;

    event.stopPropagation();

    const x = event.nativeEvent.clientX;
    const y = event.nativeEvent.clientY;
    const dx = x - d.x;
    const dy = y - d.y;

    // Drag horizontally or vertically in either direction.
    object.rotation.y += dx * 0.012;
    object.rotation.x += dy * 0.009;

    // Faster movement produces stronger release momentum.
    d.vx = THREE.MathUtils.clamp(dx * 0.065, -3, 3);
    d.vy = THREE.MathUtils.clamp(dy * 0.045, -2, 2);

    d.x = x;
    d.y = y;
  }

  function endDrag() {
    if (!drag.current.active) return;

    drag.current.active = false;
    onDraggingChange(false);
    document.body.style.cursor = "auto";
  }

  return (
    <group position={[0, 1.6, -1.5]}>
      <group
        ref={sculpture}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Tall architectural metal elements */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.08, 3.2, 0.08]} />
          <meshStandardMaterial
            color="#c39a63"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0.4, 0.05, -0.12]}>
          <boxGeometry args={[0.07, 3.5, 0.07]} />
          <meshStandardMaterial
            color="#ead0a2"
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>

        {/* Intersecting geometric frames */}
        <mesh
          position={[-0.12, 0.2, 0.1]}
          rotation={[0, 0, -0.32]}
        >
          <boxGeometry args={[1.65, 0.055, 0.055]} />
          <meshStandardMaterial
            color="#bd8b4d"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[0.08, -0.45, 0.2]}
          rotation={[0, 0, 0.42]}
        >
          <boxGeometry args={[1.7, 0.055, 0.055]} />
          <meshStandardMaterial
            color="#e1bc83"
            metalness={0.9}
            roughness={0.22}
          />
        </mesh>

        {/* Sculptural bronze blades */}
        <mesh
          position={[-0.35, 0.75, 0.12]}
          rotation={[0.08, 0, -0.48]}
        >
          <boxGeometry args={[0.48, 1.65, 0.12]} />
          <meshStandardMaterial
            color="#b17a43"
            metalness={0.88}
            roughness={0.28}
          />
        </mesh>

        <mesh
          position={[0.38, -0.65, 0.22]}
          rotation={[0, 0, 0.55]}
        >
          <boxGeometry args={[0.38, 1.45, 0.1]} />
          <meshStandardMaterial
            color="#d8b27a"
            metalness={0.92}
            roughness={0.24}
          />
        </mesh>

        {/* Dark faceted central core */}
        <mesh position={[0, 0, 0.35]}>
          <octahedronGeometry args={[0.62, 1]} />
          <meshStandardMaterial
            color="#211b17"
            metalness={0.92}
            roughness={0.19}
            emissive="#3e2514"
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* Illuminated vertical accent */}
        <mesh position={[0.04, 0, 0.46]}>
          <boxGeometry args={[0.025, 1.85, 0.025]} />
          <meshStandardMaterial
            color="#ffdda5"
            emissive="#d99543"
            emissiveIntensity={1.6}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* Small precision details */}
        {[-0.85, 0.85].map((y, i) => (
          <mesh
            key={i}
            position={[i === 0 ? -0.48 : 0.48, y, 0.28]}
            rotation={[0, 0, 0.4]}
          >
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshStandardMaterial
              color="#f0d3a5"
              metalness={0.95}
              roughness={0.16}
            />
          </mesh>
        ))}
      </group>

      {/* Black stone rectangular pedestal */}
      <mesh position={[0, -1.35, 0]}>
        <boxGeometry args={[2.2, 0.42, 1.65]} />
        <meshStandardMaterial
          color="#171615"
          metalness={0.35}
          roughness={0.28}
        />
      </mesh>

      {/* Fine brass detail */}
      <mesh position={[0, -1.13, 0]}>
        <boxGeometry args={[2.05, 0.025, 1.5]} />
        <meshStandardMaterial
          color="#bd9257"
          metalness={0.95}
          roughness={0.2}
          emissive="#65421f"
          emissiveIntensity={0.25}
        />
      </mesh>

      <pointLight
        position={[0, 0.6, 1.3]}
        intensity={12}
        distance={5}
        color="#e5b777"
      />
    </group>
  );
}

function Movement() {
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const keys = getKeys();

    forward.current
      .set(0, 0, -1)
      .applyQuaternion(camera.quaternion);
    forward.current.y = 0;
    forward.current.normalize();

    right.current
      .set(1, 0, 0)
      .applyQuaternion(camera.quaternion);
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

    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -7.8,
      7.8
    );

    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -8.1,
      7.8
    );

    camera.position.y = 1.65;
  });

  return null;
}

function GalleryScene({ onSelect }) {
  const [isSculptureDragging, setIsSculptureDragging] =
    useState(false);

  return (
    <>
      <color attach="background" args={["#090909"]} />
      <fog attach="fog" args={["#090909", 14, 27]} />

      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#d8d9e3", "#21160f", 0.7]} />

      {/* Gallery floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          color="#292725"
          roughness={0.3}
          metalness={0.22}
        />
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
        <Artwork
          key={item.title}
          {...item}
          onSelect={onSelect}
        />
      ))}

      {/* Central kinetic installation */}
      <KineticSculpture
        onDraggingChange={setIsSculptureDragging}
      />

      <PointerLockControls enabled={!isSculptureDragging} />
      <Movement />
    </>
  );
}

export default function Gallery({ onSelect }) {
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
        <GalleryScene onSelect={onSelect} />
      </Canvas>
    </KeyboardControls>
  );
}
