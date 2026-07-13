import { describe, expect, it } from "vitest";
import type Docker from "dockerode";
import { groupContainers } from "./docker.js";

function fakeContainer(overrides: Partial<Docker.ContainerInfo> = {}): Docker.ContainerInfo {
  return {
    Id: "abcdef1234567890",
    Names: ["/some-container"],
    Image: "some-image:latest",
    State: "running",
    Status: "Up 2 hours",
    Labels: {},
    ...overrides,
  } as Docker.ContainerInfo;
}

describe("groupContainers", () => {
  it("groups containers by their compose project label", () => {
    const groups = groupContainers([
      fakeContainer({
        Id: "111111111111",
        Names: ["/metryx-back"],
        Labels: { "com.docker.compose.project": "metryx", "com.docker.compose.service": "back" },
      }),
      fakeContainer({
        Id: "222222222222",
        Names: ["/metryx-front"],
        Labels: { "com.docker.compose.project": "metryx", "com.docker.compose.service": "front" },
      }),
      fakeContainer({
        Id: "333333333333",
        Names: ["/portfolio-backend"],
        Labels: { "com.docker.compose.project": "portfolio" },
      }),
    ]);

    expect(groups.map((g) => g.project)).toEqual(["metryx", "portfolio"]);
    expect(groups[0].containers.map((c) => c.name)).toEqual(["metryx-back", "metryx-front"]);
    expect(groups[0].containers[0].service).toBe("back");
    expect(groups[0].containers[0].id).toBe("111111111111");
  });

  it("buckets containers without a compose project label as ungrouped", () => {
    const groups = groupContainers([fakeContainer({ Names: ["/one-off"], Labels: {} })]);

    expect(groups).toEqual([
      {
        project: "(sans groupe)",
        containers: [
          {
            id: "abcdef1234567890".slice(0, 12),
            name: "one-off",
            service: null,
            image: "some-image:latest",
            state: "running",
            status: "Up 2 hours",
          },
        ],
        runningCount: 1,
      },
    ]);
  });

  it("counts only running containers and ranks groups by running count", () => {
    const groups = groupContainers([
      fakeContainer({
        Id: "111111111111",
        Names: ["/quiet-app"],
        State: "running",
        Labels: { "com.docker.compose.project": "quiet" },
      }),
      fakeContainer({
        Id: "222222222222",
        Names: ["/busy-app-1"],
        State: "running",
        Labels: { "com.docker.compose.project": "busy" },
      }),
      fakeContainer({
        Id: "333333333333",
        Names: ["/busy-app-2"],
        State: "exited",
        Status: "Exited (0) 2 days ago",
        Labels: { "com.docker.compose.project": "busy" },
      }),
    ]);

    expect(groups.map((g) => g.project)).toEqual(["busy", "quiet"]);
    expect(groups.find((g) => g.project === "busy")?.runningCount).toBe(1);
  });
});
