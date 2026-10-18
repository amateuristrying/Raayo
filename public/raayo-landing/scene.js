import * as THREE from 'three/webgpu'
import {
  Fn,
  If,
  color,
  instanceIndex,
  positionLocal,
  uniform,
  instancedArray,
  storage,
  struct,
  mix,
  smoothstep,
  vec3,
  vec4,
  float,
  uint,
  abs,
  pow,
  sign,
  normalWorld,
  mx_noise_float,
  atomicAdd,
  atomicStore,
} from 'three/tsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import GUI from 'lil-gui'
import Stats from 'stats-gl'
import { FixedTimestep } from './FixedTimestep.js'
import { colourWavesAt } from './ColourWaves.js'
import { BallPhysicsGPU } from './BallPhysicsGPU.js'
import { SphereGridAO } from './SphereGridAO.js'

// ─── Constants ──────────────────────────────────────────────────────────────

const SPHERE_COUNT = 4096 * 2 * 2 * 2 * 1.5
const SPHERE_RADIUS = 0.07
const SPHERE_DETAIL_NEAR = 8
const SPHERE_DETAIL_MIDDLE = 6
const SPHERE_DETAIL_FAR = 4
const BOUNDS = { x: 12, z: 12, y: 12 }

const params = {
  debug: false,
  gravity: -10,
  stiffness: 4000,
  damping: 10,
  friction: 0.4,
  restitution: 0.3,
  cohesion: 30,
  correctionStrength: 0.5,
  correctionDamping: 0.3,
  correctionPass: true,
  paused: false,
  visualLerp: 0.5,
  noiseAmplitude: 25,
  noiseFrequency: 0.4,
  noiseSpeed: 0.15,
  attractorHeight: 0.6,
  attractorRadius: 1.5,
  attractorStrength: 40,
  fov: 30,
  backgroundColor: '#0d0d15',
  ballColor: '#000',
  metalness: 0,
  materialType: 'standard',
  ambientType: 'discs',
  // environmentIntensity: 0.3,
  // lightIntensity: 0.7,

  // environmentIntensity: 0.4,
  // lightIntensity: 0,
  // roughness: 0.7,

  environmentIntensity: 0,
  lightIntensity: 0.7,
  roughness: 0.8,
  shadows: true,
  shadowType: 'vsm',
  shadowBias: -0.001,
  shadowNormalBias: 0.02,
  shadowMapSize: 1024,
  lightX: 5,
  lightY: 3,
  lightZ: -3,
  emissivePower: 4,
  emissiveEnabled: true,
  emissivePaused: false,
  emissiveColor1: '#1144ff',
  emissiveColor2: '#ffffff',
  emissiveIntensity: 2,
  emissiveAoIntensity: 0.4,
  emissiveAoRadius: 1.5,
  emissiveScale: 0.15,
  emissiveMin: -0.3,
  // emissiveMax: 0.1,
  emissiveMax: 0.9,
  bounce: true,
  bounceIntensity: 0.2,
  bounceScale: 0.26,
  bouncePower: 4,
  ao: true,
  aoIntensity: 0.5,
  aoRadius: 0.3,
  culling: true,
  lodDistanceNear: 4,
  lodDistanceFar: 8,
  colliderRadius: 1,
  colliderStrength: 200,
  colliderDistance: -4.5,
  colliderY: 0.33,
  pointLightIntensity: 0.6,
  pointLightColor: '#ffffff',
  pointLightRange: 0,
  pointLightDecay: 3.6,
  pointLightDistance: -3.28,
  pointLightY: 0.1,
  collider2Radius: 0.7,
  collider2Strength: 200,
  lightFadeIn: 0.3,
  lightFadeDelay: 1.2,
}

// ─── Scene setup ────────────────────────────────────────────────────────────

const renderer = new THREE.WebGPURenderer({ antialias: true })
renderer.toneMapping = THREE.AgXToneMapping
renderer.toneMappingExposure = 1.0
renderer.shadowMap.enabled = params.shadows
renderer.shadowMap.type = {
  basic: THREE.BasicShadowMap,
  pcf: THREE.PCFShadowMap,
  pcfSoft: THREE.PCFSoftShadowMap,
  vsm: THREE.VSMShadowMap,
}[params.shadowType]
const pixelRatio = window.devicePixelRatio
renderer.setPixelRatio(pixelRatio)
renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;z-index:0;'
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
await renderer.init()

const stats = new Stats({ trackGPU: true, trackCPT: true })
document.body.appendChild(stats.dom)
stats.init(renderer)

const scene = new THREE.Scene()
scene.background = new THREE.Color(params.backgroundColor)

const camera = new THREE.PerspectiveCamera(params.fov, window.innerWidth / window.innerHeight, 0.01, 100)
camera.position.set(-5.5, 2.2, 6.7)
window.camera = camera

const debugOverlay = document.createElement('div')
debugOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;display:none;'
document.body.appendChild(debugOverlay)

const controls = new OrbitControls(camera, debugOverlay)
controls.target.set(-0.92, 0.41, -0.09)
controls.enabled = false
controls.update()
window.controls = controls

// ─── Lights ─────────────────────────────────────────────────────────────────

const pmremGenerator = new THREE.PMREMGenerator(renderer)
const roomEnvTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture

