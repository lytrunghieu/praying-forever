/**
 * Created by hieult on 7/2/18.
 */

import React, {PureComponent} from "react";
import {View, ScrollView, Text, TouchableOpacity} from "react-native";
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
    ConfirmModal
} from "../Components/Common";
import {Images,Colors} from "../Themes"

export default class ListCommon extends PureComponent {

    constructor(props) {
        super(props);
        this.showDropdownPopup = this.showDropdownPopup.bind(this);
        this.showConfirmModal = this.showConfirmModal.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
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

    render() {
        const options = [
            {text: "Search"},
            {text: "Delete All" , color : Colors.red}
            ];

        return (<View style={{flex: 1}}>
                <ImageBackground/>
                <ScrollView>
                    <NavBar title={"Title"}/>
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
                        onPressRightButton={() => {
                            this.headerSearch.clear()
                        }}
                    />
                    <PlaceHolder/>
                    <Text>Separator</Text>
                    <Separator/>
                    <PlaceHolder/>
                    <Text>Option</Text>
                    <Option text={"Option 1"} leftIcon={Images.inProgress} count={199}/>
                    <Option text={"Option 2"} leftIcon={Images.about}/>
                    <Option text={"Option 2"} leftIcon={Images.setting}/>
                    <Option text={"Option 2"} leftIcon={Images.complete}/>
                    <PlaceHolder/>
                    <Button text="Button"/>
                    <PlaceHolder/>
                    <Button text="Button Fit" fit={true}/>
                    <PlaceHolder/>
                    <PrayItem
                        content={"a Human is sick in hopostal to near dead need help about money to heal cancer in final period"}
                        title={"Sick"} date={"23/02/2017"}/>
                    <PlaceHolder/>
                    <PrayItem content={"a Human is sick in hopostal to near dead"} title={"Sick"} date={"20/02/2017"}/>
                    <PlaceHolder/>
                    <Text onPress={this.showConfirmModal}>Show Confrim Modal</Text>

                    <PlaceHolder/>
                    <Text onPress={this.showActionSheet}>Show Action Sheet</Text>


                </ScrollView>

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

            </View>
        )
    }
}