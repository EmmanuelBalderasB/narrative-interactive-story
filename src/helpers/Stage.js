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
        this.textContainer = document.querySelector('.text-container');
        this.i = 0;
        this.textInterval = null; // Add property to store interval ID
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
        this.fillText();
    }
    update(deltaTime) {
        console.log('Updating');
        this.cameraInstance.position.y += Math.sin(this.clock.getElapsedTime() * this.oscillationFrequency) * this.oscillationAmplitude;
    }
    deactivate() {
        this.active = false;
        this.voice.stop();
        this.isAtTarget = false;
        this.i = 0;
        if (this.textInterval) {
            clearInterval(this.textInterval);
            this.textInterval = null;
        }
        this.textContainer.innerHTML = '';
    }
    fillText() {
        if (this.textInterval) {
            clearInterval(this.textInterval);
        }
        this.textInterval = setInterval(() => {
            if (this.i >= this.text.length) {
                clearInterval(this.textInterval);
                this.textInterval = null;
            } else {
                this.textContainer.innerHTML += this.text[this.i];
                this.i++;
            }
        }, 50);
    }
}

export { Stage };