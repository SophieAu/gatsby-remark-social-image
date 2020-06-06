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

exports.onCreateNode = async ({ node, actions, createNodeId, store }, { design }) => {
  if (!isValidNodeType(node.internal.type)) return;

  ensureDesign(design);

  try {
    await createSocialCardImage(node, browser, store, { ...actions, createNodeId }, design);
  } catch (e) {
    console.warn(e);
  }
};
