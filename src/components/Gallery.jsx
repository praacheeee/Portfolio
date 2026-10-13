import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  KeyboardControls,
  PointerLockControls,
  Text,
  useKeyboardControls,
} from "@react-three/drei";
import * as THREE from "three";

const exhibits = [
  { title: "FLOODSENSE", color: "#24556A", position: [-4.3, 2.35, -8.72], rotation: [0, 0, 0], motif: "water" },
  { title: "POTHOLE DETECTION", color: "#72533B", position: [4.2, 2.35, -8.72], rotation: [0, 0, 0], motif: "road" },
  { title: "MENTORMIND", color: "#574269", position: [8.72, 2.35, -3.0], rotation: [0, -Math.PI / 2, 0], motif: "mind" },
];

function createArtworkTexture(motif) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 850;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Deep, gallery-style background
  const backgrounds = {
    water: ["#061f29", "#126074", "#071923"],
    road: ["#17130f", "#8a6240", "#302016"],
    mind: ["#171126", "#554078", "#21162f"],
  };

  const colors = backgrounds[motif] || backgrounds.water;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, colors[0]);
  bg.addColorStop(0.52, colors[1]);
  bg.addColorStop(1, colors[2]);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle atmospheric glow
  const glow = ctx.createRadialGradient(
    w * 0.55, h * 0.42, 5,
    w * 0.55, h * 0.42, 520
  );
  glow.addColorStop(0, "rgba(236,190,112,0.22)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Fine, understated gold artwork details
  const gold = "#d9b578";
  ctx.lineWidth = 2;
  ctx.strokeStyle = gold;

  if (motif === "water") {
    // Large orbital circles
    [155, 235, 315].forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(620, 330, r, r * 0.9, -0.3, 0, Math.PI * 2);
      ctx.globalAlpha = 0.55 - i * 0.12;
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Layered flowing waves
    for (let layer = 0; layer < 7; layer++) {
      const y = 470 + layer * 43;

      ctx.beginPath();
      ctx.moveTo(-40, y + 60);

      ctx.bezierCurveTo(
        180, y - 100,
        260, y + 130,
        430, y + 5
      );

      ctx.bezierCurveTo(
        600, y - 115,
        770, y + 100,
        1060, y - 65
      );

      ctx.lineWidth = layer % 2 === 0 ? 5 : 2;
      ctx.strokeStyle = layer % 2 === 0 ? "#9bcbd0" : gold;
      ctx.globalAlpha = 0.78 - layer * 0.07;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Golden focal point
    const orb = ctx.createRadialGradient(620, 330, 2, 620, 330, 55);
    orb.addColorStop(0, "#fff0bd");
    orb.addColorStop(0.35, "#e7bd72");
    orb.addColorStop(1, "#9b632e");

    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(620, 330, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  if (motif === "road") {
    // Layered topographic terrain
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(-80, 100 + i * 36);

      ctx.bezierCurveTo(
        180, -20 + i * 30,
        290, 260 + i * 25,
        500, 170 + i * 32
      );

      ctx.bezierCurveTo(
        720, 80 + i * 30,
        850, 330 + i * 26,
        1100, 180 + i * 35
      );

      ctx.strokeStyle = i % 3 === 0 ? "#e0bc87" : "#b78b60";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Winding road
    ctx.beginPath();
    ctx.moveTo(480, 900);
    ctx.bezierCurveTo(360, 710, 670, 600, 535, 450);
    ctx.bezierCurveTo(420, 320, 520, 210, 700, 100);

    ctx.lineWidth = 190;
    ctx.strokeStyle = "#171411";
    ctx.stroke();

    // Road edges
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#d7b681";
    ctx.stroke();

    // Broken center line
    ctx.setLineDash([24, 25]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f1d8a8";
    ctx.stroke();
    ctx.setLineDash([]);

    // Distant golden sun
    ctx.fillStyle = "#e2b975";
    ctx.beginPath();
    ctx.arc(760, 185, 37, 0, Math.PI * 2);
    ctx.fill();
  }

  if (motif === "mind") {
    // Interlocking celestial geometry
    ctx.lineWidth = 2;

    [100, 180, 260, 340].forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(
        550, 340, r, r * 0.92,
        i * 0.35, 0, Math.PI * 2
      );
      ctx.globalAlpha = 0.5 - i * 0.08;
      ctx.strokeStyle = gold;
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Flowing violet forms
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(-60, 400 + i * 48);

      ctx.bezierCurveTo(
        220, 150 + i * 25,
        310, 720 - i * 20,
        550, 420 + i * 34
      );

      ctx.bezierCurveTo(
        730, 200 + i * 25,
        850, 550 - i * 18,
        1080, 250 + i * 45
      );

      ctx.strokeStyle = i % 2 === 0 ? "#d6b9e9" : "#8f72ba";
      ctx.lineWidth = i % 2 === 0 ? 7 : 3;
      ctx.globalAlpha = 0.8 - i * 0.09;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Luminous central orb
    const orb = ctx.createRadialGradient(690, 290, 2, 690, 290, 70);
    orb.addColorStop(0, "#fff2d2");
    orb.addColorStop(0.3, "#e8c990");
    orb.addColorStop(1, "rgba(220,175,115,0)");

    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(690, 290, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f6dfb0";
    ctx.beginPath();
    ctx.arc(690, 290, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fine print-like border inside the artwork
  ctx.globalAlpha = 0.65;
  ctx.strokeStyle = "#d7b77e";
  ctx.lineWidth = 2;
  ctx.strokeRect(25, 25, w - 50, h - 50);
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return texture;
}

function Artwork({ title, color, position, rotation, motif, onSelect }) {
  const artworkGroup = useRef();
  const panelMaterial = useRef();

  const artworkTexture = useMemo(
    () => createArtworkTexture(motif),
    [motif]
  );
  const [hovered, setHovered] = useState(false);

  const { pointer, camera } = useThree();
  const hoverRef = useRef(false);

  useFrame(({ clock }) => {
    if (panelMaterial.current) {
      const pulse =
        0.075 +
        (Math.sin(clock.elapsedTime * 1.05 + position[0] * 0.3) + 1) * 0.025;

      panelMaterial.current.emissiveIntensity = hovered ? 0.24 : pulse;
    }

    const group = artworkGroup.current;
    if (!group) return;

    const corners = [
      [-1.49, 1.24, 0.2],
      [1.49, 1.24, 0.2],
      [-1.49, -1.24, 0.2],
      [1.49, -1.24, 0.2],
    ].map(([x, y, z]) => {
      const point = group.localToWorld(new THREE.Vector3(x, y, z));
      point.project(camera);
      return point;
    });

    const xs = corners.map((p) => p.x);
    const ys = corners.map((p) => p.y);

    const inside =
      pointer.x >= Math.min(...xs) &&
      pointer.x <= Math.max(...xs) &&
      pointer.y >= Math.min(...ys) &&
      pointer.y <= Math.max(...ys);

    if (inside !== hoverRef.current) {
      hoverRef.current = inside;
      setHovered(inside);
    }
  });

  function handleArtworkClick(event) {
    event.stopPropagation();
    const canvas = document.querySelector("canvas");
    const rect = canvas?.getBoundingClientRect();
    const group = artworkGroup.current;

    if (!rect || !group) {
      onSelect?.(title, { left: event.clientX, right: event.clientX, top: event.clientY, bottom: event.clientY });
      return;
    }

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
    <group ref={artworkGroup} position={position} rotation={rotation}>
      {/* Metallic frame */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[3.15, 2.65, 0.22]} />
        <meshStandardMaterial
          color="#a88a63"
          metalness={0.65}
          roughness={0.32}
        />
      </mesh>

      {/* Clickable artwork panel */}
      <mesh onClick={handleArtworkClick}>
        <planeGeometry args={[2.92, 2.42]} />
        <meshStandardMaterial
          ref={panelMaterial}
          map={artworkTexture}
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Invisible interaction surface covering the entire artwork */}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          handleArtworkClick(event);
        }}
      >
        <planeGeometry args={[3.15, 2.65]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
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
        intensity={hovered ? 17 : 10}
        distance={hovered ? 6 : 4.5}
        color={hovered ? "#f6d6a5" : "#d9b783"}
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
        <boxGeometry args={[barThickness, height + barThickness, barThickness]} />
        {material}
      </mesh>
      <mesh position={[width / 2, 0, 0]} castShadow>
        <boxGeometry args={[barThickness, height + barThickness, barThickness]} />
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
            roughness={0.32}
            metalness={0.65}
            flatShading={true}
          />
        </mesh>

        <group ref={innerCoreRef} position={[0, -0.22, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color="#e2bf63"
              roughness={0.28}
              metalness={0.9}
              flatShading={true}
              emissive="#3d3000"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        <mesh position={[0.42, 0.35, -0.15]} rotation={[0.25, 0.45, 0.2]} castShadow>
          <boxGeometry args={[0.04, 1.7, 0.04]} />
          <meshStandardMaterial color="#e2bf63" roughness={0.32} metalness={0.85} />
        </mesh>
        <mesh position={[-0.38, -0.45, 0.18]} rotation={[-0.2, -0.4, -0.25]} castShadow>
          <boxGeometry args={[0.035, 1.3, 0.035]} />
          <meshStandardMaterial color="#d4af37" roughness={0.32} metalness={0.85} />
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
        <meshStandardMaterial color="#d4af37" roughness={0.38} metalness={0.8} />
      </mesh>

      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
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
    if (progress >= 1) {
      if (previousProgress.current < 1) {
        camera.position.copy(destination.current);
        camera.lookAt(0, 1.65, -7);
      }
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

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -8.15, 8.15);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -8.15, 8.15);
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
      
      <spotLight
        position={[0, 4.4, 0.2]}
        angle={0.3}
        penumbra={0.85}
        intensity={7}
        distance={7}
        color="#ffe0ad"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#292725" roughness={0.3} metalness={0.22} />
      </mesh>

      <ContactShadows
        position={[0, 0.02, -1.5]}
        opacity={0.25}
        scale={2.5}
        blur={3}
        far={3}
        resolution={512}
        color="#000000"
      />

      <mesh position={[0, 2.5, -9]}>
        <boxGeometry args={[18, 5, 0.3]} />
        <meshStandardMaterial color="#191817" />
      </mesh>

      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 2.5, 0]}>
          <boxGeometry args={[0.3, 5, 18]} />
          <meshStandardMaterial color="#141312" />
        </mesh>
      ))}

      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[18, 0.3, 18]} />
        <meshStandardMaterial color="#0c0c0c" />
      </mesh>

      {[-6, -2, 2, 6].map((x) => (
        <pointLight
          key={x}
          position={[x, 3.8, -5]}
          intensity={5}
          distance={9}
          color="#e8bd86"
        />
      ))}

      {exhibits.map((item) => (
        <Artwork key={item.title} {...item} onSelect={onSelect} />
      ))}

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
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
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