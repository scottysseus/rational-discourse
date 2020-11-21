import Vue from 'vue';
import { BaseScene } from "./scene";

Vue.component('scene-start', {
    template: `
    <div id="scene-start">
        <h1 class="display-4">Rational Discourse</h1>
        <div id="start-menu" class="container">
            <b-button variant="primary" id="start-button" v-b-modal.party-name-modal>Start a Game</b-button>
            <b-button variant="primary" id="join-button">Join a Game</b-button>
        </div>
        <b-modal centered id="party-name-modal" title="Start a Game">
            <p>Pick a name for your political party</p>
            <b-form-input placeholder="Greenback Labor Party"></b-form-input>
         </b-modal>
    </div>
    `
});

export function StartScene() {
    let startScene = BaseScene();
    startScene.load = (sceneManager) => {
        let startButton = document.getElementById("start-button");
        startButton.onclick = () => {
            console.log("start!!!")
            // sceneManager.switchScene();
        }
    }

    startScene.onLeave = () => {
        let container = document.getElementById("scene-start");
        container.style.display = "none";
    }   

    startScene.onEnter = () => {
        let container = document.getElementById("scene-start");
        container.style.display = "block";
    }

    return startScene;
}