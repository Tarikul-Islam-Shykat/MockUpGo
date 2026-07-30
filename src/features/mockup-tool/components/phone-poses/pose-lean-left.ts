/** Lean left — subtle 3/4 tilt showing the left edge of the iPhone */
export const poseLeanLeft = {
  id: "lean-left" as const,
  label: "Lean left",
  /** CSS transform used for the flat SVG fallback (not used when GLB renders) */
  transform: "rotateY(-22deg) rotateZ(-3deg)",
  edgeDepth: 12,
  /**
   * Three.js group rotation [x, y, z] in radians for the iPhone 16 Pro Max GLB.
   * Y = π/2 is screen-facing; increasing Y tilts the left edge toward camera.
   */
  modelRotation: [0.05, -Math.PI / 2 + 0.38, 0.05] as [number, number, number],
};
