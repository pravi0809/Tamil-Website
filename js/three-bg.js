/* ===========================================
   IMAGIX CREATION — THREE.JS BACKGROUND
=========================================== */

const canvas = document.createElement("canvas");
canvas.id = "three-bg";
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({canvas,alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.PointLight(0xffffff,1);
light.position.set(50,50,50);
scene.add(light);

const group = new THREE.Group();
scene.add(group);

const colors = [0xe53935,0x2962ff,0x00e676];

for(let i=0;i<40;i++){
  const geo = new THREE.SphereGeometry(1.5,24,24);
  const mat = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random()*colors.length)],
    transparent:true,
    opacity:0.6
  });
  const sphere = new THREE.Mesh(geo,mat);
  sphere.position.set(
    (Math.random()-0.5)*120,
    (Math.random()-0.5)*80,
    (Math.random()-0.5)*100
  );
  group.add(sphere);
}

function animate(){
  group.rotation.y += 0.0015;
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
