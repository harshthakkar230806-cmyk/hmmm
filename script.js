// ==========================================
// CUSTOM INTERACTIVE CYBER CURSOR
// ==========================================
const cursorGlow = document.querySelector('.cursor-glow');
const cursorPoint = document.querySelector('.cursor-point');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorPoint.style.left = `${mouseX}px`;
    cursorPoint.style.top = `${mouseY}px`;
});

// Interactive hover scale on links and buttons
const interactiveElements = document.querySelectorAll('a, button, .cyber-card');
interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '70px';
        cursorGlow.style.height = '70px';
        cursorGlow.style.borderColor = 'rgba(255, 0, 127, 0.9)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 127, 0.5) 0%, rgba(181, 55, 242, 0.2) 60%, transparent 80%)';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '45px';
        cursorGlow.style.height = '45px';
        cursorGlow.style.borderColor = 'rgba(255, 0, 127, 0.4)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 127, 0.3) 0%, rgba(181, 55, 242, 0.1) 60%, transparent 80%)';
    });
});

// ==========================================
// THREE.JS IMMERSIVE NEON UNIVERSE
// ==========================================
let scene, camera, renderer;
let particleSystem, torusRings = [];
let targetCameraZ = 6;
let currentScroll = 0;

function initThree() {
    const canvas = document.getElementById('bg-canvas');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. NEON PARTICLE VORTEX
    const particlesCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const pinkColor = new THREE.Color('#ff007f');
    const purpleColor = new THREE.Color('#9d00ff');
    const darkPurple = new THREE.Color('#3b0764');

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Spiral cylinder distribution
        const radius = 3 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 40;

        positions[i3] = Math.cos(theta) * radius;
        positions[i3 + 1] = Math.sin(theta) * radius;
        positions[i3 + 2] = z;

        // Alternate color mix
        const mixedColor = Math.random() > 0.5 ? pinkColor : (Math.random() > 0.5 ? purpleColor : darkPurple);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 2. REVOLVING TORUS RINGS (PORTAL GATES)
    const ringColors = [0xff007f, 0xb537f2, 0x8000ff];
    for (let i = 0; i < 4; i++) {
        const ringGeo = new THREE.TorusGeometry(3.5 + i * 1.2, 0.015, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: ringColors[i % ringColors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = -5 - (i * 6);
        scene.add(ring);
        torusRings.push(ring);
    }

    // 3. FLOATING GEOMETRIC ARTIFACT
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0xff007f,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(3, 1, -1);
    scene.add(icoMesh);
    torusRings.push(icoMesh);

    // Resize listener
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render loop with lerping and rotation
function animate() {
    requestAnimationFrame(animate);

    // Smooth Cursor Glow Interpolation
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    // Rotate particles
    if (particleSystem) {
        particleSystem.rotation.z += 0.001;
        particleSystem.rotation.y += 0.0005;
    }

    // Rotate Torus Gates
    torusRings.forEach((ring, idx) => {
        ring.rotation.x += 0.003 * (idx % 2 === 0 ? 1 : -1);
        ring.rotation.y += 0.004 * (idx % 2 === 0 ? -1 : 1);
    });

    // Mouse influence on camera parallax
    const targetCamX = (mouseX / window.innerWidth - 0.5) * 1.5;
    const targetCamY = -(mouseY / window.innerHeight - 0.5) * 1.5;
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;

    // Scroll depth mapping
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = window.scrollY / (scrollMax || 1);

    // Zoom deeper into the matrix as user scrolls
    const targetZ = 6 - (scrollPercent * 16);
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    renderer.render(scene, camera);
}

// Scroll Reveals for content
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    animate();

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(40px)';
        sec.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(sec);
    });
});
