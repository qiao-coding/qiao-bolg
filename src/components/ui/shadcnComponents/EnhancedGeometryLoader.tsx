'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Float, Sparkles, Lightformer } from '@react-three/drei'
import { motion } from 'framer-motion'

interface EnhancedGeometryLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  duration?: number
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  background?: 'dark' | 'gradient' | 'transparent'
  showControls?: boolean
}

// 几何体变形序列
const GEOMETRY_SEQUENCE = [
  { type: 'sphere', params: { radius: 1, widthSegments: 32, heightSegments: 32 } },
  { type: 'box', params: { width: 1.8, height: 1.8, depth: 1.8 } },
  { type: 'cone', params: { radius: 1, height: 2, radialSegments: 32 } },
  { type: 'torus', params: { radius: 1, tube: 0.4, radialSegments: 16, tubularSegments: 32 } },
  { type: 'octahedron', params: { radius: 1, detail: 2 } }
]

// 材质配置
const MATERIAL_CONFIG = {
  emissiveIntensity: 0.5,
  roughness: 0.1,
  metalness: 0.9,
  transparent: true,
  opacity: 0.95
}

// 几何体组件
function MorphingGeometry({ 
  currentShape, 
  morphProgress, 
  colors 
}: { 
  currentShape: number
  morphProgress: number
  colors: { primary: string; secondary: string; accent: string }
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [geometries, setGeometries] = useState<THREE.BufferGeometry[]>([])

  useEffect(() => {
    // 创建所有几何体
    const geoList = GEOMETRY_SEQUENCE.map((shape) => {
      switch (shape.type) {
        case 'sphere':
          return new THREE.SphereGeometry(
            shape.params.radius,
            shape.params.widthSegments,
            shape.params.heightSegments
          )
        case 'box':
          return new THREE.BoxGeometry(
            shape.params.width,
            shape.params.height,
            shape.params.depth
          )
        case 'cone':
          return new THREE.ConeGeometry(
            shape.params.radius,
            shape.params.height,
            shape.params.radialSegments
          )
        case 'torus':
          return new THREE.TorusGeometry(
            shape.params.radius,
            shape.params.tube,
            shape.params.radialSegments,
            shape.params.tubularSegments
          )
        case 'octahedron':
          return new THREE.OctahedronGeometry(shape.params.radius, shape.params.detail)
        default:
          return new THREE.SphereGeometry(1, 32, 32)
      }
    })

    setGeometries(geoList)
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current && geometries.length > 0) {
      // 旋转动画
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
      
      // 浮动动画
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2
    }
  })

  if (geometries.length === 0) return null

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometries[currentShape]}
      position={[0, 0, 0]}
    >
      <meshPhysicalMaterial
        {...MATERIAL_CONFIG}
        color={colors.primary}
        emissive={colors.secondary}
        emissiveIntensity={0.3 + Math.sin(Date.now() * 0.002) * 0.2}
      />
    </mesh>
  )
}

// 场景灯光组件
function SceneLights() {
  return (
    <>
      {/* 主光源 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#2A9DF4"
        castShadow
      />
      
      {/* 环境光 */}
      <ambientLight intensity={0.4} color="#FFFFFF" />
      
      {/* 点光源 */}
      <pointLight position={[-3, -3, -3]} intensity={0.8} color="#FF6B9D" />
      
      {/* 光效 - 简化版本避免加载问题 */}
      <Sparkles
        count={30}
        speed={0.1}
        opacity={0.4}
        color="#2A9DF4"
        size={1.5}
        scale={8}
      />
      
      {/* 光晕效果 */}
      <Lightformer
        form="ring"
        color="#2A9DF4"
        intensity={1.5}
        scale={3}
        position={[0, 0, 0]}
      />
    </>
  )
}

// 3D场景组件
function ThreeScene({ 
  currentShape, 
  morphProgress, 
  colors 
}: { 
  currentShape: number
  morphProgress: number
  colors: { primary: string; secondary: string; accent: string }
}) {
  const { scene, camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
    // 设置简单的背景色替代HDR环境贴图
    scene.background = new THREE.Color('#0a1929')
  }, [camera, scene])

  return (
    <>
      <SceneLights />
      
      {/* 几何体 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <MorphingGeometry 
          currentShape={currentShape} 
          morphProgress={morphProgress} 
          colors={colors}
        />
      </Float>
      
      {/* 文字 */}
      <Text
        position={[0, -2.5, 0]}
        color="white"
        fontSize={0.3}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Loading...
      </Text>
      
      {/* 控制器 */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

// 主加载器组件
export function EnhancedGeometryLoader({
  size = 'lg',
  text = '3D几何体加载中...',
  duration = 3000,
  colors = {
    primary: '#2A9DF4',
    secondary: '#00D4FF',
    accent: '#FF6B9D'
  },
  background = 'dark',
  showControls = false
}: EnhancedGeometryLoaderProps) {
  const [currentShape, setCurrentShape] = useState(0)
  const [morphProgress, setMorphProgress] = useState(0)

  useEffect(() => {
    // 几何体变形动画
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % GEOMETRY_SEQUENCE.length)
      setMorphProgress(0)
      
      // 变形过渡动画
      const startTime = Date.now()
      const animateMorph = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / 800, 1) // 800ms过渡
        setMorphProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateMorph)
        }
      }
      
      animateMorph()
    }, 1500) // 每个形态持续1.5秒

    return () => clearInterval(interval)
  }, [])

  const getSizeConfig = () => {
    switch (size) {
      case 'sm': return { width: 200, height: 200 }
      case 'md': return { width: 300, height: 300 }
      case 'lg': return { width: 400, height: 400 }
      default: return { width: 400, height: 400 }
    }
  }

  const getBackgroundStyle = () => {
    switch (background) {
      case 'dark':
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
      case 'gradient':
        return 'bg-gradient-to-br from-sky-900 via-blue-800 to-purple-900'
      case 'transparent':
        return 'bg-transparent'
      default:
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
    }
  }

  const sizeConfig = getSizeConfig()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-2xl overflow-hidden ${getBackgroundStyle()} backdrop-blur-sm border border-sky-500/20`}
      style={sizeConfig}
    >
      {/* 3D画布 */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ThreeScene 
          currentShape={currentShape} 
          morphProgress={morphProgress} 
          colors={colors}
        />
      </Canvas>
      
      {/* 文字叠加 */}
      <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          {text}
        </motion.div>
      </div>
      
      {/* 进度指示器 */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
      
      {/* 控制面板 */}
      {showControls && (
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
          <div>Shape: {GEOMETRY_SEQUENCE[currentShape].type}</div>
          <div>Progress: {Math.round(morphProgress * 100)}%</div>
        </div>
      )}
    </motion.div>
  )
}

// 全屏加载器变体
export function FullPageEnhancedLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      <EnhancedGeometryLoader 
        size="lg" 
        text="系统初始化中..."
        background="transparent"
      />
    </div>
  )
}

// 交互式加载器变体
export function InteractiveEnhancedLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-50"
    >
      <EnhancedGeometryLoader 
        size="md" 
        text="交互式3D加载体验"
        showControls={true}
      />
      
      <motion.div
        className="mt-8 text-center text-white/80"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg font-light mb-2">探索3D几何体变形</p>
        <p className="text-sm">球体 → 立方体 → 圆锥体 → 圆环 → 八面体</p>
      </motion.div>
    </motion.div>
  )
}