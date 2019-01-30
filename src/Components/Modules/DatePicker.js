import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {DatePicker} from 'native-base';
import {Text} from "../Common/index";
import {ListItem,Body}  from "native-base";
import I18n from '../../I18n/index';
import moment from "moment";
import {Colors} from "../../Themes/index";
import PropTypes from 'prop-types';


export default class DatePickerComponent extends PureComponent {
    constructor(props) {
        super(props);
        if(props.chosenDate){
            this.state = {chosenDate : props.chosenDate };
        }
        else{
            this.state = {chosenDate: new Date()};
        }
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