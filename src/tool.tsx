import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ReactNode } from "react";
import type { ZodRawShape } from "zod";

export type ToolProps<Shape extends ZodRawShape> = {
  name: string;
  shape: Shape;
  onCall: ToolCallback<Shape>;
  children?: ReactNode;
};

export type ToolCallHandler<T = {}> = (args: T) => CallToolResult;

export const Tool = <Shape extends ZodRawShape>(props: ToolProps<Shape>) => {
  return <tool {...props} />;
};
