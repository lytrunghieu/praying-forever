import React, {PureComponent} from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
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


class CreatePraying extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
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
            isReminder: false,
            timeReminder: moment().format("hh:mm a")
        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.onPressRightIconInputTitle = this.onPressRightIconInputTitle.bind(this);
        this.onSubmitOption = this.onSubmitOption.bind(this);
        this.onPressDeleteInput = this.onPressDeleteInput.bind(this);
        this.onChangeReminderStatus = this.onChangeReminderStatus.bind(this);
        this.onPressEdit = this.onPressEdit.bind(this);
        this.onPressCreate = this.onPressCreate.bind(this);
        this.onSubmitEditingTitle = this.onSubmitEditingTitle.bind(this);
    }

    onSubmitEditingTitle(){
        this.refs["textArea"].focus();
    }

    onPressCreate() {
        const {title,content,isReminder,timeReminder} = this.state;
        let params = {title,content,isReminder,timeReminder, created : moment().valueOf()};
        this.props.commonActions.createNewPray(params);
        this.onPressBack();
    }

    onPressEdit() {

    }

    onSubmitOption() {
        let optionsChecked = this.state.options.filter(e => e.isChecked);
        if (optionsChecked) {
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

    render() {
        const {timeReminder} = this.state;
        return (
            <KeyboardAvoidingView style={ApplicationStyles.screen.mainContainer}
                                  behavior="padding" enabled
            >
                <ImageBackground/>
                <NavBar title={I18n.t("createNewPray")}
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
                        returnKeyType ={"next"}
                        onSubmitEditing ={this.onSubmitEditingTitle}

                    />
                    <PlaceHolder/>
                    <TextArea
                        ref ="textArea"
                        placeholder={I18n.t("inputContent")}
                        value={this.state.content}
                        onChangeText={this.onChangeContent}
                    />
                    <PlaceHolder/>
                    <SwitchRowItem title={I18n.t("reminder")}
                                   onValueChange={this.onChangeReminderStatus}
                                   value={this.state.isReminder}
                    />
                    <PlaceHolder/>
                    {this.state.isReminder &&
                    <View>
                        <RowItem title={timeReminder} icon={Images.edit}
                                 onPress={this.onPressEdit}/>
                        <PlaceHolder/>
                    </View> || null
                    }


                </ScrollView>
                <View style={styles.buttonCreateContainer}>
                    {this.state.title && this.state.content &&
                    <Button
                        onPress={this.onPressCreate}
                        text={I18n.t("create")}
                    /> || null
                    }

                </View>
                <PlaceHolder/>
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

const mapStateToProps = (state) => ({

})

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
        height: "$heightRow",
    }

});