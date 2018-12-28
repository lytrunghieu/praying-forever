

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {commonActions} from "./Action";
import View from "./View";


const mapStateToProps = (state) => ({
    prays: state.commonReducer.prays,
    prayingReducer : state.prayingReducer
})

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(commonActions, dispatch)
})

export default  connect(mapStateToProps, mapDispatchToProps)(View);