// Custom soft disc environment — white emissive discs in the direction of the main light
const discEnvScene = new THREE.Scene()
discEnvScene.background = new THREE.Color('#111111')
const discMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' })
const discGeometry = new THREE.CircleGeometry(10, 16)
const mainDisc = new THREE.Mesh(discGeometry, discMaterial)
mainDisc.position.set(12, 15, 0).normalize().multiplyScalar(10)
mainDisc.lookAt(0, 0, 0)
discEnvScene.add(mainDisc)
const mainDiscDebug = mainDisc.clone()
mainDiscDebug.visible = params.debug
scene.add(mainDiscDebug)
const discEnvTexture = pmremGenerator.fromScene(discEnvScene).texture

const ambientLight = new THREE.AmbientLight('#ffffff', params.environmentIntensity)

function applyAmbientType(type) {
  if (type === 'room') {
    scene.environment = roomEnvTexture
    scene.environmentIntensity = params.environmentIntensity
    scene.remove(ambientLight)
  } else if (type === 'discs') {
    scene.environment = discEnvTexture
    scene.environmentIntensity = params.environmentIntensity
    scene.remove(ambientLight)
  } else {
    scene.environment = null
    ambientLight.intensity = params.environmentIntensity
    scene.add(ambientLight)
  }
}
applyAmbientType(params.ambientType)

const rimLight = new THREE.DirectionalLight('#ffffff', 0)
rimLight.position.set(params.lightX, params.lightY, params.lightZ)
rimLight.castShadow = true
rimLight.shadow.mapSize.setScalar(params.shadowMapSize)
rimLight.shadow.bias = params.shadowBias
rimLight.shadow.normalBias = params.shadowNormalBias
rimLight.shadow.camera.near = 0.1
rimLight.shadow.camera.far = 30
rimLight.shadow.camera.left = -BOUNDS.x / 2
rimLight.shadow.camera.right = BOUNDS.x / 2
rimLight.shadow.camera.top = BOUNDS.z / 2
rimLight.shadow.camera.bottom = -BOUNDS.z / 2
scene.add(rimLight)

const rimLightHelper = new THREE.DirectionalLightHelper(rimLight, 1)
rimLightHelper.visible = false
scene.add(rimLightHelper)

const shadowCameraHelper = new THREE.CameraHelper(rimLight.shadow.camera)
shadowCameraHelper.visible = false
scene.add(shadowCameraHelper)

// ─── Mouse raycasting ────────────────────────────────────────────────────

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const attractorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -params.attractorHeight)
const attractorPos = new THREE.Vector3(0, 0, 0)
let mouseOnGround = false

window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  attractorPlane.constant = -params.attractorHeight
  const hit = raycaster.ray.intersectPlane(attractorPlane, attractorPos)
  mouseOnGround = hit !== null
})

window.addEventListener('mouseleave', () => {
  mouseOnGround = false
})

// ─── Physics ────────────────────────────────────────────────────────────────

const physics = new BallPhysicsGPU({
  renderer,
  count: SPHERE_COUNT,
  radius: SPHERE_RADIUS,
  bounds: BOUNDS,
  gravity: params.gravity,
  stiffness: params.stiffness,
  damping: params.damping,
  friction: params.friction,
  restitution: params.restitution,
  cohesion: params.cohesion,
  correctionStrength: params.correctionStrength,
  correctionDamping: params.correctionDamping,
})

// ─── Ambient Occlusion ───────────────────────────────────────────────────────

const ao = new SphereGridAO({
  physics,
  count: SPHERE_COUNT,
  radius: SPHERE_RADIUS,
  intensity: params.aoIntensity,
  aoRadius: params.aoRadius,
})

// ─── Visual smoothing ────────────────────────────────────────────────────────

const visualPositions = instancedArray(SPHERE_COUNT, 'vec3')
const visualLerpUniform = uniform(0.1)

const lerpVisualPositions = Fn(() => {
  const target = physics.positions.element(instanceIndex)
  const current = visualPositions.element(instanceIndex)
  visualPositions.element(instanceIndex).assign(mix(current, target, visualLerpUniform))
})().compute(SPHERE_COUNT)

async function snapVisualPositions() {
  visualLerpUniform.value = 1
  await renderer.computeAsync(lerpVisualPositions)
  visualLerpUniform.value = params.visualLerp
}

// ─── External forces (noise + attractor) ─────────────────────────────────────

const noiseAmplitudeUniform = uniform(params.noiseAmplitude)
const noiseFrequencyUniform = uniform(params.noiseFrequency)
const noiseSpeedUniform = uniform(params.noiseSpeed)
const timeUniform = uniform(0)
const NOISE_TIME_OFFSET = 270
const NOISE_SCALE = 0.5
const NOISE_BIAS = 0.275

function noiseSamplePos(px, pz) {
  return vec3(
    px.mul(noiseFrequencyUniform),
    pz.mul(noiseFrequencyUniform),
    timeUniform.mul(noiseSpeedUniform).add(NOISE_TIME_OFFSET),
  )
}

function sampleNoise(px, pz) {
  return mx_noise_float(noiseSamplePos(px, pz)).mul(NOISE_SCALE).add(NOISE_BIAS)
}

const attractorPosUniform = uniform(vec3(0, 0, 0))
const attractorRadiusUniform = uniform(params.attractorRadius)
const attractorStrengthUniform = uniform(params.attractorStrength)
const attractorActiveUniform = uniform(0)

const colliderPosUniform = uniform(vec3(0, 0, 0))
const colliderRadiusUniform = uniform(params.colliderRadius)
const colliderStrengthUniform = uniform(params.colliderStrength)

const collider2PosUniform = uniform(vec3(0, 0, 0))
const collider2RadiusUniform = uniform(params.collider2Radius)
const collider2StrengthUniform = uniform(params.collider2Strength)

