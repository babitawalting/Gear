// app/utils/diplomaDescriptionProgress.ts
// What we remember about a diploma description plan ("Diplomabeschrijving aanvragen"). It is saved in the browser (localStorage),
// one entry per plan id, so the progress is still there after a reload and the plan overview can show the same percentage as the plan page.
// Nuxt auto-imports everything in app/utils, so pages can use these functions and lists without an import.
// Later this can move to a database. Only this file would have to change.

// The number of steps in a diploma description plan
export const diplomaDescriptionStepCount = 4;

// The diploma that gets a different route: an MBO diploma is not described by Nuffic but by SBB
const mboDiploma = "MBO";

// True when the plan is for an MBO diploma. The text of steps 2, 3 and 4 changes then (see the plan page)
export function isMboDiploma(diploma: string): boolean {
  return diploma === mboDiploma;
}

// True for the diplomas higher than secondary school (voortgezet onderwijs): HBO and WO.
// Only for these the user also needs an overview of their education (see diplomaDescriptionRequirements)
export function isHigherEducation(diploma: string): boolean {
  return diploma.startsWith("HBO") || diploma.startsWith("WO");
}

// The documents the user needs (step 2, "Wat heb ik al?"). The first one has the name of the chosen diploma ("VWO diploma"),
// so every diploma gets its own text. Without a chosen diploma it says "Uw diploma".
// An MBO diploma only needs the diploma itself for now (SBB, not Nuffic, makes that description)
export function diplomaDescriptionRequirements(diploma: string): { id: string; title: string }[] {
  const diplomaDocument = { id: "diploma", title: diploma !== "" ? `${diploma} diploma` : "Uw diploma" };
  if (isMboDiploma(diploma)) return [diplomaDocument];
  // Short names: a longer name does not fit on one line next to the "+ Toevoegen" button
  const requirements = [diplomaDocument, { id: "subject-overview", title: "Vakkenoverzicht" }];
  // The overview of the education is only needed for a diploma higher than secondary school
  if (isHigherEducation(diploma)) {
    requirements.push({ id: "education-overview", title: "Overzicht opleidingen" });
  }
  requirements.push({ id: "passport-copy", title: "Kopie van paspoort" });
  return requirements;
}

// The title a plan gets when the user has not given it one
export const diplomaDescriptionDefaultTitle = "Diplomabeschrijving aanvragen";

// All the things the diploma description page remembers
export interface DiplomaDescriptionProgress {
  // The title of the plan, for example "HAVO beschrijving". Empty means the default title is used
  title: string;
  // The diploma the plan is for, for example "VWO" (the title of the choice on the diploma screen). Empty means unknown
  diploma: string;
  // How many steps the user concluded (0 to 4): a step is concluded by tapping the next step, the last one with "Plan afronden".
  // Every concluded step is a quarter of the progress
  completedSteps: number;
  // The documents the user added from the vault, per step: { "1": [], "2": ["havo-diploma"], ... }
  evidenceByStep: Record<string, string[]>;
  // Step 2: the ids of the missing requirements the user added with "+ Toevoegen"
  addedRequirementIds: string[];
  // The text in the notes field
  notes: string;
  // True when the plan was shared with someone
  isShared: boolean;
  // The date the plan was archived ("2026-11-14"). Empty means not archived
  archivedAt: string;
  // True when the user said in step 1 that the description is not needed: the plan is cancelled and leaves the overview
  isCancelled: boolean;
}

// A new plan: 0%, no evidence, nothing added yet
export function emptyDiplomaDescriptionProgress(): DiplomaDescriptionProgress {
  return {
    title: "",
    diploma: "",
    completedSteps: 0,
    evidenceByStep: { 1: [], 2: [], 3: [], 4: [] },
    addedRequirementIds: [],
    notes: "",
    isShared: false,
    archivedAt: "",
    isCancelled: false,
  };
}

// The key under which the progress of one plan is saved
function storageKey(planId: string): string {
  return `gear-diploma-description-progress-${planId}`;
}

// Reads the saved progress. Without a saved entry (or on the server, where there is no browser storage) nothing is done yet
export function loadDiplomaDescriptionProgress(planId: string): DiplomaDescriptionProgress {
  if (typeof window === "undefined") return emptyDiplomaDescriptionProgress();
  try {
    const saved = window.localStorage.getItem(storageKey(planId));
    // { ...empty, ...saved } fills in anything that is missing in an older saved entry
    return saved ? { ...emptyDiplomaDescriptionProgress(), ...JSON.parse(saved) } : emptyDiplomaDescriptionProgress();
  } catch {
    // Storage can be blocked, or the saved text can be broken. Then we start fresh
    return emptyDiplomaDescriptionProgress();
  }
}

// Saves the progress of one plan
export function saveDiplomaDescriptionProgress(planId: string, progress: DiplomaDescriptionProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(planId), JSON.stringify(progress));
  } catch {
    // Storage can be blocked or full. Then the progress is just not saved
  }
}

// Starts a new plan with this title and diploma: everything else is empty (0%, no evidence). The plan details screen calls this
export function startDiplomaDescription(planId: string, title: string, diploma: string): void {
  saveDiplomaDescriptionProgress(planId, { ...emptyDiplomaDescriptionProgress(), title, diploma });
}

// True when the plan has this required document: the user added it from the vault in one of the steps,
// or added it with "+ Toevoegen" in step 2
export function hasDiplomaRequirement(progress: DiplomaDescriptionProgress, requirementId: string): boolean {
  const inSomeStep = Object.values(progress.evidenceByStep).some((ids) => ids.includes(requirementId));
  return inSomeStep || progress.addedRequirementIds.includes(requirementId);
}

// Which of the four steps are done, in order. A step is done once the user concluded it,
// and the user can only conclude the steps one after the other
export function diplomaDescriptionDoneSteps(progress: DiplomaDescriptionProgress): boolean[] {
  const steps: boolean[] = [];
  for (let step = 1; step <= diplomaDescriptionStepCount; step++) {
    steps.push(progress.completedSteps >= step);
  }
  return steps;
}

// The title to show: the saved one, or the default title when the plan has none yet.
// The plan page and the card on the plan overview both use this, so they always show the same title
export function diplomaDescriptionTitle(progress: DiplomaDescriptionProgress): string {
  return progress.title !== "" ? progress.title : diplomaDescriptionDefaultTitle;
}
