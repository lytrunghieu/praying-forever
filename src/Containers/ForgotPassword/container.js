
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {userActions} from "../../Action";

const mapStateToProps = (state) => ({
    forgotPasswordReducer : state.forgotPasswordReducer
});

const mapDispatchToProps = (dispatch) => ({
    userActions : bindActionCreators(userActions,dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);
