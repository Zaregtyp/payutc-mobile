/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import colors from '../styles/colors';
import BlockTemplate from './BlockTemplate';
import AmountInput from './Home/AmountInput';

export default class AmountForm extends React.Component {
	constructor(props) {
		super(props);

		this.maxLength = 5;
		this.onChange = this.onChange.bind(this);
	}

	onChange(amount) {
		const { onChange } = this.props;

		onChange(amount);
	}

	renderErrorMessage() {
		const { error } = this.props;

		return error ? (
			<Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: colors.error }}>
				{error}
			</Text>
		) : null;
	}

	renderShortcuts() {
		const { shortcuts } = this.props;

		if (!shortcuts) {
			return;
		}

		const shortcutsBlocks = shortcuts.map(shortcut => {
			return (
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					borderForAndroid
					key={shortcut}
					onPress={() => this.onChange(shortcut.toString())}
				>
					<Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>
						{shortcut} €
					</Text>
				</BlockTemplate>
			);
		});

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
				{shortcutsBlocks}
			</View>
		);
	}

	render() {
		const { title, amount } = this.props;

		return (
			<View>
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>{title}</Text>
					<AmountInput
						value={amount}
						maxLength={this.maxLength}
						tintColor={colors.more}
						onChange={this.onChange}
						{...this.props}
					/>
					{this.renderErrorMessage()}
					{this.renderShortcuts()}
				</BlockTemplate>
			</View>
		);
	}
}
