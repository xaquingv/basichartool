import React from 'react';
import {connect} from 'react-redux';


const STEP = 5;
const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
    stepActive: state.stepActive
});


class Section extends React.Component {
    render() {
        const {stepActive} = this.props;
        return (
            <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section5">
                <h1>5. Voila, take away your chart</h1>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
