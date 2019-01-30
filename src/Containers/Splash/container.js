
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {viewMain} from "./View";

const mapStateToProps = (state) => ({
    userReducer : state.userReducer
});

const mapDispatchToProps = (dispatch) => ({
});

export default  connect(mapStateToProps, mapDispatchToProps)(viewMain);

