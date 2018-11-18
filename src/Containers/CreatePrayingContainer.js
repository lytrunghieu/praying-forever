import React, {PureComponent} from 'react';
import {
    View,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TimePickerAndroid,
    DatePickerIOS,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Images, ApplicationStyles} from '../Themes';
import {CommonActions} from '../actions';
import I18n from '../I18n';
import {
    NavBar,
    ImageBackground,
    InputTitle,
    PlaceHolder,
    CheckboxModal,
    TextArea,
    SwitchRowItem,
    RowItem,
    Button
} from '../Components/Common';
import moment from "moment";
import commonUtils from "../Utils/CommonUtils";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import {Pray} from "../model";
import {StatusOfPray,EventRegisterTypes} from "../Constants";


let collect = firebase.firestore().collection("pray");


class CreatePraying extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;

        //Need pass to handle edit action
        this.isEdit = dataPassed ? true : false;
        this.uid = dataPassed && dataPassed.uid || null;
        this.created = dataPassed && dataPassed.created;
        this.owner = dataPassed && dataPassed.owner;
        this.status = dataPassed && dataPassed.status;

        this.state = {
            title: dataPassed && dataPassed.title || "",
            content: dataPassed && dataPassed.content || "",
            options: [
                {
                    text: I18n.t("health"),
                    onPress: this.onSelectOption.bind(this, 0),
                    isChecked: false,
                },
                {
                    text: I18n.t("economic"),
                    onPress: this.onSelectOption.bind(this, 1),
                    isChecked: false,
                }
            ],
            isReminder: dataPassed && dataPassed.isReminder || false,
            timeReminder: dataPassed && dataPassed.timeReminder || moment().valueOf(),
            showDateTimePickerIOS: false
        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.onPressRightIconInputTitle = this.onPressRightIconInputTitle.bind(this);
        this.onSubmitOption = this.onSubmitOption.bind(this);
        this.onPressDeleteInput = this.onPressDeleteInput.bind(this);
        this.onChangeReminderStatus = this.onChangeReminderStatus.bind(this);
        this.onPressEditTimeClock = this.onPressEditTimeClock.bind(this);

        this.onSubmitEditingTitle = this.onSubmitEditingTitle.bind(this);
        this.openTimePickerAndroid = this.openTimePickerAndroid.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.userPray = collect.doc(firebase.auth().currentUser.uid);
    }

    //endregion

    onSubmitEditingTitle() {
        this.refs["textArea"].focus();
    }

    onSubmit() {
        const {title, content, isReminder, timeReminder} = this.state;
        let params = {title, content };
        if (this.isEdit) {
            params.uid = this.uid;
            let dataSend =  Pray.removeFieldEmpty(new Pray(params));
            this.userPray.collection("data").doc(this.uid).update(dataSend).then(res =>{
                commonUtils.sendEvent({type : EventRegisterTypes.GET_PRAY});
                this.onPressBack();
            });
        }
        else {

            params.created = moment().valueOf();
            params.owner = {uid: firebase.auth().currentUser.uid};
            params.status = StatusOfPray.INPROGRESS;
            let dataSend = new Pray(params);
            this.userPray.collection("data").add(dataSend).then(res => {
                res.get().then(res2 => {
                    const docRef = res2.ref;
                    docRef.update("uid" ,res2.id).then(res2 =>{
                        commonUtils.sendEvent({type : EventRegisterTypes.GET_PRAY});
                        this.onPressBack();
                    });
                });
            })
        }

    }

    onPressEditTimeClock() {
        const {timeReminder} = this.state;
        if (Platform.OS === "ios") {
            this.setState({
                showDateTimePickerIOS: !this.state.showDateTimePickerIOS
            });
        }
        else {
            this.openTimePickerAndroid(timeReminder);
        }
    }

    onSubmitOption() {
        let optionsChecked = this.state.options.filter(e => e.isChecked);
        if (optionsChecked && optionsChecked.length > 0) {
            this.setState({
                title: optionsChecked[0].text
            });
        }
    }

    onSelectOption(index) {
        let options = [...this.state.options];
        if (options[index]) {
            options.map(op => {
                op.isChecked = false;
            });
            options[index].isChecked = true;
            this.setState({
                options: options
            });
        }
    }

    onPressRightIconInputTitle() {
        this.refs["checkBoxModal"].open()
    }

    onPressDeleteInput() {
        this.setState({
            title: ""
        });
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onChangeText(text) {
        this.setState({
            title: text
        });
    }

    onChangeContent(text) {
        this.setState({
            content: text
        });
    }

    onChangeReminderStatus(value) {
        this.setState({
            isReminder: value
        });
    }

    onDateChange(date) {
        this.setState({
            timeReminder: moment(date).valueOf()
        });
    }

    async openTimePickerAndroid(currentTime) {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: moment(currentTime).hour(),
                minute: moment(currentTime).minute(),
                is24Hour: false, // Will display '2 PM'
                mode: "spinner"
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
            }
            this.setState({
                timeReminder: moment({hour: hour, minute: minute}).valueOf()
            })

        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    render() {
        const {timeReminder} = this.state;
        return (
            <KeyboardAvoidingView style={ApplicationStyles.screen.mainContainer}
                                  behavior={Platform.OS === "ios" ? "padding" : null}
                                  enabled
            >
                <ImageBackground/>
                <NavBar title={this.isEdit ? I18n.t("editPray") : I18n.t("createNewPray")}
                        titleRight={"Save"}
                        iconLeft={Images.back}
                        onPressLeftButton={this.onPressBack}
                />
                <ScrollView
                    style={styles.scrollView}
                >
                    <PlaceHolder/>
                    <InputTitle
                        autoFocus={true}
                        value={this.state.title}
                        onChangeText={this.onChangeText}
                        placeholder={I18n.t("inputTitlePray")}
                        onPressRightIcon={this.onPressDeleteInput}
                        onPressSuggest={this.onPressRightIconInputTitle}
                        returnKeyType={"next"}
                        onSubmitEditing={this.onSubmitEditingTitle}

                    />
                    <PlaceHolder/>
                    <TextArea
                        ref="textArea"
                        placeholder={I18n.t("inputContent")}
                        value={this.state.content}
                        onChangeText={this.onChangeContent}
                    />
                    <PlaceHolder/>
                </ScrollView>
                <View style={styles.buttonCreateContainer}>
                    {this.state.title && this.state.content &&

                    <Button  text={this.isEdit ? I18n.t("save") : I18n.t("create")} fit={true} height={54} customeBorder={true} borderRadius={0} onPress={this.onSubmit} />

                        || null
                    }

                </View>
                <CheckboxModal
                    ref="checkBoxModal"
                    textDone={I18n.t("done")}
                    options={this.state.options}
                    onPressSubmit={this.onSubmitOption}
                />
            </KeyboardAvoidingView>
        );
    }

}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(CommonActions, dispatch),
})

export const CreatePrayingContainer = connect(mapStateToProps, mapDispatchToProps)(CreatePraying);

const styles = EStyleSheet.create({
    scrollView: {
        paddingLeft: "$padding",
        paddingRight: "$padding",
    },

    buttonCreateContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "$heightRowNormal",
    }

});