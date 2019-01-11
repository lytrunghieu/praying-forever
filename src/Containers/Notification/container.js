
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {notificationActions} from "../../Action"

const mapStateToProps = (state) => ({
    notificationReducer: state.notificationReducer,
});

const mapDispatchToProps = (dispatch) => ({
    notificationActions : bindActionCreators(notificationActions, dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

