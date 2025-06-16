import { render } from "./renderer.js";
import { Tool } from "./tool.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { useState } from "react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const server = new McpServer(
  { name: "meal_planner", version: "1.0.0" },
  {
    capabilities: {
      logging: {},
    },
  }
);

const MealPlanner = () => {
  const [count, setCount] = useState(0);

  const handleIncrementCall = (): CallToolResult => {
    setCount((count) => (count += 1));
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };
  const handleGetCountCall = (): CallToolResult => {
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };

  const handleDecrementCall = (): CallToolResult => {
    setCount((count) => (count -= 1));
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };

  return (
    <>
      <Tool name="increment" shape={{}} onCall={handleIncrementCall} />
      <Tool name={count.toString()} shape={{}} onCall={handleDecrementCall} />
      <Tool name={"get_count"} shape={{}} onCall={handleGetCountCall} />
      {count > 1 ? (
        <Tool name={"bigger_than_one"} shape={{}} onCall={handleDecrementCall}>
          <Tool
            name={"activated_when_parent_mounts"}
            shape={{}}
            onCall={handleDecrementCall}
          />
        </Tool>
      ) : null}
    </>
  );
};

render(<MealPlanner />, server);
