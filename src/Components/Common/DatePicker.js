import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {DatePicker} from 'native-base';
import {Text} from "./";
import {ListItem,Body}  from "native-base";
import I18n from '../../I18n';
import moment from "moment";
import {Colors} from "../../Themes";
import PropTypes from 'prop-types';


export default class DatePickerComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {chosenDate: new Date()};
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({chosenDate: newDate});
        const {setDate} = this.props;
        setDate(newDate);
    }

    render() {
        const {label} = this.props;
        const {chosenDate} = this.state;
        return (
            <ListItem>
                <Text>
                    {label}
                </Text>
                <Body>
                <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
                    maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText ={moment(chosenDate).format("DD/MM/YYYY")}
                    textStyle={{color: Colors.red}}
                    placeHolderTextStyle={{color: Colors.red}}
                    onDateChange={this.setDate}
                />
                </Body>
            </ListItem>

        );
    }
}

DatePickerComponent.defaultProps = {
    setDate : () =>{}
};

DatePickerComponent.propTypes = {
    setDate : PropTypes.func
};