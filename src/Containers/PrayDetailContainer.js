import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {CommonActions} from "../actions";
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
import firebase from 'react-native-firebase';

const collect = firebase.firestore().collection("pray");

const optionActionSheetForFinished = [

]

class PrayDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        this.pray = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;
        this.userUID = dataPassed && dataPassed.owner && dataPassed.owner.uid || null;
        this.optionActionSheetForFinished = [
            {text: I18n.t('continuesPraying'), onPress: this.onPressContinuesPraying.bind(this)},
            {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ];

        this.optionActionSheetForInprogress = [
            {text: I18n.t('updateToFinish'), onPress: this.onPressChangeToFinished.bind(this)},
            {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ];
        const {status} = this.pray;

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressRightHeader = this.onPressRightHeader.bind(this);
        this.onAcceptDelete = this.onAcceptDelete.bind(this);
        this.callbackChangeStatusPray = this.callbackChangeStatusPray.bind(this);
        this.state = {
            title: dataPassed.title,
            content: dataPassed.content,
            status : status,
            available : true
        };
    }

    //region cycle life

    componentWillReceiveProps(nextProps) {
        if (nextProps.prays && nextProps.prays !== this.props.prays) {
            const currentPray = nextProps.prays.find(e => e.uid === this.uid);
            if (currentPray) {
                this.pray = currentPray;
                this.setState({
                    title: currentPray.title,
                    content: currentPray.content
                })
            }
        }
    }

    componentDidMount(){
        if(this.uid && this.userUID){
            this.getPray();
        }
    }

    //endregion

    //region handle Action Sheet


    callbackChangeStatusPray(){
        const {status} = this.state;
        this.setState({
           status : status === StatusOfPray.INPROGRESS ? StatusOfPray.COMPLETE : StatusOfPray.INPROGRESS
        });
    }

    onPressContinuesPraying() {
        const item = this.pray;
        const action ={ type :  EventRegisterTypes.UPDATE_STATUS_PRAY, callback : this.callbackChangeStatusPray , params : {...item, status : StatusOfPray.INPROGRESS}};
        commonUtils.sendEvent(action);
    }


    onPressChangeToFinished() {
        const item = this.pray;
        const action ={ type :  EventRegisterTypes.UPDATE_STATUS_PRAY, callback : this.callbackChangeStatusPray, params : {...item, status : StatusOfPray.COMPLETE}};
        commonUtils.sendEvent(action);
    }


    onPressEdit() {
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING, this.pray);
    }

    onPressDelete() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle confirm modal

    onAcceptDelete() {
        const item = this.pray;
        const action ={ type :  EventRegisterTypes.DELETE_PRAY, params : item};
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

    //region functions
    getPray(){
        const currentDocRef = collect.doc(this.userUID).collection("data").doc(this.uid);
        currentDocRef.get().then(snap =>{
           const data = snap.data();
           if(data){
               const { title , content ,status}= data;
               this.setState({
                   status, title,content
               });
               commonUtils.sendEvent({type : EventRegisterTypes.UPDATE_PRAY, params : {uid : this.uid} });
           }
           else{
               //case : owner of this prayer is login user
               if(this.userUID === firebase.auth().currentUser.uid){
                   commonUtils.sendEvent({type : EventRegisterTypes.GET_PRAY});
               }
               //case : owner of this prayer is other user
               else{
                   commonUtils.sendEvent({type : EventRegisterTypes.DELETE_PRAY, params : {uid : this.uid} });
               }
               this.setState({
                   available : false
               })
           }

        });
    }
    //endregion

    //region rendering


    renderContainer(){
        const {title, content} = this.state;
        return (
            <ScrollView style={styles.scrollView}>
                <PlaceHolder/>
                <RowItem title={title} canPress={false} titleBold={true}/>
                <PlaceHolder/>
                <TextArea
                    value={content}
                    editable ={false}
                />
            </ScrollView>
        )
    }

    render() {
        const {status , available} = this.state;

        return (
            <View style={ApplicationStyles.screen.mainContainerWithBackgroundColor}>
                <NavBar title={I18n.t('prayDetail')}
                        onPressLeftButton={this.onPressBack}
                        iconLeft={Images.back}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRightHeader}
                />
                {
                    available ? this.renderContainer() : null
                }

                <ActionSheet
                    options={status === StatusOfPray.INPROGRESS ? this.optionActionSheetForInprogress  : this.optionActionSheetForFinished}
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
    prays: state.commonReducer.prays
})

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(CommonActions, dispatch)
})

export const PrayDetailContainer = connect(mapStateToProps, mapDispatchToProps)(PrayDetail);

const styles = EStyleSheet.create({

    scrollView: {
        flex: 1,
    }

});