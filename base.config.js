module.exports = {
  //Infrastructure settings
  binarySource: "global",
  platform: "gitlab",
  endpoint: "https://private.gitlab/api/v4",
  token: `${process.env.TOKEN}`,
  npmrc:
    "registry=https://private.com/artifactory/api/npm/npm\n:registry=https://private.com/artifactory/api/npm/foo-application-public-npm-local/",
  fetchChangeLogs: "off",
  hostRules: [
    {
      timeout: 10000, //Set timeout for external requests to 10s
    },
  ],

  //Dependency update configuration (extends equals config:base without prLimit settings)
  extends: [
    ":separateMajorReleases",
    ":combinePatchMinorReleases",
    ":ignoreUnstable",
    ":prImmediately",
    ":semanticPrefixFixDepsChoreOthers",
    ":updateNotScheduled",
    ":automergeDisabled",
    ":ignoreModulesAndTests",
    "group:monorepos",
    "group:recommended",
    "helpers:disableTypesNodeMajor",
    "workarounds:all",
    ":dependencyDashboard",
    "customManagers:dockerfileVersions",
  ],
  labels: ["renovate"],
  prConcurrentLimit: 1,
  branchConcurrentLimit: 0,
  bumpVersion: "patch",
  pinDigests: true,
  platformAutomerge: true,

  //Enable autodiscovery for GitLab group (discover all projects within bahnid group, except the listed ones)
  autodiscover: true,
  autodiscoverFilter: [
    `foo/${
      process.env.PROJECT ||
      "!(stuff-+(foo-bar|minikube-local|onboarding-guide))"
    }`,
    "team/team-operations/*",
  ],
};
