import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "./blog-post.css"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <article className="blog-post">
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p className="post-meta">
            <span>Sujay Pillai</span>
            <span className="dot">·</span>
            <span>{post.frontmatter.date}</span>
            <span className="dot">·</span>
            <span>{post.timeToRead} min read</span>
          </p>
        </header>
        <section
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </Layout>
  )
}

export const Head = ({ data }) => (
  <Seo
    title={data.markdownRemark.frontmatter.title}
    description={data.markdownRemark.frontmatter.description}
  />
)

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
