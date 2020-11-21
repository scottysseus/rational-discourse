export function MockClient() {

    let syncBuffer = [];

    return {
        /**
         * @param {string} tweet
         */
        sendTweet(tweet) {
            socket.to(...).emit('tweet', socket.id, tweet);
        },
        
        /**
         * @param {function} callback
         */
        onTweet(callback) {
            socket.on('tweet', callback);
        }
    };
}