const computeExternalForces = Fn(() => {
  const pos = physics.positions.element(instanceIndex)
  const extForce = physics.externalForces.element(instanceIndex)

  // Noise force
  const noiseVal = sampleNoise(pos.x, pos.z)
  const force = vec3(0, noiseVal.mul(noiseAmplitudeUniform), 0).toVar()

  // Attractor force
  const toAttractor = attractorPosUniform.sub(pos).toVar()
  const dist = toAttractor.length()
  const falloff = dist.div(attractorRadiusUniform).clamp(0, 1).oneMinus().mul(attractorActiveUniform)
  force.addAssign(toAttractor.normalize().mul(attractorStrengthUniform).mul(falloff))

  // Sphere collider 1 — repel balls outward
  const toCenter = pos.sub(colliderPosUniform).toVar()
  const centerDist = toCenter.length()
  const penetration = colliderRadiusUniform.sub(centerDist)
  If(penetration.greaterThan(0), () => {
    const pushDir = toCenter.normalize()
    const pushForce = pushDir.mul(penetration.mul(colliderStrengthUniform))
    force.addAssign(pushForce)
  })

  // Sphere collider 2 — follows point light
  const toCenter2 = pos.sub(collider2PosUniform).toVar()
  const centerDist2 = toCenter2.length()
  const penetration2 = collider2RadiusUniform.sub(centerDist2)
  If(penetration2.greaterThan(0), () => {
    const pushDir2 = toCenter2.normalize()
    const pushForce2 = pushDir2.mul(penetration2.mul(collider2StrengthUniform))
    force.addAssign(pushForce2)
  })

  extForce.assign(force)
})().compute(SPHERE_COUNT)

// ─── Instance Culling ────────────────────────────────────────────────────────
// NOTE: Ideally we'd use drawIndirectCount for fully GPU-driven multi-LOD rendering,
// but it's not yet available in WebGPU: https://github.com/gpuweb/gpuweb/issues/1354
// Instead we use three InstancedMesh objects with separate indirect draw buffers.

const boundingSphere = new THREE.Sphere(
  new THREE.Vector3(0, BOUNDS.y / 2, 0),
  Math.hypot(BOUNDS.x, BOUNDS.y, BOUNDS.z) / 2,
)

// LOD geometries
const sphereGeoNear = new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_DETAIL_NEAR, SPHERE_DETAIL_NEAR)
const sphereGeoMid = new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_DETAIL_MIDDLE, SPHERE_DETAIL_MIDDLE)
const sphereGeoFar = new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_DETAIL_FAR, SPHERE_DETAIL_FAR)
sphereGeoNear.boundingSphere = boundingSphere.clone()
sphereGeoMid.boundingSphere = boundingSphere.clone()
sphereGeoFar.boundingSphere = boundingSphere.clone()

// Indirect draw buffers (DrawIndexedIndirect: indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
const nearIndirect = new THREE.IndirectStorageBufferAttribute(
  new Uint32Array([sphereGeoNear.index.count, 0, 0, 0, 0]),
  5,
)
const midIndirect = new THREE.IndirectStorageBufferAttribute(new Uint32Array([sphereGeoMid.index.count, 0, 0, 0, 0]), 5)
const farIndirect = new THREE.IndirectStorageBufferAttribute(new Uint32Array([sphereGeoFar.index.count, 0, 0, 0, 0]), 5)

// Survivor ID buffers (packed original instance indices)
const nearOutIdSSBO = new THREE.StorageBufferAttribute(new Uint32Array(SPHERE_COUNT), 1)
const midOutIdSSBO = new THREE.StorageBufferAttribute(new Uint32Array(SPHERE_COUNT), 1)
const farOutIdSSBO = new THREE.StorageBufferAttribute(new Uint32Array(SPHERE_COUNT), 1)
const nearOutIdNode = storage(nearOutIdSSBO, 'uint', SPHERE_COUNT)
const midOutIdNode = storage(midOutIdSSBO, 'uint', SPHERE_COUNT)
const farOutIdNode = storage(farOutIdSSBO, 'uint', SPHERE_COUNT)

// Draw struct for atomic instanceCount updates
const DrawIndexed = struct(
  {
    indexCount: 'uint',
    instanceCount: { type: 'uint', atomic: true },
    firstIndex: 'uint',
    baseVertex: 'uint',
    firstInstance: 'uint',
  },
  'DrawIndexed',
)
const nearDrawStruct = storage(nearIndirect, DrawIndexed)
const midDrawStruct = storage(midIndirect, DrawIndexed)
const farDrawStruct = storage(farIndirect, DrawIndexed)

// Camera uniforms for culling
const cullCamView = uniform(new THREE.Matrix4())
const cullCamProj = uniform(new THREE.Matrix4())
const cullCamPos = uniform(new THREE.Vector3())
const cullingEnabledUniform = uniform(1)
const lodDistanceNearUniform = uniform(params.lodDistanceNear)
const lodDistanceFarUniform = uniform(params.lodDistanceFar)

// Clear instance counts
const clearCulling = Fn(() => {
  atomicStore(nearDrawStruct.get('instanceCount'), uint(0))
  atomicStore(midDrawStruct.get('instanceCount'), uint(0))
  atomicStore(farDrawStruct.get('instanceCount'), uint(0))
})().compute(1)

