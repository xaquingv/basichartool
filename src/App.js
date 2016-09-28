import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
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

const App = () => (
  <div>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Navigation
            list={navList}
        />
    </div>
);

export default App;
