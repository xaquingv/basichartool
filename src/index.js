import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore/*, applyMiddleware*/} from 'redux'
//import logger from "redux-logger"
import './index.css'
//import '../bower_components/guss-typography/_typography.scss'
import reducers from './reducers'
import App from './App'


//const middleware = applyMiddleware(logger())
const store = createStore(reducers/*, middleware*/)

render (
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
