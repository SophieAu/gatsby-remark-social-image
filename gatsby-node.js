const puppeteer = require('puppeteer');
const { createSocialCardImage } = require('./src/social-image');

let browser = null;

exports.onPreInit = async () => {
  browser = await puppeteer.launch({ headless: true });
};

exports.onPostBuild = async () => {
  await browser.close();
};

exports.onCreateNode = async ({ node, actions, createNodeId, store }, options) => {
  if (node.internal.type !== 'MarkdownRemark') return;

  if (options.design === undefined || typeof options.design !== 'function')
    throw new Error('You need to define a design');
  if (options.variables !== undefined && !Array.isArray(options.variables))
    throw new Error('If you define variables do so in an array please');

  try {
    await createSocialCardImage(node, browser, store, { ...actions, createNodeId }, options);
  } catch (e) {
    console.warn(e);
  }
};
