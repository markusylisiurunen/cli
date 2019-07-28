/**
 * @overview Tests for the help module.
 */

import help from "@/flags/help";

import FlagTypeString from "@/flags/types/string";

describe("flags/help", (): void => {
  it("wip", (): void => {
    help("deploy", "Deploy a service to a Kubernetes cluster.", [
      new FlagTypeString("service", "s", "Service to deploy.", {}),
      new FlagTypeString("environment", null, "Environment to deploy to.", {}),
    ]);
  });
});
