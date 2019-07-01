import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './navigation.css';
import {changeStep} from '../actions';
import scrollTo from '../lib/scrollTo';
//import logo from '../assets/logo.svg';

const navList = [
    "1. Import",
    "2. Discover",
    //"3. Select",
    "3. Edit",
    // "4. Download"
];

const marginTop = 60

//TODO: scroll and switch step

const mapDispatchToProps = (dispatch) => ({
  onClickStep: (step) => {
    dispatch(changeStep(step));
  }
});

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive
});

class Navigation extends React.Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
  };

  animateScroll = () => {
    const to = document.querySelector("#section" + this.props.step).offsetTop - marginTop;
    scrollTo(to, null, 1000);
  };

  // dom ready
  componentDidUpdate() {
    this.animateScroll();
  };

  render() {
    //console.log("props:", this.props);
    const {step, stepActive, onClickStep} = this.props;
    return (
      <nav className="nav">
        <ul className="ul-flex l-section">
          
          {navList.map((li, index) => <li
            key={"step"+(index+1)}
            ref={(node) => this.node = node}
            className={"li step" + ((step===index+1)?" li-focus":"") + ((stepActive>=index+1)?"":" pe-n")}
            onClick={()=>onClickStep(index+1)}>{li}
          </li>)}
          {/*<li><img src={logo} className="logo" alt="logo" /></li>*/}
        </ul>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
