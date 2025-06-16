import { createRoot, render } from "./renderer.js";
import { Tool, type ToolCallHandler } from "./tool.js";
import { useState } from "react";
import z from "zod";

const Test = () => {
  const [count, setCount] = useState(0);

  const handleIncrementCall: ToolCallHandler<{ a: number }> = ({ a }) => {
    setCount((count) => (count += 1));
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };
  const handleGetCountCall: ToolCallHandler = () => {
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };

  const handleDecrementCall: ToolCallHandler = (a) => {
    setCount((count) => (count -= 1));
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  };

  return (
    <>
      <Tool
        name="increment"
        shape={{ a: z.number() }}
        onCall={handleIncrementCall}
      />
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

const root = createRoot({ name: "test", version: "1" });
render(<Test />, root);
