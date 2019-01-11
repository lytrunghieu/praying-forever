// Libraries
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {prayerActions, notificationActions, userActions} from '../../Action/index';

const mapStateToProps = (state) => {
    return {
        notificationReducer: state.notificationReducer,
        prayerReducer : state.prayerReducer,
        commonReducer : state.commonReducer,
        drawerReducer : state.drawerReducer,
        userReducer : state.userReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        prayerActions: bindActionCreators(prayerActions, dispatch),
        notificationActions: bindActionCreators(notificationActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(viewMain);
