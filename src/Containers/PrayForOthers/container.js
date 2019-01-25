
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";
import {prayerActions} from "../../Action"

const mapStateToProps = (state) => ({
    prayForOthersReducer: state.prayForOthersReducer,
    notificationReducer: state.notificationReducer,
});

const mapDispatchToProps = (dispatch) => ({
    prayerActions : bindActionCreators(prayerActions,dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

