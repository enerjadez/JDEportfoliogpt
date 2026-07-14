import {
  AmbientLight,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

export type MountedHeroScene = {
  dispose: () => void;
  setReleased: (released: boolean) => void;
};

type RibbonConfig = {
  color: number;
  emissive: number;
  points: Array<[number, number, number]>;
  startPosition: [number, number, number];
  releasedPosition: [number, number, number];
  startRotation: [number, number, number];
  releasedRotation: [number, number, number];
};

const ribbonConfigs: RibbonConfig[] = [
  {
    color: 0xdfff70,
    emissive: 0x3a4c12,
    points: [
      [-2.4, 0.2, 0.1],
      [-1.45, 1.25, 0.7],
      [-0.45, 0.72, -0.55],
      [0.35, -0.9, 0.62],
      [1.45, -0.55, -0.45],
      [2.35, 0.52, 0.08],
    ],
    startPosition: [0, 0.15, 0.15],
    releasedPosition: [0, 1.12, -0.2],
    startRotation: [0.08, -0.2, 0.2],
    releasedRotation: [0, 0.02, -0.06],
  },
  {
    color: 0xf1f0e9,
    emissive: 0x24241e,
    points: [
      [-2.3, -0.55, -0.2],
      [-1.5, 0.35, -0.85],
      [-0.3, 1.05, 0.5],
      [0.6, 0.2, -0.6],
      [1.3, -1.15, 0.58],
      [2.4, -0.15, 0.1],
    ],
    startPosition: [0, -0.05, -0.1],
    releasedPosition: [0, 0, 0.16],
    startRotation: [-0.12, 0.28, -0.12],
    releasedRotation: [0, -0.02, 0.02],
  },
  {
    color: 0x242820,
    emissive: 0x11130f,
    points: [
      [-2.35, 0.65, 0.15],
      [-1.35, -0.7, 0.72],
      [-0.3, -1.05, -0.48],
      [0.5, 0.72, 0.7],
      [1.4, 0.95, -0.62],
      [2.35, -0.45, 0.05],
    ],
    startPosition: [0.1, 0.08, 0],
    releasedPosition: [0, -1.12, -0.12],
    startRotation: [0.18, -0.32, -0.24],
    releasedRotation: [0, 0.03, 0.06],
  },
];

function makeRibbon(config: RibbonConfig) {
  const curve = new CatmullRomCurve3(
    config.points.map(([x, y, z]) => new Vector3(x, y, z)),
    false,
    "catmullrom",
    0.42,
  );
  const shape = new Shape();
  shape.moveTo(-0.22, -0.075);
  shape.lineTo(0.22, -0.075);
  shape.lineTo(0.22, 0.075);
  shape.lineTo(-0.22, 0.075);
  shape.closePath();

  const geometry = new ExtrudeGeometry(shape, {
    steps: 88,
    bevelEnabled: false,
    extrudePath: curve,
  });
  geometry.center();

  const material = new MeshPhysicalMaterial({
    color: config.color,
    emissive: config.emissive,
    emissiveIntensity: config.color === 0xdfff70 ? 0.5 : 0.14,
    roughness: config.color === 0x242820 ? 0.42 : 0.28,
    metalness: config.color === 0x242820 ? 0.3 : 0.08,
    clearcoat: 0.42,
    clearcoatRoughness: 0.38,
  });
  const mesh = new Mesh(geometry, material);

  const edgeGeometry = new EdgesGeometry(geometry, 32);
  const edgeMaterial = new LineBasicMaterial({
    color: config.color === 0x242820 ? 0x8c9875 : 0xffffff,
    transparent: true,
    opacity: config.color === 0x242820 ? 0.26 : 0.18,
  });
  const edges = new LineSegments(edgeGeometry, edgeMaterial);

  const group = new Group();
  group.add(mesh, edges);
  group.position.set(...config.startPosition);
  group.rotation.set(...config.startRotation);
  return group;
}

export function mountHeroScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  onFirstFrame: () => void,
): MountedHeroScene {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !coarsePointer,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(0x080908), 0);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.6),
  );

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.1, 9.2);

  const engine = new Group();
  engine.rotation.set(-0.08, -0.12, 0.04);
  scene.add(engine);

  const ribbons = ribbonConfigs.map((config) => {
    const ribbon = makeRibbon(config);
    engine.add(ribbon);
    return ribbon;
  });

  const coreGeometry = new IcosahedronGeometry(0.48, 2);
  const coreMaterial = new MeshStandardMaterial({
    color: 0x0c0e0b,
    emissive: 0xdfff70,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    metalness: 0.52,
    wireframe: true,
  });
  const core = new Mesh(coreGeometry, coreMaterial);
  engine.add(core);

  const ringMaterial = new MeshStandardMaterial({
    color: 0xdfff70,
    emissive: 0x26330d,
    emissiveIntensity: 0.38,
    roughness: 0.32,
    metalness: 0.2,
  });
  const ringOne = new Mesh(new TorusGeometry(2.55, 0.018, 8, 96), ringMaterial);
  ringOne.rotation.set(1.15, 0.18, 0.32);
  const ringTwo = new Mesh(
    new TorusGeometry(3.05, 0.012, 8, 96),
    ringMaterial.clone(),
  );
  ringTwo.rotation.set(0.42, 1.08, -0.22);
  engine.add(ringOne, ringTwo);

  const postGeometry = new BoxGeometry(0.055, 0.055, 0.34);
  const postMaterial = new MeshStandardMaterial({
    color: 0xf1f0e9,
    emissive: 0x1d1f18,
    emissiveIntensity: 0.2,
    roughness: 0.35,
  });
  const posts = new InstancedMesh(postGeometry, postMaterial, 18);
  const dummy = new Object3D();
  const matrix = new Matrix4();
  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    const radius = index % 2 === 0 ? 3.25 : 2.82;
    dummy.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.66,
      Math.sin(angle * 2) * 0.52,
    );
    dummy.rotation.set(angle * 0.15, angle, angle * 0.4);
    dummy.scale.setScalar(index % 5 === 0 ? 1.65 : 1);
    dummy.updateMatrix();
    matrix.copy(dummy.matrix);
    posts.setMatrixAt(index, matrix);
  }
  posts.instanceMatrix.needsUpdate = true;
  engine.add(posts);

  scene.add(new AmbientLight(0xf1f0e9, 1.8));
  const keyLight = new DirectionalLight(0xf1f0e9, 4.4);
  keyLight.position.set(-4, 5, 6);
  scene.add(keyLight);
  const signalLight = new PointLight(0xdfff70, 18, 12, 2);
  signalLight.position.set(3.2, -1.4, 3.8);
  scene.add(signalLight);

  const pointer = { x: 0, y: 0 };
  let releaseTarget = 0;
  let releaseValue = 0;
  let scrollRelease = 0;
  let visible = true;
  let disposed = false;
  let firstFrame = true;
  let frameId = 0;
  let previousTime = 0;

  const updatePointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const resetPointer = () => {
    pointer.x = 0;
    pointer.y = 0;
  };

  const updateScroll = () => {
    const rect = host.getBoundingClientRect();
    const progress = MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
    scrollRelease = progress * 0.72;
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const renderFrame = (time: number) => {
    frameId = 0;
    if (disposed || !visible || document.hidden) return;
    const minimumFrameGap = coarsePointer ? 30 : 15;
    if (time - previousTime < minimumFrameGap) {
      frameId = requestAnimationFrame(renderFrame);
      return;
    }
    const delta = Math.min((time - previousTime) / 1000 || 0.016, 0.05);
    previousTime = time;

    const desiredRelease = Math.max(releaseTarget, scrollRelease);
    releaseValue = MathUtils.lerp(
      releaseValue,
      desiredRelease,
      1 - Math.exp(-delta * 4.8),
    );

    ribbons.forEach((ribbon, index) => {
      const config = ribbonConfigs[index];
      ribbon.position.x = MathUtils.lerp(
        config.startPosition[0],
        config.releasedPosition[0],
        releaseValue,
      );
      ribbon.position.y = MathUtils.lerp(
        config.startPosition[1],
        config.releasedPosition[1],
        releaseValue,
      );
      ribbon.position.z = MathUtils.lerp(
        config.startPosition[2],
        config.releasedPosition[2],
        releaseValue,
      );
      ribbon.rotation.x = MathUtils.lerp(
        config.startRotation[0],
        config.releasedRotation[0],
        releaseValue,
      );
      ribbon.rotation.y = MathUtils.lerp(
        config.startRotation[1],
        config.releasedRotation[1],
        releaseValue,
      );
      ribbon.rotation.z = MathUtils.lerp(
        config.startRotation[2],
        config.releasedRotation[2],
        releaseValue,
      );
    });

    engine.rotation.x = MathUtils.lerp(
      engine.rotation.x,
      -pointer.y * 0.075 - 0.05,
      0.06,
    );
    engine.rotation.y = MathUtils.lerp(
      engine.rotation.y,
      pointer.x * 0.095 - 0.08,
      0.06,
    );
    ringOne.rotation.z += delta * 0.055;
    ringTwo.rotation.z -= delta * 0.035;
    core.rotation.x += delta * 0.1;
    core.rotation.y -= delta * 0.12;

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onFirstFrame();
    }
    frameId = requestAnimationFrame(renderFrame);
  };

  const start = () => {
    if (!frameId && visible && !document.hidden && !disposed) {
      previousTime = 0;
      frameId = requestAnimationFrame(renderFrame);
    }
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    },
    { rootMargin: "120px" },
  );
  visibilityObserver.observe(host);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    host.classList.remove("is-webgl-ready");
  };

  host.addEventListener("pointermove", updatePointer, { passive: true });
  host.addEventListener("pointerleave", resetPointer, { passive: true });
  window.addEventListener("scroll", updateScroll, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  canvas.addEventListener("webglcontextlost", handleContextLost);
  resize();
  updateScroll();
  start();

  return {
    setReleased(released) {
      releaseTarget = released ? 1 : 0;
    },
    dispose() {
      disposed = true;
      stop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", updatePointer);
      host.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);

      const geometries = new Set<{ dispose: () => void }>();
      const materials = new Set<{ dispose: () => void }>();
      scene.traverse((object) => {
        if ("geometry" in object && object.geometry) {
          geometries.add(object.geometry as { dispose: () => void });
        }
        if ("material" in object && object.material) {
          const objectMaterial = object.material as
            | { dispose: () => void }
            | Array<{ dispose: () => void }>;
          if (Array.isArray(objectMaterial)) {
            objectMaterial.forEach((material) => materials.add(material));
          } else {
            materials.add(objectMaterial);
          }
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    },
  };
}
