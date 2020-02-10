import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name
            ? navigation.getParam('user').name
            : navigation.getParam('user').login,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: true,
        page: 1,
        refreshing: false,
    };

    componentDidMount() {
        this.loadStarred();
    }

    loadStarred = async (page = 1) => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const { stars } = this.state;

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
            },
        });

        this.setState({
            stars: page >= 2 ? [...stars, ...response.data] : response.data,
            loading: false,
            page,
            refreshing: false,
        });
    };

    loadMore = () => {
        const { page } = this.state;
        const nextPage = page + 1;
        this.loadStarred(nextPage);
    };

    refreshList = () => {
        this.setState({ refreshing: true });
        this.loadStarred();
    };

    handleNavigate = repository => {
        const { navigation } = this.props;

        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading, refreshing } = this.state;

        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name ? user.name : user.login}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <ActivityIndicator size={29} color="#7159c1" />
                ) : (
                    <Stars
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        onRefresh={this.refreshList}
                        refreshing={refreshing}
                        renderItem={({ item }) => (
                            <Starred onPress={() => this.handleNavigate(item)}>
                                <OwnerAvatar
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )}
            </Container>
        );
    }
}
