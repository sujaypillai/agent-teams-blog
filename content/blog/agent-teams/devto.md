---
title: "I Let Three AI Agents Argue About My Architecture — Here's What Happened"
published: false
description: "How a UX designer, an architect, and a devil's advocate built a better system than I could alone — all inside a single terminal session using Claude Code's Agent Teams."
tags: claudecode, ai, kubernetes, architecture
cover_image: https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_001.png
canonical_url: https://blog.sujaypill.ai/agent-teams/
---

If you've ever tried to find details about a specific CNCF certification exam, you know the pain. The official [CNCF training page](https://www.cncf.io/training/courses/) lists dozens of courses, certifications, and workshops — all in one endless scroll. There's no way to search by exam domain, compare certification weightings side by side, or filter by difficulty level. You're left bouncing between PDFs, GitHub repos, and Linux Foundation pages just to answer a simple question like "What percentage of the CKA exam covers cluster architecture?"

I wanted to fix that — build a clean, searchable hub for all 15 CNCF certification exams. But the design space was wide open. What frontend framework? What search technology? Where to host? How to keep the data in sync with the upstream [curriculum repo](https://github.com/cncf/curriculum)? The kind of project where you can burn an entire day debating "static site generator or full server?" before writing a single line of code. (Spoiler: the finished site is live at [cncfexamguide.sujaypill.ai](https://cncfexamguide.sujaypill.ai).)

Instead, I opened a terminal, typed one prompt, and watched three AI agents debate the architecture *for* me. Three and a half minutes later, I had a synthesized design document that was better than anything I'd have written alone — because one of the agents was specifically hired to **tear the plan apart**.

This is the story of that session, and a deep dive into Claude Code's **Agent Teams** feature — the experimental capability that lets you spawn multiple specialized agents that work in parallel, each with a distinct role and perspective.

## The Challenge: A CNCF Exam Search Website

The [CNCF curriculum repository](https://github.com/cncf/curriculum) contains exam materials for 15 cloud-native certifications — CKA, CKAD, CKS, KCNA, and more. Each exam has PDFs, markdown READMEs listing domains and weightings, and links to study resources.

The goal: build a clean, searchable website where someone preparing for any CNCF exam can quickly find exam domains, compare certifications, and discover resources. Sounds straightforward, but the design space is wide open. What frontend framework? What search technology? Where to host? How much infrastructure is too much?

Rather than spiraling into analysis paralysis, I decided to let Claude Code's Agent Teams feature do what it's designed for — **run multiple perspectives in parallel and synthesize the results**.

## Assembling the Team

Agent Teams lets you launch specialized "teammates" directly from your prompt using the `@teammate-name` syntax. Each teammate runs as an independent Claude Code instance with its own context, tools, and instructions. Here's the prompt I used:

```
I want to build a CNCF Exam Search Website. Use the curriculum repo
at github.com/cncf/curriculum as the data source.

@ux-designer — Focus on information architecture, search UX,
user journeys, exam comparison features, mobile-first, accessibility.

@architect — Focus on Azure Container Apps deployment,
frontend/backend stack, data pipeline from GitHub, search
implementation, CI/CD, infrastructure-as-code.

@devils-advocate — Challenge every assumption. Is ACA overkill?
Are we over-engineering? Cost analysis. Competitive landscape.
What are simpler alternatives?
```

![The prompt that started it all — one input, three agents about to spin up](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_001.png)

The moment I hit Enter, Claude Code spawned three independent agents — each one receiving the full project context plus their specialized role instructions:

- 🎨 **@ux-designer** — Information architecture, search patterns, user journeys, exam comparison features, mobile & accessibility.
- 🏗️ **@architect** — Azure Container Apps, frontend/backend stack, data pipeline, search implementation, CI/CD, IaC with Bicep.
- 😈 **@devils-advocate** — Challenge assumptions. Is ACA overkill? Cost analysis. Simpler alternatives. What could go wrong?

![Three agents launched in parallel with role descriptions visible](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_003.png)

## Watching Them Work: The In-Process Display Mode

Here's where it gets interesting. Claude Code offers two **display modes** for agent teams — and the one I used, **in-process mode**, keeps everything in a single terminal window.

| Feature | In-Process | Split Panes |
|---------|-----------|-------------|
| Terminal setup | Single window | Requires tmux or iTerm2 |
| Navigation | `Shift+↑/↓` to switch agents | Each agent in its own pane |
| Visibility | One agent at a time, status bar for all | All agents visible simultaneously |
| Best for | Quick sessions, any terminal | Long-running parallel work |
| Configuration | `--teammate-mode in-process` | `--teammate-mode split-panes` |

In in-process mode, a **teammate navigation bar** appears at the bottom of the terminal showing all active agents. You can see each agent's name, switch between them, and monitor their progress — all without leaving your terminal.

![All three agents working in parallel — note the teammate bar at the bottom](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_005.png)

> 💡 **Pro Tip:** Press `Ctrl+T` to show all teammates and their status. Press `Shift+↑` to expand and read a specific agent's output. The navigation bar shows token usage and elapsed time per agent.

To configure the display mode, add this to your `.claude/settings.json`:

```json
{
  "teammateMode": "in-process"
}
```

Or pass it as a CLI flag:

```bash
# Use in-process mode (works in any terminal)
claude --teammate-mode in-process

# Use split panes (requires tmux or iTerm2)
claude --teammate-mode split-panes

# Auto-detect: split panes if in tmux, otherwise in-process
claude --teammate-mode auto
```

## Three Minutes, Three Perspectives

While I watched, each agent dove deep into the problem space. They independently read through the CNCF curriculum repository, analyzed the 15 exam PDFs, and produced their recommendations — all running in parallel.

- **0:00 – 0:30** — Agents spawn and begin reading the CNCF curriculum repository. Each one scans all 15 exam directories, PDFs, and markdown files.
- **0:30 – 2:00** — Parallel deep analysis. The UX designer maps user journeys. The architect designs infrastructure. The devil's advocate researches alternatives.
- **2:00 – 3:00** — Agents complete their analysis and report back to the main agent with detailed findings.
- **3:00 – 3:38** — Main agent synthesizes all three reports into a unified design document.

### 🏗️ The Architect's Blueprint

The `@architect` agent came back with a comprehensive infrastructure plan:

![The architect delivers: data pipeline, search strategy, Azure Container Apps setup, and a cost estimate](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_008.png)

Key recommendations from the architect:

- **Data Pipeline:** GitHub Actions ETL process, curriculum repo as a git submodule, Node.js scripts for markdown + PDF extraction, output as static JSON API
- **Search:** [Pagefind](https://pagefind.app) for client-side search — free, zero-latency, sub-100ms results
- **Infrastructure:** Azure Container Apps with scale-to-zero, Azure Front Door CDN, Bicep IaC
- **Cost:** ~$52-60/month at low traffic, ~$300/month at 10K concurrent users
- **Roadmap:** MVP in 2-3 weeks, enhancements in 1-2 weeks, optimization in 1 week

### 😈 The Devil's Advocate Strikes

And then there was the `@devils-advocate`. This is where things got *really* interesting.

![The devil's advocate delivering critical analysis](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_009.png)

The devil's advocate didn't just nitpick — it fundamentally challenged the core assumptions:

> 🔥 "Is Azure Container Apps overkill for a site that's essentially serving static content? You're paying for container orchestration to serve files that change once a quarter."
>
> "Why build a custom search solution when the data fits in a single JSON file? Pagefind works, but have you considered that a simple `ctrl+F` on a well-structured page might be enough for an MVP?"
>
> "The CNCF already has a certifications page. What's your differentiation? If it's just 'better search,' that's a feature, not a product."

## The Synthesis: Where the Magic Happens

Once all three agents reported back, the main agent — the orchestrator — did something I didn't expect. It didn't just concatenate the three reports. It **synthesized** them, identifying consensus points, resolving debates, and producing a unified design document that was stronger than any individual report.

![The main agent synthesizing findings from all three teammates](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_010.png)

The synthesis document had clear sections: **Consensus Points** (where all three agents agreed), **Key Debates** (where they disagreed and how the debates were resolved), and a **Recommended Approach** that incorporated the best ideas from each perspective.

### The Plot Twist: What the Devil's Advocate Changed

This was my favorite part of the entire session. The synthesis included a dedicated section titled **"What the Devil's Advocate Changed"** — a list of concrete ways the critical review *actually improved* the final design:

![The payoff — the devil's advocate made the design genuinely better](https://raw.githubusercontent.com/sujaypillai/agent-teams-blog/main/content/blog/agent-teams/images/frame_013.png)

**Key changes driven by the devil's advocate:**

- **Static generation over SSR** — Why run a server when the data changes quarterly? The final design uses Astro as a static site generator instead of a full server-side rendered app.
- **Pagefind over Azure AI Search for MVP** — The architect initially suggested an upgrade path to Azure AI Search. The devil's advocate argued that client-side search with Pagefind handles the dataset size (15 exams) perfectly, saving ~$200/month.
- **Scale-to-zero validated** — The devil's advocate confirmed that Azure Container Apps' scale-to-zero was appropriate here, but pushed for a cost ceiling and monitoring alerts.
- **Differentiation defined** — Forced the team to articulate why this site needs to exist beyond the CNCF's own page: structured comparison, cross-exam search, and study path recommendations.

This is the real power of agent teams. It's not just about parallelism — it's about **productive disagreement**. The devil's advocate made the architect's plan cheaper, simpler, and more focused. Without it, we'd have an over-engineered system solving the wrong problem.

## Watch the Full Demo

Here's the complete 3.5-minute recording of the session described above — from the initial prompt to the final synthesis. Watch three agents analyze, debate, and converge on a design in real time:

{% youtube yXgHI6qg7JU %}

## Getting Started with Agent Teams

Agent Teams is currently an experimental feature in Claude Code. Here's how to enable it and start your first team:

### Step 1: Enable the Feature

```bash
# Set the environment variable to enable agent teams
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### Step 2: Launch Teammates from Your Prompt

Use the `@teammate-name` syntax directly in your prompt. Give each teammate a clear role and specific focus areas:

```
Refactor the authentication module.

@security-reviewer — Audit the current auth flow for
vulnerabilities. Check token handling, session management, CSRF.

@implementer — Refactor the code to use JWT with refresh
tokens. Update all middleware and route handlers.

@tester — Write comprehensive tests for the new auth flow.
Cover edge cases: expired tokens, concurrent sessions, revocation.
```

### Step 3: Choose Your Display Mode

```bash
# Option A: In-process (default, works everywhere)
claude --teammate-mode in-process

# Option B: Split panes (tmux or iTerm2 required)
claude --teammate-mode split-panes

# Option C: Auto-detect (recommended)
claude --teammate-mode auto
```

### Step 4: Control Your Team

```bash
# Check status of all teammates
/teammate status

# Add a new teammate mid-session
/teammate add

# Remove a specific teammate
/teammate remove security-reviewer

# Emergency stop: press Escape to halt all agents
```

### Best Practices

- **Limit to 3-5 teammates** — More agents means more context and higher costs. Keep teams focused.
- **Give distinct roles** — Overlapping responsibilities lead to redundant work. Each agent should have a clear lane.
- **Always include a critic** — A devil's advocate or reviewer agent consistently improves outcomes by challenging assumptions.
- **Use for parallel independent tasks** — Agent teams shine when work can be divided without constant coordination.

## The Takeaway

What struck me most about this session wasn't the speed — though getting a comprehensive design in 3.5 minutes is remarkable. It was the **quality of the disagreement**.

In a real team, getting a UX designer, a systems architect, and a skeptical reviewer to sit in the same room and hash out a design takes days of calendar wrangling. The feedback loops are slow. The politics are real. And nobody wants to be the one who says "this is over-engineered" in front of the person who designed it.

Agent teams compress all of that into minutes. The devil's advocate has no ego to protect. The architect doesn't take the criticism personally. The UX designer's input is weighted equally. And the synthesis agent — the orchestrator — has the superhuman ability to hold all three perspectives in memory simultaneously and find the intersection.

Is this a replacement for real human collaboration? No. But as a **first pass** — a way to rapidly explore a design space, surface assumptions, and identify the real decisions that need human judgment — it's the most productive 3.5 minutes I've spent on architecture in a long time. And the proof is in the result — the design that came out of this session is now live at [cncfexamguide.sujaypill.ai](https://cncfexamguide.sujaypill.ai).

---

**Resources:**
- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [Display Mode Configuration Guide](https://code.claude.com/docs/en/agent-teams#choose-a-display-mode)
- [CNCF Curriculum Repository](https://github.com/cncf/curriculum)
- [CNCF Exam Guide — The finished site built from this session](https://cncfexamguide.sujaypill.ai)
