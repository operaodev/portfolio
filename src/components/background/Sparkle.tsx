import { useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { circleRandomPosition, randomVelocity } from './move'

const SPARKLE_MAX_SCALE = 170
const SPARKLE_MAX_SPEED = 1.5
const SPARKLE_Z_BOUNDS = 20

const sparkleColors: [number, number, number][] = [
  [1.5, 2, 8],
  [10, 2, 8],
  [2, 8, 2],
  [8, 4, 1.5],
  [6, 1.5, 8],
  [1.5, 8, 7],
  [8, 8, 1.5],
  [8, 3, 3],
  [3, 6, 8],
  [5, 8, 4],
]

const randomSparkleColor = () => {
  const [red, green, blue] =
    sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
  const max = Math.max(red, green, blue)
  return new THREE.Color(red / max, green / max, blue / max)
}

const randomSparkleCount = () => Math.floor(Math.random() * 10) + 1

const tempMatrix = new THREE.Matrix4()
const tempColor = new THREE.Color(1, 1, 1)
const tempObject = new THREE.Object3D()
const tempPos = new THREE.Vector3()

function useSparkleMove() {
  const [countStarship, setCountStarship] = useState(randomSparkleCount)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const velocityRef = useRef(0)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    velocityRef.current = randomVelocity()
    tempObject.scale.set(1, 1, 1)

    for (let i = 0; i < countStarship; i++) {
      tempPos.copy(circleRandomPosition(SPARKLE_Z_BOUNDS))
      tempObject.position.copy(tempPos)
      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  }, [countStarship])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < countStarship; i++) {
      mesh.getMatrixAt(i, tempMatrix)

      const velocity =
        velocityRef.current *
        (0.7 + 0.3 * Math.cos(state.clock.elapsedTime * 0.3))

      tempObject.scale.set(1, 1, Math.max(1, velocity * SPARKLE_MAX_SCALE))

      tempPos.setFromMatrixPosition(tempMatrix)

      if (tempPos.z > SPARKLE_Z_BOUNDS / 4) {
        setCountStarship((current) => {
          let next = randomSparkleCount()
          while (next === current) next = randomSparkleCount()
          return next
        })
        return
      }

      tempPos.z += Math.max(delta, velocity * SPARKLE_MAX_SPEED)
      tempObject.position.copy(tempPos)

      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)
      mesh.setColorAt(i, tempColor)
    }

    mesh.instanceMatrix.needsUpdate = true

    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return { meshRef, countStarship }
}

export default function Sparkle() {
  const { meshRef, countStarship } = useSparkleMove()

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, countStarship]}>
      <capsuleGeometry args={[0.015, 0]} />
      <meshBasicMaterial color={randomSparkleColor()} toneMapped={false} />
    </instancedMesh>
  )
}
