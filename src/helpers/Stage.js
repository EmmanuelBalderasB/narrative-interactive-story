import { gsap } from 'gsap';
const nextButton = document.querySelector('.next-button')
class Stage {
    constructor(voice, cameraInstance, cameraTargetPosition, clock, name, duration, oscillationAmplitude, oscillationFrequency, text, lookAtTarget = null) {
        this.voice = voice;
        this.cameraInstance = cameraInstance;
        this.cameraTargetPosition = cameraTargetPosition;
        this.active = name === 0 ? true : false;
        this.clock = clock;
        this.isAtTarget = false;
        this.oscillationAmplitude = oscillationAmplitude;
        this.name = name;
        this.duration = duration;
        this.oscillationFrequency = oscillationFrequency;
        this.text = text;
        this.lookAtTarget = lookAtTarget || cameraTargetPosition; // Default to target position
    }
    activate() {
        this.active = true;
        gsap.to(this.cameraInstance.position, {
            x: this.cameraTargetPosition.x,
            y: this.cameraTargetPosition.y,
            z: this.cameraTargetPosition.z,
            duration: this.duration,
            ease: 'power2.inOut'
        });
        // Remove gsap.to for lookAt, handle in render loop
        // Set up the onEnded callback before playing
        this.voice.setOnEnded(() => {
            console.log('Voice ended');
            nextButton.style.opacity = 1;
        });
        this.voice.play();
        if (this.cameraInstance.position.distanceTo(this.cameraTargetPosition) < 0.1) {
            this.isAtTarget = true;
        }
    }
    update(deltaTime) {
        console.log('Updating');
        this.cameraInstance.position.y += Math.sin(this.clock.getElapsedTime() * this.oscillationFrequency) * this.oscillationAmplitude;
    }
    deactivate() {
        this.active = false;
        this.voice.stop();
        this.isAtTarget = false;
    }
}

export { Stage };