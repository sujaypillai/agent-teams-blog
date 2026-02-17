import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  return (
    <Layout>
      <div style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "60px 24px",
      }}>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          marginBottom: 40,
        }}>
          Blog
        </h1>
        {posts.map(post => (
          <article key={post.fields.slug} style={{
            background: "#141416",
            border: "1px solid #2a2a2e",
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 20,
          }}>
            <Link to={post.fields.slug} style={{
              textDecoration: "none",
              color: "inherit",
            }}>
              <h2 style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 8,
              }}>
                {post.frontmatter.title}
              </h2>
              <p style={{
                fontSize: 14,
                color: "#8b8b96",
                marginBottom: 8,
              }}>
                {post.frontmatter.date} · {post.timeToRead} min read
              </p>
              <p style={{
                fontSize: 15,
                color: "#8b8b96",
                marginBottom: 0,
              }}>
                {post.frontmatter.description}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Blog" />

export default IndexPage

export const pageQuery = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        timeToRead
        fields { slug }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
