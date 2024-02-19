import * as THREE from "three";
import { totalGroups } from "@/utils/consts";

export function calculateSection(
  groupOrigin: number,
  groupDestination: number,
): number {
  // Ensure the inputs are within the expected range
  if (
    groupOrigin < 0 ||
    groupOrigin >= totalGroups ||
    groupDestination < 0 ||
    groupDestination >= totalGroups
  ) {
    throw new Error(
      `groupOrigin and groupDestination must be between 0 and ${totalGroups}.`,
    );
  }
  // Calculate the section
  const section = groupOrigin * totalGroups + groupDestination;
  return section;
}
function getRandomAngleInSection(
  sectionIndex: number,
  totalSections: number,
): number {
  const degreesPerSection = 360 / totalSections;
  // Convert degrees to radians for mathematical functions
  const startAngle = degreesPerSection * (sectionIndex - 1) * (Math.PI / 180);
  const endAngle = degreesPerSection * sectionIndex * (Math.PI / 180);
  const randomAngle = Math.random() * (endAngle - startAngle) + startAngle;
  return randomAngle;
}

function convertPolarToCartesian(
  radius: number,
  angle: number,
  heightOffset: number,
): THREE.Vector3 {
  const x = radius * Math.cos(angle);
  const y = heightOffset;
  const z = radius * Math.sin(angle);
  return new THREE.Vector3(x, y, z);
}

export function calcCubePosition(
  groupOrigin: number,
  groupDestination: number,
  totalSections: number,
  circleRadius: number,
  heightOffset: number,
): THREE.Vector3 {
  const sectionIndex = calculateSection(groupOrigin, groupDestination);
  const angle = getRandomAngleInSection(sectionIndex, totalSections);
  // Random distance from center within the circle's radius
  // const distanceFromCenter = Math.random() * circleRadius;

  // Place on circle's radius
  const distanceFromCenter = circleRadius;

  const cubePosition = convertPolarToCartesian(
    distanceFromCenter,
    angle,
    heightOffset,
  );
  return cubePosition;
}
