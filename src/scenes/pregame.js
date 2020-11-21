import { BaseScene } from "./scene";

Vue.component('scene-pregame', {
    template: `
    <div id="scene-pregame">
        <h1>Lobby $lobby ID</h1>
        <p>Copy the room link:</p>
        <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
    </div>
    `
});

export function PregameScene() {
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