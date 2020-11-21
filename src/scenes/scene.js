// base class for a scene
export function BaseScene() {
    return {

        // called the first time the scene is loaded
        load: (sceneManager) => {
            throw "not implemented";
        },

        // called before the scene is entered
        onEnter: (sceneManager) => {
            throw "not implemented";
        },
    
        // called before the scene is left
        onLeave: (sceneManager, args) => {
            throw "not implemented"
        }    
    }
}

// scene manager
export function SceneManager(sceneMap) {
    return {
        switchScene: (from, to, args) => {
            sceneMap[from].onLeave(this);
            sceneMap[to].onEnter(this, args);
        }
    }
}