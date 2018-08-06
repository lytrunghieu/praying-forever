
import React, {PureComponent} from 'react';
import {
    View,
    FlatList
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey} from '../Constants';
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {
    NavBar,
    ImageBackground,
    ActionSheet,
    ButtonAction,
    PrayItem,
    PlaceHolder,
    ConfirmModal,
    HeaderSearch
} from '../Components/Common';
import moment from "moment";
import {CommonActions} from "../actions";
import commonUtils from "../Utils/CommonUtils";
import {AsyncStoreKeys} from "../Constants";


class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: I18n.t('search'), onPress: this.onPressSearch.bind(this)},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDeleteAll.bind(this)}
        ]
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeleteAll = this.onAcceptDeleteAll.bind(this);
        this.onChangeKeySearch = this.onChangeKeySearch.bind(this);
        this.onPressBackSearch = this.onPressBackSearch.bind(this);
        this.state = {
            prays: props.prays.filter(e => e.isFinished),
            isSearch: false,
            keySearch: "",
        };
    }

    //region cycle life

    componentDidMount() {
        commonUtils.retrieveData(AsyncStoreKeys.PRAY_LIST).then(res => {
            if (res) {
                this.props.commonActions.getPrayList(JSON.parse(res));
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prays !== this.props.prays) {
            this.setState({
                prays: nextProps.prays.filter(e => !e.isFinished)
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.keySearch !== this.state.keySearch && nextState.keySearch.length > 3) {
            const {prays} = nextProps;
            const newPrays = prays.filter(e => {
                let contentFormated = commonUtils.trim(e.content).toUpperCase();
                return !e.isFinished && contentFormated.indexOf(nextState.keySearch.toUpperCase()) != -1 ? true : false;
            });
            this.setState({
                prays: newPrays
            })
        }

        if (!nextState.isSearch && this.state.isSearch && !nextState.keySearch) {
            this.setState({
                prays: nextProps.prays.filter(e => !e.isFinished)
            });
        }
    }

    //endregion

    //region handle header search

    onChangeKeySearch(value) {
        this.setState({
            keySearch: value
        });
        const {prays} = this.props;
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
        this.refs["moreAction"].close();
    }

    onPressDeleteAll() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle modal confirm
    onAcceptDeleteAll() {
        this.props.commonActions.deleteAllPrayInprogress();
        this.refs["confirm"].close();
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

    //region handle Header

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressRight() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region handle Pray Iteam
    onPressPrayItem(item) {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, item);
    }

    onPressFinish(item) {
        this.props.commonActions.changeStatusPray({status: true, pray: item});
    }

    onPressDeleteSpecificPray(item) {
        this.props.commonActions.deletePray(item);
    }


    //endregion

    //region rendering

    renderPrayItem({item}) {
        const leftOptions = [
            {
                text: I18n.t("finished"),
                onPress: this.onPressFinish.bind(this, item)
            },
            {
                text: I18n.t("delete"),
                backgroundColor: Colors.red,
                onPress: this.onPressDeleteSpecificPray.bind(this, item)
            }
        ]

        return (
            <PrayItem
                title={item.title}
                content={item.content}
                date={moment(item.created).format("DD/MM/YYYY")}
                onPress={this.onPressPrayItem.bind(this, item)}
                leftOptions={leftOptions}
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
        const {prays, isSearch} = this.state;
        return (
            <View style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>

                {
                    isSearch &&
                    <HeaderSearch
                        fit={true}
                        value={this.state.keySearch}
                        onChangeText={this.onChangeKeySearch}
                        onPressRightIcon={this.onChangeKeySearch.bind(this, "")}
                        onPressLeftButton={this.onPressBackSearch}
                    />
                    ||
                    <NavBar title={I18n.t('praying')}
                            onPressLeftButton={this.onPressLeft}
                            iconLeft={Images.menu}
                            iconRight={Images.more}
                            onPressRightButton={this.onPressRight}
                    />
                }


                <FlatList
                    style={styles.flatList}
                    data={prays}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderPrayItem}
                    ItemSeparatorComponent={this.renderSeparate}
                    ListHeaderComponent={this.renderListHeaderComponent}
                    ListFooterComponent={this.renderListFooterComponent}

                />
                <ButtonAction onPress={this.onPressAdd}/>
                <ActionSheet
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />
                <ConfirmModal
                    ref={"confirm"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirmAll")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDeleteAll}
                />

            </View>
        );
    }

    //endregion

}

const mapStateToProps = (state) => ({
    prays: state.commonReducer.prays
})

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(CommonActions, dispatch)
})

export const PrayingInProgressContainer = connect(mapStateToProps, mapDispatchToProps)(PrayingInProgress);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});