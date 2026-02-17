const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          fields { slug }
        }
      }
    }
  `)
  result.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/blog-post.js"),
      context: { slug: node.fields.slug },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent)
    const slug = `/${fileNode.relativeDirectory.split("/").pop()}/`
    createNodeField({ name: "slug", node, value: slug })
  }
}
