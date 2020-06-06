const puppeteer = require('puppeteer');
const { createSocialCardImage } = require('./src/social-image');

let browser = null;

exports.onPreInit = async () => {
  browser = await puppeteer.launch({ headless: true });
};

exports.onPostBuild = async () => {
  await browser.close();
};

const isValidNodeType = type => {
  if (type === 'MarkdownRemark') return true;
  if (type === 'Mdx') return true;

  return false;
};

const ensureDesign = design => {
  if (design === undefined || typeof design !== 'function')
    throw new Error('You need to define a design');
};

const ensureVariables = variables => {
  if (variables !== undefined && !Array.isArray(variables))
    throw new Error('If you define variables do so in an array please');
};

exports.onCreateNode = async ({ node, actions, createNodeId, store }, options) => {
  if (!isValidNodeType(node.internal.type)) return;

  ensureDesign(options.design);
  ensureVariables(options.variables);

  try {
    await createSocialCardImage(node, browser, store, { ...actions, createNodeId }, options);
  } catch (e) {
    console.warn(e);
  }
};
