# Reagent

**Reagent** is a React reconciler-based library for building **MCP orchestration servers** using React’s declarative model instead of traditional UI rendering.

Instead of rendering to the DOM or native UI elements, Reagent lets you build complex MCP servers as React components. These components can:

- Register and route MCP tools (like a Router with nested Routes, but for MCP tools)
- Expose native functionality via native modules (e.g., using `napi-rs` for Rust integration)
- Call and orchestrate remote MCP servers seamlessly as components
- Manage state and lifecycle with React hooks like `useState` and `useEffect`
- Handle events such as `onCall` to respond to MCP calls

The goal is to treat MCP servers and other programs as composable React components and create a MCP Orchestration server. This abstraction blurs the line between UI and backend orchestration, offering a powerful, declarative way to build AI-centric tools.

---

## Status

This project is very much a work in progress — the core reconciler, routing concepts, and native integration ideas are still being prototyped. Contributions and feedback are welcome!

---

## Getting Started

*Instructions to come soon*

---

## License

MIT
