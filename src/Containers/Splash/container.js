
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {commonActions} from "../../Action";

const mapStateToProps = (state) => ({
    userReducer : state.userReducer
});

const mapDispatchToProps = (dispatch) => ({
    commonActions : bindActionCreators(commonActions,dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

