import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

// ─── Types ────────────────────────────────────────────────────────
type GLTFResult = {
  nodes: {
    Cube014_black002_0: THREE.Mesh;
    Cube014_basecolor001_0: THREE.Mesh;
    Cube014_metalframe002_0: THREE.Mesh;
    Cube014_metaL001_0: THREE.Mesh;
    Cube014_glass002_0: THREE.Mesh;
    Cube014_apple_logo001_0: THREE.Mesh;
    Cube014_screen001_0: THREE.Mesh;
    Cube015_Material001_0: THREE.Mesh;
    Cube016_black002_0: THREE.Mesh;
    Cube016_glass002_0: THREE.Mesh;
    Cube017_metalframe002_0: THREE.Mesh;
    Cube017_black002_0: THREE.Mesh;
    Circle010_black002_0: THREE.Mesh;
    Circle011_black002_0: THREE.Mesh;
    Circle012_black002_0: THREE.Mesh;
    Circle013_black002_0: THREE.Mesh;
    Cylinder018_metalframe002_0: THREE.Mesh;
    Cylinder018_black002_0: THREE.Mesh;
    Cylinder019_metalframe002_0: THREE.Mesh;
    Cylinder019_black002_0: THREE.Mesh;
    Cylinder020_metalframe002_0: THREE.Mesh;
    Cylinder020_black002_0: THREE.Mesh;
    Cylinder021_metalframe002_0: THREE.Mesh;
    Cylinder021_Material_0: THREE.Mesh;
    Cylinder022_black002_0: THREE.Mesh;
    len11001_glass002_0: THREE.Mesh;
    len22001_glass002_0: THREE.Mesh;
    len33001_glass002_0: THREE.Mesh;
    Object003_gray001_0: THREE.Mesh;
    Plane011_glass002_0: THREE.Mesh;
    Plane011_basecolor001_0: THREE.Mesh;
    Plane012_metalframe002_0: THREE.Mesh;
    Plane013_metaL001_0: THREE.Mesh;
    Plane014_metaL001_0: THREE.Mesh;
    Sphere010_lensinglass_0: THREE.Mesh;
    Sphere011_lensinglass_0: THREE.Mesh;
    Sphere012_lensinglass_0: THREE.Mesh;
    Sphere013_lensinglass_0: THREE.Mesh;
  };
  materials: {
    "black.002": THREE.MeshStandardMaterial;
    "basecolor.001": THREE.MeshStandardMaterial;
    "metalframe.002": THREE.MeshStandardMaterial;
    "metaL.001": THREE.MeshStandardMaterial;
    "glass.002": THREE.MeshPhysicalMaterial;
    "apple_logo.001": THREE.MeshStandardMaterial;
    "screen.001": THREE.MeshStandardMaterial;
    "Material.001": THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
    "gray.001": THREE.MeshStandardMaterial;
    lensinglass: THREE.MeshStandardMaterial;
  };
};

export type Phone3DModelProps = {
  screenshotUrl: string | null;
  tilt: number;
  scale: number;
};

// ─── Screen mesh — loaded via useTexture so React state drives re-render ──
function ScreenWithTexture({ geometry, url }: { geometry: THREE.BufferGeometry; url: string }) {
  const texture = useTexture(url);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={texture} roughness={0.15} metalness={0.05} />
    </mesh>
  );
}

function ScreenEmpty({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#080a0f" roughness={0.2} metalness={0.1} />
    </mesh>
  );
}

