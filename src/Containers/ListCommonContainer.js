/**
 * Created by hieult on 7/2/18.
 */

import React, {PureComponent} from "react";
import {View, ScrollView,Text,TouchableOpacity} from "react-native";
import  {NavBar, PlaceHolder, HeaderSearch,Separator,OptionPopup,DropdowPopup,Button,PrayItem} from "../Components/Common";
import {Images} from "../Themes"

export default class ListCommon extends PureComponent {

    constructor(props){
        super(props);
        this.showDropdownPopup = this.showDropdownPopup.bind(this);
    }

    showDropdownPopup(){
        this.refs["navBar"].measure().then(res =>{
            this.refs["dropdown"].open({x : res.ox , y : res.oy});
        });
    }

    render() {
        return (<View style={{flex: 1}}>
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
                    <OptionPopup text={"Option 1"}/>
                    <PlaceHolder/>
                    <Button text="Button"/>
                    <PrayItem content={"a Human is sick in hopostal to near dead need help about money to heal cancer in final period"} title={"Sick"} date={"23/02/2017"}/>
                    <PrayItem content={"a Human is sick in hopostal to near dead"} title={"Sick"} date={"20/02/2017"}/>

                </ScrollView>
                <DropdowPopup
                    ref ="dropdown"
                    options={["option 1","option 2"]}
                />
            </View>
        )
    }
}