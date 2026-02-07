<div align=center>

# [SEMANTIC RELEASIFY]

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Test](https://github.com/d3p1/semantic-releasify/actions/workflows/test.yml/badge.svg)](https://github.com/d3p1/semantic-releasify/actions/workflows/test.yml)
[![CodeQL](https://github.com/d3p1/semantic-releasify/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/d3p1/semantic-releasify/actions/workflows/codeql-analysis.yml)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

</div>

## Introduction

A tiny [GitHub Action](https://docs.github.com/en/actions) for automated releases, changelogs, and package publishing with [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/). 

> [!NOTE]
> [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) already has a [great explained recipe to configure a GitHub Action using its library](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions). 

The idea of this [GitHub Action](https://docs.github.com/en/actions) is to encapsulate a basic [configuration](https://semantic-release.gitbook.io/semantic-release/usage/configuration) with basic [plugins](https://semantic-release.gitbook.io/semantic-release/usage/plugins) to have a handful and easy way to:

- Generate/update the project `CHANGELOG`. 
- Dispatch a [GitHub release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).
- Update the related [`npm` package](https://www.npmjs.com/) version in the `package.json`.  
- Publish the related [`npm` package](https://www.npmjs.com/).
- Publish the related [Docker image](https://www.docker.com/).

> [!NOTE] 
> For the moment, [it is only possible to publish `npm` packages to `npmjs` registry](https://github.com/d3p1/semantic-releasify/issues/7).

> [!WARNING]
> It is important to understand that this action uses the [`@semantic-release/git`](https://github.com/semantic-release/git), which commit changes to the `package.json`, `package-lock.json` and `CHANGELOG.md`.
> This practice is [discouraged by `semantic-release`](https://semantic-release.gitbook.io/semantic-release/support/faq#making-commits-during-the-release-process-adds-significant-complexity). The main reason is that it adds complexity. For instance, if your release branch is a [protected branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), you must add the [`semantic-release` user as collaborator with admin permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository) and [generate the `GITHUB_TOKEN` by yourself](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions#pushing-package.json-changes-to-your-repository) so it can push the release commit. 

## Usage

See [`action.yml`](./action.yml)

```yaml
- uses: d3p1/semantic-releasify@v1
  with:
    ##
    # @note The branch on which release should happen
    # @note The targeted branch is used by default
    # @link https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches
    ##
    branch: ''

    ##
    # @note The Git tag format used by semantic-release to identify releases
    # @note The `v${version}` is used by default
    # @link https://semantic-release.gitbook.io/semantic-release/usage/configuration#tagformat
    ##
    tag-format: ''

    ##
    # @note Flag to check if it is required to release a Docker image
    ##
    is-docker-release: true
  
    ##
    # @note Docker registry
    # @link https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#options
    ##
    docker-registry: 'registry-1.docker.io'
  
    ##
    # @note Docker project
    # @note If not defined, it is used the scope of the `name` mentioned in `package.json`.
    #       It is your Docker user
    # @link https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#options
    ##
    docker-project: 'd3p1'
  
    ##
    # @note Docker image
    # @note If not defined, it is used the `name` mentioned in `package.json`
    # @link https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#options
    ##
    docker-image: 'app'
  
    ##
    # @note File used to build the image
    # @link https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#options
    ##
    docker-file: 'Dockerfile'
  
    ##
    # @note Docker args
    # @link https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#options
    ##
    docker-args: '{arg1: "value1", arg2: "value2"}'
```

For example:

```yaml
jobs:
  test-action:
    name   : Test
    runs-on: ubuntu-latest

    permissions:
      contents     : write 
      issues       : write 
      pull-requests: write 
      id-token     : write

    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
        
    - uses: d3p1/semantic-releasify@v1
      with:
        is-docker-release: true
        docker-project: 'd3p1'
        docker-image: 'app'
        docker-file: 'Dockerfile'
        docker-args: '{"BASE_NODE_VERSION": "22.21", "BASE_BUN_VERSION": "1.3"}'
      env :
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: ${{secrets.NPM_TOKEN}}
        DOCKER_REGISTRY_USER: ${{ secrets.DOCKER_REGISTRY_USER }}
        DOCKER_REGISTRY_PASSWORD: ${{ secrets.DOCKER_REGISTRY_PASSWORD }}
```

> [!NOTE]
> It is necessary to set the described [`permissions`](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs), so the bot can execute the following actions:
> - `contents: write`: Publish a release.
> - `issues: write`: Comment on released issues.
> - `pull-requests: write`: Comment on released pull requests.
> - `id-token: write`: Enable use of `OIDC` for trusted publishing and `npm` provenance.

> [!NOTE]
> If you want to publish the module/package to [`npm`](https://www.npmjs.com/), it is necessary to [set `private: false` within your `package.json`](https://semantic-release.gitbook.io/semantic-release/support/faq#why-is-the-package) and to [configure the `NPM_TOKEN`](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration) as [secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions). Visit the used [`@semantic-release/npm` plugin for more information](https://github.com/semantic-release/npm).

> [!NOTE]
> Recently, instead of using a `NPM_TOKEN` token to publish, [`npm` recommends the use of `id-token: write` that enables `OIDC`](https://docs.npmjs.com/trusted-publishers). To use `OIDC` authentication, you must configure a trusted publisher for your package, [as explained by the official documentation](https://docs.npmjs.com/trusted-publishers).
> If it is used `OIDC`, you can [enable the setting `Require two-factor authentication and disallow tokens`](https://docs.npmjs.com/trusted-publishers#how-to-configure-maximum-security) to improve you package security.
> Please note that if `OIDC` is not enabled, traditional token-based publishing will be used.

> [!NOTE]
> If you want to publish a [Docker](https://www.docker.com/) image, you must [configure the `DOCKER_REGISTRY_USER` and `DOCKER_REGISTRY_PASSWORD`](https://github.com/esatterwhite/semantic-release-docker?tab=readme-ov-file#configuration) as [secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions). Visit the used [`@codedependant/semantic-release-docker` plugin for more information](https://github.com/esatterwhite/semantic-release-docker).

> [!NOTE] 
> Remember to set the `GITHUB_TOKEN` environment variable using the autogenerated GitHub secret token because it is required by the plugin [`@semantic-release/github`](https://github.com/semantic-release/github) used by this implementation.

## Changelog

Detailed changes for each release are documented in [`CHANGELOG.md`](./CHANGELOG.md).

## License

This work is published under [MIT License](./LICENSE).

## Author

Always happy to receive a greeting on:

- [LinkedIn](https://www.linkedin.com/in/cristian-marcelo-de-picciotto/) 
- [Web](https://d3p1.dev/)
