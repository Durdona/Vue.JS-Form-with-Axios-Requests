// module.exports = {
//   stories: ['../../src/**/*.stories.(js|jsx|ts|tsx|mdx)'],
//   addons: [
//     '@storybook/addon-actions',
//     '@storybook/addon-knobs',
//     '@storybook/addon-links',
//     '@storybook/addon-notes'
//   ]
// }

module.exports = {
	stories: [ '../../src/**/*.components.(js|jsx|ts|tsx|mdx)' ],
	addons: [ '@storybook/addon-actions', '@storybook/addon-knobs', '@storybook/addon-links', '@storybook/addon-notes' ]
};
