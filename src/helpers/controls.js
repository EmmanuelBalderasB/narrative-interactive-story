import * as THREE from 'three'

export default class Controls {
    constructor(camera, domElement, clock, meshModel) {
        this.camera = camera;
        this.domElement = domElement;
        this.meshModel = meshModel;
        
        // Simplified velocity system
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.damping = 0.95;
        this.moveSpeed = 0.5;
        
        // Rotation
        this.pitch = 0;
        this.roll = 0; 
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            pitchUp: false,
            pitchDown: false,
            rollLeft: false,
            rollRight: false,
        }
        
        this.clock = clock;

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.keys.forward = true;
                    break;
                case 's':
                    this.keys.backward = true;
                    break;
                case 'a':
                    this.keys.left = true;
                    break;
                case 'd':
                    this.keys.right = true;
                    break;
                case 'ArrowLeft':
                    this.keys.rollLeft = true;
                    break;
                case 'ArrowRight':
                    this.keys.rollRight = true;
                    break;
                case 'ArrowUp':
                    this.keys.pitchUp = true;
                    break;
                case 'ArrowDown':
                    this.keys.pitchDown = true;
                    break;        
            }
        })
        
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                    this.keys.forward = false;
                    break;
                case 's':
                    this.keys.backward = false;
                    break;
                case 'a':
                    this.keys.left = false;
                    break;
                case 'd':
                    this.keys.right = false;
                    break;
                case 'ArrowLeft':
                    this.keys.rollLeft = false;
                    break;
                case 'ArrowRight':
                    this.keys.rollRight = false;
                    break;
                case 'ArrowUp':
                    this.keys.pitchUp = false;
                    break;
                case 'ArrowDown':
                    this.keys.pitchDown = false;
                    break;
            }
        })
    }

    update(delta) {
        this.updateRotation();
        this.updatePosition();
        
        // Less frequent logging for better performance
        if (Math.random() < 0.01) {
            console.log('Camera position:', {
                x: this.camera.position.x.toFixed(2), 
                y: this.camera.position.y.toFixed(2), 
                z: this.camera.position.z.toFixed(2)
            });
        }
    }

    updatePosition() {
        // Get camera's local coordinate system
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0); // World up
        
        // Get the camera's forward direction
        this.camera.getWorldDirection(forward);
        
        // Calculate right vector (cross product of forward and world up)
        right.crossVectors(forward, up).normalize();
        
        // Recalculate up vector to be perpendicular to both forward and right
        up.crossVectors(right, forward).normalize();
        
        // Apply thrust based on key presses
        const thrust = new THREE.Vector3(0, 0, 0);
        
        if (this.keys.forward) {
            thrust.add(forward.clone().multiplyScalar(this.moveSpeed));
        }
        if (this.keys.backward) {
            thrust.add(forward.clone().multiplyScalar(-this.moveSpeed));
        }
        if (this.keys.left) {
            thrust.add(right.clone().multiplyScalar(-this.moveSpeed));
        }
        if (this.keys.right) {
            thrust.add(right.clone().multiplyScalar(this.moveSpeed));
        }
        if (this.keys.up) {
            thrust.add(up.clone().multiplyScalar(this.moveSpeed));
        }
        if (this.keys.down) {
            thrust.add(up.clone().multiplyScalar(-this.moveSpeed));
        }
        
        // Add thrust to velocity
        this.velocity.add(thrust);
        
        // Apply damping
        this.velocity.multiplyScalar(this.damping);
        
        // Move camera
        this.camera.position.add(this.velocity);
    }

    updateRotation() {
        const rotationSpeed = 0.02;
        
        // Pitch (nose up/down)
        if (this.keys.pitchUp) {
            this.pitch -= rotationSpeed;
        }
        if (this.keys.pitchDown) {
            this.pitch += rotationSpeed;
        }
        
        // Roll (bank left/right)
        if (this.keys.rollLeft) {
            this.roll -= rotationSpeed;
        }
        if (this.keys.rollRight) {
            this.roll += rotationSpeed;
        }
        
        // Apply rotations to camera
        this.camera.rotation.x = this.pitch;
        this.camera.rotation.z = this.roll;
    }
}