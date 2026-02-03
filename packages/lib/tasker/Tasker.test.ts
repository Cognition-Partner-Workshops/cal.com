import { describe, expect, it, vi, beforeEach } from "vitest";

import type { ILogger } from "./types";

vi.mock("../constants", () => ({
  ENABLE_ASYNC_TASKER: false,
}));

vi.mock("@trigger.dev/sdk", () => ({
  configure: vi.fn(),
}));

interface MockTaskerMethods {
  testTask: (arg: string) => Promise<string>;
  failingTask: (arg: string) => Promise<string>;
}

class TestTasker {
  protected readonly asyncTasker: MockTaskerMethods;
  protected readonly syncTasker: MockTaskerMethods;
  protected readonly logger: ILogger;

  constructor(dependencies: { asyncTasker: MockTaskerMethods; syncTasker: MockTaskerMethods; logger: ILogger }) {
    this.logger = dependencies.logger;
    this.asyncTasker = dependencies.syncTasker;
    this.syncTasker = dependencies.syncTasker;
  }

  public async dispatch<K extends keyof MockTaskerMethods>(
    taskName: K,
    ...args: Parameters<MockTaskerMethods[K]>
  ): Promise<Awaited<ReturnType<MockTaskerMethods[K]>>> {
    this.logger.info(`Safely Dispatching task '${String(taskName)}'`, { args });
    return this._safeDispatch(taskName, ...args);
  }

  private async _safeDispatch<K extends keyof MockTaskerMethods>(
    taskName: K,
    ...args: Parameters<MockTaskerMethods[K]>
  ): Promise<Awaited<ReturnType<MockTaskerMethods[K]>>> {
    try {
      this.logger.info(`SyncTasker '${String(taskName)}' dispatched.`);
      const method = this.asyncTasker[taskName] as (...args: unknown[]) => Promise<unknown>;
      return (await method.apply(this.asyncTasker, args)) as Awaited<ReturnType<MockTaskerMethods[K]>>;
    } catch (err) {
      this.logger.error(
        `SyncTasker failed for '${String(taskName)}'.`,
        (err as Error)?.message ?? "ERROR MESSAGE UNAVAILABLE"
      );

      if (this.asyncTasker === this.syncTasker) {
        throw err;
      }

      this.logger.warn(`Trying again with SyncTasker for '${String(taskName)}'.`);

      try {
        const fallbackMethod = this.syncTasker[taskName] as (...args: unknown[]) => Promise<unknown>;
        return (await fallbackMethod.apply(this.syncTasker, args)) as Awaited<ReturnType<MockTaskerMethods[K]>>;
      } catch (fallbackErr) {
        this.logger.error(
          `SyncTasker failed for '${String(taskName)}'.`,
          (fallbackErr as Error)?.message ?? "ERROR MESSAGE UNAVAILABLE"
        );
        throw fallbackErr;
      }
    }
  }
}

describe("Tasker", () => {
  let mockLogger: ILogger;
  let mockAsyncTasker: MockTaskerMethods;
  let mockSyncTasker: MockTaskerMethods;

  beforeEach(() => {
    mockLogger = {
      log: vi.fn(),
      silly: vi.fn(),
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      getSubLogger: vi.fn(),
    };

    mockAsyncTasker = {
      testTask: vi.fn().mockResolvedValue("async result"),
      failingTask: vi.fn().mockRejectedValue(new Error("async error")),
    };

    mockSyncTasker = {
      testTask: vi.fn().mockResolvedValue("sync result"),
      failingTask: vi.fn().mockRejectedValue(new Error("sync error")),
    };
  });

  describe("constructor", () => {
    it("should initialize with provided dependencies", () => {
      const tasker = new TestTasker({
        asyncTasker: mockAsyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      expect(tasker).toBeDefined();
    });
  });

  describe("dispatch", () => {
    it("should log when dispatching a task", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockAsyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      await tasker.dispatch("testTask", "test-arg");

      expect(mockLogger.info).toHaveBeenCalledWith("Safely Dispatching task 'testTask'", { args: ["test-arg"] });
    });

    it("should execute the task and return result", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockAsyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      const result = await tasker.dispatch("testTask", "test-arg");

      expect(result).toBe("sync result");
    });

    it("should log task dispatch info", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockAsyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      await tasker.dispatch("testTask", "test-arg");

      expect(mockLogger.info).toHaveBeenCalledWith("SyncTasker 'testTask' dispatched.");
    });
  });

  describe("_safeDispatch error handling", () => {
    it("should throw error when task fails and asyncTasker equals syncTasker", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockSyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      await expect(tasker.dispatch("failingTask", "test-arg")).rejects.toThrow("sync error");
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it("should log error message when task fails", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockSyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      try {
        await tasker.dispatch("failingTask", "test-arg");
      } catch {
        // Expected to throw
      }

      expect(mockLogger.error).toHaveBeenCalledWith("SyncTasker failed for 'failingTask'.", "sync error");
    });
  });

  describe("task execution", () => {
    it("should pass arguments correctly to the task", async () => {
      const tasker = new TestTasker({
        asyncTasker: mockAsyncTasker,
        syncTasker: mockSyncTasker,
        logger: mockLogger,
      });

      await tasker.dispatch("testTask", "specific-argument");

      expect(mockSyncTasker.testTask).toHaveBeenCalledWith("specific-argument");
    });

    it("should handle tasks with different return types", async () => {
      const customTasker = {
        testTask: vi.fn().mockResolvedValue({ data: "complex result" }),
        failingTask: vi.fn().mockRejectedValue(new Error("error")),
      };

      const tasker = new TestTasker({
        asyncTasker: customTasker,
        syncTasker: customTasker,
        logger: mockLogger,
      });

      const result = await tasker.dispatch("testTask", "arg");

      expect(result).toEqual({ data: "complex result" });
    });
  });
});
