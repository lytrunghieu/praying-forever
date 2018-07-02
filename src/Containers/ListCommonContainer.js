/**
 * Created by hieult on 7/2/18.
 */

import React, {PureComponent} from "react";
import {View, ScrollView} from "react-native";
import  {NavBar, PlaceHolder, HeaderSearch} from "../Components/Common";
import {Images} from "../Themes"

export default class ListCommon extends PureComponent {

    render() {
        return (<View style={{flex: 1}}>
                <ScrollView>
                    <NavBar title={"Title"}/>
                    <PlaceHolder/>
                    <NavBar title={"Title"} iconLeft={Images.back}/>
                    <PlaceHolder/>
                    <NavBar title={"Title"} iconLeft={Images.back} iconRight={Images.more}/>
                    <PlaceHolder/>
                    <HeaderSearch
                        ref={ref => this.headerSearch = ref}
                        onPressRightButton={() => {
                            this.headerSearch.clear()
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}