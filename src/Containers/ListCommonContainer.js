/**
 * Created by hieult on 7/2/18.
 */

import React, {PureComponent} from "react";
import {View, ScrollView, Text, TouchableOpacity, StyleSheet,ActivityIndicator} from "react-native";
import {
    NavBar,
    PlaceHolder,
    HeaderSearch,
    Separator,
    Option,
    DropdowPopup,
    Button,
    PrayItem,
    ImageBackground,
    ActionSheet,
    ConfirmModal,
    Checkbox,
    CheckboxModal,
    SwitchRowItem,
    Input,
    InputTitle,
    TextArea,
    RowItem,
    TextError,
    TextLink,
    ModalLoading
} from "../Components/Common";
import {Images, Colors} from "../Themes"
import * as _ from "lodash";
import I18n from '../I18n';


export default class ListCommon extends PureComponent {

    constructor(props) {
        super(props);

        this.showDropdownPopup = this.showDropdownPopup.bind(this);
        this.showConfirmModal = this.showConfirmModal.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.showLoadingModal = this.showLoadingModal.bind(this);
        this.onPressCheckbox = this.onPressCheckbox.bind(this);
        this.showCheckboxList = this.showCheckboxList.bind(this);
        this.onChangeValueSwitch = this.onChangeValueSwitch.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
        this.onDeleteTextInput = this.onDeleteTextInput.bind(this);
        this.onChangeHeaderSearch = this.onChangeHeaderSearch.bind(this);
        this.onDeleteTextInputSearch = this.onDeleteTextInputSearch.bind(this);

        this.state = {
            checkboxList: [
                {
                    text: "Option 1",
                    index: 0,
                    isChecked: true,
                    onPress: this.onPressCheckbox
                },

                {
                    index: 1,
                    text: "Option 2",
                    isChecked: false,
                    onPress: this.onPressCheckbox
                },
                {
                    index: 2,
                    text: "Option 3",
                    isChecked: false,
                    onPress: this.onPressCheckbox
                },
                {
                    index: 3,
                    text: "Option 4",
                    isChecked: false,
                    onPress: this.onPressCheckbox
                },
                {
                    index: 4,
                    text: "Option 5",
                    isChecked: false,
                    onPress: this.onPressCheckbox
                }
            ],
            switchValue: false,
            valueTextInput: "",
            valueHeaderSearch: "",
        };

    }

    onDeleteTextInputSearch() {
        this.setState({
            valueHeaderSearch: ""
        });
    }

    onDeleteTextInput() {
        this.setState({
            valueTextInput: ""
        });
    }

    onChangeTextInput(text) {
        this.setState({
            valueTextInput: text
        });
    }

    onChangeHeaderSearch(text) {
        this.setState({
            valueHeaderSearch: text
        });
    }

    onChangeValueSwitch(value) {
        this.setState({
            switchValue: value
        });
    }

    onPressCheckbox(index) {

        let checkboxList = _.cloneDeep(this.state.checkboxList);
        if (!checkboxList[index]) {
            return;
        }


        checkboxList[index].isChecked = !checkboxList[index].isChecked;
        checkboxList.map((ch, _index) => {
            if (_index !== index) {
                ch.isChecked = false;
            }
            return ch;
        })

        this.setState({
            checkboxList: checkboxList
        });
    }

    showDropdownPopup() {
        this.refs["navBar"].measure().then(res => {
            this.refs["dropdown"].open({x: res.ox, y: res.oy});
        });
    }

    showConfirmModal() {
        this.refs["confirm"].open();
    }

    showActionSheet() {
        this.refs["actionSheet"].open();
    }

    showCheckboxList() {
        this.refs["checkboxList"].open();
    }

    showLoadingModal() {
        this.refs["loading"].open();
    }

