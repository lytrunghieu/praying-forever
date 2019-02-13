import React, {PureComponent} from 'react';
import {  EventRegisterTypes} from '../../Constants';
import I18n from '../../I18n/index';
import {commonService} from "../../Service";
import {
    ActionSheet,
} from '../Common/index';
import Proptypes from "prop-types";
import {CommonUtils} from "../../Utils";

export default class ReportModal extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetching: false
        };
        this.onClosed = this.onClosed.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate(nextProps, nextState) {
    }

    //endregion

    onClosed() {
        this.setState({
            data: [],
            fetching: false
        })
    }

    onPressOption = (params) => () => {
        const {user, prayer} = this.params;
        if (params) {
            CommonUtils.sendEvent({
                type: EventRegisterTypes.ADD_REPORT,
                params: {data: {user, prayer, reportType: params}}
            });
        }
        else {
            CommonUtils.sendEvent({
                type: EventRegisterTypes.SHOW_REPORT_INPUT_MODAL,
                params: {data: {user, prayer}}
            });
        }
    }

    //region functions
    open(data) {
        this.refs["moreAction"].open();
        this.params = data;
        this.setState({
            fetching: true
        }, () => {
            let options = [];
            new commonService().getReportOption({forUser: data.user ? true : false}).then(res => {
                if (res.success) {
                    const values = res.data;
                    if (Array.isArray(values) && values.length > 0) {
                        values.map(op => {
                            options.push({
                                text: I18n.t(op.code),
                                onPress: this.onPressOption(op.code)
                            });
                        })
                    }
                }
                options.push({
                    text: I18n.t("reportOtherReason"),
                    onPress: this.onPressOption()
                });
                this.setState({
                    data: options
                });
            }).finally(() => {
                this.setState({
                    fetching: false
                })
            });
        })
    }

    //endregion

    //region RENDERING

    render() {
        const {...rest} = this.props;
        const {data, fetching} = this.state;
        return (
            <ActionSheet
                onClosed={this.onClosed}
                title={I18n.t("reportModalTitle")}
                key="moreAction"
                options={data}
                ref={"moreAction"}
                fetching={fetching}
                {...rest}
            />
        );
    }

    //endregion
}

ReportModal.defaultProps = {};

ReportModal.propTypes = {};