// Frustum cull + LOD sort
const cullAndPack = Fn(() => {
  const idx = instanceIndex
  const pos = visualPositions.element(idx)

  // Project to clip space
  const clipPos = cullCamProj.mul(cullCamView).mul(vec4(pos, 1)).toVar()
  const w = clipPos.w

  // Sphere radius in clip space: scale by projection focal lengths per axis
  const rx = float(SPHERE_RADIUS).mul(cullCamProj.element(0).x)
  const ry = float(SPHERE_RADIUS).mul(cullCamProj.element(1).y)
  const rz = float(SPHERE_RADIUS).mul(cullCamProj.element(2).z.abs())

  // Frustum test (perspective): visible if inside all 6 clip planes with projected sphere radius margin
  const inFrustum = w
    .greaterThan(0)
    .and(clipPos.x.abs().lessThanEqual(w.add(rx)))
    .and(clipPos.y.abs().lessThanEqual(w.add(ry)))
    .and(clipPos.z.greaterThanEqual(rz.negate()))
    .and(clipPos.z.lessThanEqual(w.add(rz)))

  // When culling disabled, everything is visible
  const visible = inFrustum.or(cullingEnabledUniform.equal(0))

  If(visible, () => {
    const dist = cullCamPos.sub(pos).length()
    // When LOD disabled, all visible instances go to near (full detail)
    If(dist.lessThan(lodDistanceNearUniform), () => {
      const slot = atomicAdd(nearDrawStruct.get('instanceCount'), uint(1))
      If(slot.lessThan(uint(SPHERE_COUNT)), () => {
        nearOutIdNode.element(slot).assign(uint(idx))
      })
    }).Else(() => {
      If(dist.lessThan(lodDistanceFarUniform), () => {
        const slot = atomicAdd(midDrawStruct.get('instanceCount'), uint(1))
        If(slot.lessThan(uint(SPHERE_COUNT)), () => {
          midOutIdNode.element(slot).assign(uint(idx))
        })
      }).Else(() => {
        const slot = atomicAdd(farDrawStruct.get('instanceCount'), uint(1))
        If(slot.lessThan(uint(SPHERE_COUNT)), () => {
          farOutIdNode.element(slot).assign(uint(idx))
        })
      })
    })
  })
})().compute(SPHERE_COUNT)

// Attach indirect draw to geometries
sphereGeoNear.setIndirect(nearIndirect)
sphereGeoMid.setIndirect(midIndirect)
sphereGeoFar.setIndirect(farIndirect)

// Remapped index nodes (draw instanceIndex → original instance ID)
const nearRemappedIndex = nearOutIdNode.element(instanceIndex)
const midRemappedIndex = midOutIdNode.element(instanceIndex)
const farRemappedIndex = farOutIdNode.element(instanceIndex)

// ─── Visualization ──────────────────────────────────────────────────────────

const ballColorUniform = uniform(color(params.ballColor))
const roughnessUniform = uniform(params.roughness)
const metalnessUniform = uniform(params.metalness)

// ─── Emissive gradient ───────────────────────────────────────────────────────
const emissiveColor1Uniform = uniform(color(params.emissiveColor1))
const emissiveColor2Uniform = uniform(color(params.emissiveColor2))
const emissiveIntensityUniform = uniform(params.emissiveIntensity)
const emissiveScaleUniform = uniform(params.emissiveScale)
const emissivePowerUniform = uniform(params.emissivePower)
const emissiveAoIntensityUniform = uniform(params.emissiveAoIntensity)
const emissiveAoRadiusUniform = uniform(params.emissiveAoRadius)
const initialWaves = colourWavesAt(0, params.emissiveMin, params.emissiveMax)
const colourWaveUniforms = initialWaves.map((wave) => uniform(new THREE.Vector2(wave.center, wave.strength)))

const bounceIntensityUniform = uniform(params.bounceIntensity)
const bounceScaleUniform = uniform(params.bounceScale)
const bouncePowerUniform = uniform(params.bouncePower)
// ─── Precomputed noise buffer (noise value + gradient direction per ball) ────
const noiseDataBuffer = instancedArray(SPHERE_COUNT, 'vec4') // x=noiseVal, y=gradX, z=0, w=gradZ

const computeNoiseData = Fn(() => {
  const pos = visualPositions.element(instanceIndex)
  const eps = float(0.1)

  const nVal = sampleNoise(pos.x, pos.z)

  // Finite differences for gradient
  const gradX = sampleNoise(pos.x.add(eps), pos.z).sub(sampleNoise(pos.x.sub(eps), pos.z))
  const gradZ = sampleNoise(pos.x, pos.z.add(eps)).sub(sampleNoise(pos.x, pos.z.sub(eps)))

  noiseDataBuffer.element(instanceIndex).assign(vec4(nVal, gradX, 0, gradZ))
})().compute(SPHERE_COUNT)

