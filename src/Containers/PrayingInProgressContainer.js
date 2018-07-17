// Libraries
import React, { PureComponent } from 'react';
import {
    View,
} from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import { ScreenKey } from '../Constants';
import { Colors,Images,ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {NavBar,ImageBackground,ActionSheet,ButtonAction} from '../Components/Common';


const optionActionSheet = [
    {text: I18n.t('search')},
    {text: I18n.t('deleteAll') , color : Colors.red}
];

class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
    }

    onPressLeft(){
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressRight(){
        this.refs["moreAction"].open();
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>
                <NavBar title={I18n.t('praying')}
                        onPressLeftButton={this.onPressLeft}
                        iconLeft ={Images.menu}
                        iconRight ={Images.more}
                        onPressRightButton={this.onPressRight}
                />
                <ButtonAction />
                <ActionSheet
                    options={optionActionSheet}
                    ref ={"moreAction"}
                />

            </View>
        );
    }

}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export const  PrayingInProgressContainer = connect(mapStateToProps, mapDispatchToProps)(PrayingInProgress);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,

    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});