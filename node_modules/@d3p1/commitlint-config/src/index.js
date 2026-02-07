/**
 * @description Custom configuration for `commitlint`
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 * {@link       https://commitlint.js.org/}
 * {@link       https://www.conventionalcommits.org/en/v1.0.0/}
 */
module.exports = {
  /**
   * @note Load `@commitlint/config-conventional` configuration
   */
  extends: ['@commitlint/config-conventional'],

  /**
   * @note Add parser preset
   */
  parserPreset: './commitlint.parser.js'
};
