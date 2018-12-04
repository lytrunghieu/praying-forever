import React, {Component} from 'react';
import {Container, Header, Content, Form, Item, Input, Label} from 'native-base';

export default class FormComponent extends Component {
    render() {
        const {children ,...rest} = this.props;
        return (
            <Form {...rest}>
                {children}
            </Form>
        );
    }
}