import Reconciler, { type ReactContext } from "react-reconciler";
import { ConcurrentRoot } from "react-reconciler/constants.js";
import React, { createContext } from "react";
import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ZodRawShape } from "zod";
import { ToolSet } from "./tool-set.js";

type McpType = "tool" | "resource" | "prompt";

type Node<Shape extends ZodRawShape> = {
  type: "tool";
  name: string;
  shape: Shape;
  onCall: ToolCallback<Shape>;
};

type Type = McpType;
type Props = Node<ZodRawShape>;
type Container = ToolSet<ZodRawShape>;
type Instance = Node<ZodRawShape>;
type TextInstance = never;
type SuspenseInstance = never;
type HydratableInstance = never;
type PublicInstance = {};
type HostContext = any;
type UpdatePayload = any;
type ChildSet = never;
type TimeoutHandle = ReturnType<typeof setTimeout>;
type NoTimeout = -1;
type TransitionStatus = { isTransition: boolean } | null;

const createReconciler = (toolset: ToolSet<ZodRawShape>) =>
  Reconciler<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout,
    TransitionStatus
  >({
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    warnsIfNotActing: false,
    supportsHydration: false,

    createInstance(type, props) {
      if (type === "tool") {
        const { name, shape, onCall } = props;
        return {
          type: "tool",
          name,
          shape,
          onCall,
        };
      }

      throw new Error("Not a tool");
    },

    createTextInstance() {
      throw new Error("Text not supported");
    },

    appendInitialChild(parent, child) {
      toolset.add(child);
    },
    appendChild(parent, child) {
      if (child.type === "tool") {
        toolset.add(child);
      }
    },
    appendChildToContainer(container, child) {
      toolset.add(child);
    },
    insertBefore(parentInstance, child, beforeChild) {},
    removeChild(parent, child) {
      toolset.remove(child);
    },
    removeChildFromContainer(container, child) {
      toolset.remove(child);
    },
    finalizeInitialChildren(instance, type, props, container, host) {
      return true;
    },

    commitUpdate(instance, type, prev, next, fiber) {
      if (prev.name !== next.name) {
        toolset.remove(prev);
        toolset.add(next);
      }
    },

    commitMount(instance, type, props, internalInstanceHandle) {},

    getPublicInstance(instance) {
      return instance;
    },
    prepareForCommit() {
      return null;
    },
    resetAfterCommit(container) {},
    shouldSetTextContent() {
      return false;
    },
    getRootHostContext(context) {
      return context;
    },
    getChildHostContext(context, type, container) {
      return context;
    },
    clearContainer(container) {
      toolset.removeAll();
    },
    preparePortalMount(containerInfo: unknown): void {
      return;
    },
    scheduleTimeout(
      fn: (...args: unknown[]) => unknown,
      delay?: number
    ): number {
      return 1;
    },
    cancelTimeout(id: unknown): void {
      return;
    },
    noTimeout: -1,

    getInstanceFromNode(node: any): Reconciler.Fiber | null | undefined {
      return node;
    },
    beforeActiveInstanceBlur(): void {
      return;
    },
    afterActiveInstanceBlur(): void {
      return;
    },
    prepareScopeUpdate(scopeInstance: any, instance: any): void {
      return;
    },
    getInstanceFromScope(scopeInstance: any) {
      return null;
    },
    detachDeletedInstance(node: unknown): void {
      return;
    },
    NotPendingTransition: null,
    HostTransitionContext: createContext<TransitionStatus>(
      null
    ) as unknown as ReactContext<TransitionStatus>,
    setCurrentUpdatePriority: function (
      newPriority: Reconciler.EventPriority
    ): void {
      return;
    },
    getCurrentUpdatePriority(): Reconciler.EventPriority {
      return 1;
    },
    resolveUpdatePriority(): Reconciler.EventPriority {
      return 1;
    },
    resetFormInstance(form: unknown): void {
      return;
    },
    requestPostPaintCallback: function (
      callback: (time: number) => void
    ): void {
      return;
    },
    shouldAttemptEagerTransition(): boolean {
      return false;
    },
    trackSchedulerEvent(): void {
      return;
    },
    resolveEventType(): null | string {
      return null;
    },
    resolveEventTimeStamp(): number {
      return 1;
    },
    maySuspendCommit(type: unknown, props: unknown): boolean {
      return false;
    },
    preloadInstance(type: unknown, props: unknown): boolean {
      return false;
    },
    startSuspendingCommit(): void {
      return;
    },
    suspendInstance(type: unknown, props: unknown): void {
      return;
    },
    waitForCommitToBeReady():
      | ((
          initiateCommit: (...args: unknown[]) => unknown
        ) => (...args: unknown[]) => unknown)
      | null {
      return null;
    },
  });

const PREFIX = "__REAGENT__";

export async function render(
  element: React.ReactElement,
  mcpServer: McpServer
) {
  const toolset = new ToolSet(mcpServer);
  const reconciler = createReconciler(toolset);
  const root = reconciler.createContainer(
    toolset,
    ConcurrentRoot,
    null,
    false,
    null,
    PREFIX,
    (e) => {
      mcpServer.server.sendLoggingMessage({ level: "critical", data: e });
    },
    null
  );
  reconciler.updateContainer(element, root, null, async () => {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
  });
}
