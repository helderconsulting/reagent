import Reconciler, { type ReactContext } from "react-reconciler";
import { ConcurrentRoot } from "react-reconciler/constants.js";
import React, { createContext } from "react";
import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ZodRawShape } from "zod";

type McpType = "tool" | "resource" | "prompt";
type Node<Shape extends ZodRawShape> = {
  type: "tool";
  name: string;
  shape: Shape;
  onCall: ToolCallback<Shape>;
  nodes: Node<Shape>[];
  append: (nodes: Node<Shape>[]) => void;
};

const update = (container: McpServer): (() => void) | null | undefined => {
  return async () => {
    const transport = new StdioServerTransport();
    await container.connect(transport);
    mcp = container;
  };
};

type Type = McpType;
type Props = Node<ZodRawShape>;
type Container = McpServer;
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

let mcp: McpServer | null = null;

const createReconciler = () =>
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
    // old mode
    supportsMutation: true,
    supportsPersistence: false,
    warnsIfNotActing: false,
    supportsHydration: false,

    // runs before server is connected
    createInstance(type, props) {
      if (type === "tool") {
        const { name, shape, onCall } = props;
        return {
          type: "tool",
          name,
          shape,
          onCall,
          nodes: [],
          append: (nodes) => {
            for (const node of nodes) {
              mcp?.tool(node.name, node.shape, node.onCall);
            }
          },
        };
      }

      throw new Error("Not a tool");
    },

    createTextInstance() {
      throw new Error("Text not supported");
    },

    appendInitialChild(parent, child) {
      if (child.type === "tool") {
        mcp?.server.sendLoggingMessage({
          level: "debug",
          data: {
            message: "appending initial child",
            name: child.name,
          },
        });
        parent.nodes.push(child);
      }
    },
    appendChild(parent, child) {
      if (child.type === "tool") {
        mcp?.server.sendLoggingMessage({
          level: "debug",
          data: {
            message: "appending child",
            name: child.name,
          },
        });
        parent.nodes.push(child);
        parent.append([child]);
      }
    },
    appendChildToContainer(container, child) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "appendChildToContainer",
          name: child.name,
        },
      });
      if (child.type === "tool") {
        container.tool(child.name, child.shape, child.onCall);
        for (const node of child.nodes) {
          mcp?.server.sendLoggingMessage({
            level: "debug",
            data: {
              message: "appending child to container",
              name: node.name,
            },
          });
          container.tool(node.name, node.shape, node.onCall);
        }
      }
    },
    insertBefore(parentInstance, child, beforeChild) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "insertBefore",
          parent: parent.name,
          child: beforeChild.name,
        },
      });
    },
    removeChild(parent, child) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "removeChild",
          parent: parent.name,
          child: child.name,
        },
      });
    },
    removeChildFromContainer(container, child) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "removeChildFromContainer",
          child: child.name,
        },
      });
    },
    finalizeInitialChildren(instance, type, props, container, host) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "finalizeInitialChildren",
          instance,
          type,
          props,
          host,
        },
      });
      // triggers commitMount when true
      return true;
    },

    commitMount(instance, type, props, internalInstanceHandle) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "commitMount",
          instance,
          type,
          props,
        },
      });
    },

    getPublicInstance(instance) {
      return instance;
    },

    commitUpdate(instance, type, prev, next, fiber) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "commitUpdate",
          name: instance.name,
          instance,
          prev: prev.nodes,
          next: next.nodes,
        },
      });
    },
    prepareForCommit() {
      return null;
    },
    resetAfterCommit(container) {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "resetAfterCommit",
        },
      });
    },
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
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "clearContainer",
        },
      });
      if (container.isConnected()) {
        container.close().catch(console.error);
      }
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
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "getInstanceFromNode",
        },
      });
      return node;
    },
    beforeActiveInstanceBlur(): void {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "beforeActiveInstanceBlur",
        },
      });
      return;
    },
    afterActiveInstanceBlur(): void {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "afterActiveInstanceBlur",
        },
      });
      return;
    },
    prepareScopeUpdate(scopeInstance: any, instance: any): void {
      mcp?.server.sendLoggingMessage({
        level: "info",
        data: {
          message: "prepareScopeUpdate",
          scopeInstance,
          instance,
        },
      });
      return;
    },
    getInstanceFromScope(scopeInstance: any) {
      mcp?.server.sendLoggingMessage({
        level: "info",
        data: {
          message: "getInstanceFromScope",
          scopeInstance,
        },
      });
      return null;
    },
    detachDeletedInstance: function (node: unknown): void {
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "detachDeletedInstance",
        },
      });
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
      mcp?.server.sendLoggingMessage({
        level: "debug",
        data: {
          message: "waitForCommitToBeReady",
        },
      });
      return null;
    },
  });

const PREFIX = "__REAGENT__";

export async function render(
  element: React.ReactElement,
  container: McpServer
) {
  const reconciler = createReconciler();
  const root = reconciler.createContainer(
    container,
    ConcurrentRoot,
    null,
    false,
    null,
    PREFIX,
    (e) => {
      container.server.sendLoggingMessage({ level: "critical", data: e });
    },
    null
  );
  reconciler.updateContainer(element, root, null, update(container));
}
