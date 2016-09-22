import React from 'react';
import './navigation.css';
import logo from '../assets/logo.svg';
import scrollTo from '../lib/scrollTo';

class Navigation extends React.Component {
    
    render() {
        const {list, stepChange} = this.props;
        
        // TODO: how to init states? 
        // TODO: where should i put this code!?
        let onClickStep = (index) => {
            let step = index + 1; 
            stepChange(step);
            // remove all highlight
            [...document.querySelectorAll(".step")].forEach(el => {
                el.classList.remove("li-focus");
            });
            // highlight
            document.querySelector("#step" + step)
            .classList.add("li-focus");
            // scrollTo
            let to = document.querySelector("#section"+step).offsetTop - 60;
            scrollTo(to, null, 1000);
        }; 
            
        return (
            <nav className="nav">
                <ul className="ul-flex l-section">
                    <li>Step</li>
                    {list.map((li, index) => 
                        <li 
                            id = {"step"+(index+1)}
                            className="li step" 
                            onClick={()=>onClickStep(index)}>{li}
                        </li>
                    )}
                    <li><img src={logo} className="logo" alt="logo" /></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;
