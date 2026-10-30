import { Suspense, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Card3D from './Card3D'
import Sparkle from './Sparkle'

type CardModule = string | { src: string }

const cardModules = import.meta.glob('../../assets/cards/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, CardModule>

const resolveUrl = (value: CardModule | undefined): string =>
  typeof value === 'string' ? value : (value?.src ?? '')

const BACK_PATH = '../../assets/cards/back_card.webp'
const backUrl = resolveUrl(cardModules[BACK_PATH])
const frontUrls = Object.entries(cardModules)
  .filter(([path]) => path !== BACK_PATH)
  .map(([, value]) => resolveUrl(value))
  .filter(Boolean)

const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 640px)').matches

const CARD_COUNT = isMobile ? 15 : 30

const textureUrls = [...frontUrls, backUrl]

const cards = Array.from({ length: CARD_COUNT }, (_, index) => index)

const SPARKLE_COUNT = 3

function CardField() {
  const textures = useTexture(textureUrls) as THREE.Texture[]

  useLayoutEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
    })
  }, [textures])

  const backTexture = textures[textures.length - 1]
  const fronts = textures.slice(0, -1)

  return (
    <group>
      {cards.map((index) => (
        <Card3D key={index} fronts={fronts} back={backTexture} />
      ))}
    </group>
  )
}

export default function BackgroundScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 75, near: 0.002, far: 200 }}
        style={{ background: 'transparent' }}
      >
        {/*{Array.from({ length: SPARKLE_COUNT }, (_, index) => (
          <Sparkle key={index} />
        ))}*/}
        <Suspense fallback={null}>
          <CardField />
        </Suspense>
      </Canvas>
    </div>
  )
}
