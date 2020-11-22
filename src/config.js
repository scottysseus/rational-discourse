export const config = {
  serverUrl: process.env.NODE_ENV === 'production' ?
    'https://rational-discourse.herokuapp.com' :
    'http://localhost:3001'
};