import * as THREE from "three";

class GeometryMorpher {
  constructor(geometry) {
    this.geometry = geometry;
    this.initialGeometry = new THREE.BufferGeometry().copy(this.geometry);

    // Precomputed bounding distance for normalization factor
    this.boundingBoxSize = new THREE.Vector3();
    this.initialGeometry.boundingBox.getSize(this.boundingBoxSize);

    this.boundingBoxCenter = new THREE.Vector3();
    this.initialGeometry.boundingBox.getCenter(this.boundingBoxCenter);

    console.log(this.boundingBoxSize);
    this.maxDistance = this.boundingBoxSize.x / 2;

    this.waveLength = 0.002; //파장
    this.waveAmplitude = 0.0015; //진폭
    this.waveSpeed = 5;
  }

  morph(clock) {
    const posAttribute = this.geometry.getAttribute("position");
    const initialPosAttribute = this.initialGeometry.getAttribute("position");
    const elapsedTime = clock.getElapsedTime();

    for (let index = 0; index < posAttribute.count; index++) {
      const xPos = posAttribute.getX(index);
      const zPos = posAttribute.getZ(index);

      const distanceFromCenter = Math.hypot(
        this.boundingBoxCenter.x - xPos,
        this.boundingBoxCenter.z - zPos
      );
      const factor = (this.maxDistance - distanceFromCenter) / this.maxDistance;

      const waveOffset =
        Math.sin(xPos * (1 / this.waveLength) + elapsedTime * this.waveSpeed) *
        this.waveAmplitude *
        factor;
      posAttribute.setY(index, initialPosAttribute.getY(index) + waveOffset);
    }

    this.geometry.computeVertexNormals();
    posAttribute.needsUpdate = true;
  }
}

export { GeometryMorpher };
