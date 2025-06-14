import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ReactNode } from "react";
import type { ZodRawShape } from "zod";

export type ToolProps<Shape extends ZodRawShape> = {
  name: string;
  shape: Shape;
  onCall: ToolCallback<Shape>;
  children?: ReactNode;
};

export const Tool = <Shape extends ZodRawShape>(props: ToolProps<Shape>) => {
  console.log(`Tool: ${props.name}`);
  return <tool {...props} />;
};
