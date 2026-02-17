import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{ background: "#0a0a0b", minHeight: "100vh" }}>
      <header style={{
        borderBottom: "1px solid #2a2a2e",
        padding: "16px 24px",
      }}>
        <div style={{
          maxWidth: 780,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/" style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 16,
          }}>
            {data.site.siteMetadata?.title || "Blog"}
          </Link>
          <span style={{
            fontSize: 12,
            color: "#8b8b96",
            background: "rgba(192,132,252,0.12)",
            border: "1px solid rgba(192,132,252,0.25)",
            padding: "4px 12px",
            borderRadius: 100,
            fontWeight: 500,
            color: "#c084fc",
          }}>
            ⚡ Claude Code
          </span>
        </div>
      </header>
      <main>{children}</main>
      <footer style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "40px 24px",
        borderTop: "1px solid #2a2a2e",
        textAlign: "center",
        fontSize: 14,
        color: "#8b8b96",
      }}>
        Built with Claude Code · Agent Teams
      </footer>
    </div>
  )
}

export default Layout
