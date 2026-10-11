
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Sculpture3D({
  className = "w-full h-[600px]",
  autoRotateSpeed = 0.0035,
  showPedestal = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0c");
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;

    container.replaceChildren(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x232228, 1.2));

    const keySpot = new THREE.SpotLight(
      0xf5eedc,
      4.5,
      20,
      Math.PI / 4,
      0.45,
      1.2
    );
    keySpot.position.set(2.8, 5.5, 3.2);
    keySpot.castShadow = true;
    scene.add(keySpot);

    const rim = new THREE.DirectionalLight(0x768294, 1.6);
    rim.position.set(-3.5, 3, -2.5);
    scene.add(rim);

    const obsidianMat = new THREE.MeshPhongMaterial({
      color: 0x141416,
      specular: 0x6e6e78,
      shininess: 90,
      flatShading: true,
    });

    const bronzeMat = new THREE.MeshPhongMaterial({
      color: 0xc5a059,
      specular: 0xffeebb,
      shininess: 120,
    });

    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xd4af37,
      specular: 0xffffff,
      shininess: 140,
    });

    const group = new THREE.Group();
    scene.add(group);

    if (showPedestal) {
      const pedestal = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.4, 1.2),
        new THREE.MeshLambertMaterial({ color: 0x0c0c0e })
      );
      pedestal.position.set(0, -1.3, 0);
      group.add(pedestal);

      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(1.24, 0.03, 1.24),
        bronzeMat
      );
      trim.position.set(0, -0.585, 0);
      group.add(trim);
    }

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78, 0),
      obsidianMat
    );
    core.position.set(0, 0.45, 0);
    group.add(core);

    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 0),
      goldMat
    );
    inner.position.set(0, 0.45, 0);
    group.add(inner);

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;
    let rotX = 0.05;
    let rotY = 0.4;
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    const getPoint = (event) => {
      const point =
        event.touches?.[0] ??
        event.changedTouches?.[0] ??
        event;

      return { x: point.clientX, y: point.clientY };
    };

    const onDown = (event) => {
      isDragging = true;
      const point = getPoint(event);
      prevX = point.x;
      prevY = point.y;
      velX = 0;
      velY = 0;
    };

    const onMove = (event) => {
      const point = getPoint(event);
      const rect = container.getBoundingClientRect();

      mouseX = ((point.x - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((point.y - rect.top) / rect.height - 0.5) * 2;

      if (!isDragging) return;

      velX = (point.x - prevX) * 0.006;
      velY = (point.y - prevY) * 0.006;

      rotY += velX;
      rotX += velY;

      prevX = point.x;
      prevY = point.y;
    };

    const onUp = () => {
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        rotY += velX + autoRotateSpeed;
        rotX += velY;
        velX *= 0.94;
        velY *= 0.94;
      }

      rotX = THREE.MathUtils.clamp(rotX, -0.6, 0.8);

      core.rotation.y = rotY * 1.1;
      core.rotation.x = rotX;
      inner.rotation.y = -rotY * 0.9;

      camera.position.x +=
        (mouseX * 0.3 - camera.position.x) * 0.04;
      camera.position.y +=
        (1.2 - mouseY * 0.2 - camera.position.y) * 0.04;

      camera.lookAt(0, 0.4, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      group.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      canvas.remove();
    };
  }, [autoRotateSpeed, showPedestal]);

  return <div ref={containerRef} className={className} />;
}
