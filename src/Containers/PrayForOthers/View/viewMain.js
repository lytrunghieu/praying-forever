import React, {PureComponent} from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {IconName} from '../../../Themes';
import I18n from '../../../I18n/index';
import {
    ActionSheet,
    PlaceHolder,
} from '../../../Components/Common';

import {LoadingBar, Header, Container, Content, EmptyHolder,PrayItem} from "../../../Components/Modules";

import commonUtils from "../../../Utils/CommonUtils";
import {EventRegisterTypes, ScreenKey} from "../../../Constants";
import firebase, {NotificationOpen} from 'react-native-firebase';

export default class PrayForOther extends PureComponent {

    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: "5Km", onPress: this.onPressOption(0)},
            {text: "10Km", onPress: this.onPressOption(1)},
            {text: "15Km", onPress: this.onPressOption(2)}
        ];
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);

        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            prayers: [],
            distance: 5000,
            loading: true,
        };

        this.leftHeader = {
            icon: IconName.menu,
            onPress: this.onPressLeft.bind(this)
        };
        this.rightHeader = [
            {
                icon: IconName.filter,
                onPress: this.onPressMoreOption.bind(this)
            }
        ];

        this.getPray(5000);
    }

    //region CYCLE LIFE

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prayForOthersReducer.payload !== this.props.prayForOthersReducer.payload) {
            let newPrayers = [];
            const {payload} = nextProps.prayForOthersReducer;
            if (payload) {
                newPrayers = payload.filter(p => {
                    const {following = []} = p;
                    if (following && following.find(_p => _p === firebase.auth().currentUser.uid)) {
                        return false;
                    }
                    else
                        return true;
                });
            }
            this.setState({
                prayers: [...newPrayers]
            });
        }

        if (nextProps.prayForOthersReducer.fetching !== this.props.prayForOthersReducer.fetching && nextProps.prayForOthersReducer.fetching) {
            this.setState({loading: true})
        }

        if (nextProps.prayForOthersReducer.fetching !== this.props.prayForOthersReducer.fetching && !nextProps.prayForOthersReducer.fetching) {
            this.setState({loading: false})
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.distance != this.state.distance) {
            this.getPray(nextState.distance);
        }

    }

    componentWillUnmount() {
    }

    //endregion


    onPressMoreOption() {
        this.refs["moreAction"].open();
    }

    onRefresh() {
        const {distance} = this.state;
        this.getPray(distance);
    }

    getPray(distance) {
        const {prayerActions} = this.props;
        prayerActions.getPrayersNearby({distance});
    }

    //region handle action modal

    onPressOption = (index) => () => {
        let distance = 5000;
        switch (index) {
            case 1: {
                distance = 10000;
                break;
            }

            case 2: {
                distance = 15000;
                break;
            }
        }

        this.setState({
            distance
        });
    }


    onPressDeleteAll() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle modal confirm

    //endregion

    //region other

    keyExtractor(item, index) {
        return index.toString();
    }

    //endregion

    //region handle Header

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressRight() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region handle Pray Iteam
    onPressPrayItem = (item) => () => {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, {item, uid: item.uid});
    }

    onPressReport(item) {
    }


    //endregion

    //region RENDERING

    renderPrayItem({item}) {
        return (
            <PrayItem
                item={item}
                onPress={this.onPressPrayItem(item)}
            />
        )
    }

    renderSeparate() {
        return (
            <PlaceHolder/>
        )
    }

    renderListHeaderComponent() {
        return (<PlaceHolder/>);
    }

    renderListFooterComponent() {
        return (<PlaceHolder/>);
    }

    render() {
        const {prayers, distance, loading} = this.state;
        const {prayForOthersReducer} = this.props;
        const {fetching} = prayForOthersReducer;

        return (
            [<Container key="container" pointerEvents={fetching ? "none" : "auto"}>

                <Header
                    title={I18n.t('prayForOther')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    onChangeTextSearch={this.onChangeKeySearch}
                    onCloseSearchBar={this.onCloseSearchBar}
                />

                    {
                        !loading && prayers.length === 0 ? <EmptyHolder
                            h1={I18n.t("noResult")}
                            h2={I18n.t("noPrayerNearby")}
                            link={I18n.t("tryAgain")}
                            onPressLink={this.onRefresh}
                        /> : null
                    }

                    <FlatList
                        data={prayers}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderPrayItem}
                        ItemSeparatorComponent={this.renderSeparate}
                        ListFooterComponent={this.renderListFooterComponent}
                        refreshing ={fetching}
                        onRefresh={this.onRefresh}
                    />

            </Container>,
                <ActionSheet
                    title={I18n.t("selectDistance")}
                    key="ActionSheet"
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />,

            ]
        );
    }

    //endregion

}

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});