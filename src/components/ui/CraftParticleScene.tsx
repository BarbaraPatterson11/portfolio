import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 1200;

/** Shape 0: Shopify Storefront / Shopping Bag with Handles & Emblem */
function generateShoppingBag(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = i / PARTICLE_COUNT;
    let x: number;
    let y: number;
    let z: number;

    if (p < 0.65) {
      // Bag body (trapezoidal tapered prism)
      const normY = Math.random();
      y = -1.05 + normY * 1.45;
      const width = 0.82 + normY * 0.22;
      const depth = 0.42;

      const edge = Math.random() * 4;
      if (edge < 1) {
        x = -width + (edge % 1) * 2 * width;
        z = depth;
      } else if (edge < 2) {
        x = width;
        z = depth - (edge % 1) * 2 * depth;
      } else if (edge < 3) {
        x = width - (edge % 1) * 2 * width;
        z = -depth;
      } else {
        x = -width;
        z = -depth + (edge % 1) * 2 * depth;
      }
      x += (Math.random() - 0.5) * 0.05;
      y += (Math.random() - 0.5) * 0.05;
      z += (Math.random() - 0.5) * 0.05;
    } else if (p < 0.85) {
      // Arched handles
      const isFront = Math.random() > 0.5;
      const angle = Math.random() * Math.PI;
      const r = 0.46;
      x = Math.cos(angle) * r;
      y = 0.4 + Math.sin(angle) * 0.72;
      z = isFront ? 0.32 : -0.32;
      x += (Math.random() - 0.5) * 0.03;
      z += (Math.random() - 0.5) * 0.03;
    } else {
      // Front emblem
      const angle = Math.random() * Math.PI * 2;
      const r = 0.24;
      x = Math.cos(angle) * r;
      y = -0.28 + Math.sin(angle) * r;
      z = 0.44;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/** Shape 1: Product Hangtag & Barcode Matrix */
function generateProductTag(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = i / PARTICLE_COUNT;
    let x: number;
    let y: number;
    const z = (Math.random() - 0.5) * 0.08;

    if (p < 0.48) {
      // Tag boundary with shoulders
      const edge = (p / 0.48) * 6;
      if (edge < 1) {
        x = -0.75 + (edge % 1) * 1.5;
        y = -1.15;
      } else if (edge < 2) {
        x = 0.75;
        y = -1.15 + (edge % 1) * 1.65;
      } else if (edge < 3) {
        const t = edge % 1;
        x = 0.75 - t * 0.75;
        y = 0.5 + t * 0.65;
      } else if (edge < 4) {
        const t = edge % 1;
        x = 0.0 - t * 0.75;
        y = 1.15 - t * 0.65;
      } else if (edge < 5) {
        x = -0.75;
        y = 0.5 - (edge % 1) * 1.65;
      } else {
        // Tag grommet hole
        const angle = Math.random() * Math.PI * 2;
        const r = 0.12;
        x = Math.cos(angle) * r;
        y = 0.92 + Math.sin(angle) * r;
      }
    } else if (p < 0.78) {
      // Barcode lines
      const line = Math.floor(Math.random() * 8);
      const lineY = -0.75 + (line / 7) * 0.85;
      x = -0.55 + Math.random() * 1.1;
      y = lineY;
    } else {
      // String loop
      const t = Math.random();
      x = Math.sin(t * Math.PI) * 0.22;
      y = 1.0 + t * 0.5;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/** Shape 2: UI/UX Storefront Window */
function generateStorefrontUI(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = i / PARTICLE_COUNT;
    let x: number;
    let y: number;
    const z = (Math.random() - 0.5) * 0.1;

    if (p < 0.32) {
      // Window frame
      const edge = (p / 0.32) * 4;
      if (edge < 1) {
        x = -1.2 + (edge % 1) * 2.4;
        y = 1.1;
      } else if (edge < 2) {
        x = 1.2;
        y = 1.1 - (edge % 1) * 2.2;
      } else if (edge < 3) {
        x = 1.2 - (edge % 1) * 2.4;
        y = -1.1;
      } else {
        x = -1.2;
        y = -1.1 + (edge % 1) * 2.2;
      }
    } else if (p < 0.44) {
      // Header divider line & 3 dots
      if (Math.random() > 0.35) {
        x = -1.2 + Math.random() * 2.4;
        y = 0.82;
      } else {
        const dot = Math.floor(Math.random() * 3);
        const angle = Math.random() * Math.PI * 2;
        x = -0.95 + dot * 0.18 + Math.cos(angle) * 0.05;
        y = 0.96 + Math.sin(angle) * 0.05;
      }
    } else if (p < 0.72) {
      // Hero product banner
      x = -1.0 + Math.random() * 2.0;
      y = 0.05 + Math.random() * 0.65;
    } else {
      // 3 product cards
      const col = Math.floor(Math.random() * 3);
      const minX = -1.0 + col * 0.72;
      x = minX + Math.random() * 0.56;
      y = -0.95 + Math.random() * 0.75;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

type ParticleStroke = { weight: number; sample: () => [number, number] };

function strokeLine(x1: number, y1: number, x2: number, y2: number, weight: number): ParticleStroke {
  return { weight, sample: () => {
    const t = Math.random();
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  } };
}

function strokeCircle(x: number, y: number, radius: number, weight: number, start = 0, end = Math.PI * 2): ParticleStroke {
  return { weight, sample: () => {
    const angle = start + Math.random() * (end - start);
    return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius];
  } };
}

function strokePath(vertices: [number, number][], weight: number): ParticleStroke[] {
  const lengths = vertices.slice(1).map((point, i) => Math.hypot(point[0] - vertices[i][0], point[1] - vertices[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return lengths.map((length, i) => strokeLine(...vertices[i], ...vertices[i + 1], weight * length / total));
}

function sampleStrokes(strokes: ParticleStroke[]): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const total = strokes.reduce((sum, stroke) => sum + stroke.weight, 0);
  let index = 0;
  strokes.forEach((stroke, strokeIndex) => {
    const count = strokeIndex === strokes.length - 1 ? PARTICLE_COUNT - index : Math.floor(PARTICLE_COUNT * stroke.weight / total);
    for (let i = 0; i < count; i++, index++) {
      const [x, y] = stroke.sample();
      positions[index * 3] = x + (Math.random() - 0.5) * 0.018;
      positions[index * 3 + 1] = y + (Math.random() - 0.5) * 0.018;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 0.14;
    }
  });
  return positions;
}

/** Ecommerce CRO: shopping cart with a rising sales/conversion trajectory. */
function generateCROFunnel(): Float32Array {
  return sampleStrokes([
    // A continuous, recognizable cart silhouette and two distinct wheels.
    ...strokePath([[-1.12, 0.52], [-0.86, 0.52], [-0.59, -0.66], [0.82, -0.66]], 22),
    ...strokePath([[-0.79, 0.18], [1.02, 0.18], [0.82, -0.43], [-0.65, -0.43]], 27),
    strokeCircle(-0.42, -0.89, 0.14, 9),
    strokeCircle(0.66, -0.89, 0.14, 9),
    // Growing completed purchases, kept above the basket for legibility.
    ...strokePath([[-0.46, 0.46], [-0.05, 0.76], [0.27, 0.56], [0.91, 1.13]], 23),
    ...strokePath([[0.5, 1.13], [0.91, 1.13], [0.91, 0.72]], 10),
  ]);
}

/** Shopify SEO + performance: product bag, search lens, and a lightning bolt. */
function generateStoreSEO(): Float32Array {
  return sampleStrokes([
    // Shopping bag behind the search lens. The interrupted right edge keeps
    // the overlap clean rather than drawing through the magnifying glass.
    ...strokePath([[0.07, 0.19], [0.03, 0.56], [-0.8, 0.56], [-0.92, -0.85], [0.13, -0.85]], 32),
    strokeCircle(-0.39, 0.56, 0.24, 10, 0, Math.PI),
    strokeCircle(0.38, -0.3, 0.48, 27),
    ...strokePath([[0.72, -0.64], [1.13, -1.05]], 10),
    // A distinct bolt signals storefront loading speed beside product search.
    ...strokePath([[0.83, 1.08], [0.4, 0.52], [0.72, 0.52], [0.57, 0.08], [1.14, 0.74], [0.83, 0.74], [0.83, 1.08]], 21),
  ]);
}

/** Automation: an email trigger branching into two connected workflow nodes. */
function generateMarketingAutomation(): Float32Array {
  return sampleStrokes([
    ...strokePath([[-0.58, 0.35], [-0.58, 1], [0.58, 1], [0.58, 0.35], [-0.58, 0.35]], 34),
    ...strokePath([[-0.58, 1], [0, 0.57], [0.58, 1]], 14),
    ...strokePath([[0, 0.35], [0, 0.02], [-0.72, 0.02], [-0.72, -0.48]], 12),
    ...strokePath([[0, 0.02], [0.72, 0.02], [0.72, -0.48]], 10),
    ...strokePath([[-1.02, -0.48], [-0.42, -0.48], [-0.42, -0.96], [-1.02, -0.96], [-1.02, -0.48]], 12),
    ...strokePath([[0.42, -0.48], [1.02, -0.48], [1.02, -0.96], [0.42, -0.96], [0.42, -0.48]], 12),
    ...strokePath([[-0.88, -0.71], [-0.76, -0.82], [-0.57, -0.62]], 3),
    ...strokePath([[0.55, -0.71], [0.67, -0.82], [0.86, -0.62]], 3),
  ]);
}

interface CraftParticleSceneProps {
  activeStep: number; // 0 to 5
}

export const CraftParticleScene: React.FC<CraftParticleSceneProps> = ({ activeStep }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(activeStep);
  useEffect(() => { activeStepRef.current = activeStep; }, [activeStep]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const shapes = [
      generateShoppingBag(),
      generateProductTag(),
      generateStorefrontUI(),
      generateCROFunnel(),
      generateStoreSEO(),
      generateMarketingAutomation(),
    ];

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.9);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(renderer.domElement);
    const geometry = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(shapes[activeStepRef.current] ?? shapes[0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    // Each dot retains its own displacement across pointer movement AND morphs.
    const offsets = new Float32Array(PARTICLE_COUNT * 3);
    const mouse = { x: 0, y: 0, clientX: -1, clientY: -1, active: false };
    const localPointer = new THREE.Vector3();
    const inverseRotation = new THREE.Quaternion();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePointerMove = (event: PointerEvent) => {
      mouse.clientX = event.clientX;
      mouse.clientY = event.clientY;
      mouse.active = event.pointerType !== 'touch';
    };
    const handlePointerLeave = () => { mouse.active = false; };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      // Keep dot sizes consistent with the visual stage as the canvas scales.
      const visualHeight = container.parentElement?.clientHeight || h;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(15)) * h / visualHeight));
      material.size = 0.012 * visualHeight / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { rootMargin: '12% 0px' });
    visibilityObserver.observe(container);
    let frame = 0;
    let previousTime = performance.now();
    let elapsed = 0;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      if (!visible || document.hidden) return;
      elapsed += dt;
      const reduced = motionQuery.matches;
      const rect = container.getBoundingClientRect();
      const overCanvas = mouse.active && mouse.clientX >= rect.left && mouse.clientX <= rect.right
        && mouse.clientY >= rect.top && mouse.clientY <= rect.bottom;
      mouse.x = overCanvas ? (mouse.clientX - rect.left) / rect.width * 2 - 1 : 0;
      mouse.y = overCanvas ? 1 - (mouse.clientY - rect.top) / rect.height * 2 : 0;
      const rotationEase = 1 - Math.pow(0.96, dt * 60);
      points.rotation.y += ((reduced ? 0 : 0.45 * Math.sin(elapsed * 0.3)) - points.rotation.y) * rotationEase;
      points.rotation.x += ((reduced ? 0 : mouse.y * 0.2) - points.rotation.x) * (1 - Math.pow(0.95, dt * 60));
      points.scale.setScalar(0.6 * (reduced ? 1 : 1 + Math.sin(elapsed * 1.2) * 0.03));
      // Project using the actual canvas aspect/zoom, then undo the object's
      // rotation and scale. The force stays under the crosshair at every angle.
      const halfHeight = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      inverseRotation.setFromEuler(points.rotation).invert();
      localPointer.set(mouse.x * halfHeight * camera.aspect, mouse.y * halfHeight, 0)
        .applyQuaternion(inverseRotation).divideScalar(points.scale.x);
      const target = shapes[activeStepRef.current] ?? shapes[0];
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const follow = reduced ? 1 : Math.min(1, (1 - Math.pow(0.001, dt)) * 0.9);
      const damping = Math.pow(0.88, dt * 60);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        offsets[idx] *= damping;
        offsets[idx + 1] *= damping;
        offsets[idx + 2] *= damping;
        if (overCanvas && !reduced) {
          const dx = positions[idx] - localPointer.x;
          const dy = positions[idx + 1] - localPointer.y;
          const dz = positions[idx + 2] - localPointer.z;
          const distance = Math.hypot(dx, dy, dz);
          if (distance < 0.55) {
            // Resolve even a dot directly under the crosshair independently.
            const angle = i * 2.399963;
            const force = (1 - distance / 0.55) * 0.09 * dt * 60;
            offsets[idx] += (distance > 0.0001 ? dx / distance : Math.cos(angle)) * force;
            offsets[idx + 1] += (distance > 0.0001 ? dy / distance : Math.sin(angle)) * force;
            offsets[idx + 2] += (distance > 0.0001 ? dz / distance : 0) * force;
          }
        }
        // Retarget from the live position: reversing scroll never resets a
        // tween or snaps dots back to an old shape mid-transition.
        for (let axis = 0; axis < 3; axis++) {
          positions[idx + axis] += (target[idx + axis] + offsets[idx + axis] - positions[idx + axis]) * follow;
        }
      }
      posAttr.needsUpdate = true;
      points.frustumCulled = false;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      cancelAnimationFrame(frame);
      renderer.domElement.remove();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="craft-particle-scene"
      aria-hidden="true"
    />
  );
};
