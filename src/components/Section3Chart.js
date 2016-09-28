import React from 'react';
import {connect} from 'react-redux';


const STEP = 3;
const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
    stepActive: state.stepActive
});


class Section extends React.Component {
    render() {
        const {stepActive} = this.props;
        return (
            <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section3">
                <h1>3. Select a visulaization</h1>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
