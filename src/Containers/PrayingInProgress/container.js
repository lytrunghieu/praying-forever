
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";

const mapStateToProps = (state) => ({
    prayerReducer: state.prayerReducer,
});

const mapDispatchToProps = (dispatch) => ({
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

