if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight,
  r = 450,
  mouseY = 0,
  windowHalfY = window.innerHeight / 2,
  camera,
  scene,
  renderer;
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera(
    80,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    1,
    3000
  );
  camera.position.z = 1000;
  scene = new THREE.Scene();
  var i,
    line,
    material,
    p,
    parameters = [
      [0.25, 0xff7700, 1],
      [0.5, 0xff9900, 1],
      [0.75, 0xffaa00, 0.75],
      [1, 0xffaa00, 0.5],
      [1.25, 0x000833, 0.8],
      [3.0, 0xaaaaaa, 0.75],
      [3.5, 0xffffff, 0.5],
      [4.5, 0xffffff, 0.25],
      [5.5, 0xffffff, 0.125]
    ];
  var geometry = createGeometry();
  for (i = 0; i < parameters.length; ++i) {
    p = parameters[i];
    material = new THREE.LineBasicMaterial({ color: p[1], opacity: p[2] });
    line = new THREE.LineSegments(geometry, material);
    line.scale.x = line.scale.y = line.scale.z = p[0];
    line.userData.originalScale = p[0];
    line.rotation.y = Math.random() * Math.PI;
    line.updateMatrix();
    scene.add(line);
  }
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  //
  window.addEventListener('resize', onWindowResize, false);
  // test geometry swapability
  setInterval(function() {
    var geometry = createGeometry();
    scene.traverse(function(object) {
      if (object.isLine) {
        object.geometry.dispose();
        object.geometry = geometry;
      }
    });
  }, 1000);
}
function createGeometry() {
  var geometry = new THREE.BufferGeometry();
  var vertices = [];
  var vertex = new THREE.Vector3();
  for (var i = 0; i < 1500; i++) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.normalize();
    vertex.multiplyScalar(r);
    vertices.push(vertex.x, vertex.y, vertex.z);
    vertex.multiplyScalar(Math.random() * 0.09 + 1);
    vertices.push(vertex.x, vertex.y, vertex.z);
  }
  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return geometry;
}
function onWindowResize() {
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
  mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
//
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  var time = Date.now() * 0.0001;
  for (var i = 0; i < scene.children.length; i++) {
    var object = scene.children[i];
    if (object.isLine) {
      object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
      if (i < 5) {
        var scale =
          object.userData.originalScale *
          (i / 5 + 1) *
          (1 + 0.5 * Math.sin(7 * time));
        object.scale.x = object.scale.y = object.scale.z = scale;
      }
    }
  }
}
