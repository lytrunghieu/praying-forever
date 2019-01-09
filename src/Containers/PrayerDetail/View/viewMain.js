import React, {PureComponent} from 'react';
import {
    Alert,
} from 'react-native';
import {EventRegisterTypes} from '../../../Constants';
import {IconName} from '../../../Themes';
import I18n from '../../../I18n';
import {CommonUtils} from "../../../Utils";
import {Header, Container, Content, PrayItem} from "../../../Components/Modules";

export default class PrayerDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        const {status} = dataPassed;

        this.prayer = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;
        this.userUID = dataPassed && dataPassed.owner && dataPassed.owner.uid || null;
        this.onPressBack = this.onPressBack.bind(this)
        this.onPressRightHeader = this.onPressRightHeader.bind(this)
        this.state = {
            item: dataPassed,
            status: status,
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
                    Alert.alert(I18n.t("oops"), I18n.t("notFoundPrayer"), [
                        {text: I18n.t("done"), onPress: this.onPressBack}
                    ]);
                }
            });
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
            [<Container key="container" pointerEvents={fetching ? "none" : fetchingPrayers ? "none" : "auto"}>
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
            ]
        );
    }

    //endregion
}
