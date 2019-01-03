
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {action} from './Action';

const mapStateToProps = (state) => ({
    prayerReducer: state.prayerReducer,
    prayerDetailReducer : state.prayerDetailReducer
});

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch),
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

