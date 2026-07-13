import Docker from "dockerode";

export interface DockerContainer {
  id: string;
  name: string;
  service: string | null;
  image: string;
  state: string;
  status: string;
}

export interface DockerGroup {
  project: string;
  containers: DockerContainer[];
  runningCount: number;
}

export interface DockerInfo {
  available: boolean;
  groups: DockerGroup[];
}

const UNGROUPED = "(sans groupe)";

// Talks to a docker-socket-proxy (see docker-compose.yml), never to the real
// Docker socket directly: the proxy only allows GET on /containers, so a
// compromised back process can list containers but can't create, start,
// stop or exec into anything.
const docker = new Docker({
  host: process.env.DOCKER_PROXY_HOST ?? "127.0.0.1",
  port: Number(process.env.DOCKER_PROXY_PORT ?? 2375),
});

export function groupContainers(containers: Docker.ContainerInfo[]): DockerGroup[] {
  const byProject = new Map<string, DockerContainer[]>();

  for (const c of containers) {
    const project = c.Labels["com.docker.compose.project"] || UNGROUPED;
    const container: DockerContainer = {
      id: c.Id.slice(0, 12),
      name: (c.Names[0] ?? c.Id).replace(/^\//, ""),
      service: c.Labels["com.docker.compose.service"] ?? null,
      image: c.Image,
      state: c.State,
      status: c.Status,
    };

    const group = byProject.get(project);
    if (group) {
      group.push(container);
    } else {
      byProject.set(project, [container]);
    }
  }

  return [...byProject.entries()]
    .map(([project, containers]) => ({
      project,
      containers: containers.sort((a, b) => a.name.localeCompare(b.name)),
      runningCount: containers.filter((c) => c.state === "running").length,
    }))
    .sort((a, b) => b.runningCount - a.runningCount || a.project.localeCompare(b.project));
}

export async function getDockerInfo(): Promise<DockerInfo> {
  try {
    const containers = await docker.listContainers({ all: true });
    return { available: true, groups: groupContainers(containers) };
  } catch {
    return { available: false, groups: [] };
  }
}
