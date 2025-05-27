import * as THREE from 'three'

export default class Controls {
    constructor(camera, domElement, clock) {
        this.camera = camera;
        this.domElement = domElement;
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.speed = new THREE.Vector3(0, 0, 0);
        this.damping = 0.995;
        this.accelerationScale = 1.01;
        this.slowThreshold = 0.001;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
        }
        this.maxSpeed = 0.05;
        this.minSpeed = 0;
        this.clock = clock;

        window.addEventListener('keydown', (event) => {
            if (event.key === 'w') {
                this.keys.forward = true;
            }
            if (event.key === 's') {
                this.keys.backward = true;
            }
            if (event.key === 'a') {
                this.keys.left = true;
            }
            if (event.key === 'd') {
                this.keys.right = true;
            }
        })
        window.addEventListener('keyup', (event) => {
            if (event.key === 'w') {
                this.keys.forward = false;
            }
            if (event.key === 's') {
                this.keys.backward = false;
            }
            if (event.key === 'a') {
                this.keys.left = false;
            }
            if (event.key === 'd') {
                this.keys.right = false;
            }
        })
    }

    update() {
        this.updatePosition()
    }

    updatePosition(delta) {
        const baseAcceleration = 0.001; // Small starting acceleration
        
        // Get camera's forward, right, and up vectors
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        
        this.camera.getWorldDirection(forward);
        right.crossVectors(forward, this.camera.up).normalize();
        up.crossVectors(right, forward).normalize();
        
        // Forward/Backward movement (along camera's facing direction)
        if (this.keys.forward) {
            // Reset acceleration if changing from backward to forward
            if (this.speed.z < 0) {
                this.acceleration.z = 0;
                this.speed.z = 0;
            }
            if (this.acceleration.z === 0) this.acceleration.z = baseAcceleration;
            this.acceleration.z *= this.accelerationScale;
            this.speed.z = Math.min(this.speed.z + this.acceleration.z, this.maxSpeed);
            
            // Move along camera's forward direction
            const moveVector = forward.clone().multiplyScalar(this.speed.z);
            this.camera.position.add(moveVector);
        } else if (this.speed.z > 0) {
            // Damping when not pressing forward
            this.speed.z *= this.damping;
            if (this.speed.z < this.slowThreshold) {
                this.speed.z = 0;
                this.acceleration.z = 0;
            } else {
                const moveVector = forward.clone().multiplyScalar(this.speed.z);
                this.camera.position.add(moveVector);
            }
        }
        
        if (this.keys.backward) {
            // Reset acceleration if changing from forward to backward
            if (this.speed.z > 0) {
                this.acceleration.z = 0;
                this.speed.z = 0;
            }
            if (this.acceleration.z === 0) this.acceleration.z = -baseAcceleration;
            this.acceleration.z *= this.accelerationScale;
            this.speed.z = Math.max(this.speed.z + this.acceleration.z, -this.maxSpeed);
            
            // Move along camera's forward direction (negative)
            const moveVector = forward.clone().multiplyScalar(this.speed.z);
            this.camera.position.add(moveVector);
        } else if (this.speed.z < 0) {
            // Damping when not pressing backward
            this.speed.z *= this.damping;
            if (Math.abs(this.speed.z) < this.slowThreshold) {
                this.speed.z = 0;
                this.acceleration.z = 0;
            } else {
                const moveVector = forward.clone().multiplyScalar(this.speed.z);
                this.camera.position.add(moveVector);
            }
        }
        
        // Left/Right movement (along camera's right vector)
        if (this.keys.left) {
            // Reset acceleration if changing from right to left
            if (this.speed.x < 0) {
                this.acceleration.x = 0;
                this.speed.x = 0;
            }
            if (this.acceleration.x === 0) this.acceleration.x = baseAcceleration;
            this.acceleration.x *= this.accelerationScale;
            this.speed.x = Math.min(this.speed.x + this.acceleration.x, this.maxSpeed);
            
            // Move along camera's right direction (negative for left)
            const moveVector = right.clone().multiplyScalar(-this.speed.x);
            this.camera.position.add(moveVector);
        } else if (this.speed.x > 0) {
            this.speed.x *= this.damping;
            if (this.speed.x < this.slowThreshold) {
                this.speed.x = 0;
                this.acceleration.x = 0;
            } else {
                const moveVector = right.clone().multiplyScalar(-this.speed.x);
                this.camera.position.add(moveVector);
            }
        }
        
        if (this.keys.right) {
            // Reset acceleration if changing from left to right
            if (this.speed.x > 0) {
                this.acceleration.x = 0;
                this.speed.x = 0;
            }
            if (this.acceleration.x === 0) this.acceleration.x = -baseAcceleration;
            this.acceleration.x *= this.accelerationScale;
            this.speed.x = Math.max(this.speed.x + this.acceleration.x, -this.maxSpeed);
            
            // Move along camera's right direction
            const moveVector = right.clone().multiplyScalar(-this.speed.x);
            this.camera.position.add(moveVector);
        } else if (this.speed.x < 0) {
            this.speed.x *= this.damping;
            if (Math.abs(this.speed.x) < this.slowThreshold) {
                this.speed.x = 0;
                this.acceleration.x = 0;
            } else {
                const moveVector = right.clone().multiplyScalar(-this.speed.x);
                this.camera.position.add(moveVector);
            }
        }
        
        // Up/Down movement (along camera's up vector)
        if (this.keys.up) {
            // Reset acceleration if changing from down to up
            if (this.speed.y < 0) {
                this.acceleration.y = 0;
                this.speed.y = 0;
            }
            if (this.acceleration.y === 0) this.acceleration.y = baseAcceleration;
            this.acceleration.y *= this.accelerationScale;
            this.speed.y = Math.min(this.speed.y + this.acceleration.y, this.maxSpeed);
            
            // Move along camera's up direction
            const moveVector = up.clone().multiplyScalar(this.speed.y);
            this.camera.position.add(moveVector);
        } else if (this.speed.y > 0) {
            this.speed.y *= this.damping;
            if (this.speed.y < this.slowThreshold) {
                this.speed.y = 0;
                this.acceleration.y = 0;
            } else {
                const moveVector = up.clone().multiplyScalar(this.speed.y);
                this.camera.position.add(moveVector);
            }
        }
        
        if (this.keys.down) {
            // Reset acceleration if changing from up to down
            if (this.speed.y > 0) {
                this.acceleration.y = 0;
                this.speed.y = 0;
            }
            if (this.acceleration.y === 0) this.acceleration.y = -baseAcceleration;
            this.acceleration.y *= this.accelerationScale;
            this.speed.y = Math.max(this.speed.y + this.acceleration.y, -this.maxSpeed);
            
            // Move along camera's up direction (negative)
            const moveVector = up.clone().multiplyScalar(this.speed.y);
            this.camera.position.add(moveVector);
        } else if (this.speed.y < 0) {
            this.speed.y *= this.damping;
            if (Math.abs(this.speed.y) < this.slowThreshold) {
                this.speed.y = 0;
                this.acceleration.y = 0;
            } else {
                const moveVector = up.clone().multiplyScalar(this.speed.y);
                this.camera.position.add(moveVector);
            }
        }
    }
}