// Build material nodes for a given remapped index
function createMaterialNodes(remappedIndex) {
  const instancePos = positionLocal.add(visualPositions.element(remappedIndex))

  // Read precomputed noise data
  const noiseData = noiseDataBuffer.element(remappedIndex)
  const noiseVal = noiseData.x

  // Directional AO using remapped index
  const aoData = ao.aoBuffer.element(remappedIndex)
  const occDir = vec3(aoData.x, aoData.y, aoData.z)
  const occWeight = aoData.w
  // Darken the hemisphere facing neighbors: dot normal with occlusion direction
  const aoFacing = normalWorld.dot(occDir.normalize()).mul(0.5).add(0.5).mul(occWeight).mul(ao.intensityUniform)
  const aoNode = float(1.0).sub(aoFacing).clamp(0.0, 1.0)

  // Remap AO for emissive: radius controls the spread (smoothstep edge), intensity scales the result
  const emissiveAoDarkening = float(1.0).sub(aoNode) // 0 = no occlusion, 1 = fully occluded
  const emissiveAo = float(1.0)
    .sub(smoothstep(0, emissiveAoRadiusUniform, emissiveAoDarkening).mul(emissiveAoIntensityUniform))
    .clamp(0, 1)
  const waveEmissive = (wave) => {
    const bandCenter = wave.x
    const gradDir = vec3(noiseData.y, 0, noiseData.w).normalize().mul(sign(bandCenter.sub(noiseVal)))
    const bDistance = abs(noiseVal.sub(bandCenter)).div(emissiveScaleUniform).clamp(0, 1)
    const gColor = mix(emissiveColor2Uniform, emissiveColor1Uniform, smoothstep(0, 0.5, bDistance))
    const gAlpha = pow(smoothstep(1.0, 0.7, bDistance), emissivePowerUniform)
    const hFactor = pow(normalWorld.dot(gradDir).mul(0.5).add(0.5), bouncePowerUniform)
    const bDist = abs(noiseVal.sub(bandCenter)).div(bounceScaleUniform).clamp(0, 1)
    const bProximity = smoothstep(1.0, 0.3, bDist)
    const bounceNode = gColor.mul(bounceIntensityUniform).mul(bProximity).mul(hFactor).mul(gAlpha.oneMinus()).mul(aoNode)
    return gColor.mul(emissiveIntensityUniform).mul(emissiveAo).mul(gAlpha).add(bounceNode).mul(wave.y)
  }
  // Max blending keeps the overlapping waves from doubling the brightness.
  const emissiveNode = waveEmissive(colourWaveUniforms[0]).max(waveEmissive(colourWaveUniforms[1]))
  const aoColorNode = ballColorUniform.mul(aoNode)

  return { positionNode: instancePos, colorNode: aoColorNode, emissiveNode }
}

function createMaterials(remappedIndex) {
  const nodes = createMaterialNodes(remappedIndex)

  const lambert = new THREE.MeshLambertNodeMaterial()
  lambert.positionNode = nodes.positionNode
  lambert.colorNode = nodes.colorNode
  lambert.emissiveNode = nodes.emissiveNode

  const standard = new THREE.MeshStandardNodeMaterial()
  standard.positionNode = nodes.positionNode
  standard.colorNode = nodes.colorNode
  standard.emissiveNode = nodes.emissiveNode
  standard.roughnessNode = roughnessUniform
  standard.metalnessNode = metalnessUniform

  return { lambert, standard }
}

const nearMaterials = createMaterials(nearRemappedIndex)
const midMaterials = createMaterials(midRemappedIndex)
const farMaterials = createMaterials(farRemappedIndex)

const sphereMeshNear = new THREE.InstancedMesh(sphereGeoNear, nearMaterials[params.materialType], SPHERE_COUNT)
sphereMeshNear.castShadow = true
sphereMeshNear.receiveShadow = true
scene.add(sphereMeshNear)

const sphereMeshMid = new THREE.InstancedMesh(sphereGeoMid, midMaterials[params.materialType], SPHERE_COUNT)
sphereMeshMid.castShadow = true
sphereMeshMid.receiveShadow = true
scene.add(sphereMeshMid)

const sphereMeshFar = new THREE.InstancedMesh(sphereGeoFar, farMaterials[params.materialType], SPHERE_COUNT)
sphereMeshFar.castShadow = true
sphereMeshFar.receiveShadow = true
scene.add(sphereMeshFar)

// ─── Attractor helper ────────────────────────────────────────────────────────

const attractorHelper = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: true, transparent: true, opacity: 0.5 }),
)
attractorHelper.visible = false
scene.add(attractorHelper)

// ─── Center collider + point light ──────────────────────────────────────────

const cameraDir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize()
const colliderPos = new THREE.Vector3().copy(controls.target).addScaledVector(cameraDir, params.colliderDistance)

const pointLight = new THREE.PointLight(params.pointLightColor, 0, params.pointLightRange, params.pointLightDecay)
pointLight.position.copy(colliderPos)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
pointLightHelper.visible = params.debug
scene.add(pointLightHelper)

const colliderHelper = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x4a7cff, wireframe: true, transparent: true, opacity: 0.4 }),
)
colliderHelper.position.copy(colliderPos)
colliderHelper.scale.setScalar(params.colliderRadius)
colliderHelper.visible = params.debug
scene.add(colliderHelper)

const collider2Helper = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff7744, wireframe: true, transparent: true, opacity: 0.4 }),
)
collider2Helper.scale.setScalar(params.collider2Radius)
collider2Helper.visible = params.debug
scene.add(collider2Helper)

function updateCollider2() {
  collider2PosUniform.value.copy(pointLight.position)
  collider2RadiusUniform.value = params.collider2Radius
  collider2StrengthUniform.value = params.collider2Strength
  collider2Helper.position.copy(pointLight.position)
  collider2Helper.scale.setScalar(params.collider2Radius)
}

function updateCenterCollider() {
  colliderPos.copy(controls.target).addScaledVector(cameraDir, params.colliderDistance)
  colliderPos.y += params.colliderY
  colliderPosUniform.value.copy(colliderPos)
  colliderRadiusUniform.value = params.colliderRadius
  colliderStrengthUniform.value = params.colliderStrength
  colliderHelper.position.copy(colliderPos)
  colliderHelper.scale.setScalar(params.colliderRadius)
}

