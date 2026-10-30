import { Vector3 } from 'three'

const RADIUS = 4
const X = 0.2
const Y = 0.4

export const circleRandomPosition = (zBounds: number) => {
  const angle = Math.random() * Math.PI * 2
  const x = RADIUS * Math.cos(angle)
  const y = RADIUS * Math.sin(angle)
  return new Vector3(x, y, -zBounds / 2)
}

export const squareRandomPosition = (zBounds: number) => {
  const side = Math.random() < 0.5 ? -X : X
  const offset = Math.random() * 2
  return new Vector3(
    side * offset,
    (Math.random() - 0.5) * Y,
    -zBounds * 2,
  )
}

export const randomVelocity = () => 0.5 + Math.random() * 0.8
