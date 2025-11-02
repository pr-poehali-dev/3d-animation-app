import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, TransformControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { SceneObject, TransformMode } from '@/pages/Index';

interface SceneObjectComponentProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  transformMode: TransformMode;
  onTransform: (updates: Partial<SceneObject>) => void;
}

const SceneObjectComponent = ({ object, isSelected, onSelect, transformMode, onTransform }: SceneObjectComponentProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale]);

  useEffect(() => {
    if (transformRef.current && isSelected) {
      const controls = transformRef.current;
      
      const handleChange = () => {
        if (meshRef.current) {
          onTransform({
            position: [
              meshRef.current.position.x,
              meshRef.current.position.y,
              meshRef.current.position.z,
            ],
            rotation: [
              meshRef.current.rotation.x,
              meshRef.current.rotation.y,
              meshRef.current.rotation.z,
            ],
            scale: [
              meshRef.current.scale.x,
              meshRef.current.scale.y,
              meshRef.current.scale.z,
            ],
          });
        }
      };

      controls.addEventListener('change', handleChange);
      return () => controls.removeEventListener('change', handleChange);
    }
  }, [isSelected, onTransform]);

  const renderGeometry = () => {
    switch (object.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const renderModelWithBones = () => {
    if (object.type === 'robot') {
      return (
        <group ref={groupRef}>
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.4, 0.5, 0.3]} />
            <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.4]} />
            <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.35, 0.4, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.35, 0.4, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-0.15, -0.2, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, -0.2, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    } else if (object.type === 'character') {
      return (
        <group ref={groupRef}>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#FDBCB4" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
            <meshStandardMaterial color="#4A90E2" />
          </mesh>
          <mesh position={[-0.35, 0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
            <meshStandardMaterial color="#FDBCB4" />
          </mesh>
          <mesh position={[0.35, 0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
            <meshStandardMaterial color="#FDBCB4" />
          </mesh>
          <mesh position={[-0.12, -0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.7, 16]} />
            <meshStandardMaterial color="#2C5F2D" />
          </mesh>
          <mesh position={[0.12, -0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.7, 16]} />
            <meshStandardMaterial color="#2C5F2D" />
          </mesh>
        </group>
      );
    }
  };

  const renderEffect = () => {
    if (!object.isEffect) return null;

    if (object.type === 'fire') {
      return (
        <EffectFire />
      );
    } else if (object.type === 'explosion') {
      return (
        <EffectExplosion />
      );
    } else if (object.type === 'smoke') {
      return (
        <EffectSmoke />
      );
    }
  };

  if (object.isEffect) {
    return (
      <group
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {renderEffect()}
      </group>
    );
  }

  if (object.type === 'robot' || object.type === 'character') {
    return (
      <>
        <group
          ref={meshRef as any}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {renderModelWithBones()}
        </group>
        {isSelected && (
          <TransformControls
            ref={transformRef}
            object={meshRef.current!}
            mode={transformMode}
          />
        )}
      </>
    );
  }

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={object.color}
          metalness={0.3}
          roughness={0.4}
          emissive={isSelected ? '#8B5CF6' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      {isSelected && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current!}
          mode={transformMode}
        />
      )}
    </>
  );
};

const EffectFire = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 100;

  useFrame((state) => {
    if (particles.current) {
      const positions = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.random() * 0.02;
        
        if (positions[i3 + 1] > 2) {
          positions[i3] = (Math.random() - 0.5) * 0.5;
          positions[i3 + 1] = 0;
          positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 0.5;
    particlePositions[i * 3 + 1] = Math.random() * 2;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FF4500"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const EffectExplosion = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 150;

  useFrame(() => {
    if (particles.current) {
      particles.current.scale.multiplyScalar(1.05);
      particles.current.material.opacity *= 0.95;
    }
  });

  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = Math.random() * 0.5;
    
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#FFA500"
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const EffectSmoke = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 80;

  useFrame(() => {
    if (particles.current) {
      const positions = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.random() * 0.015;
        positions[i3] += (Math.random() - 0.5) * 0.02;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.02;
        
        if (positions[i3 + 1] > 3) {
          positions[i3] = (Math.random() - 0.5) * 0.3;
          positions[i3 + 1] = 0;
          positions[i3 + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
      
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 0.3;
    particlePositions[i * 3 + 1] = Math.random() * 3;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#888888"
        transparent
        opacity={0.4}
      />
    </points>
  );
};

interface ThreeSceneProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  transformMode: TransformMode;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
}

const ThreeScene = ({ objects, selectedObjectId, onSelectObject, transformMode, onUpdateObject }: ThreeSceneProps) => {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      shadows
    >
      <color attach="background" args={['#0f1419']} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4A90E2" />
      
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2a3442"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#0EA5E9"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
      
      {objects.map((obj) => (
        <SceneObjectComponent
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={() => onSelectObject(obj.id)}
          transformMode={transformMode}
          onTransform={(updates) => onUpdateObject(obj.id, updates)}
        />
      ))}

      <OrbitControls makeDefault />
      
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#E74C3C', '#2ECC71', '#3498DB']} labelColor="white" />
      </GizmoHelper>
    </Canvas>
  );
};

export default ThreeScene;
