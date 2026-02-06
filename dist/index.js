/**
 * @description Automate release processes using `semantic-release`
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 * @link        https://semantic-release.gitbook.io/semantic-release/
 * @link        https://semantic-release.gitbook.io/semantic-release/developer-guide/js-api
 */
import * as core from '@actions/core';
import semanticRelease from 'semantic-release';
/**
 * Action entry point
 *
 * @returns {Promise<void>} Resolves when the action is completed
 */
export async function run() {
    try {
        /**
         * @note Dispatch release
         */
        const result = await semanticRelease({
            branches: [core.getInput('branch')],
            tagFormat: core.getInput('tag-format'),
            plugins: [
                '@semantic-release/commit-analyzer',
                '@semantic-release/release-notes-generator',
                '@semantic-release/changelog',
                '@semantic-release/npm',
                '@semantic-release/github',
                '@semantic-release/git'
            ]
        });
        /**
         * @note Check release
         */
        if (result) {
            const { commits, nextRelease } = result;
            core.info(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`);
        }
        else {
            core.info('No release published.');
        }
    }
    catch (error) {
        /**
         * @note Fail the workflow run if an error occurs
         */
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
/**
 * @note Execute action
 */
run();
//# sourceMappingURL=index.js.map