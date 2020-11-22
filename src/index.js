import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connectToServer } from './server-api';
import { Tweet } from './components/tweet';

// Wait for the DOM to be completely loaded before
// trying to manipulate it.
document.addEventListener('DOMContentLoaded', async (event) => {
    const client = await connectToServer();
    
    ReactDOM.render(<React.Fragment>
        <App client={client}/>
    </React.Fragment>, document.getElementById("wrapper-main"));
});