const MainVolume = 0.3;

const Audios = [
    { name: 'ding' },
    { name: 'honk' },
    {
        name: 'letters',
        loop: true,
        loopStartInSeconds: 85995.0/44100.0, // sample and samplerate
        loopEndInSeconds: 2720512.0/44100.0 // famitracker pads with silence
    }
];

export default class MusicPlayer {
    static async load() {
        // for compatibility
        var AudioContext = window.AudioContext // Default
        || window.webkitAudioContext // Safari and old versions of Chrome
        || false;

        if (AudioContext) {
            this.audioEnabled = true;
            this.context = this.context || new AudioContext();
        } else {
            this.audioEnabled = false;
            this.log("audio context not supported; disabling audio");
        }

        // private. a map of AudioBuffers, which represent decoded audio files, keyed by audio name.
        this.audioBuffers = {};
        // private. a map of AudioBufferSourceNodes, which represent playing sounds, keyed by audio name.
        this.bufferSources = {};
        // private. enable logging and access to the class via the `window`.
        this.debug = true;
        // private. determines whether to block new audio from playing.
        this.muted = false;

        await Promise.all(Audios.map((audio) => this.fetchAudioBuffer(audio)))
            .catch(error => {
                this.log(error);
                this.audioEnabled = false;
                this.log("Unable to load audio; disabling audio");
            });
        this.log('Finished loading everything.');

        if (this.debug) {
            window.MusicPlayer = this;
        }
    }

    /**
     * Play the music used during the title screen.
     */
    static playMusicTitle() {
        this.log('No title screen music yet.');
    }

    /**
     * Play the music used during gameplay.
     */
    static playMusicGameplay() {
        this.playAudio('letters');
    }

    /**
     * Play the audio for when the round-starting countdown changes.
     */
    static playSfxCountdown() {
        this.playAudio('honk');
    }

    /**
     * Play the audio for when a tweet is sent.
     */
    static playSfxTweet() {
        this.playAudio('ding');
    }

    /**
     * Stops the music used during the title screen, if any is playing.
     */
    static stopMusicTitle() {
        this.log('No title screen music yet.');
    }

    /**
     * Stops the music used during gameplay, if any is playing.
     */
    static stopMusicGameplay() {
        this.stopAudio('letters');
    }

    /**
     * Mutes all sound effects and music.
     * Blocks new audio from playing until `unmuteAll` is called.
     */
    static muteAll() {
        this.context.close();
        this.context = new AudioContext();
        this.muted = true;
    }

    /**
     * Unblocks new audio from playing.
     * Any sounds that were playing at the time of calling `muteAll` do not resume; you must restart them.
     */
    static unmuteAll() {
        this.muted = false;
    }

    /*
     * PRIVATE METHODS
     */

    /**
     * Fetch an audio file and decode it, creating an AudioBuffer.
     * Does not return anything, but blocks until the audio is loaded.
     * @param {object} audio
     */
    static async fetchAudioBuffer(audio) {
        const { name } = audio;

        this.log(`Loading ${name}`);

        const url = `./assets/audio/${name}.ogg`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

        this.audioBuffers[name] = audioBuffer;
        this.log(`Finished loading ${name}`);
    }

    /**
     * Search through the Audio definitions for an audio by the name of `name`, and return it.
     * If none were found, return null.
     * @param {string} name
     */
    static getAudioByName(name) {
        return Audios.find((audio) => audio.name === name);
    }

    /**
     * Play an audio or segment by name.
     * @param {string} name
     */
    static playAudio(name) {
        if (!this.audioEnabled || !this.context) {
            this.log(`Tried to play audio "${name}", but audio is unsupported`);
            return
        }

        if (this.muted) {
            this.log(`Tried to play audio "${name}", but we are muted.`);
            return;
        }

        const audio = this.getAudioByName(name);
        if (!audio) {
            this.error(`Tried to play audio "${name}", but it was not defined.`);
            return;
        }

        const bufferSource = this.context.createBufferSource();
        const audioBuffer = this.audioBuffers[name];
        if (!audioBuffer) {
            this.error(`Tried to play audio "${name}", but it was not loaded.`);
            this.error(`List of buffers:`);
            this.error(this.audioBuffers);
            return;
        }

        bufferSource.buffer = audioBuffer;
        bufferSource.loop = Boolean(audio.loop);
        bufferSource.loopStart = audio.loopStartInSeconds || 0.0;
        bufferSource.loopEnd = audio.loopEndInSeconds || audioBuffer.duration;

        const gainNode = this.context.createGain();
        gainNode.gain.value = MainVolume;
        bufferSource.connect(gainNode);
        gainNode.connect(this.context.destination);

        this.bufferSources[name] = bufferSource;

        bufferSource.start();
    }

    /**
     * Stop an audio or segment by name.
     * If multiple instances are playing, stop the most recent one.
     * @param {string} name
     */
    static stopAudio(name) {
        const bufferSource = this.bufferSources[name];
        if (!bufferSource) {
            this.error(`Tried to stop audio ${name}, but it was not playing.`);
            this.error(`List of bufferSources:`);
            this.error(this.bufferSources);
            return;
        }

        bufferSource.stop();
    }

    /**
     * Log an item to the console, prefixed with the class name.
     * @param {string|object} item
     */
    static log(item) {
        if (this.debug) {
            if (item.constructor.name === String.name) {
                console.log(`${this.name}: ${item}`);
            } else {
                console.log(`${this.name}`, item);
            }
        }
    }

    /**
     * Log an item to the console as an error.
     * @param {string|object} item
     */
    static error(item) {
        console.error(item);
    }
};
