import React, {PureComponent} from 'react';
import {
    View,
    Linking
} from 'react-native';
import {style as styles} from "../Style";
import {Header,Container,OptionButton,Content} from "../../../Components/Modules";
import {IconName} from "../../../Themes";
import I18n from "../../../I18n";
import DeviceInfo from 'react-native-device-info';
import {firebaseAnalytics,CommonUtils} from "../../../Utils";

export default class About extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSendFeedBack = this.onPressSendFeedBack.bind(this);
        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };
    }

    componentDidMount() {
        firebaseAnalytics("About screen");
    }

    //endregion


    onPressSendFeedBack(){
        CommonUtils.sendEmail();
    }
    
    onPressBack(){
        this.props.navigation.goBack();
    }
    
    render() {
        return (
         <Container>
             <Header
                 left={this.leftHeader}
                 title={I18n.t("about")}/>
            <View style ={styles.content}>
             <OptionButton text={I18n.t("version").concat(" ").concat(DeviceInfo.getVersion())}/>
             <OptionButton  arrow={true} text={I18n.t("sendFeedback")} onPress={this.onPressSendFeedBack}/>
            </View>
         </Container>
        );
    }

}

