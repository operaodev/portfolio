import { useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Texture } from 'three'
import { randomVelocity, squareRandomPosition } from './move'

export type Card3DProps = {
  fronts: Texture[]
  back: Texture
}

const SCALE = 0.4
const CARD_WIDTH = 0.295 * SCALE
const CARD_HEIGHT = 0.43 * SCALE
const CARD_DEPTH = 0.005 * SCALE

const MAX_SPEED = 0.12
const ROTATION_SPEED = 2
const Z_BOUNDS = 5

const randomTexture = (textures: Texture[]) =>
  textures[Math.floor(Math.random() * textures.length)]

export default function Card3D({ fronts, back }: Card3DProps) {
  const [front, setFront] = useState<Texture>(() => randomTexture(fronts))
  const meshRef = useRef<Mesh>(null)
  const baseRotaRef = useRef(0)
  const baseVeloRef = useRef(0)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    baseRotaRef.current = Math.random() * Math.PI * 2
    baseVeloRef.current = randomVelocity()

    mesh.position.copy(squareRandomPosition(Z_BOUNDS))
    mesh.rotation.set(Math.random() * Math.PI * 5, baseRotaRef.current, 0)
  }, [front])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const velocity =
      baseVeloRef.current *
      (0.7 + 0.3 * Math.cos(state.clock.elapsedTime * 0.3))
    mesh.position.z += Math.max(delta, velocity * MAX_SPEED)

    if (mesh.position.z > Z_BOUNDS) {
      setFront((current) => {
        let next = randomTexture(fronts)
        while (next === current && fronts.length > 1) {
          next = randomTexture(fronts)
        }
        return next
      })
    }

    mesh.rotation.y =
      baseRotaRef.current + state.clock.elapsedTime * ROTATION_SPEED
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
      <meshBasicMaterial attach="material-0" color="gray" />
      <meshBasicMaterial attach="material-1" color="gray" />
      <meshBasicMaterial attach="material-2" color="gray" />
      <meshBasicMaterial attach="material-3" color="gray" />
      <meshBasicMaterial attach="material-4" map={back} />
      <meshBasicMaterial attach="material-5" map={front} />
    </mesh>
  )
}
