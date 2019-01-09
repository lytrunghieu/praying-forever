import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {prayerActions} from "../Action";
import {
    View,
    ScrollView
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey,StatusOfPray,EventRegisterTypes} from '../Constants';
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {
    NavBar,
    ActionSheet,
    PlaceHolder,
    ConfirmModal,
    RowItem,
    TextArea
} from '../Components/Common';
import commonUtils from "../Utils/CommonUtils";

class NotificationDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        this.data = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;

        this.optionActionSheet = [
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ];

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressRightHeader = this.onPressRightHeader.bind(this);
        this.onAcceptDelete = this.onAcceptDelete.bind(this);

        this.state ={
           title : this.data.title,
           content : this.data.content
        };

    }

    //region CYCLE LIFE

    componentDidMount(){
        commonUtils.sendEvent({type : EventRegisterTypes.UPDATE_NOTIFICATION , params: {uid : this.uid}})
    }

    componentWillReceiveProps(nextProps) {
    }

    //endregion

    //region handle Action Sheet

    onPressDelete() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle confirm modal

    onAcceptDelete() {
        const item = this.prayer;
        const action ={ type :  EventRegisterTypes.DELETE_NOTIFICATION, params : item};
        commonUtils.sendEvent(action);
        this.refs["confirm"].close();
        this.onPressBack();
    }

    //endregion

    //region handle Header

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressRightHeader() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region RENDERING

    render() {
        const {title, content} = this.state;

        return (
            <View style={ApplicationStyles.screen.mainContainerWithBackgroundColor}>
                <NavBar title={title}
                        onPressLeftButton={this.onPressBack}
                        iconLeft={Images.back}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRightHeader}
                />
                <ScrollView style={styles.scrollView}>
                    <PlaceHolder/>
                    <TextArea
                        value={content}
                        editable ={false}
                    />
                </ScrollView>
                <ActionSheet
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />
                <ConfirmModal
                    ref={"confirm"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirm")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDelete}
                />

            </View>
        );
    }

    //endregion
}

const mapStateToProps = (state) => ({
    prays: state.prayerReducer.prays
})

const mapDispatchToProps = (dispatch) => ({
    prayersActions: bindActionCreators(prayerActions, dispatch)
})

export const NotificationDetailContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationDetail);

const styles = EStyleSheet.create({

    scrollView: {
        flex: 1,
    }

});