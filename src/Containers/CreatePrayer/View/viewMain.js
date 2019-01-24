import React, {PureComponent} from 'react';
import {
    Platform,
    KeyboardAvoidingView,
    TimePickerAndroid,
    View
} from 'react-native';
import {IconName, Colors} from '../../../Themes';
import I18n from '../../../I18n';
import {
    PlaceHolder,
    CheckboxModal,
    TextArea,
    Button, Icon, Input, Text
} from '../../../Components/Common';
import moment from "moment";
import firebase, {NotificationOpen} from 'react-native-firebase';
import {Pray} from "../../../model";
import {StatusOfPray, titlePrayerCode} from "../../../Constants";

import {Header, ButtonFooter, Container, Content} from "../../../Components/Modules";

import {Item, Form} from 'native-base';

let collect = firebase.firestore().collection("prayer");

import {style as styles} from "../Style";


export default class CreatePraying extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        const {createPrayerReducer} = this.props;
        const {payload} = createPrayerReducer;
        //Need pass to handle edit action
        this.isEdit = dataPassed ? true : false;
        this.uid = dataPassed && dataPassed.uid || null;
        this.created = dataPassed && dataPassed.created;
        this.owner = dataPassed && dataPassed.owner;
        this.status = dataPassed && dataPassed.status;


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
        this.generateOption = this.generateOption.bind(this);
        this.getTemplate = this.getTemplate.bind(this);
        this.userPray = collect.doc(firebase.auth().currentUser.uid);
        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };

        this.state = {
            title: dataPassed && dataPassed.title || "",
            content: dataPassed && dataPassed.content || "",
            options: this.generateOption(payload),
            isReminder: dataPassed && dataPassed.isReminder || false,
            timeReminder: dataPassed && dataPassed.timeReminder || moment().valueOf(),
            showDateTimePickerIOS: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.createPrayerReducer.payload !== this.props.createPrayerReducer.payload) {
            this.setState({
                options: this.generateOption(nextProps.createPrayerReducer.payload)
            })
        }
    }

    componentDidMount() {
        this.getTemplate();
    }

    //endregion


    generateOption(data) {

        const _data = [];
        if (Array.isArray(data) && data.length) {
            data.map(e =>{
                _data.push(e);
            })
        }

        if (Array.isArray(_data) && _data.length) {
            return _data.map(e => {
                let text = "";
                switch (e.code) {
                    case  titlePrayerCode.HEALTH : {
                        text = I18n.t("health");
                        break;
                    }

                    case  titlePrayerCode.ECONOMIC : {
                        text = I18n.t("economic");
                        break;
                    }

                    case  titlePrayerCode.CAREER : {
                        text = I18n.t("career");
                        break;
                    }

                    case  titlePrayerCode.LEARNING : {
                        text = I18n.t("learning");
                        break;
                    }

                    case  titlePrayerCode.MARRIAGE : {
                        text = I18n.t("marriage");
                        break;
                    }
                }

                return {
                    text: text,
                    code: e.code,
                    onPress: this.onSelectOption.bind(this, e.code),
                    isChecked: false,
                }
            });
        }
        else {
            return [];
        }
    }

    getTemplate() {
        const {action} = this.props;
        action.getTemplatePrayer();
    }

    onSubmitEditingTitle() {
        this.refs["_description"].focus();
    }

    onSubmit() {
        const {title, content, isReminder, timeReminder} = this.state;
        const {action} = this.props;
        let params = {title, content};
        if (this.isEdit) {
            params.uid = this.uid;
            let dataSend = Pray.removeFieldEmpty(new Pray(params));
            action.editPrayer(dataSend).then(res => {
                if (res.success) {
                    this.onPressBack();
                }
            });

        }
        else {

            const {userReducer = {}} = this.props;
            const {payload} = userReducer;
            if (payload) {
                params.owner = {
                    uid: firebase.auth().currentUser.uid,
                    birthDay: payload.birthDay,
                    gender: payload.gender,
                    displayName: payload.displayName
                };
                params.status = StatusOfPray.INPROGRESS;
                let dataSend = new Pray(params);
                action.createNewPrayer(dataSend).then(res => {
                    if (res.success) {
                        this.onPressBack();
                    }
                });
            }
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

    onSelectOption(code) {
        let options =  [...this.state.options];

        options.map(op => {
            if (op.code == code) {
                op.isChecked = true;
            }
            else {
                op.isChecked = false;
            }
            return op;
        });
        this.setState({
            options: options
        });
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
        const {content, title} = this.state;
        const {createPrayerReducer} = this.props;
        const {fetching} = createPrayerReducer;

        return (
            [<Container key="Container" pointerEvents={fetching ? "none" : "auto"}>
                <Header
                    title={this.isEdit ? I18n.t("editPray") : I18n.t("createNewPrayer")}
                    left={this.leftHeader}
                    isFetching={fetching}
                />
                <Content>
                    <View style={[styles.form]}>
                        <Form>
                            <Item fixedLabel>

                                <Input
                                    autoFocus={true}
                                    underlineColorAndroid={'rgba(0,0,0,0)'}
                                    value={this.state.title}
                                    onChangeText={this.onChangeText}
                                    placeholder={I18n.t("inputTitlePray")}
                                    returnKeyType={"next"}
                                    onSubmitEditing={this.onSubmitEditingTitle}
                                    maxLength={500}
                                />
                                {
                                    title ? <Button transparent style={{marginRight: 16}}
                                                    onPress={this.onPressDeleteInput}
                                    >
                                        <Icon active name={IconName.clear}/>
                                    </Button> : null
                                }


                                <Button transparent style={{marginRight: 16}}
                                        onPress={this.onPressRightIconInputTitle}
                                >
                                    <Icon active name={IconName.suggest}/>
                                </Button>
                            </Item>
                        </Form>
                        <PlaceHolder/>
                        <Form>
                          <TextArea
                              ref="_description"
                              placeholder={I18n.t("inputDescription")}
                              value={this.state.content}
                              onChangeText={this.onChangeContent}
                              maxLength={5000}
                          />


                        </Form>
                    </View>

                </Content>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    enabled
                >
                    <ButtonFooter transparent={false} disabled={!title || !content || fetching}
                                  onPress={this.onSubmit}>
                        <Text>{this.isEdit ? I18n.t("save") : I18n.t("create")}</Text>
                    </ButtonFooter>
                </KeyboardAvoidingView>

            </Container>,
                <CheckboxModal
                    key="CheckboxModal"
                    ref="checkBoxModal"
                    textDone={I18n.t("done")}
                    title={I18n.t("selectTitle")}
                    options={this.state.options}
                    onPressSubmit={this.onSubmitOption}
                />,

            ]
        );
    }

}

