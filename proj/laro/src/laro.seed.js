/**
 * laro seed for module loader
 */
(function () {
    var scriptList = document.getElementsByTagName('head')[0].getElementsByTagName('script');
    var lastScriptNode = scriptList[scriptList.length - 1];
   
    var base = lastScriptNode.getAttribute('baseUrl') || '../';
    
    Laro.module.register('class', base + 'src/base/class.js')
        .register('exception', base + 'src/base/exception.js')
        .register('util', base + 'src/geometry/util.js')
        .register('perlin', base + 'src/geometry/perlin.js')
		.register('sound', base + 'src/sound/sound.js').require(['class'])
        
        .register('point2', base + 'src/geometry/point2.js').require(['class', 'exception'])
        .register('vector2', base + 'src/geometry/vector2.js').require(['class', 'exception', 'point2'])
        .register('chaikin', base + 'src/geometry/chaikin.js').require(['point2', 'vector2'])
        .register('pixel32', base + 'src/geometry/pixel32.js').require(['class', 'exception'])
        .register('rectf', base + 'src/geometry/rectf.js').require(['class', 'exception', 'vector2', 'point2'])

        .register('imageW', base + 'src/world/image_wrapper.js').require(['class', 'exception'])
        .register('layer', base + 'src/world/layer.js').require(['rectf'])
        .register('render', base + 'src/world/render.js').require(['class', 'exception', 'pixel32', 'rectf', 'layer', 'imageW'])
        .register('canvasRender', base + 'src/world/canvas_render.js').require(['render'])
        .register('loop', base + 'src/game/game.util.js').require(['class', 'pixel32'])
        
        .register('animation', base + 'src/actions/animation.js').require(['class', 'loop'])
        .register('animationHandle', base + 'src/actions/animation_handle.js').require(['animation'])
        
        .register('resource', base + 'src/game/resource.class.js').require(['class', 'pixel32'])
        .register('state', base + 'src/game/state.js').require(['class', 'pixel32'])
        .register('fsm', base + 'src/game/fsm.js').require(['state'])
        .register('laro', base + 'src/world/world.js').require(['class', 'sound', 'exception', 'util', 'perlin', 'point2', 'vector2', 'chaikin', 'piexel32', 'rectf', 'imageW', 'layer', 'render', 'canvasRender', 'world', 'animation', 'animationHandle', 'resource', 'loop', 'state', 'fsm'])
        
        
        /*Laro.initialize = function (cb) {
            Laro.multiModule(['class', 'exception', 'util', 'perlin', 'point2', 'vector2', 'chaikin', 'piexel32', 'rectf', 'imageW', 'layer', 'render', 'canvasRender', 'world', 'animation', 'animationHandle', 'resource', 'loop', 'state', 'fsm'], function () {
                console.log('Laro initialized :)', Laro);
                cb && cb();
            });
        }*/
})();
