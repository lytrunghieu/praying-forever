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
import {universalLink} from "../../../Constants"
import {firebaseAnalytics} from "../../../Utils";

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
        Linking.canOpenURL(universalLink.FEEDBACK).then(supported => {
            if (!supported) {
                console.error('Can\'t handle url: ' + universalLink.FEEDBACK);
            } else {
                let footer = "\n\n\n\n{yourInfo}\n{version}: {Version}\n{deviceModel}: {Device Model}\n{platform}: {OS}";
                const Version = DeviceInfo.getVersion();
                const Model = DeviceInfo.getModel();
                const OS = DeviceInfo.getSystemName().concat(" ").concat(DeviceInfo.getSystemVersion());
                footer = footer.replace("{Version}", Version)
                    .replace("{Device Model}", Model)
                    .replace("{OS}", OS)
                    .replace("{yourInfo}", I18n.t("yourInfo"))
                    .replace("{version}", I18n.t("version"))
                    .replace("{deviceModel}", I18n.t("deviceModel"))
                    .replace("{platform}",  I18n.t("platform"))
                ;
                const url = universalLink.FEEDBACK.replace("{body}", footer);
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
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

