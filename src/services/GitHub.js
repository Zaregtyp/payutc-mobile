/**
 * Intéragir avec GitHub.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { APP_REPO_NAME, GITHUB_URL, GITHUB_API_URL, GITHUB_CHANGELOG_URL } from '../../config';

import Api from './Api';

class GitHub extends Api {
	TYPE = 'github';

	constructor(url = GITHUB_API_URL) {
		super(url);
	}

	// eslint-disable-next-line class-methods-use-this
	getRepoUrl() {
		return `${GITHUB_URL}${APP_REPO_NAME}`;
	}

	// eslint-disable-next-line class-methods-use-this
	getIssueUrl() {
		return `${GITHUB_URL}${APP_REPO_NAME}/issues`;
	}

	// eslint-disable-next-line class-methods-use-this
	getVersionUrl(version) {
		return `${GITHUB_URL}${APP_REPO_NAME}/releases/tag/${version}`;
	}

	getContributors() {
		return this.call(`repos/${APP_REPO_NAME}/contributors`);
	}

	getUser(user) {
		return this.call(`users/${user}`);
	}

	getLastestRelease() {
		return this.call(`repos/${APP_REPO_NAME}/releases/latest`);
	}

	// eslint-disable-next-line class-methods-use-this
	getChangelog(lang) {
		const parameters = {
			credentials: 'same-origin',
			method: Api.GET,
			headers: Api.HEADERS_JSON,
		};

		return new Promise((resolve, reject) => {
			Api.fetch(
				true,
				resolve,
				reject,
				`${GITHUB_CHANGELOG_URL}${lang}.json`,
				parameters,
				Api.VALID_STATUS,
				true
			);
		});
	}
}

export default new Proxy(new GitHub(), {
	get: (github, method) => {
		if (method.indexOf('#') === -1) {
			return github[method];
		}

		const [realMethod, data] = method.split('#');

		return (...args) => github[realMethod](data, ...args);
	},
});
