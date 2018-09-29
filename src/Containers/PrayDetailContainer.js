import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {CommonActions} from "../actions";

import {
    View,
    ScrollView
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey,StatusOfPray} from '../Constants';
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import Pray from '../model/Pray';
import {
    NavBar,
    ActionSheet,
    PlaceHolder,
    ConfirmModal,
    RowItem
} from '../Components/Common';
import firebase from 'react-native-firebase';
import PrayStatus from "../model/PrayStatus";

let collect = firebase.firestore().collection("pray");

class PrayDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        this.pray = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;
        this.optionActionSheet = [];
        const {status} = this.pray;
        if(status === StatusOfPray.INPROGRESS){
            this.optionActionSheet.push(
                {text: I18n.t('updateToFinish'), onPress: this.onPressChangeToFinished.bind(this)},
            );
        }
        else{
            this.optionActionSheet.push(
                {text: I18n.t('continuesPraying'), onPress: this.onPressContinuesPraying.bind(this)},
            );
        }
        this.optionActionSheet = this.optionActionSheet.concat([
            {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ]);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressRightHeader = this.onPressRightHeader.bind(this);
        this.onAcceptDelete = this.onAcceptDelete.bind(this);
        this.state = {
            title: dataPassed.title,
            content: dataPassed.content
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

    //endregion

    //region handle Action Sheet


    onPressContinuesPraying() {
        const item = this.pray;
        const currentDoc =  collect.doc(item.uid);
        const dataSend = Pray.removeFieldEmpty( new Pray({status : StatusOfPray.INPROGRESS}));
        currentDoc.update(dataSend).then(res =>{
            this.props.commonActions.changeStatusPray({status: StatusOfPray.INPROGRESS, pray: item});
            this.onPressBack();
        });
    }


    onPressChangeToFinished() {
        const item = this.pray;
        const currentDoc =  collect.doc(item.uid);
        const dataSend = Pray.removeFieldEmpty( new Pray({status : StatusOfPray.COMPLETE}));
        currentDoc.update(dataSend).then(res =>{
            this.props.commonActions.changeStatusPray({status: StatusOfPray.COMPLETE, pray: item});
            this.onPressBack();
        });
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
        this.props.commonActions.deletePray(this.pray);
        this.refs["confirm"].close();
        this.onPressBack()
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

    //region rendering

    render() {
        const {title, content} = this.state;

        return (
            <View style={ApplicationStyles.screen.mainContainerWithBackgroundColor}>
                <NavBar title={I18n.t('prayDetail')}
                        onPressLeftButton={this.onPressBack}
                        iconLeft={Images.back}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRightHeader}
                />
                <ScrollView style={styles.scrollView}>
                    <PlaceHolder/>
                    <RowItem title={title} canPress={false} titleBold={true}/>
                    <PlaceHolder/>
                    <RowItem value={content} canPress={false} scaled={true}/>
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