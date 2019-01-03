
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {action} from './Action';

const mapStateToProps = (state) => ({
    userReducer : state.userReducer,
    createPrayerReducer: state.createPrayerReducer
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

