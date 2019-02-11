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

import {Header, Container, EmptyHolder} from "../../../Components/Modules";
import {PrayItem} from "../../../Components/HightComponent";
import {ScreenKey} from "../../../Constants";
import firebase, {NotificationOpen} from 'react-native-firebase';
import {firebaseAnalytics} from "../../../Utils";

export default class PrayForOther extends PureComponent {

    constructor(props) {
        super(props);
        this.onPressLeft = this.onPressLeft.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            prayers: [],
            loading: true,
            options : [],
            indexOption : -1,
            fetchingActionSheet : true
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

        // this.getPray(5000);
    }

    //region CYCLE LIFE

    componentDidMount() {
        const {action} = this.props;
        action.getTemplateDistancePrayer().then(res => {
            if (res.success) {
                const {data} = res;
                this.setState({
                    options: data
                })
            }
        }).finally(e => {
            this.setState({
                fetchingActionSheet: false
            })
        });
        firebaseAnalytics("PrayForOthers screen");
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
            if(nextProps.prayForOthersReducer.lastAction !== this.props.prayForOthersReducer.lastAction){
                this.onRefresh();
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.indexOption !== this.state.indexOption && nextState.indexOption > -1 && nextState.options) {
            const option = nextState.options[nextState.indexOption];
            let text = option.unitValue / 1000;
            text = text.toString().concat(" ").concat(I18n.t(option.unitCode));
            this.rightHeader = [
                {
                    text: text,
                },
                {
                    icon: IconName.filter,
                    onPress: this.onPressMoreOption.bind(this)
                },

            ];
            this.getPray(option.unitValue);
        }
        if(nextState.options !== this.state.options && nextState.options){
            const {options,indexOption} = nextState;
            const _optionActionSheet = [];
            options.map((op,index) =>{
                let text = op.unitValue / 1000;
                text = text.toString().concat(" ").concat(I18n.t(op.unitCode));
                _optionActionSheet.push({
                    text : text,
                    onPress : this.onPressOption(index)
                });
            });

            const newState ={
                optionActionSheet : _optionActionSheet
            }

            if(indexOption  === -1){
                newState.indexOption = 0;
            }

            this.setState(newState);
        }

    }

    //endregion

    onPressMoreOption() {
        this.refs["moreAction"].open();
    }

    onRefresh() {
        const {indexOption, options} = this.state;
        this.getPray(options[indexOption] && options[indexOption].unitValue);
    }

    getPray(distance) {
        const {prayerActions} = this.props;
        prayerActions.getPrayersNearby({distance});
    }

    //region handle action modal

    onPressOption = (index) => () => {
        this.setState({
            indexOption: index
        });
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
        this.props.navigation.toggleDrawer();
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
        const {prayers, loading,optionActionSheet,fetchingActionSheet} = this.state;
        const {prayForOthersReducer, notificationReducer} = this.props;
        const {fetching} = prayForOthersReducer;
        const {payload} = notificationReducer;
        const unreadNoti = payload.filter(e => !e.isRead).length;

        return (
            <Container key="container">

                <Header
                    title={I18n.t('prayForOther')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    badge={unreadNoti ? true : false}
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
                    refreshing={fetching}
                    onRefresh={this.onRefresh}
                />
                <ActionSheet
                    fetching={fetchingActionSheet}
                    title={I18n.t("selectDistance")}
                    key="ActionSheet"
                    options={optionActionSheet}
                    ref={"moreAction"}
                />

            </Container>
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