function updateCenterLight() {
  pointLight.position.copy(controls.target).addScaledVector(cameraDir, params.pointLightDistance)
  pointLight.position.y += params.pointLightY
  pointLightHelper.update()
  updateCollider2()
}
updateCenterCollider()
updateCenterLight()

// ─── GUI ────────────────────────────────────────────────────────────────────

const gui = new GUI({ title: 'Settings', closeFolders: true })
gui.domElement.style.display = 'none'

function applyDebug(value) {
  stats.dom.style.display = value ? '' : 'none'
  debugOverlay.style.display = value ? '' : 'none'
  if (value) gui.domElement.style.display = ''
  controls.enabled = value
  attractorHelper.visible = value && mouseOnGround
  rimLightHelper.visible = value
  mainDiscDebug.visible = value
  shadowCameraHelper.visible = value
  colliderHelper.visible = value
  pointLightHelper.visible = value
  collider2Helper.visible = value
}
applyDebug(params.debug)
gui.add(params, 'debug').name('Debug (P)').onChange(applyDebug)

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyP') {
    params.debug = !params.debug
    applyDebug(params.debug)
    gui
      .controllersRecursive()
      .find((c) => c.property === 'debug')
      ?.updateDisplay()
  }
  if (e.code === 'Space') {
    e.preventDefault()
    const pause = !params.paused
    params.paused = pause
    params.emissivePaused = pause
    gui
      .controllersRecursive()
      .filter((c) => c.property === 'paused' || c.property === 'emissivePaused')
      .forEach((c) => c.updateDisplay())
  }
  if (e.code === 'KeyR') {
    physics.init().then(() => snapVisualPositions())
  }
  if (e.code === 'KeyC') {
    const hidden = gui.domElement.style.display === 'none'
    gui.domElement.style.display = hidden ? '' : 'none'
  }
})

const cameraFolder = gui.addFolder('Camera')
cameraFolder
  .add(params, 'fov', 10, 120, 1)
  .name('FOV')
  .onChange((value) => {
    camera.fov = value
    camera.updateProjectionMatrix()
  })

const lightsFolder = gui.addFolder('Lights')
lightsFolder.add(params, 'ambientType', ['room', 'discs', 'ambient']).name('Ambient Type').onChange(applyAmbientType)
lightsFolder
  .add(params, 'environmentIntensity', 0, 1, 0.01)
  .name('Environment Intensity')
  .onChange((value) => {
    if (params.ambientType === 'room' || params.ambientType === 'discs') {
      scene.environmentIntensity = value
    } else {
      ambientLight.intensity = value
    }
  })
lightsFolder
  .add(params, 'lightIntensity', 0, 50, 0.1)
  .name('Light Intensity')
  .onChange((value) => {
    rimLight.intensity = value
  })

const updateLightPos = () => {
  rimLight.position.set(params.lightX, params.lightY, params.lightZ)
  rimLightHelper.update()
}
lightsFolder
  .add(params, 'shadows')
  .name('Shadows')
  .onChange((value) => {
    renderer.shadowMap.enabled = value
    rimLight.castShadow = value
  })

const shadowTypeMap = {
  basic: THREE.BasicShadowMap,
  pcf: THREE.PCFShadowMap,
  pcfSoft: THREE.PCFSoftShadowMap,
  vsm: THREE.VSMShadowMap,
}
lightsFolder
  .add(params, 'shadowType', Object.keys(shadowTypeMap))
  .name('Shadow Type')
  .onChange((value) => {
    renderer.shadowMap.type = shadowTypeMap[value]
  })
lightsFolder
  .add(params, 'shadowBias', -0.01, 0.01, 0.0001)
  .name('Shadow Bias')
  .onChange((value) => {
    rimLight.shadow.bias = value
  })
lightsFolder
  .add(params, 'shadowNormalBias', 0, 0.1, 0.001)
  .name('Shadow Normal Bias')
  .onChange((value) => {
    rimLight.shadow.normalBias = value
  })
lightsFolder
  .add(params, 'shadowMapSize', [256, 512, 1024, 2048, 4096])
  .name('Shadow Map Size')
  .onChange((value) => {
    rimLight.shadow.mapSize.setScalar(value)
    rimLight.shadow.map?.dispose()
    rimLight.shadow.map = null
  })

lightsFolder.add(params, 'lightX', -10, 10, 0.1).name('Light X').onChange(updateLightPos)
lightsFolder.add(params, 'lightY', -10, 10, 0.1).name('Light Y').onChange(updateLightPos)
lightsFolder.add(params, 'lightZ', -10, 10, 0.1).name('Light Z').onChange(updateLightPos)
lightsFolder.add(params, 'lightFadeDelay', 0, 5, 0.01).name('Fade Delay (s)')
lightsFolder.add(params, 'lightFadeIn', 0, 5, 0.01).name('Fade In (s)')

const envFolder = gui.addFolder('Environment')
envFolder
  .addColor(params, 'backgroundColor')
  .name('Background')
  .onChange((value) => {
    if (scene.background) scene.background.set(value)
  })

const simFolder = gui.addFolder('Simulation')
simFolder
  .add(
    {
      reset: async () => {
        await physics.init()
        await snapVisualPositions()
      },
    },
    'reset',
  )
  .name('Reset')
