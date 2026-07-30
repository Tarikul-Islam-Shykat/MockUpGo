/** Three quarter — dramatic perspective view showing a strong left-side depth */
export const poseThreeQuarter = {
  id: "three-quarter" as const,
  label: "Three quarter",
  /** CSS transform used for the flat SVG fallback (not used when GLB renders) */
  transform: "rotateY(-36deg) rotateZ(-5deg)",
  edgeDepth: 18,
  /**
   * Three.js group rotation [x, y, z] in radians for the iPhone 16 Pro Max GLB.
   * Stronger Y offset than lean-left to show a wider left-side perspective.
   */
  modelRotation: [0.05, -Math.PI / 2 + 0.63, 0.09] as [number, number, number],
};
