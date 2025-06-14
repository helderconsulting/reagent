import { ZodRawShape } from "zod";
import type { ToolProps } from "./src/tool.ts";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      tool: ToolProps<ZodRawShape>;
    }
  }
}
