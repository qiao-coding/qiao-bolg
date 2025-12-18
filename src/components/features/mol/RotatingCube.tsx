'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useTheme } from 'next-themes'

interface RotatingCubeProps {
  size?: number
  color?: string
  rotationSpeed?: number
  className?: string
}

function Cube({ 
  size = 1, 
  color = '#9fcfefff',
  rotationSpeed = 0.01 
}: { 
  size: number
  color: string
  rotationSpeed: number
}) {
  const meshRef = useRef<Mesh>(null)

  // 沿着X轴旋转
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function RotatingCube({
  size = 1,
  rotationSpeed = 0.01,
  className = ''
}: RotatingCubeProps) {

  const {theme} = useTheme()
  return (
    <div className={`w-full h-[60vh]  ${className}`}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <Cube 
          size={size}
          color={theme === 'dark' ? 'rgba(107, 134, 150, 1)' : 'rgb(122, 194, 242)'}
          rotationSpeed={rotationSpeed}
        />
      </Canvas>
    </div>
  )
}