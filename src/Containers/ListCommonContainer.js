/**
 * Created by hieult on 7/1/18.
 */
import React ,{PureComponent} from "react";
import {View ,ScrollView} from "react-native";
import  {NavBar} from "../Components/Common";

export default class ListCommon extends PureComponent {

    render(){
        return (<View style={{flex : 1}}>
            <ScrollView>
                <NavBar title={"Title"}/>
            </ScrollView>
        </View>
        )
    }
}