const { createHash } = require('crypto');
const { writeFile } = require('fs');
const { resolve } = require('path');
const { promisify } = require('util');
const fs = require(`fs-extra`);
const { createFileNode } = require(`gatsby-source-filesystem/create-file-node`);
const writeFileAsync = promisify(writeFile);

async function writeCachedFile(CACHE_DIR, key, contents, extension) {
  const hash = createHash('md5').update(key).digest('hex');

  const absolutePath = resolve(CACHE_DIR, `${hash}.${extension}`);
  await writeFileAsync(absolutePath, contents);
  return absolutePath;
}

const postToImage = async (CACHE_DIR, browser, post, design, variables) => {
  const imageFileExtension = 'png';

  const vars = {};
  variables.map(varb => {
    vars[varb] = post.frontmatter[varb];
  });

  const filePath = await writeCachedFile(CACHE_DIR, post.id, design(vars), 'html');
  const page = await browser.newPage();

  await page.goto(`file://${filePath}`);
  await page.evaluateHandle('document.fonts.ready');
  await page.setViewport({ width: 1200, height: 630 });
  const file = await page.screenshot({ type: imageFileExtension });

  return writeCachedFile(CACHE_DIR, post.id, file, imageFileExtension);
};

exports.createSocialCardImage = async (
  parentNode,
  browser,
  store,
  actions,
  { design = '', variables = [] }
) => {
  const { createNode, createNodeField, createNodeId } = actions;

  const CACHE_DIR = resolve(`${store.getState().program.directory}/.cache/social/`);
  await fs.ensureDir(CACHE_DIR);

  const ogImagePath = await postToImage(CACHE_DIR, browser, parentNode, design, variables);
  const imageFileNode = await createFileNode(ogImagePath, createNodeId);
  imageFileNode.parent = parentNode.id;
  createNode(imageFileNode, { name: `gatsby-source-filesystem` });

  createNodeField({
    node: parentNode,
    name: 'socialImage___NODE',
    value: imageFileNode.id,
  });
};
