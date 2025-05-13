import * as THREE from "three";

const shaderCommon = {
  uniforms: {
    diffuseColor: { value: null },
    roughness: { value: 0.5 },
    metalness: { value: 0.5 },
    ambientLightColor: { value: new THREE.Color(0x404040) },
    pointLights: {
      value: [
        {
          position: new THREE.Vector3(5, 10, 7),
          color: new THREE.Color(0xffffff),
          intensity: 0.8,
        },
        {
          position: new THREE.Vector3(-5, 8, -7),
          color: new THREE.Color(0xffa500),
          intensity: 0.6,
        },
        {
          position: new THREE.Vector3(7, 6, -4),
          color: new THREE.Color(0x0088ff),
          intensity: 0.4,
        }
      ],
    },
    numActiveLights: { value: 1 }, // Default to 1 active light
  },
};

const gouraudVertexShader = `
  varying vec3 vColor;
  uniform vec3 diffuseColor;
  uniform float roughness;
  uniform float metalness;

  struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
  };
  
  uniform PointLight pointLights[3];
  uniform vec3 ambientLightColor;
  uniform int numActiveLights;

  void main() {
    vec3 normal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    
    // Ambient component
    vec3 ambient = ambientLightColor * diffuseColor;
    
    vColor = ambient;
    
    // Loop through active lights
    for(int i = 0; i < 3; i++) {
      if (i >= numActiveLights) break;
      
      vec3 lightDirection = normalize(pointLights[i].position - worldPosition.xyz);
      
      // Diffuse component (Lambert)
      float diffuseFactor = max(dot(normal, lightDirection), 0.0);
      vec3 diffuse = pointLights[i].color * pointLights[i].intensity * diffuseFactor * diffuseColor;
      
      // Specular component (Blinn-Phong)
      vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
      vec3 halfwayDir = normalize(lightDirection + viewDirection);
      float specularFactor = pow(max(dot(normal, halfwayDir), 0.0), 32.0 + 64.0 * metalness);
      vec3 specular = pointLights[i].color * pointLights[i].intensity * specularFactor * metalness;
      
      vColor += diffuse + specular;
    }
    
    // Apply roughness (reduces overall brightness)
    vColor = mix(vColor, vColor * (1.0 - roughness * 0.5), roughness);
    vColor = clamp(vColor, 0.0, 1.0);
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const gouraudFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

const phongVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const phongFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform vec3 diffuseColor;
  uniform float roughness;
  uniform float metalness;
  
  struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
  };
  
  uniform PointLight pointLights[3];
  uniform vec3 ambientLightColor;
  uniform int numActiveLights;

  void main() {
    vec3 normal = normalize(vNormal);
    
    // Ambient component
    vec3 color = ambientLightColor * diffuseColor;
    
    // Loop through active lights
    for(int i = 0; i < 3; i++) {
      if (i >= numActiveLights) break;
      
      vec3 lightDirection = normalize(pointLights[i].position - vWorldPosition);
      
      // Diffuse component (Lambert)
      float diffuseFactor = max(dot(normal, lightDirection), 0.0);
      vec3 diffuse = pointLights[i].color * pointLights[i].intensity * diffuseFactor * diffuseColor;
      
      // Specular component (Blinn-Phong)
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      vec3 halfwayDir = normalize(lightDirection + viewDirection);
      float specularFactor = pow(max(dot(normal, halfwayDir), 0.0), 32.0 + 64.0 * metalness);
      vec3 specular = pointLights[i].color * pointLights[i].intensity * specularFactor * metalness;
      
      color += diffuse + specular;
    }
    
    // Apply roughness (reduces overall brightness)
    color = mix(color, color * (1.0 - roughness * 0.5), roughness);
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export class ShaderManager {
  constructor() {
    this.currentShading = "phong"; // Default to Phong shading
    this.materials = new Map();
    this.meshesToUpdate = [];
    this.floorMeshes = [];
    this.dominoMeshes = [];
    this.lights = [];
  }

  setLights(lights) {
    this.lights = lights;
  }

  createMaterial(color, roughness, metalness, shading = this.currentShading) {
    const materialKey = `${color}-${roughness}-${metalness}-${shading}`;

    if (!this.materials.has(materialKey)) {
      const uniforms = {
        ...shaderCommon.uniforms,
        diffuseColor: { value: new THREE.Color(color) },
        roughness: { value: roughness },
        metalness: { value: metalness },
      };

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader:
          shading === "gouraud" ? gouraudVertexShader : phongVertexShader,
        fragmentShader:
          shading === "gouraud" ? gouraudFragmentShader : phongFragmentShader,
      });

      this.materials.set(materialKey, material);
    }
    return this.materials.get(materialKey);
  }

  createFloorMaterial(color, roughness, metalness) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness,
    });
  }

  registerMesh(mesh, isFloor = false) {
    if (isFloor) {
      if (!this.floorMeshes.includes(mesh)) {
        this.floorMeshes.push(mesh);
      }
    } else {
      if (!this.dominoMeshes.includes(mesh)) {
        this.dominoMeshes.push(mesh);
      }
      if (!this.meshesToUpdate.includes(mesh)) {
        this.meshesToUpdate.push(mesh);
      }
    }
  }

  updateShading() {
    this.dominoMeshes.forEach((mesh) => {
      if (mesh.material) {
        const color = mesh.material.userData.baseColor || 0x808080;
        const roughness = mesh.material.userData.roughness || 0.5;
        const metalness = mesh.material.userData.metalness || 0.5;
        const newMaterial = this.createMaterial(color, roughness, metalness);

        newMaterial.userData.baseColor = color;
        newMaterial.userData.roughness = roughness;
        newMaterial.userData.metalness = metalness;

        mesh.material = newMaterial;
      }
    });
  }

  updateUniforms() {
    if (this.lights.length >= 4) { // Ambient + 3 directional lights
      this.materials.forEach((material) => {
        if (material.uniforms) {
          // Update ambient light
          if (material.uniforms.ambientLightColor && this.lights[0]) {
            material.uniforms.ambientLightColor.value.copy(this.lights[0].color);
          }
          
          // Update directional lights
          if (material.uniforms.pointLights) {
            // Primary light
            if (this.lights[1]) {
              material.uniforms.pointLights.value[0].position.copy(this.lights[1].position);
              material.uniforms.pointLights.value[0].color.copy(this.lights[1].color);
              material.uniforms.pointLights.value[0].intensity = this.lights[1].intensity;
            }
            
            // Secondary light
            if (this.lights[2]) {
              material.uniforms.pointLights.value[1].position.copy(this.lights[2].position);
              material.uniforms.pointLights.value[1].color.copy(this.lights[2].color);
              material.uniforms.pointLights.value[1].intensity = this.lights[2].visible ? this.lights[2].intensity : 0;
            }
            
            // Accent light
            if (this.lights[3]) {
              material.uniforms.pointLights.value[2].position.copy(this.lights[3].position);
              material.uniforms.pointLights.value[2].color.copy(this.lights[3].color);
              material.uniforms.pointLights.value[2].intensity = this.lights[3].visible ? this.lights[3].intensity : 0;
            }
            
            // Update number of active lights
            if (material.uniforms.numActiveLights) {
              // Count visible lights (excluding ambient)
              let activeLights = 0;
              for (let i = 1; i < this.lights.length; i++) {
                if (this.lights[i].visible) activeLights++;
              }
              material.uniforms.numActiveLights.value = activeLights;
            }
          }
        }
      });
    }
  }

  toggleShading() {
    this.currentShading =
      this.currentShading === "gouraud" ? "phong" : "gouraud";
    this.updateShading();
    return this.currentShading;
  }
}