    render() {

        const {checkboxList, switchValue} = this.state;
        const options = [
            {text: "Search"},
            {text: "Delete All", color: Colors.red}
        ];

        return (<View style={{flex: 1}}>
                <ImageBackground/>
                <ScrollView
                    stickyHeaderIndices={[0, 2,4,6,8,10,12,14,16,18,20,22,24,26,28]}
                >
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Text</Text>
                    </View>
                    <TextError text={"Text error"}/>
                    <TextLink text={"Text Link"}/>
                    <TextLink text={"Text Link Red "} isRed={true}/>

                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Nav Bar</Text>
                    </View>
                    <View>
                        <NavBar title={I18n.t("logInScreen")}/>
                        <PlaceHolder/>
                        <NavBar title={"Title"} iconLeft={Images.back}/>
                        <PlaceHolder/>
                        <NavBar
                            ref="navBar"
                            title={"Title"} iconLeft={Images.back} iconRight={Images.more}
                            onPressRightButton={this.showDropdownPopup}
                        />
                        <PlaceHolder/>
                        <HeaderSearch
                            ref={ref => this.headerSearch = ref}
                            onPressRightIcon={this.onDeleteTextInputSearch}
                            value={this.state.valueHeaderSearch}
                            onChangeText={this.onChangeHeaderSearch}
                            fit={true}
                        />
                        <PlaceHolder/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Separate</Text>
                    </View>
                    <View>
                        <Separator/>
                        <PlaceHolder/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Option</Text>
                    </View>
                    <View>
                        <Option text={"Option 1"} leftIcon={Images.inProgress} count={199}/>
                        <Option text={"Option 2"} leftIcon={Images.about}/>
                        <Option text={"Option 2"} leftIcon={Images.setting}/>
                        <Option text={"Option 2"} leftIcon={Images.complete}/>
                        <PlaceHolder/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Button</Text>
                    </View>
                    <View>
                        <Button text="Button"/>
                        <PlaceHolder/>
                        <Button text="Button Fit" fit={true}/>
                        <PlaceHolder/>
                        <Button text="Button Transparent" textColor={Colors.black} customeBorder={true}  backgroundColor={Colors.transparent} />
                        <Button text="Button Lagre" fit={true} height={54} customeBorder={true} borderRadius={0}/>
                        <PlaceHolder/>

                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Pray Item</Text>
                    </View>
                    <View>
                        <PrayItem
                            content={"a Human is sick in hopostal to near dead need help about money to heal cancer in final period"}
                            title={"Sick"} date={"23/02/2017"}/>
                        <PlaceHolder/>
                        <PrayItem
                            content={"a Human is sick in hopostal to near dead"}
                            title={"Sick"}
                            date={"20/02/2017"}
                        />
                        <PlaceHolder/>
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Modal</Text>
                    </View>
                    <View>
                        <Text onPress={this.showConfirmModal}>Show Confrim Modal</Text>
                        <PlaceHolder/>
                        <Text onPress={this.showActionSheet}>Show Action Sheet</Text>
                        <PlaceHolder/>
                        <Text onPress={this.showCheckboxList}>Show checkbox Modal</Text>
                        <PlaceHolder/>
                        <Text onPress={this.showLoadingModal}>Show Loading Modal</Text>
                        <PlaceHolder/>
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Checkbox</Text>
                    </View>
                    <View>
                        <Checkbox text={checkboxList[0].text} isChecked={checkboxList[0].isChecked}
                                  onPress={checkboxList[0].onPress} index={0}/>
                        <Checkbox text={checkboxList[1].text} isChecked={checkboxList[1].isChecked}
                                  onPress={checkboxList[1].onPress} index={1}/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>SwitchRowItem</Text>
                    </View>
                    <View>
                        <SwitchRowItem
                            title={"Reminder"}
                            value={switchValue}
                            onValueChange={this.onChangeValueSwitch}
                        />
                        <PlaceHolder/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Input</Text>
                    </View>
                    <View>
                        <Input
                            ref={"textInput"}
                            value={this.state.valueTextInput}
                            placeholder="Search"
                            onChangeText={this.onChangeTextInput}
                            onPressRightIcon={this.onDeleteTextInput}
                            isShowShadow={true}
                        />

                        <PlaceHolder/>
                        <InputTitle
                            ref={"textInputTitle"}
                            value={this.state.valueTextInput}
                            placeholder="Search"
                            onChangeText={this.onChangeTextInput}
                            onPressRightIcon={this.onDeleteTextInput}
                        />

                        <PlaceHolder/>

                        <Input
                            ref={"textInput"}
                            value={this.state.valueTextInput}
                            placeholder="Search"
                            onChangeText={this.onChangeTextInput}
                            onPressRightIcon={this.onDeleteTextInput}
                            isShowShadow={true}
                            hideDivider={true}
                            customBorder={true}
                            leftIcon={Images.user}
                        />

                        <PlaceHolder/>

                        <Input
                            ref={"textInput"}
                            value={this.state.valueTextInput}
                            placeholder="Search"
                            onChangeText={this.onChangeTextInput}
                            onPressRightIcon={this.onDeleteTextInput}
                            isShowShadow={true}
                            hideDivider={true}
                            customBorder={true}
                            leftIcon={Images.key}
                        />

                        <TextArea/>
                        <PlaceHolder/>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Row Item</Text>
                    </View>

                    <View>
                        <RowItem title={"Reminder"} icon={Images.edit}/>
                        <PlaceHolder/>
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Row Item Regular</Text>
                    </View>
                    <RowItem title={"Title"} titleBold ={true}/>
                    <RowItem value={"Hello This a rowitem contain content so long and height of row can scale follow size of content"} scaled ={true} />


                    <View style={styles.header}>
                        <Text style={styles.titleHeader}>Other</Text>
                    </View>
                    <Text onPress={() => {this.props.navigation.navigate('DrawerNav')}}>show drawer</Text>

                </ScrollView>

                {/*MODAL*/}
                <DropdowPopup
                    ref="dropdown"
                    options={["option 1", "option 2"]}
                />

                <ConfirmModal
                    ref="confirm"
                    title={"Warning"}
                    content={"Are you want delete all ?"}
                    acceptText={"Yes"}
                    rejectText={"No"}
                />
                <ActionSheet
                    ref="actionSheet"
                    options={options}
                />
                <CheckboxModal
                    ref={"checkboxList"}
                    options={checkboxList}
                    textDone={"DONE"}
                />

                <ModalLoading
                    ref={"loading"}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 40,
        width: "100%",
        backgroundColor: "black",
    },

    titleHeader: {
        fontSize: 18,
        color: "white"
    }


});