import React, {PureComponent} from 'react';
import {
    FlatList,
} from 'react-native';
import {Colors, IconName} from '../../../Themes';
import I18n from '../../../I18n';
import {
    ActionSheet,
    PlaceHolder,
} from '../../../Components/Common';
import commonUtils from "../../../Utils/CommonUtils";
import {StatusOfPray, EventRegisterTypes, ScreenKey} from "../../../Constants";
import {style} from "../Style";
import {
    Header,
    ActionSheetPrayItem,
    LoadingBar,
    Container,
    Content,
    PrayItem
} from "../../../Components/Modules";

export default class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);

        this.optionActionSheet = [
            {text: I18n.t('createNewPrayer'), onPress: this.onPressAdd.bind(this)},
            {text: I18n.t('search'), onPress: this.onPressSearch.bind(this)},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDeletePrayer.bind(this)}
        ];
        this.leftHeader = {
            icon: IconName.menu,
            onPress: this.onPressLeft.bind(this)
        };
        this.rightHeader = [
            {
                icon: IconName.qr_code,
                onPress: this.onPressScanQR.bind(this),
            },
            {
                icon: IconName.more,
                onPress: this.onPressMoreOption.bind(this)
            }
        ];

        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.onAcceptDeletePrayer = this.onAcceptDeletePrayer.bind(this);
        this.onChangeKeySearch = this.onChangeKeySearch.bind(this);
        this.onPressBackSearch = this.onPressBackSearch.bind(this);
        this.onCloseActionPrayerModal = this.onCloseActionPrayerModal.bind(this);
        this.onCloseSearchBar = this.onCloseSearchBar.bind(this);

        this.state = {
            prays: props.prayerReducer.payload && props.prayerReducer.payload.filter(e => e.status == StatusOfPray.INPROGRESS) || [],
            isSearch: false,
            keySearch: "",
            prayerSelected: null,
        };
    }

    //region CYCLE LIFE

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prayerReducer !== this.props.prayerReducer && nextProps.prayerReducer.payload) {
            this.setState({
                prays: nextProps.prayerReducer.payload.filter(e => e.status == StatusOfPray.INPROGRESS)
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.keySearch !== this.state.keySearch && nextProps.prayerReducer.payload) {
            const {prayerReducer} = nextProps;
            const {payload} = prayerReducer;
            if (nextState.keySearch.length > 3) {
                const newPrays = payload.filter(e => {
                    let contentFormated = commonUtils.trim(e.content).toUpperCase();
                    return e.status == StatusOfPray.INPROGRESS && contentFormated.indexOf(nextState.keySearch.toUpperCase()) != -1 ? true : false;
                });
                this.setState({
                    prays: newPrays
                });
            }
            else {
                const newPrays = payload.filter(e => {
                    return e.status == StatusOfPray.INPROGRESS;
                });
                this.setState({
                    prays: newPrays
                });
            }
        }


    }

    componentDidUpdate(preProps, preState) {
    }

    componentWillUnmount() {
    }

    //endregion

    //region handle event press

    onPressScanQR() {
        commonUtils.sendEvent({type : EventRegisterTypes.SHOW_SCANNER});
    }

    //endregion

    //region handle header search

    onChangeKeySearch(value) {
        this.setState({
            keySearch: value
        });
    }

    onPressBackSearch() {
        this.setState({
            isSearch: false,
            keySearch: ""
        });
    }

    //endregion

    //region handle action modal

    onPressSearch() {
        this.setState({
            isSearch: true
        });
    }

    onCloseActionPrayerModal() {
        this.setState({
            prayerSelected: null
        });
    }

    //endregion

    //region handle modal confirm

    onAcceptDeletePrayer(data) {
        const {prayerActions} = this.props;
        prayerActions.deletePrayer(data ? data.uid : null);
    }

    //endregion

    //region other

    onPressAdd() {
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING);
    }

    keyExtractor(item, index) {
        return index.toString();
    }

    //endregion

    //region HANDLE HEADER

    onCloseSearchBar() {
        this.setState({
            isSearch: false,
            keySearch: "",
        });
    }

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressMoreOption() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region HANDLE PRAY ITEM

    onPressPrayItem = (item) => () => {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, item);
    }

    onPressDeletePrayer() {
        commonUtils.sendEvent({type : EventRegisterTypes.SHOW_CONFIRM_MODAL});
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
            <PlaceHolder small={true}/>
        )
    }


    renderListFooterComponent() {
        return (<PlaceHolder/>);
    }

    render() {
        const {prays, isSearch, prayerSelected, keySearch} = this.state;
        const {prayerReducer, navigation, prayerActions} = this.props;
        const {fetching} = prayerReducer;
        return (
            [<Container key="container" pointerEvents={fetching ? "none" : "auto"}>

                <Header
                    title={I18n.t('praying')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    searchBar={isSearch}
                    keySearch={keySearch}
                    onChangeTextSearch={this.onChangeKeySearch}
                    onCloseSearchBar={this.onCloseSearchBar}
                />
                <Content>
                    <FlatList
                        data={prays}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderPrayItem}
                        ItemSeparatorComponent={this.renderSeparate}
                        ListFooterComponent={this.renderListFooterComponent}

                    />
                </Content>
            </Container>,
                <ActionSheet
                    key="ActionSheet"
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />,

                <LoadingBar visible={fetching}/>
            ]
        );

    }

    //endregion

}