import React, {PureComponent} from 'react';
import {
    View
} from 'react-native';

import {style as styles} from "../Style";

export default class CreatePraying extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
    }

    //endregion

    render() {
        const {content, title} = this.state;
        const {createPrayerReducer} = this.props;
        const {fetching} = createPrayerReducer;

        return (
         <View/>
        );
    }

}

