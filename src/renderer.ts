import Reconciler from "react-reconciler";
import React from "react";
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

const reconciler = Reconciler<
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
  supportsMutation: true,

  createInstance(type, props) {
    console.log("createInstance");
    if (type === "tool") {
      const { name, shape, onCall } = props;
      return { type: "tool", name, shape, onCall };
    }

    throw new Error("Not a tool");
  },

  createTextInstance() {
    throw new Error("Text not supported");
  },

  appendInitialChild(parent, child) {
    console.log(`appendChild: ${child.name} to parent: ${parent.name}`);
  },
  appendChild(parent, child) {
    console.log(`appendChild: ${child.name} to parent: ${parent.name}`);
  },
  appendChildToContainer(container, child) {
    console.log(`appendChildToContainer: ${child.name}`);
    if (child.type === "tool") {
      container.tool(child.name, child.shape, child.onCall);
    }
  },
  removeChild() {},
  removeChildFromContainer() {},
  finalizeInitialChildren() {
    return false;
  },
  getPublicInstance(instance) {
    return instance;
  },

  commitUpdate() {
    console.log("commitUpdate");
  },
  prepareForCommit() {
    console.log("prepareForCommit");
    return null;
  },
  resetAfterCommit() {
    console.log("resetAfterCommit");
  },
  shouldSetTextContent() {
    return false;
  },
  getRootHostContext() {
    return null;
  },
  getChildHostContext() {
    return null;
  },
  clearContainer(container) {
    console.log("clearContainer");
    if (container.isConnected()) {
      container.close().catch(console.error);
    }
  },
  supportsPersistence: false,
  preparePortalMount: function (containerInfo: unknown): void {
    return;
  },
  scheduleTimeout: function (
    fn: (...args: unknown[]) => unknown,
    delay?: number
  ): number {
    return 1;
  },
  cancelTimeout: function (id: unknown): void {
    return;
  },
  noTimeout: -1,
  isPrimaryRenderer: false,
  getInstanceFromNode: function (
    node: any
  ): Reconciler.Fiber | null | undefined {
    return node;
  },
  beforeActiveInstanceBlur: function (): void {
    return;
  },
  afterActiveInstanceBlur: function (): void {
    return;
  },
  prepareScopeUpdate: function (scopeInstance: any, instance: any): void {
    console.log("prepareScopeUpdate");
    return;
  },
  getInstanceFromScope: function (scopeInstance: any) {
    console.log("getInstanceFromScope");
    return null;
  },
  detachDeletedInstance: function (node: unknown): void {
    return;
  },
  supportsHydration: false,
  NotPendingTransition: null,
  HostTransitionContext: null as any,
  setCurrentUpdatePriority: function (
    newPriority: Reconciler.EventPriority
  ): void {
    return;
  },
  getCurrentUpdatePriority: function (): Reconciler.EventPriority {
    return 1;
  },
  resolveUpdatePriority: function (): Reconciler.EventPriority {
    return 1;
  },
  resetFormInstance: function (form: unknown): void {
    return;
  },
  requestPostPaintCallback: function (callback: (time: number) => void): void {
    console.log("requestPostPaintCallback");
    return;
  },
  shouldAttemptEagerTransition: function (): boolean {
    return false;
  },
  trackSchedulerEvent: function (): void {
    return;
  },
  resolveEventType: function (): null | string {
    return null;
  },
  resolveEventTimeStamp: function (): number {
    return 1;
  },
  maySuspendCommit: function (type: unknown, props: unknown): boolean {
    return false;
  },
  preloadInstance: function (type: unknown, props: unknown): boolean {
    console.log("preloadInstance");
    return false;
  },
  startSuspendingCommit: function (): void {
    return;
  },
  suspendInstance: function (type: unknown, props: unknown): void {
    return;
  },
  waitForCommitToBeReady: function ():
    | ((
        initiateCommit: (...args: unknown[]) => unknown
      ) => (...args: unknown[]) => unknown)
    | null {
    console.log("waitForCommitToBeReady");
    return null;
  },
});

const PREFIX = "__REAGENT__";

export async function render(element: React.ReactElement, server: McpServer) {
  const root = reconciler.createContainer(
    server,
    0,
    null,
    false,
    null,
    PREFIX,
    (e) => {
      console.error(e);
    },
    null
  );
  reconciler.updateContainer(element, root, null, async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  });
}