// ─── Full model ───────────────────────────────────────────────────
function IPhoneModel({ screenshotUrl }: { screenshotUrl: string | null }) {
  const { nodes, materials } = useGLTF("/models/iphone_16_pro_max.glb") as unknown as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} scale={1.2} dispose={null}>
      <group scale={0.01}>
        {/* Main phone body */}
        <group position={[-0.328, 2.26, 0.199]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Cube014_black002_0.geometry} material={materials["black.002"]} />
          <mesh geometry={nodes.Cube014_basecolor001_0.geometry} material={materials["basecolor.001"]} />
          <mesh geometry={nodes.Cube014_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cube014_metaL001_0.geometry} material={materials["metaL.001"]} />
          <mesh geometry={nodes.Cube014_glass002_0.geometry} material={materials["glass.002"]} />
          <mesh geometry={nodes.Cube014_apple_logo001_0.geometry} material={materials["apple_logo.001"]} />
          {/* Screen — driven by React state via useTexture */}
          {screenshotUrl ? (
            <Suspense fallback={<ScreenEmpty geometry={nodes.Cube014_screen001_0.geometry} />}>
              <ScreenWithTexture geometry={nodes.Cube014_screen001_0.geometry} url={screenshotUrl} />
            </Suspense>
          ) : (
            <ScreenEmpty geometry={nodes.Cube014_screen001_0.geometry} />
          )}
        </group>

        {/* Top glass */}
        <group position={[-1.412, 78.525, -2.209]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Cube016_black002_0.geometry} material={materials["black.002"]} />
          <mesh geometry={nodes.Cube016_glass002_0.geometry} material={materials["glass.002"]} />
        </group>

        {/* Side buttons */}
        <group position={[-0.395, -6.001, -38.303]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.482}>
          <mesh geometry={nodes.Cube017_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cube017_black002_0.geometry} material={materials["black.002"]} />
        </group>

        {/* Camera lenses */}
        <group position={[5.382, 71.83, 25.412]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]}>
          <mesh geometry={nodes.Cylinder018_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cylinder018_black002_0.geometry} material={materials["black.002"]} />
        </group>
        <group position={[5.382, 51.985, 25.276]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]}>
          <mesh geometry={nodes.Cylinder019_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cylinder019_black002_0.geometry} material={materials["black.002"]} />
        </group>
        <group position={[5.382, 61.853, 6.769]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]}>
          <mesh geometry={nodes.Cylinder020_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cylinder020_black002_0.geometry} material={materials["black.002"]} />
        </group>
        <group position={[2.335, 75.921, 6.84]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Cylinder021_metalframe002_0.geometry} material={materials["metalframe.002"]} />
          <mesh geometry={nodes.Cylinder021_Material_0.geometry} material={materials.Material} />
        </group>

        {/* Camera housing glass */}
        <group position={[5.841, 63.502, 15.678]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={19.937}>
          <mesh geometry={nodes.Plane011_glass002_0.geometry} material={materials["glass.002"]} />
          <mesh geometry={nodes.Plane011_basecolor001_0.geometry} material={materials["basecolor.001"]} />
        </group>

        {/* Small details */}
        <mesh geometry={nodes.Circle010_black002_0.geometry} material={materials["black.002"]} position={[7.94, 61.852, 6.767]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={3.777} />
        <mesh geometry={nodes.Circle011_black002_0.geometry} material={materials["black.002"]} position={[7.825, 71.855, 25.405]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={1.701} />
        <mesh geometry={nodes.Circle012_black002_0.geometry} material={materials["black.002"]} position={[7.924, 51.987, 25.288]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={2.424} />
        <mesh geometry={nodes.Circle013_black002_0.geometry} material={materials["black.002"]} position={[-4.604, 78.558, 7.249]} rotation={[Math.PI / 2, -Math.PI / 2, 0]} scale={1.643} />
        <mesh geometry={nodes.Cube015_Material001_0.geometry} material={materials["Material.001"]} position={[0.034, -79.376, -0.696]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Cylinder022_black002_0.geometry} material={materials["black.002"]} position={[0.848, 47.824, 6.803]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={3.346} />
        <mesh geometry={nodes.len11001_glass002_0.geometry} material={materials["glass.002"]} position={[5.382, 71.83, 25.412]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]} />
        <mesh geometry={nodes.len22001_glass002_0.geometry} material={materials["glass.002"]} position={[5.382, 61.853, 6.769]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]} />
        <mesh geometry={nodes.len33001_glass002_0.geometry} material={materials["glass.002"]} position={[5.382, 51.985, 25.276]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[8.288, 8.288, 2.595]} />
        <mesh geometry={nodes.Object003_gray001_0.geometry} material={materials["gray.001"]} position={[-0.191, -80.599, -0.721]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plane012_metalframe002_0.geometry} material={materials["metalframe.002"]} position={[5.367, 51.214, 0.79]} rotation={[-Math.PI / 4, Math.PI / 2, 0]} scale={0.394} />
        <mesh geometry={nodes.Plane013_metaL001_0.geometry} material={materials["metaL.001"]} position={[-0.219, -81.443, 11.407]} rotation={[Math.PI / 2, 0, -2.356]} scale={1.058} />
        <mesh geometry={nodes.Plane014_metaL001_0.geometry} material={materials["metaL.001"]} position={[-0.219, -81.443, -20.018]} rotation={[Math.PI / 2, 0, -2.356]} scale={1.058} />
        <mesh geometry={nodes.Sphere010_lensinglass_0.geometry} material={materials.lensinglass} position={[7.297, 71.865, 25.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.557, 1.255, 1.255]} />
        <mesh geometry={nodes.Sphere011_lensinglass_0.geometry} material={materials.lensinglass} position={[7.337, 51.995, 25.291]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.952, 2.145, 2.145]} />
        <mesh geometry={nodes.Sphere012_lensinglass_0.geometry} material={materials.lensinglass} position={[7.375, 61.87, 6.748]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.641, 2.918, 2.918]} />
        <mesh geometry={nodes.Sphere013_lensinglass_0.geometry} material={materials.lensinglass} position={[-4.094, 78.567, 7.254]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={[0.538, 1.212, 1.212]} />
      </group>
    </group>
  );
}

// ─── Exported wrapper ─────────────────────────────────────────────
export function Phone3DModel({ screenshotUrl, tilt, scale }: Phone3DModelProps) {
  const radTilt = (tilt * Math.PI) / 180;
  const zoomScale = scale / 100;

  return (
    <div
      style={{ width: "100%", height: "100%", minHeight: "400px" }}
      // NOTE: pointer-events on this div are intentionally left default so
      // the CanvasEditor drag wrapper above can attach its handlers here.
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 42 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        // FIX 1: pass pointer events through the WebGL canvas to the parent div
        // so drag-to-position handlers on the slide card still work
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 8, 6]} intensity={2.5} castShadow />
        <directionalLight position={[-4, 4, -4]} intensity={1.0} />
        <pointLight position={[0, 2, 2]} intensity={1.5} />

        {/* FIX 2: rotate model so screen faces forward (Y + π/2) */}
        <group rotation={[0.05, radTilt + Math.PI / 2, 0]} scale={zoomScale}>
          <Suspense fallback={null}>
            <IPhoneModel screenshotUrl={screenshotUrl} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/iphone_16_pro_max.glb");
