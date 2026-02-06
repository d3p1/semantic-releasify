/**
 * @description Automate release processes using `semantic-release`
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 * @link        https://semantic-release.gitbook.io/semantic-release/
 * @link        https://semantic-release.gitbook.io/semantic-release/developer-guide/js-api
 * @link        https://github.com/esatterwhite/semantic-release-docker
 */
import * as core from '@actions/core';
import semanticRelease from 'semantic-release';

/**
 * Action entry point
 *
 * @returns {Promise<void>} Resolves when the action is completed
 */
export async function run(): Promise<void> {
  try {
    /**
     * @note Check if Docker release is enabled and process related inputs
     * @note If there is an error parsing `docker-args`, then it will be
     *       thrown an error that will be caught and reported
     */
    let dockerRelease: string | [string, {[key: string]: string | undefined}] =
      '';
    if (
      core.getInput('is-docker-release') &&
      core.getBooleanInput('is-docker-release')
    ) {
      const dockerArgs = core.getInput('docker-args');
      const parsedDockerArgs = dockerArgs ? JSON.parse(dockerArgs) : {};

      dockerRelease = [
        '@codedependant/semantic-release-docker',
        {
          dockerRegistry: core.getInput('docker-registry'),
          dockerProject: core.getInput('docker-project'),
          dockerImage: core.getInput('docker-image'),
          dockerFile: core.getInput('docker-file'),
          dockerArgs: parsedDockerArgs
        }
      ];
    }

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
        dockerRelease,
        '@semantic-release/github',
        '@semantic-release/git'
      ]
    });

    /**
     * @note Check release
     */
    if (result) {
      const {commits, nextRelease} = result;
      core.info(
        `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
      );
    } else {
      core.info('No release published.');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

/**
 * @note Execute action
 */
run();
