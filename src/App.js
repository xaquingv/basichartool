import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Section1 from './components/Section1Input';
import Section2 from './components/Section2Discovery';
import Section3 from './components/Section3Edit';


const App = () => (
  <div>
    <Section1 />
    <Section2 />
    <Section3 />
    <Navigation />
  </div>
);

export default App;
