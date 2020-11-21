export function MockClient() {

    let syncBuffer = [];

    return {
        /**
         * @param {string} tweet
         */
        sendTweet(tweet) {
            syncBuffer.push(tweet);
        },

        /**
         * @param {function} callback
         */
        onTweet(callback) {
            socket.on('tweet', callback);
        }
    };
}