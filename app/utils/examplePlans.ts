// Example data until the real vault and plans are stored somewhere.
// Files in app/utils are auto-imported by Nuxt, so pages can use these without an import.

export interface Plan {
  id: number;
  title: string;
  type: string;
  progress: number; // percentage, 0 to 100
  selectedVaultIds: number[];
  // What the job asks for (step 2)
  requirements: { id: number; name: string; type: "file" | "link" }[];
}

export const exampleVault = [
  { id: 1, name: "HBO Diploma-ICT" },
  { id: 2, name: "CV" },
  { id: 3, name: "Stage referentie" },
  { id: 4, name: "Portfolio PDF" },
  { id: 5, name: "Motivatiebrief" },
  { id: 6, name: "VOG" },
  { id: 7, name: "Rijbewijs" },
  { id: 8, name: "Certificaat Scrum" },
];

export const examplePlans: Plan[] = [
  {
    id: 1,
    title: "Software developer",
    type: "Sollicitatie",
    progress: 33,
    selectedVaultIds: [1, 2, 3, 4],
    requirements: [
      { id: 1, name: "Motivatiebrief", type: "file" },
      { id: 2, name: "GitHub account", type: "link" },
    ],
  },
  {
    id: 2,
    title: "Front-end developer",
    type: "Sollicitatie",
    progress: 66,
    selectedVaultIds: [2, 4],
    requirements: [{ id: 1, name: "Portfolio website", type: "link" }],
  },
  {
    id: 3,
    title: "Stage data-analist",
    type: "Stage",
    progress: 0,
    selectedVaultIds: [],
    requirements: [],
  },
];

export function findPlan(id: number): Plan | undefined {
  return examplePlans.find((plan) => plan.id === id);
}
