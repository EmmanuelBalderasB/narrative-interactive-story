import { fadeToBlack } from '../helpers/fade.js'
import { fadeToNormal } from '../helpers/fade.js'
import { isBlack } from '../main.js'
export class StageManager {
    constructor() {
        this.stages = {};
        this.activeStage = null;
        this.totalStages = 0;
    }
    addStage(stage) {
        const name = stage.name;
        this.stages[name] = stage;
        this.totalStages++;
    }
    activateStage(stageName) {
        this.stages[stageName].activate();
        this.activeStage = stageName;
        fadeToNormal(document.querySelector('canvas'), isBlack);
    }
    deactivateStage(stageName) {
        this.stages[stageName].deactivate();
        this.activeStage = null;
        fadeToBlack(document.querySelector('canvas'), isBlack);
    }
    update(deltaTime) {
        if(this.activeStage) {
            this.stages[this.activeStage].update(deltaTime);
        }
    }
    getActiveStage() {
        return this.stages[this.activeStage];
    }
    nextStage() {
        const currentIndex = this.activeStage
        const nextIndex = (this.activeStage + 1) % this.totalStages;
        if (currentIndex === this.totalStages - 1) {
            this.stages[nextIndex].finalStage();
        }
        this.deactivateStage(this.stages[currentIndex].name);
        this.activateStage(this.stages[nextIndex].name);
    }
    previousStage() {
        const currentIndex = this.activeStage
        const prevIndex = (this.activeStage - 1 + this.totalStages) % this.totalStages;
        this.deactivateStage(this.stages[currentIndex].name);
        this.activateStage(this.stages[prevIndex].name);
    }
}
