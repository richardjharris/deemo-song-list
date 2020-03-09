/* config-overrides.js */
const { useBabelRc, override } = require('customize-cra')

/* If using Create React App, we need to specify an override to use .babaelrc
 * without ejecting
 */

module.exports = override(
    useBabelRc()
);
