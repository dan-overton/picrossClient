import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import reducer from './reducers'
import apiMiddleware from './middleware/api';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter, Route} from 'react-router-dom';

const store = createStore(reducer, applyMiddleware(apiMiddleware))

ReactDOM.render(
    <Provider store={store} >
        <BrowserRouter>
            <Route exact path="*" component={App}/>
        </BrowserRouter>
    </Provider>, 
document.getElementById('root'));
registerServiceWorker();
