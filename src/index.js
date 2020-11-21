import {SceneManager} from "./scenes/scene";
import {StartScene} from "./scenes/start";
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


// Wait for the DOM to be completely loaded before
// trying to manipulate it.
document.addEventListener('DOMContentLoaded', (event) => {

    

    var app = new Vue({
        el: '#wrapper-main',
        data: {
            tweets: [
                "Purple wave is coming!",
                "Vote Purple!",
                "Purple is Perfect",
                "#Purple4ever",
                "Jobs jobs jobs!",
                "Make Our Country Purple Again!"
            ]
        }
    });

    const startScene = StartScene();

    const sceneManager = SceneManager({
        "start": startScene
    });

    startScene.load(sceneManager);


});