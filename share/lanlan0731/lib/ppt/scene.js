(function() {
  var container;
  var renderer, particle;
  var mouseX = 0, mouseY = 0;

  // var stats = new Stats();
  // stats.domElement.id = 'stats';
  // document.getElementById('info').insertBefore( stats.domElement, document.getElementById('togglefft') );

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  
  // Expose these for the demo
  window.rotateSpeed = 1;
  window.scene = new THREE.Scene();
  window.group = new THREE.Object3D();
  window.camera;

  window.PLAY_3D = true;
  window.__stop3D = function () {
      PLAY_3D = false;
      container.style.display = 'none';
  }
  window.__start3D = function () {
    if (PLAY_3D) return;
    PLAY_3D = true;

    container.style.display = 'block';
    container.style.opacity = 0;
    container.style.webkitTransitionDuration = '0.5s';
    animate();

    setTimeout(function () {
        container.style.opacity = 0.5;
    }, 400);
    
  }

  init();
  animate();

  function init() {
    container = document.createElement( 'div' );
    container.style.position = 'absolute';
    container.style.left = 0;
    container.style.top = 0;
    container.style.opacity = 0.5;
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 1000;

    scene.add( camera );
    scene.add( group );

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouch, false );
    document.addEventListener( 'touchmove', onDocumentTouch, false );
  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }

  function onDocumentTouch( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
  }

  function animate() {
    if (!window.PLAY_3D) return;
    requestAnimationFrame( animate );
    render();
    //stats.update();
  }

  var t = 0;
  function render() {
    camera.position.x = Math.sin(t * 0.005 * rotateSpeed) * 1000;
    camera.position.z = Math.cos(t * 0.005 * rotateSpeed) * 1000;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
    camera.lookAt( scene.position );
    t++;
    renderer.render( scene, camera );
  }
})();
