"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
/**
 * @description Automate release processes using `semantic-release`
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 * @link        https://semantic-release.gitbook.io/semantic-release/
 * @link        https://semantic-release.gitbook.io/semantic-release/developer-guide/js-api
 * @link        https://github.com/esatterwhite/semantic-release-docker
 */
const core = __importStar(require("@actions/core"));
const semantic_release_1 = __importDefault(require("semantic-release"));
/**
 * Action entry point
 *
 * @returns {Promise<void>} Resolves when the action is completed
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /**
             * @note Check if Docker release is enabled and process related inputs
             * @note If there is an error parsing `docker-args`, then it will be
             *       thrown an error that will be caught and reported
             */
            const isDockerRelease = core.getInput('is-docker-release') &&
                core.getBooleanInput('is-docker-release');
            const dockerPlugin = isDockerRelease
                ? [
                    [
                        '@codedependant/semantic-release-docker',
                        {
                            dockerRegistry: core.getInput('docker-registry'),
                            dockerProject: core.getInput('docker-project'),
                            dockerImage: core.getInput('docker-image'),
                            dockerFile: core.getInput('docker-file'),
                            dockerArgs: (() => {
                                const dockerArgs = core.getInput('docker-args');
                                return dockerArgs ? JSON.parse(dockerArgs) : {};
                            })()
                        }
                    ]
                ]
                : [];
            /**
             * @note Dispatch release
             */
            const result = yield (0, semantic_release_1.default)({
                branches: [core.getInput('branch')],
                tagFormat: core.getInput('tag-format'),
                plugins: [
                    '@semantic-release/commit-analyzer',
                    '@semantic-release/release-notes-generator',
                    '@semantic-release/changelog',
                    '@semantic-release/npm',
                    ...dockerPlugin,
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
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
        }
    });
}
exports.run = run;
/**
 * @note Execute action
 */
run();
