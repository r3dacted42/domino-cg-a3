import * as THREE from 'three';

export function applyCylindricalUV(geo) {
  if (!geo || !geo.attributes || !geo.attributes.position) return;

  geo.computeBoundingBox();
  const bbox = geo.boundingBox;
  const pos = geo.attributes.position;
  const uvs = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const theta = Math.atan2(z, x);               // angle around Y axis
    const u = (theta + Math.PI) / (2 * Math.PI);  // 0 → 1
    const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y);

    uvs.push(u, v);
  }

  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.attributes.uv.needsUpdate = true;
}

export function applySphericalUV(geo) {
  if (!geo || !geo.attributes || !geo.attributes.position) return;

  const pos = geo.attributes.position;
  const uvs = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.atan2(z, x);
    const phi = Math.acos(y / r);

    const u = (theta + Math.PI) / (2 * Math.PI);  // longitude
    const v = phi / Math.PI;                      // latitude

    uvs.push(u, v);
  }

  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.attributes.uv.needsUpdate = true;
}
