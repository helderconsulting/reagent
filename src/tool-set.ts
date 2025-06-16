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
    const registeredTool = this.mcpServer.tool(
      node.name,
      node.shape,
      node.onCall
    );
    this.tools.set(node.name, registeredTool);
  }

  update(name: string, node: Node<Shape>) {
    const tool = this.tools.get(name);
    if (tool) {
      this.tools.delete(name);
      tool.remove();
      this.add(node);
    }
  }

  remove(node: Node<Shape>) {
    const tool = this.tools.get(node.name);
    if (tool) {
      this.tools.delete(node.name);
      tool.remove();
    }
  }

  removeAll() {
    this.tools.forEach((tool) => tool.remove());
    this.tools.clear();
  }
}
