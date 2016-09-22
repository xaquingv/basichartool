import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import './index.css';
import './App.css';
import Navigation from './components/Navigation';
import navigation from './reducers';
import {changeStep} from './actions';
import Section1 from './components/Section1Input';
import Section2 from './components/Section2Table';
import Section3 from './components/Section3Chart';
import Section4 from './components/Section4Panel';
import Section5 from './components/Section5Embed';

const navList = [
    "1. Import", 
    "2. Toggle", 
    "3. Select", 
    "4. Edit", 
    "5. Download"
];

const store = createStore(navigation);

const render = () => ReactDOM.render(
    <div>
        <Navigation 
            list={navList}
            stepChange={(step) => store.dispatch(changeStep(step))}
        />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
    </div>,
    document.getElementById('root')
);

render();
store.subscribe(render);
