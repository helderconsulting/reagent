import { z } from "zod";
import { render } from "./renderer.js";
import { Tool } from "./tool.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { useState } from "react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const meals = [
  "spaghetti",
  "sushi",
  "pokebowl",
  "hamburgers",
  "boerenkool met worst",
  "barbecue slaatje",
  "ribbetjes",
  "soep",
  "wortelpuree met fishsticks",
  "wok",
  "erwtjes en worteljes",
];

type days =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "sunday"
  | string;

const planMealsInput = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "sunday",
  ]),
  meal: z.string(),
});

type PlanMealsInput = z.infer<typeof planMealsInput>;

const MealPlanner = () => {
  const [plan, setPlan] = useState<Record<days, string>>({});

  const handlePlanMealsCall = ({
    day,
    meal,
  }: PlanMealsInput): CallToolResult => {
    setPlan((plan) => ({
      ...plan,
      [day]: meal,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(plan, null, 4) }],
    };
  };

  const handleGetMealsCall = (): CallToolResult => {
    return {
      content: [{ type: "text", text: meals.join(", ") }],
    };
  };

  return (
    <>
      <Tool name="get_meals" shape={{}} onCall={handleGetMealsCall} />
      <Tool
        name="plan_meals"
        shape={planMealsInput.shape}
        onCall={handlePlanMealsCall}
      />
    </>
  );
};

const server = new McpServer({ name: "meal_planner", version: "1.0.0" });
render(<MealPlanner />, server);
