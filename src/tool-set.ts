import type {
  McpServer,
  RegisteredTool,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZodRawShape } from "zod";

type Node<Shape extends ZodRawShape> = {
  type: "tool";
  name: string;
  shape: Shape;
  onCall: ToolCallback<Shape>;
};

export class ToolSet<Shape extends ZodRawShape> {
  private tools = new Map<string, RegisteredTool>();

  constructor(private mcpServer: McpServer) {}

  add(node: Node<Shape>) {
    if (this.mcpServer.isConnected()) {
      this.mcpServer.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "adding a tool",
          name: node.name,
        },
      });
    }
    const registeredTool = this.mcpServer.tool(
      node.name,
      node.shape,
      node.onCall
    );
    this.tools.set(node.name, registeredTool);
  }

  remove(node: Node<Shape>) {
    if (this.mcpServer.isConnected()) {
      this.mcpServer.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "removing a tool",
          name: node.name,
        },
      });
    }
    const tool = this.tools.get(node.name);
    if (tool) {
      this.tools.delete(node.name);
      tool.remove();
    }
  }

  removeAll() {
    if (this.mcpServer.isConnected()) {
      this.mcpServer.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "removing all tools",
        },
      });
    }
    this.tools.forEach((tool) => tool.remove());
    this.tools.clear();
  }
}
