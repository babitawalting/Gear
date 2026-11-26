// app/utils/jobApplicationProgress.ts
// What we remember about a job application plan ("Sollicitatie"). It is saved in the browser (localStorage), one entry per plan id,
// so the progress is still there after a reload and the plan overview can show the same percentage as the plan page.
// Nuxt auto-imports everything in app/utils, so pages can use these functions and lists without an import.
// Later this can move to a database. Only this file would have to change.

// One document in a list of the plan
export interface JobApplicationDocument {
  id: string;
  // The name of the document, in Dutch
  title: string;
}

// Sample data for now: the documents the user already has in the vault (step 1, "Wat heb ik al?")
export const jobApplicationVaultDocuments: JobApplicationDocument[] = [
  { id: "hbo-diploma", title: "HBO Diploma-ICT" },
  { id: "cv", title: "CV" },
  { id: "internship-reference", title: "Stage referentie" },
  { id: "portfolio", title: "Portfolio PDF" },
];

// Sample data for now: the documents the vacancy asks for (step 2, "Vacaturevereisten").
// `inVault` is true when the user already has it in the vault
export const jobApplicationRequirements: (JobApplicationDocument & { inVault: boolean })[] = [
  { id: "hbo-diploma", title: "HBO Diploma-ICT", inVault: true },
  { id: "cv", title: "CV", inVault: true },
  { id: "motivation-letter", title: "Motivatiebrief", inVault: false },
  { id: "certificate-of-conduct", title: "VOG", inVault: false },
];

// Sample data for now: documents that are not required, but can make the application stronger (step 3, "Aanvullen")
export const jobApplicationOptionalDocuments: JobApplicationDocument[] = [
  { id: "recommendation-letter", title: "Aanbevelingsbrief" },
  { id: "certificates", title: "Certificaten" },
];

// The title a plan gets when the user has not given it one (sample data for now)
export const jobApplicationDefaultTitle = "Software developer";

// All the things the job application page remembers
export interface JobApplicationProgress {
  // The title of the plan, for example "Software developer". Empty means the default title is used
  title: string;
  // Step 2: the ids of the missing documents the user added with "+ Toevoegen"
  addedRequirementIds: string[];
  // Step 3: the ids of the optional documents the user added
  addedOptionalIds: string[];
  // Step 3: the user pressed "Klaar met aanvullen"
  isSupplementDone: boolean;
  // The text in the notes field
  notes: string;
  // True when the plan was shared with someone
  isShared: boolean;
  // The date the plan was archived ("2026-11-14"). Empty means not archived
  archivedAt: string;
}

// A plan where nothing is done yet
export function emptyJobApplicationProgress(): JobApplicationProgress {
  return { title: "", addedRequirementIds: [], addedOptionalIds: [], isSupplementDone: false, notes: "", isShared: false, archivedAt: "" };
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

// True when the user has this required document: it was already in the vault, or it was added later
export function hasRequirement(progress: JobApplicationProgress, requirement: { id: string; inVault: boolean }): boolean {
  return requirement.inVault || progress.addedRequirementIds.includes(requirement.id);
}

// Which of the three steps are done, in order (countedSteps from planProgress.ts: every step needs the ones before it)
// 1. The vault has documents  2. Nothing the vacancy asks for is missing  3. The user finished adding optional documents
export function jobApplicationDoneSteps(progress: JobApplicationProgress): boolean[] {
  const hasAllRequirements = jobApplicationRequirements.every((requirement) => hasRequirement(progress, requirement));
  return countedSteps([jobApplicationVaultDocuments.length > 0, hasAllRequirements, progress.isSupplementDone]);
}

// The title to show: the saved one, or the default title when the plan has none yet.
// The plan page and the card on the plan overview both use this, so they always show the same title
export function jobApplicationTitle(progress: JobApplicationProgress): string {
  return progress.title !== "" ? progress.title : jobApplicationDefaultTitle;
}
