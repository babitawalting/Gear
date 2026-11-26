// app/utils/jobApplicationProgress.ts
// What we remember about a job application plan ("Sollicitatie"). It is saved in the browser (localStorage), one entry per plan id,
// so the progress is still there after a reload and the plan overview can show the same percentage as the plan page.
// Nuxt auto-imports everything in app/utils, so pages can use these functions and lists without an import.
// Later this can move to a database. Only this file would have to change.

// The number of steps in a job application plan
export const jobApplicationStepCount = 3;

// Sample data for now: the documents the vacancy asks for (step 2, "Vacaturevereisten").
// The id is the same as the id of the document in the vault (app/utils/vaultDocuments.ts), so the plan can see
// when the user added that document. Motivatiebrief and VOG are not in the sample vault, so they start as missing
export const jobApplicationRequirements = [
  { id: "hbo-diploma", title: "HBO Diploma - ICT" },
  { id: "cv", title: "CV" },
  { id: "motivation-letter", title: "Motivatiebrief" },
  { id: "certificate-of-conduct", title: "VOG" },
];

// The title a plan gets when the user has not given it one (sample data for now)
export const jobApplicationDefaultTitle = "Software developer";

// All the things the job application page remembers
export interface JobApplicationProgress {
  // The title of the plan, for example "Software developer". Empty means the default title is used
  title: string;
  // How many steps the user concluded (0 to 3): a step is concluded by tapping the next step, the last one with "Plan afronden". Every concluded step is a third of the progress
  completedSteps: number;
  // The documents the user added from the vault, per step: { "1": ["cv", "hbo-diploma"], "2": [], "3": [] }
  evidenceByStep: Record<string, string[]>;
  // Step 2: the ids of the missing requirements the user added with "+ Toevoegen"
  addedRequirementIds: string[];
  // The text in the notes field
  notes: string;
  // True when the plan was shared with someone
  isShared: boolean;
  // The date the plan was archived ("2026-11-14"). Empty means not archived
  archivedAt: string;
}

// A new plan: 0%, no evidence, nothing added yet
export function emptyJobApplicationProgress(): JobApplicationProgress {
  return {
    title: "",
    completedSteps: 0,
    evidenceByStep: { 1: [], 2: [], 3: [] },
    addedRequirementIds: [],
    notes: "",
    isShared: false,
    archivedAt: "",
  };
}

// The key under which the progress of one plan is saved
function storageKey(planId: string): string {
  return `gear-job-application-progress-${planId}`;
}

// Reads the saved progress. Without a saved entry (or on the server, where there is no browser storage) nothing is done yet
export function loadJobApplicationProgress(planId: string): JobApplicationProgress {
  if (typeof window === "undefined") return emptyJobApplicationProgress();
  try {
    const saved = window.localStorage.getItem(storageKey(planId));
    // { ...empty, ...saved } fills in anything that is missing in an older saved entry
    return saved ? { ...emptyJobApplicationProgress(), ...JSON.parse(saved) } : emptyJobApplicationProgress();
  } catch {
    // Storage can be blocked, or the saved text can be broken. Then we start fresh
    return emptyJobApplicationProgress();
  }
}

// Saves the progress of one plan
export function saveJobApplicationProgress(planId: string, progress: JobApplicationProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(planId), JSON.stringify(progress));
  } catch {
    // Storage can be blocked or full. Then the progress is just not saved
  }
}

// Starts a new plan with this title: everything else is empty (0%, no evidence). The plan details screen calls this
export function startJobApplication(planId: string, title: string): void {
  saveJobApplicationProgress(planId, { ...emptyJobApplicationProgress(), title });
}

// True when the plan has this required document: the user added it from the vault in one of the steps,
// or added it with "+ Toevoegen" in step 2
export function hasRequirement(progress: JobApplicationProgress, requirementId: string): boolean {
  const inSomeStep = Object.values(progress.evidenceByStep).some((ids) => ids.includes(requirementId));
  return inSomeStep || progress.addedRequirementIds.includes(requirementId);
}

// Which of the three steps are done, in order. A step is done once the user concluded it,
// and the user can only conclude the steps one after the other
export function jobApplicationDoneSteps(progress: JobApplicationProgress): boolean[] {
  const steps: boolean[] = [];
  for (let step = 1; step <= jobApplicationStepCount; step++) {
    steps.push(progress.completedSteps >= step);
  }
  return steps;
}

// The title to show: the saved one, or the default title when the plan has none yet.
// The plan page and the card on the plan overview both use this, so they always show the same title
export function jobApplicationTitle(progress: JobApplicationProgress): string {
  return progress.title !== "" ? progress.title : jobApplicationDefaultTitle;
}
