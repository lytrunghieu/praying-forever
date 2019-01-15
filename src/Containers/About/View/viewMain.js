import React, {PureComponent} from 'react';
import {
    View,
} from 'react-native';

import {style as styles} from "../Style";
import {Header,Container,OptionButton,Content} from "../../../Components/Modules";
import {Icon} from "../../../Components/Common";
import {IconName} from "../../../Themes";
import I18n from "../../../I18n";


export default class About extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.onPressBack = this.onPressBack.bind(this);
        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };
    }

    //endregion

    
    onPressBack(){
        this.props.navigation.goBack();
    }
    
    render() {
        // const {content, title} = this.state;
        // const {createPrayerReducer} = this.props;
        // const {fetching} = createPrayerReducer;

        return (
         <Container>
             <Header
                 left={this.leftHeader}
                 title={I18n.t("about")}/>
            <View style ={styles.content}>
             <OptionButton text={I18n.t("version")}/>
             <OptionButton  arrow={true} text={I18n.t("sendFeedback")}/>
            </View>
         </Container>
        );
    }

}

