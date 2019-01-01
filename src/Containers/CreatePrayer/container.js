
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {prayerActions} from '../../Action';

const mapStateToProps = (state) => ({
    userReducer : state.userReducer,
    createPrayerReducer: state.createPrayerReducer
});

const mapDispatchToProps = (dispatch) => ({
    prayersActions: bindActionCreators(prayerActions, dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

