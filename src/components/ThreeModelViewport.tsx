import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Compass,
  Eye,
  Camera,
  Sparkles,
  Sliders,
  Expand,
  Info,
} from 'lucide-react';
import { Material, StructuralZone } from '../types';

interface ThreeModelViewportProps {
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
  hoveredZoneId: string | null;
  setHoveredZoneId?: (id: string | null) => void;
  buildingMeta?: {
    buildingType?: string;
    estimatedFloors?: number;
    facadeWidthFt?: number;
    facadeHeightFt?: number;
  };
}

/**
 * Creates dynamic canvas textures for Three.js materials
 */
function createThreeTexture(material: Material, customColor?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const color = customColor || material.colorHex;
  if (!ctx) return new THREE.CanvasTexture(canvas);

  switch (material.textureType) {
    case 'fluted_wood': {
      // 3D vertical fluted wood battens with rich woodgrain gradient
      canvas.width = 128;
      canvas.height = 128;
      const slatW = 16;
      for (let x = 0; x < 128; x += slatW) {
        const grad = ctx.createLinearGradient(x, 0, x + slatW, 0);
        grad.addColorStop(0, '#3E210C');
        grad.addColorStop(0.25, color);
        grad.addColorStop(0.75, '#8C532B');
        grad.addColorStop(1, '#211005');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, slatW - 2.5, 128);

        // Gap shadow
        ctx.fillStyle = '#100602';
        ctx.fillRect(x + slatW - 2.5, 0, 2.5, 128);
      }
      break;
    }
    case 'stacked_stone': {
      // Natural split-face stacked stone courses
      canvas.width = 256;
      canvas.height = 256;
      ctx.fillStyle = '#232529';
      ctx.fillRect(0, 0, 256, 256);

      const rows = [22, 34, 18, 28, 30, 22, 28, 24, 34];
      let y = 0;
      for (const h of rows) {
        let x = 0;
        while (x < 256) {
          const w = 38 + ((x * 17 + y * 13) % 25);
          ctx.fillStyle = color;
          ctx.fillRect(x, y, w - 2, h - 2);

          // Highlights & clefts
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(x, y, w - 2, 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillRect(x, y + h - 3, w - 2, 2);

          x += w;
        }
        y += h;
      }
      break;
    }
    case 'travertine': {
      // Linear veined travertine stone slabs
      canvas.width = 256;
      canvas.height = 128;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 256, 128);

      for (let i = 0; i < 9; i++) {
        ctx.strokeStyle = 'rgba(140, 115, 85, 0.35)';
        ctx.lineWidth = 2 + (i % 3);
        ctx.beginPath();
        const vy = i * 14 + 6;
        ctx.moveTo(0, vy);
        ctx.bezierCurveTo(80, vy + 4, 180, vy - 4, 256, vy + 2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 0, 256, 128);
      break;
    }
    case 'brick': {
      canvas.width = 128;
      canvas.height = 64;
      ctx.fillStyle = '#D6CEBE';
      ctx.fillRect(0, 0, 128, 64);

      ctx.fillStyle = color;
      ctx.fillRect(1, 1, 126, 30);
      ctx.fillRect(1, 33, 62, 30);
      ctx.fillRect(65, 33, 62, 30);
      break;
    }
    default: {
      // Stucco / Matte Paint
      canvas.width = 64;
      canvas.height = 64;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 64, 64);

      for (let s = 0; s < 45; s++) {
        ctx.fillStyle = s % 2 === 0 ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.07)';
        ctx.fillRect((s * 19) % 64, (s * 29) % 64, 1.5, 1.5);
      }
      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export const ThreeModelViewport: React.FC<ThreeModelViewportProps> = ({
  zones,
  materialsMap,
  activeZoneId,
  setActiveZoneId,
  hoveredZoneId,
  setHoveredZoneId,
  buildingMeta = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'sunset' | 'night'>('noon');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'iso' | 'front' | 'street' | 'detail'>('iso');
  const [hoveredInfo, setHoveredInfo] = useState<{ name: string; materialName: string } | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.HemisphereLight | null>(null);
  const nightSpotlightsRef = useRef<THREE.Group | null>(null);
  const zoneMeshesRef = useRef<Map<string, { mesh: THREE.Mesh; basePosition: THREE.Vector3; explodeOffset: THREE.Vector3 }>>(
    new Map()
  );

  // Orbit control tracking
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const orbitAnglesRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3, radius: 28 });
  const targetLookAtRef = useRef(new THREE.Vector3(0, 4.0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene with Light Cool Studio Slate Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8FAFC); // Very clean, light cool porcelain
    scene.fog = new THREE.FogExp2(0xF8FAFC, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with Soft Realistic PCF Shadows & Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xFFFFFF, 0xCBD5E1, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 1.8);
    sunLight.position.set(20, 26, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 90;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Night Spotlights group for architectural uplighting
    const nightGroup = new THREE.Group();
    nightGroup.visible = false;

    const spot1 = new THREE.SpotLight(0xFDE68A, 3.5, 25, Math.PI / 6, 0.4);
    spot1.position.set(-6, 0.2, 8);
    spot1.target.position.set(-6, 5, 0);
    nightGroup.add(spot1);
    nightGroup.add(spot1.target);

    const spot2 = new THREE.SpotLight(0xFDE68A, 3.5, 25, Math.PI / 6, 0.4);
    spot2.position.set(4, 0.2, 8);
    spot2.target.position.set(4, 5, 0);
    nightGroup.add(spot2);
    nightGroup.add(spot2.target);

    scene.add(nightGroup);
    nightSpotlightsRef.current = nightGroup;

    // 5. Ground Plane & Minimalist Landscaping
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5F9, // Soft cool slate
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Front Paver Courtyard
    const lawnGeo = new THREE.PlaneGeometry(36, 12);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x86EFAC, // Crisp spring green turf
      roughness: 0.95,
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.02, 11);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // Modern Concrete Paver Driveway
    const driveGeo = new THREE.PlaneGeometry(14, 12);
    const driveMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0, // Crisp concrete
      roughness: 0.8,
    });
    const drive = new THREE.Mesh(driveGeo, driveMat);
    drive.rotation.x = -Math.PI / 2;
    drive.position.set(8, 0.03, 11);
    drive.receiveShadow = true;
    scene.add(drive);

    // Subtle Architectural Grid Floor
    const gridHelper = new THREE.GridHelper(60, 60, 0xCBD5E1, 0xE2E8F0);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Lighting based on Time of Day
  useEffect(() => {
    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const night = nightSpotlightsRef.current;
    const scene = sceneRef.current;
    if (!sun || !ambient || !scene) return;

    if (timeOfDay === 'morning') {
      scene.background = new THREE.Color(0xFEF3C7);
      ambient.color.setHex(0xFFEDD5);
      ambient.intensity = 0.85;
      sun.position.set(-26, 18, 16);
      sun.color.setHex(0xFED7AA);
      sun.intensity = 1.7;
      if (night) night.visible = false;
    } else if (timeOfDay === 'noon') {
      scene.background = new THREE.Color(0xF8FAFC);
      ambient.color.setHex(0xFFFFFF);
      ambient.intensity = 0.95;
      sun.position.set(16, 28, 20);
      sun.color.setHex(0xFFFBEB);
      sun.intensity = 1.9;
      if (night) night.visible = false;
    } else if (timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0xFFEDD5);
      ambient.color.setHex(0xFDBA74);
      ambient.intensity = 0.8;
      sun.position.set(30, 9, 16);
      sun.color.setHex(0xFB923C);
      sun.intensity = 2.2;
      if (night) night.visible = false;
    } else {
      // Night Lighting Mode
      scene.background = new THREE.Color(0x0F172A);
      ambient.color.setHex(0x1E293B);
      ambient.intensity = 0.4;
      sun.position.set(5, 20, 10);
      sun.color.setHex(0x38BDF8);
      sun.intensity = 0.3;
      if (night) night.visible = true;
    }
  }, [timeOfDay]);

  // Rebuild Dynamic 3D Architectural Model Parametrically from Zones
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous building group
    const prevGroup = scene.getObjectByName('building-model');
    if (prevGroup) {
      scene.remove(prevGroup);
    }
    zoneMeshesRef.current.clear();

    const buildingGroup = new THREE.Group();
    buildingGroup.name = 'building-model';

    // Calculate building dimensions from meta or defaults
    const floors = Math.max(1, buildingMeta.estimatedFloors || 2);
    const totalW = 18;
    const floorH = 4.2;
    const totalH = floors * floorH;
    const baseDepth = 11;

    // Plinth Foundation
    const plinthGeo = new THREE.BoxGeometry(totalW + 0.8, 0.4, baseDepth + 0.8);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.set(0, 0.2, 0);
    plinthMesh.receiveShadow = true;
    plinthMesh.castShadow = true;
    buildingGroup.add(plinthMesh);

    // Main structural core back wall (substrate)
    const coreGeo = new THREE.BoxGeometry(totalW, totalH, baseDepth);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, totalH / 2 + 0.4, 0);
    coreMesh.receiveShadow = true;
    coreMesh.castShadow = true;
    buildingGroup.add(coreMesh);

    // Map each StructuralZone to 3D geometry
    zones.forEach((zone) => {
      const matConfig = zone.assignedMaterialId ? materialsMap.get(zone.assignedMaterialId) : null;
      const isZoneActive = zone.id === activeZoneId;
      const isZoneHovered = zone.id === hoveredZoneId;
      const effectiveColor = zone.customColorHex || matConfig?.colorHex || '#FFFFFF';

      // Three.js Material
      let material: THREE.Material;
      if (matConfig?.textureType === 'glass') {
        material = new THREE.MeshPhysicalMaterial({
          color: 0xBAE6FD,
          roughness: 0.05,
          transmission: 0.9,
          thickness: 0.6,
          transparent: true,
          opacity: 0.65,
          reflectivity: 0.95,
          wireframe: isWireframe,
        });
      } else {
        const texture = matConfig ? createThreeTexture(matConfig, zone.customColorHex) : null;
        material = new THREE.MeshStandardMaterial({
          color: isZoneActive ? 0x2563EB : new THREE.Color(effectiveColor),
          map: texture,
          roughness: matConfig?.textureType === 'metal_slats' ? 0.35 : 0.75,
          metalness: matConfig?.textureType === 'metal_slats' ? 0.65 : 0.05,
          wireframe: isWireframe,
        });
      }

      // Calculate bounding box in normalized coordinates (0.0 to 1.0)
      let minX = 0.2;
      let maxX = 0.8;
      let minY = 0.2;
      let maxY = 0.8;

      if (zone.polygon && zone.polygon.length >= 3) {
        const xs = zone.polygon.map((p) => p[0]);
        const ys = zone.polygon.map((p) => p[1]);
        minX = Math.min(...xs);
        maxX = Math.max(...xs);
        minY = Math.min(...ys);
        maxY = Math.max(...ys);
      }

      const normW = Math.max(0.06, maxX - minX);
      const normH = Math.max(0.06, maxY - minY);
      const normCenterX = (minX + maxX) / 2;
      const normCenterY = (minY + maxY) / 2;

      // Map to 3D space
      let geomW = normW * totalW;
      let geomH = normH * totalH;
      let posX = (normCenterX - 0.5) * totalW;
      let posY = (1.0 - normCenterY) * totalH + 0.4;
      let posZ = baseDepth / 2;
      let geomD = 0.3;
      let explodeZ = 0;

      switch (zone.type) {
        case 'pillar': {
          geomW = Math.max(1.0, normW * totalW);
          geomD = 1.2;
          posZ = baseDepth / 2 + geomD / 2 + 0.1;
          explodeZ = 1.5;
          break;
        }

        case 'accent_wall': {
          geomW = Math.max(2.5, normW * totalW);
          geomH = Math.max(2.0, normH * totalH);
          geomD = 3.2; // Projecting cantilever box volume
          posZ = baseDepth / 2 + geomD / 2;
          explodeZ = 2.2;
          break;
        }

        case 'balcony': {
          geomW = Math.max(3.0, normW * totalW);
          geomH = 0.4; // Slab thickness
          geomD = 3.0; // Projection depth
          posZ = baseDepth / 2 + geomD / 2;
          explodeZ = 1.8;
          break;
        }

        case 'railing': {
          geomW = Math.max(2.8, normW * totalW);
          geomH = 1.15;
          geomD = 0.12;
          posZ = baseDepth / 2 + 2.9;
          explodeZ = 3.0;
          break;
        }

        case 'gate_porch': {
          geomW = Math.max(3.0, normW * totalW);
          geomH = 0.35;
          geomD = 2.8;
          posZ = baseDepth / 2 + geomD / 2;
          explodeZ = 2.0;
          break;
        }

        case 'window': {
          geomW = Math.max(1.6, normW * totalW);
          geomH = Math.max(1.4, normH * totalH);
          geomD = 0.22;
          posZ = baseDepth / 2 + 0.18;
          explodeZ = 0.9;
          break;
        }

        case 'door': {
          geomW = Math.max(1.5, normW * totalW);
          geomH = Math.max(2.4, normH * totalH);
          geomD = 0.30;
          posZ = baseDepth / 2 + 0.22;
          explodeZ = 1.1;
          break;
        }

        case 'parapet':
        case 'roof_edge': {
          geomW = totalW + 0.4;
          geomH = Math.max(0.5, normH * totalH);
          geomD = baseDepth + 0.4;
          posX = 0;
          posY = totalH + 0.4 + geomH / 2;
          posZ = 0;
          explodeZ = 1.2;
          break;
        }

        case 'plinth': {
          geomW = totalW + 0.2;
          geomH = 0.6;
          geomD = baseDepth + 0.2;
          posX = 0;
          posY = 0.5;
          posZ = 0;
          explodeZ = 0.6;
          break;
        }

        case 'main_wall':
        default: {
          geomW = Math.max(2.0, normW * totalW);
          geomH = Math.max(2.0, normH * totalH);
          geomD = 0.25;
          posZ = baseDepth / 2 + 0.12;
          explodeZ = 0.4;
          break;
        }
      }

      const geom = new THREE.BoxGeometry(geomW, geomH, geomD);
      const mesh = new THREE.Mesh(geom, material);
      const basePos = new THREE.Vector3(posX, posY, posZ);
      const explodeOffset = new THREE.Vector3(0, 0, explodeZ);

      if (isExploded) {
        mesh.position.copy(basePos).add(explodeOffset);
      } else {
        mesh.position.copy(basePos);
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { zoneId: zone.id, zoneName: zone.name, materialName: matConfig?.name || 'Default Finish' };

      // Add architectural details for windows and doors
      if (zone.type === 'door') {
        const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, geomH * 0.45, 12);
        const handleMat = new THREE.MeshStandardMaterial({
          color: 0xE2E8F0,
          metalness: 0.9,
          roughness: 0.15,
        });
        const handleMesh = new THREE.Mesh(handleGeo, handleMat);
        handleMesh.position.set(geomW * 0.35, 0, geomD / 2 + 0.06);
        handleMesh.castShadow = true;
        mesh.add(handleMesh);
      } else if (zone.type === 'window') {
        const frameEdges = new THREE.EdgesGeometry(geom);
        const frameLine = new THREE.LineSegments(
          frameEdges,
          new THREE.LineBasicMaterial({ color: 0x1E293B, linewidth: 2 })
        );
        mesh.add(frameLine);
      }

      // Highlight active zone with edge helper
      if (isZoneActive) {
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x2563EB, linewidth: 2 }));
        mesh.add(line);
      }

      buildingGroup.add(mesh);
      zoneMeshesRef.current.set(zone.id, { mesh, basePosition: basePos, explodeOffset });
    });

    // Add Fallback Front Door only if no explicit door zone was detected
    if (!zones.some((z) => z.type === 'door')) {
      const doorGeo = new THREE.BoxGeometry(1.6, 2.7, 0.12);
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.35,
      });
      const doorMesh = new THREE.Mesh(doorGeo, doorMat);
      doorMesh.position.set(1.5, 1.75, baseDepth / 2 + 0.15);
      doorMesh.castShadow = true;
      buildingGroup.add(doorMesh);
    }

    scene.add(buildingGroup);
  }, [zones, materialsMap, activeZoneId, hoveredZoneId, isWireframe, isExploded, buildingMeta]);

  // Update Camera based on Orbit Angles
  const updateCameraPosition = () => {
    const camera = cameraRef.current;
    if (!camera) return;
    const { theta, phi, radius } = orbitAnglesRef.current;
    const target = targetLookAtRef.current;

    camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    camera.position.y = target.y + radius * Math.cos(phi);
    camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(target);
  };

  // Mouse Orbit Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2 || e.shiftKey) {
      isPanningRef.current = true;
    } else {
      isDraggingRef.current = true;
    }
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 3D Raycasting for hover tooltip
    const container = mountRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (container && camera && scene && !isDraggingRef.current) {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const meshes: THREE.Mesh[] = Array.from(zoneMeshesRef.current.values()).map((v) => v.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData?.zoneName) {
          setHoveredInfo({
            name: hit.userData.zoneName,
            materialName: hit.userData.materialName,
          });
          if (setHoveredZoneId) setHoveredZoneId(hit.userData.zoneId);
        }
      } else {
        setHoveredInfo(null);
        if (setHoveredZoneId) setHoveredZoneId(null);
      }
    }

    if (!isDraggingRef.current && !isPanningRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current) {
      orbitAnglesRef.current.theta -= deltaX * 0.007;
      orbitAnglesRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.04, orbitAnglesRef.current.phi - deltaY * 0.007)
      );
    } else if (isPanningRef.current) {
      targetLookAtRef.current.y += deltaY * 0.02;
    }
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    orbitAnglesRef.current.radius = Math.max(
      8,
      Math.min(65, orbitAnglesRef.current.radius + e.deltaY * 0.02)
    );
    updateCameraPosition();
  };

  // Raycaster to select zone on 3D click
  const handleClick = (e: React.MouseEvent) => {
    const container = mountRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const meshes: THREE.Mesh[] = Array.from(zoneMeshesRef.current.values()).map((v) => v.mesh);
    const intersects = raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      if (clickedMesh.userData?.zoneId) {
        setActiveZoneId(clickedMesh.userData.zoneId);
      }
    }
  };

  const setPresetView = (view: 'iso' | 'front' | 'street' | 'detail') => {
    setCameraView(view);
    if (view === 'iso') {
      orbitAnglesRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 28 };
      targetLookAtRef.current.set(0, 4.0, 0);
    } else if (view === 'front') {
      orbitAnglesRef.current = { theta: 0, phi: Math.PI / 2.15, radius: 26 };
      targetLookAtRef.current.set(0, 4.2, 0);
    } else if (view === 'street') {
      orbitAnglesRef.current = { theta: Math.PI / 5, phi: Math.PI / 2.05, radius: 22 };
      targetLookAtRef.current.set(0, 2.5, 4);
    } else if (view === 'detail') {
      orbitAnglesRef.current = { theta: Math.PI / 4.5, phi: Math.PI / 2.4, radius: 14 };
      targetLookAtRef.current.set(2, 4.8, 3);
    }
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 select-none overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      {/* 3D Model Top Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: Camera Angles (Natural segmented buttons) */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm pointer-events-auto text-xs">
          <button
            onClick={() => setPresetView('iso')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              cameraView === 'iso'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3D Isometric
          </button>
          <button
            onClick={() => setPresetView('front')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              cameraView === 'front'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Front Elevation
          </button>
          <button
            onClick={() => setPresetView('street')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              cameraView === 'street'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Street View
          </button>
          <button
            onClick={() => setPresetView('detail')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              cameraView === 'detail'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Detail Zoom
          </button>
        </div>

        {/* Right: Architectural Tools & Daylight */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm pointer-events-auto text-xs">
          {/* Exploded View Toggle */}
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              isExploded
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Exploded View (Shows construction layers)"
          >
            <Expand className="w-3.5 h-3.5" />
            <span>Exploded View</span>
          </button>

          {/* Wireframe CAD Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all ${
              isWireframe
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Wireframe CAD Mode"
          >
            <Box className="w-3.5 h-3.5" />
            <span>CAD</span>
          </button>

          {/* Daylight Selector */}
          <div className="flex items-center gap-0.5 pl-1 border-l border-slate-200">
            <button
              onClick={() => setTimeOfDay('morning')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'morning' ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Morning Sunrise"
            >
              <Sunrise className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('noon')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'noon' ? 'bg-blue-100 text-blue-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Noon Daylight"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'sunset' ? 'bg-orange-100 text-orange-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Sunset Golden Hour"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'night' ? 'bg-indigo-100 text-indigo-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Night Architectural Spotlights"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Hover Info Badge */}
      {hoveredInfo && (
        <div className="absolute bottom-10 left-4 z-10 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs pointer-events-none animate-in fade-in duration-150">
          <div className="font-bold text-slate-800">{hoveredInfo.name}</div>
          <div className="text-[10px] text-blue-600 font-medium">{hoveredInfo.materialName} · Click to style</div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] text-slate-500 pointer-events-none shadow-xs">
        Left Click: Rotate · Shift + Drag: Pan · Scroll: Zoom · Click element to style
      </div>
    </div>
  );
};