simFolder.add(params, 'paused').name('Paused')
simFolder.add(params, 'gravity', -50, 0, 0.1).name('Gravity')
simFolder.add(params, 'stiffness', 500, 10000, 10).name('Stiffness')
simFolder.add(params, 'damping', 0, 100, 0.1).name('Damping')
simFolder.add(params, 'friction', 0, 1, 0.01).name('Friction')
simFolder.add(params, 'restitution', 0, 1, 0.01).name('Restitution')
simFolder.add(params, 'cohesion', 0, 200, 1).name('Cohesion')
simFolder.add(params, 'correctionPass').name('Correction Pass')
simFolder.add(params, 'correctionStrength', 0, 1, 0.01).name('Correction Strength')
simFolder.add(params, 'correctionDamping', 0, 1, 0.01).name('Correction Damping')
simFolder.add(params, 'noiseAmplitude', 0, 100, 1).name('Noise Amplitude')
simFolder.add(params, 'noiseFrequency', 0.01, 2, 0.01).name('Noise Frequency')
simFolder.add(params, 'noiseSpeed', 0, 2, 0.01).name('Noise Speed')
simFolder.add(params, 'attractorHeight', 0, 10, 0.1).name('Attractor Height')
simFolder.add(params, 'attractorRadius', 0.5, 10, 0.1).name('Attractor Radius')
simFolder.add(params, 'attractorStrength', 0, 200, 1).name('Attractor Strength')
simFolder.add(params, 'visualLerp', 0.01, 1, 0.01).name('Visual Lerp')

const matFolder = gui.addFolder('Material')
matFolder
  .add(params, 'materialType', ['lambert', 'standard'])
  .name('Type')
  .onChange((value) => {
    sphereMeshNear.material = nearMaterials[value]
    sphereMeshMid.material = midMaterials[value]
    sphereMeshFar.material = farMaterials[value]
  })
matFolder
  .addColor(params, 'ballColor')
  .name('Color')
  .onChange((value) => {
    ballColorUniform.value.set(value)
  })
matFolder
  .add(params, 'roughness', 0, 1, 0.01)
  .name('Roughness')
  .onChange((value) => {
    roughnessUniform.value = value
  })
matFolder
  .add(params, 'metalness', 0, 1, 0.01)
  .name('Metalness')
  .onChange((value) => {
    metalnessUniform.value = value
  })

const emissiveFolder = gui.addFolder('Emissive Gradient')
emissiveFolder.add(params, 'emissiveEnabled').name('Enabled')
emissiveFolder.add(params, 'emissivePaused').name('Paused')
emissiveFolder
  .addColor(params, 'emissiveColor1')
  .name('Color 1')
  .onChange((value) => {
    emissiveColor1Uniform.value.set(value)
  })
emissiveFolder
  .addColor(params, 'emissiveColor2')
  .name('Color 2')
  .onChange((value) => {
    emissiveColor2Uniform.value.set(value)
  })
emissiveFolder.add(params, 'emissiveIntensity', 0, 10, 0.1).name('Intensity')
emissiveFolder.add(params, 'emissiveScale', 0.1, 5, 0.01).name('Scale')
emissiveFolder.add(params, 'emissiveMin', -1, 1, 0.01).name('Min')
emissiveFolder.add(params, 'emissiveMax', 0, 2, 0.01).name('Max')
emissiveFolder.add(params, 'emissivePower', 0.1, 20, 0.1).name('Power')
emissiveFolder.add(params, 'emissiveAoIntensity', 0, 2, 0.01).name('AO Intensity')
emissiveFolder.add(params, 'emissiveAoRadius', 0.01, 3, 0.01).name('AO Radius')

const bounceFolder = gui.addFolder('Bounce Lighting')
bounceFolder.add(params, 'bounce').name('Enabled')
bounceFolder.add(params, 'bounceIntensity', 0, 1, 0.01).name('Intensity')
bounceFolder.add(params, 'bounceScale', 0, 1, 0.01).name('Scale')
bounceFolder.add(params, 'bouncePower', 0.1, 5, 0.1).name('Power')

const aoFolder = gui.addFolder('AO')
aoFolder.add(params, 'ao').name('Enabled')
aoFolder.add(params, 'aoIntensity', 0, 1, 0.01).name('Intensity')
aoFolder.add(params, 'aoRadius', 0, 1, 0.01).name('Radius')

const centerFolder = gui.addFolder('Collider')
centerFolder.add(params, 'colliderRadius', 0.5, 5, 0.01).name('Radius').onChange(updateCenterCollider)
centerFolder.add(params, 'colliderStrength', 0, 200, 0.01).name('Strength').onChange(updateCenterCollider)
centerFolder.add(params, 'colliderDistance', -10, 10, 0.01).name('Distance').onChange(updateCenterCollider)
centerFolder.add(params, 'colliderY', -5, 5, 0.01).name('Y Offset').onChange(updateCenterCollider)
centerFolder
  .add(params, 'pointLightIntensity', 0, 3, 0.01)
  .name('Light Intensity')
  .onChange((value) => {
    pointLight.intensity = value
  })
centerFolder.add(params, 'pointLightDistance', -10, 10, 0.01).name('Light Distance').onChange(updateCenterLight)
centerFolder.add(params, 'pointLightY', -5, 5, 0.01).name('Light Y Offset').onChange(updateCenterLight)
centerFolder
  .add(params, 'pointLightRange', 0, 50, 0.01)
  .name('Light Range')
  .onChange((value) => {
    pointLight.distance = value
  })
centerFolder
  .add(params, 'pointLightDecay', 0, 5, 0.01)
  .name('Light Decay')
  .onChange((value) => {
    pointLight.decay = value
  })
centerFolder
  .addColor(params, 'pointLightColor')
  .name('Light Color')
  .onChange((value) => {
    pointLight.color.set(value)
  })

