import React, { Component } from 'react';
import {} from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'proptypes';

// import { Container } from './styles';

export default class Repository extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repository').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {};

    render() {
        const { navigation } = this.props;
        const { html_url } = navigation.getParam('repository');

        return <WebView source={{ uri: html_url }} style={{ flex: 1 }} />;
    }
}
