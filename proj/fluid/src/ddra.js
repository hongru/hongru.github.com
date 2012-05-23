/**
 * Double Density Relaxation Algorithm
 * Particles Fluid Simulation
 */

/**
 * namespace
 */
var ddra = {};

ddra.$version = 0.1;

ddra.config = {
    gridResolution: 20,
    particleRadius: 20, //should <= gridResolution
    gravity: 0.1 // number or vector2
}

