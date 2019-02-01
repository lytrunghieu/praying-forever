import React, {PureComponent} from 'react';
import {
    Alert,
} from 'react-native';
import {EventRegisterTypes} from '../../../Constants';
import {IconName} from '../../../Themes';
import I18n from '../../../I18n';
import {CommonUtils} from "../../../Utils";
import {Header, Container, Content} from "../../../Components/Modules";
import {PrayItem} from "../../../Components/HightComponent";

export default class PrayerDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        const {item, uid} = dataPassed;
        this.prayer = item;
        this.uid = dataPassed.uid;
        this.cb = dataPassed.cb;
        this.userUID = item && item.owner && item.owner.uid || null;
        this.onPressBack = this.onPressBack.bind(this)
        this.onPressRightHeader = this.onPressRightHeader.bind(this)
        this.state = {
            item: item,
            available: true
        };

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };

        this.rightHeader = [
            {
                icon: IconName.more,
                onPress: this.onPressRightHeader
            }
        ];


    }

    //region CYCLE LIFE

    componentWillReceiveProps(nextProps) {
        if (nextProps.prayerReducer && nextProps.prayerReducer !== this.props.prayerReducer && nextProps.prayerReducer.payload) {
            const currentPray = nextProps.prayerReducer.payload.find(e => e.uid === this.uid);
            if (currentPray) {
                this.prayer = currentPray;
                this.setState({
                    item: currentPray
                });
            }
            else {
                this.onPressBack();
            }
        }
    }

    componentDidMount() {
        if (this.uid && this.userUID) {
            const {action} = this.props;
            action.getPrayerDetail({userUID: this.userUID, prayerUID: this.uid}).then(res => {
                if (res.success && res.data[0]) {
                    this.setState({
                        item: res.data[0]
                    });
                }
                else {
                    if (!res.data[0]) {
                        Alert.alert(I18n.t("oops"), I18n.t("notFoundPrayer"), [
                            {text: I18n.t("done"), onPress: this.onPressBack}
                        ]);
                    }

                }
            });
        }
        if (this.cb) {
            this.cb();
        }
    }

    //endregion

    //region handle Action Sheet


    //endregion

    //region handle confirm modal

    //endregion

    //region handle Header

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressRightHeader() {
        const {item: data} = this.state;
        CommonUtils.sendEvent({type: EventRegisterTypes.SHOW_PRAYER_OPTION, params: {data}});
    }

    //endregion

    //region functions


    //endregion

    //region RENDERING

    renderContainer() {
        const {item = {}} = this.state;
        return (<PrayItem allowScaleHeight={true} item={item} actionMore={false}/>)
    }

    render() {
        const {available} = this.state;
        const {fetching} = this.props.prayerDetailReducer;
        const {fetching: fetchingPrayers} = this.props.prayerReducer;

        return (
            <Container>
                <Header
                    title={I18n.t('prayDetail')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    isFetching={fetching || fetchingPrayers}
                />
                <Content>
                    {
                        available ? this.renderContainer() : null
                    }
                </Content>
            </Container>
        );
    }

    //endregion
}
