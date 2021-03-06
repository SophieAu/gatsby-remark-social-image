[![NPM](https://nodei.co/npm/gatsby-remark-social-image.png)](https://npmjs.org/package/gatsby-remark-social-image)

# gatsby-remark-social-image

A super-flexible but more involved Social Card Image plugin.

Build your own completely custom social card html and css code (which is parametrizable with the values from your post frontmatter) and have it autogenerated on build. All without 3rd party platforms.

## How to install

```bash
npm install gatsby-remark-social-image
```

## How to use

In your `gatsby-node.js` file: 
```jsx
const renderCard = ({title, author}) => `<p>${title}</p><p>${author}</p>`

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-remark-social-image',
      options: { design: renderCard },
    },
  ],
};
```

Be aware that that the parameters in the `renderCard` function will be destructured from the frontmatter of the node you're using it on.
