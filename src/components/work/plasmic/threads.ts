// /work/plasmic's threads: one part of the product followed across the
// years, each step a dive. The overview lists them, so a part can be
// followed through time a dive at a time.

export type Thread = { title: string; steps: Array<[string, string]> }

export const THREADS: Array<Thread> = [
  {
    title: "The left side",
    steps: [
      ["2020", "first-comps"],
      ["2020", "rail"],
      ["2021", "docked"],
      ["2021", "globals"],
      ["2022", "tabs"],
      ["2022", "ribbon"],
      ["2022", "rail-again"],
    ],
  },
  {
    title: "Recording a variant",
    steps: [
      ["2020", "variants"],
      ["2021", "takes"],
      ["2021", "recording"],
      ["2022", "rail-again"],
      ["2023", "breadcrumbs"],
    ],
  },
  {
    title: "Search & insert",
    steps: [
      ["2020", "insert"],
      ["2021", "data"],
      ["2022", "tabs"],
      ["2023", "copilot"],
    ],
  },
  {
    title: "Publishing",
    steps: [
      ["2020", "code"],
      ["2021", "publish"],
      ["2023", "publish"],
    ],
  },
  {
    title: "Settings",
    steps: [
      ["2022", "settings"],
      ["2023", "page-settings"],
      ["2023", "app-builder"],
    ],
  },
  {
    title: "Together",
    steps: [
      ["2020", "together"],
      ["2021", "sand"],
      ["2023", "together"],
    ],
  },
  {
    title: "The dashboard",
    steps: [
      ["2020", "projects"],
      ["2021", "teams"],
      ["2023", "dashboard"],
    ],
  },
]
