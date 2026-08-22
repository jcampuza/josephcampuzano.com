export const logRuntime = () => {
  const bunVersion = (process.versions as { bun?: string }).bun;

  if (typeof bunVersion === "string") {
    console.log("Using Bun runtime");
    console.log("Bun version", bunVersion);
    return;
  }

  console.log("Using Node runtime", process.versions.node);
};
