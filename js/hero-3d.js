// Enhanced 3D Background with Three.js
if (typeof THREE !== 'undefined') {
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 15;
        
        // Color variations (red shades)
        colorArray[i] = 0.77 + Math.random() * 0.23;     // R
        colorArray[i + 1] = 0.12 + Math.random() * 0.1;  // G
        colorArray[i + 2] = 0.23 + Math.random() * 0.1;  // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create multiple geometric shapes
    const geometries = [
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.TetrahedronGeometry(0.5, 0)
    ];
    
    const meshes = [];
    
    geometries.forEach((geo, index) => {
        const material = new THREE.MeshBasicMaterial({
            color: index === 0 ? 0xc41e3a : index === 1 ? 0xff0055 : 0xff6b9d,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );
        meshes.push(mesh);
        scene.add(mesh);
    });
    
    camera.position.z = 5;
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2;
        
        // Animate meshes
        meshes.forEach((mesh, index) => {
            mesh.rotation.x = elapsedTime * (0.3 + index * 0.1);
            mesh.rotation.y = elapsedTime * (0.2 + index * 0.15);
            mesh.position.y = Math.sin(elapsedTime + index) * 0.3;
        });
        
        // Smooth camera follow
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
