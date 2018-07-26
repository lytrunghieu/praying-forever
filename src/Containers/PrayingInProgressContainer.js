// Libraries
import React, {PureComponent} from 'react';
import {
    View,
    FlatList
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey} from '../Constants';
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {NavBar, ImageBackground, ActionSheet, ButtonAction, PrayItem, PlaceHolder} from '../Components/Common';
import moment from "moment";

const optionActionSheet = [
    {text: I18n.t('search')},
    {text: I18n.t('deleteAll'), color: Colors.red}
];

class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
    }

    onPressAdd() {
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING);
    }

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressRight() {
        this.refs["moreAction"].open();
    }

    componentDidMount() {
    }

    keyExtractor(item, index) {
        return index.toString();
    }

    renderPrayItem({item}) {
        return (
            <PrayItem
                title={item.title}
                content={item.content}
                date={moment(item.created).format("DD/MM/YYYY")}
            />
        )
    }

    renderSeparate() {
        return (
            <PlaceHolder/>
        )
    }

    renderListHeaderComponent(){
        return (<PlaceHolder/>);
    }

    renderListFooterComponent(){
        return (<PlaceHolder/>);
    }

    render() {
        const {prays} = this.props;

        return (
            <View style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>
                <NavBar title={I18n.t('praying')}
                        onPressLeftButton={this.onPressLeft}
                        iconLeft={Images.menu}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRight}
                />

                <FlatList
                    style={styles.flatList}
                    data={prays}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderPrayItem}
                    ItemSeparatorComponent={this.renderSeparate}
                    ListHeaderComponent ={this.renderListHeaderComponent}
                    ListFooterComponent ={this.renderListFooterComponent}

                />
                <ButtonAction onPress={this.onPressAdd}/>
                <ActionSheet
                    options={optionActionSheet}
                    ref={"moreAction"}
                />

            </View>
        );
    }

}

const mapStateToProps = (state) => ({
    prays: state.commonReducer.prays
})

const mapDispatchToProps = (dispatch) => ({})

export const PrayingInProgressContainer = connect(mapStateToProps, mapDispatchToProps)(PrayingInProgress);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$padding",
        paddingLeft: "$padding",
    }
});