const collider2Folder = gui.addFolder('Collider 2')
collider2Folder.add(params, 'collider2Radius', 0.5, 5, 0.01).name('Radius').onChange(updateCollider2)
collider2Folder.add(params, 'collider2Strength', 0, 200, 0.01).name('Strength').onChange(updateCollider2)

const cullingFolder = gui.addFolder('Culling')
cullingFolder.add(params, 'culling').name('Frustum Culling')
cullingFolder.add(params, 'lodDistanceNear', 1, 20, 0.5).name('LOD Near Distance')
cullingFolder.add(params, 'lodDistanceFar', 1, 30, 0.5).name('LOD Far Distance')

// ─── Animation Loop ─────────────────────────────────────────────────────────

const fixedTimestep = new FixedTimestep({ dt: 1 / 120, maxSteps: 6 })

await physics.init()
await snapVisualPositions()

// Precompile all materials
await renderer.compileAsync(scene, camera)

let colourWaveTime = 0
let prevTimestamp
let elapsedTime = 0
document.addEventListener('visibilitychange', () => { prevTimestamp = undefined })
renderer.setAnimationLoop(async (timestamp) => {
  // GPU setup and time spent in a background tab must not skip the opening wave.
  const dt = prevTimestamp === undefined ? 0 : (timestamp - prevTimestamp) / 1000
  prevTimestamp = timestamp
  elapsedTime += dt

  // Light fade-in
  const fadeElapsed = elapsedTime - params.lightFadeDelay
  if (fadeElapsed < 0) {
    rimLight.intensity = 0
    pointLight.intensity = 0
  } else if (fadeElapsed < params.lightFadeIn) {
    const t = fadeElapsed / params.lightFadeIn
    rimLight.intensity = params.lightIntensity * t
    pointLight.intensity = params.pointLightIntensity * t
  } else {
    rimLight.intensity = params.lightIntensity
    pointLight.intensity = params.pointLightIntensity
  }
  const steps = params.paused ? 0 : fixedTimestep.update(timestamp)

  if (steps > 0) {
    // Sync uniforms from params (single source of truth)
    physics.gravityUniform.value = params.gravity
    physics.stiffnessUniform.value = params.stiffness
    physics.dampingUniform.value = params.damping
    physics.frictionUniform.value = params.friction
    physics.restitutionUniform.value = params.restitution
    physics.cohesionUniform.value = params.cohesion
    physics.correctionStrengthUniform.value = params.correctionStrength
    physics.correctionDampingUniform.value = params.correctionDamping
    noiseAmplitudeUniform.value = params.noiseAmplitude
    noiseFrequencyUniform.value = params.noiseFrequency
    noiseSpeedUniform.value = params.noiseSpeed
    timeUniform.value = timestamp / 1000
    attractorRadiusUniform.value = params.attractorRadius
    attractorStrengthUniform.value = params.attractorStrength
    attractorActiveUniform.value = mouseOnGround ? 1 : 0
    attractorPosUniform.value.copy(attractorPos)
    renderer.compute(computeExternalForces)

    for (let i = 0; i < steps; i++) {
      physics.compute(fixedTimestep.dt, { correctionPass: params.correctionPass })
    }
  }

  // Update AO
  ao.intensityUniform.value = params.ao ? params.aoIntensity : 0
  ao.aoRadiusUniform.value = params.aoRadius
  if (params.ao) {
    ao.update(renderer)
  }

  visualLerpUniform.value = params.visualLerp
  renderer.compute(lerpVisualPositions)

  // Precompute noise values + gradient for emissive/bounce
  renderer.compute(computeNoiseData)

  // Run frustum culling + LOD sort
  cullingEnabledUniform.value = params.culling ? 1 : 0
  lodDistanceNearUniform.value = params.lodDistanceNear
  lodDistanceFarUniform.value = params.lodDistanceFar
  cullCamView.value.copy(camera.matrixWorldInverse)
  cullCamProj.value.copy(camera.projectionMatrix)
  cullCamPos.value.copy(camera.position)
  renderer.compute(clearCulling)
  renderer.compute(cullAndPack)

  // Update attractor helper
  attractorHelper.visible = params.debug && mouseOnGround
  attractorHelper.position.copy(attractorPos)
  const r = params.attractorRadius
  attractorHelper.scale.set(r, r, r)

  controls.update()

  // Sync emissive gradient uniforms
  emissiveIntensityUniform.value = params.emissiveEnabled ? params.emissiveIntensity : 0
  emissiveScaleUniform.value = params.emissiveScale
  emissivePowerUniform.value = params.emissivePower
  emissiveAoIntensityUniform.value = params.emissiveAoIntensity
  emissiveAoRadiusUniform.value = params.emissiveAoRadius
  if (!params.emissivePaused) {
    colourWaveTime += dt
  }
  colourWavesAt(colourWaveTime, params.emissiveMin, params.emissiveMax).forEach((wave, index) => {
    colourWaveUniforms[index].value.set(wave.center, wave.strength)
  })

  // Sync bounce lighting uniforms
  bounceIntensityUniform.value = params.bounce ? params.bounceIntensity : 0
  bounceScaleUniform.value = params.bounceScale
  bouncePowerUniform.value = params.bouncePower

  renderer.render(scene, camera)
  if (!renderer.domElement.dataset.ready) renderer.domElement.dataset.ready = 'true'

  stats.update()
  await renderer.resolveTimestampsAsync('render')
  await renderer.resolveTimestampsAsync('compute')
})

// ─── Resize ─────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
