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
  const [visible, setVisible] = useState(false);
  const [plan, setPlan] = useState<Record<days, string>>({});
  const text = visible ? "visible" : "invisible";
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

  const handleToggleCall = (): CallToolResult => {
    setVisible(!visible);
    return {
      content: [{ type: "text", text: "toggling new tool" }],
    };
  };

  const handleToggledCall = (): CallToolResult => {
    return {
      content: [{ type: "text", text: "it works" }],
    };
  };

  const handleVisibilityCall = (): CallToolResult => {
    return {
      content: [{ type: "text", text }],
    };
  };

  const handleOverviewCall = (): CallToolResult => {
    return {
      content: [{ type: "text", text: JSON.stringify(plan, null, 4) }],
    };
  };

  return (
    <>
      <Tool name="get_meals" shape={{}} onCall={handleGetMealsCall} />
      <Tool name="toggle" shape={{}} onCall={handleToggleCall}>
        <Tool name="show_visibility" shape={{}} onCall={handleVisibilityCall} />
        {visible ? (
          <Tool
            name="only_visible_when_toggled"
            shape={{}}
            onCall={handleToggledCall}
          />
        ) : null}
      </Tool>
      <Tool
        name="plan_meals"
        shape={planMealsInput.shape}
        onCall={handlePlanMealsCall}
      >
        <Tool name="overview" shape={{}} onCall={handleOverviewCall} />
      </Tool>
    </>
  );
};

const server = new McpServer(
  { name: "meal_planner", version: "1.0.0" },
  {
    capabilities: {
      logging: {},
    },
  }
);
render(<MealPlanner />, server);
