/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, View, Linking } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import LinkButton from '../../components/LinkButton';
import { _, Settings as t } from '../../utils/i18n';
import SwitchBlockTemplate from '../../components/SwitchBlockTemplate';
import { Config, PayUTC } from '../../redux/actions';
import { PAYUTC_EMAIL } from '../../../config';

class SettingsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);
		this.onLockChange = this.onLockChange.bind(this);
	}

	componentDidMount() {
		this.onRefresh();
	}

	onRefresh() {
		const { lockStatusFetching, dispatch } = this.props;

		if (!lockStatusFetching) {
			dispatch(PayUTC.getLockStatus());
		}
	}

	onLockChange(value) {
		const { dispatch, lockStatusFetching } = this.props;

		if (lockStatusFetching) {
			return;
		}

		dispatch(
			Config.spinner({
				visible: true,
				textContent: value ? t('locking') : t('unlocking'),
			})
		);

		PayUTC.setLockStatus(value).payload.then(([status]) => {
			dispatch(
				Config.spinner({
					visible: false,
				})
			);

			if (status !== true && status !== false) {
				Alert.alert(
					_('error'),
					value ? t('lock_error') : t('unlock_error'),
					[{ text: _('ok') }],
					{}
				);
				return;
			}
			this.onRefresh();
		});
	}

	signOut() {
		const { navigation } = this.props;

		PayUTC.forget().payload.then(() => navigation.navigate('Auth'));
	}

	render() {
		const { lockStatus, lockStatusFetching, navigation } = this.props;

		return (
			<View style={{ flex: 1, backgroundColor: colors.backgroundLight, paddingHorizontal: 15 }}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={lockStatusFetching}
							onRefresh={() => this.onRefresh()}
							colors={[colors.secondary]}
							tintColor={colors.secondary}
						/>
					}
				>
					<View style={{ height: 15 }} />
					<BlockTemplate roundedTop roundedBottom shadow>
						<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
							{t('title')}
						</Text>
					</BlockTemplate>
					<View style={{ height: 15 }} />
					<SwitchBlockTemplate
						roundedTop
						roundedBottom
						value={lockStatusFetching ? false : lockStatus}
						onValueChange={this.onLockChange}
						tintColor={colors.less}
						disabled={lockStatusFetching}
					>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<Text
								style={{
									fontSize: 16,
									fontWeight: 'bold',
									color: lockStatusFetching ? colors.disabled : colors.secondary,
								}}
							>
								{t('lock')}
							</Text>
							<Text
								style={{
									fontSize: 13,
									color: lockStatusFetching ? colors.disabled : colors.secondary,
								}}
							>
								{t('lock_info')}
							</Text>
						</View>
					</SwitchBlockTemplate>
					<View style={{ height: 15 }} />
					<LinkButton text={t('about')} onPress={() => navigation.navigate('About')} />
					<View style={{ height: 15 }} />
					<LinkButton text={t('legal')} onPress={() => navigation.navigate('Legal')} />
					<View style={{ height: 15 }} />
					<LinkButton
						text={t('contact_us')}
						onPress={() =>
							Linking.openURL(`mailto:${PAYUTC_EMAIL}?subject=[App] &body=${t('mail_body')}`)
						}
					/>
					<View style={{ height: 15 }} />
					<LinkButton text={t('sign_out')} color={colors.less} onPress={() => this.signOut()} />
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const lockStatus = payutc.getLockStatus();

	return {
		lockStatus: lockStatus.getData(false),
		lockStatusFetching: lockStatus.isFetching(),
		lockStatusFetched: lockStatus.isFetched(),
	};
};

export default connect(mapStateToProps)(SettingsScreen);
