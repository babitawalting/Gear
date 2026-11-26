// app/utils/planProgress.ts
// What we remember about the progress of a plan. It is saved in the browser (localStorage), one entry per plan id,
// so the progress is still there after a reload and the plan overview can show the same percentage as the plan page.
// Nuxt auto-imports everything in app/utils, so pages can use these functions without an import.
// Later this can move to a database. Only these functions would have to change.

// All the things the plan page remembers
export interface PlanProgress {
  // The title of the plan, for example "Rijbewijs BE". Empty means the default title is used (see drivingLicenceTitle)
  title: string;
  // Step 1: the user has Rijbewijs B in the vault
  hasLicenseB: boolean;
  // Step 2: the exam is done
  examDone: boolean;
  // Step 3: the user pressed "Ik heb al een afspraak", and the date of the appointment ("2026-11-14")
  hasAppointment: boolean;
  appointmentDate: string;
  // Step 4: the licence was received
  licenseReceived: boolean;
  // The text in the notes field
  notes: string;
  // The documents the user added from the vault, per step: { "1": ["cv"], "2": [], ... }
  evidenceByStep: Record<string, string[]>;
}

// A plan where nothing is done yet
export function emptyPlanProgress(): PlanProgress {
  return { title: "", hasLicenseB: false, examDone: false, hasAppointment: false, appointmentDate: "", licenseReceived: false, notes: "", evidenceByStep: { 1: [], 2: [], 3: [], 4: [] } };
}

// The key under which the progress of one plan is saved
function storageKey(planId: string): string {
  return `gear-plan-progress-${planId}`;
}

// Reads the saved progress. Without a saved entry (or on the server, where there is no browser storage) nothing is done yet
export function loadPlanProgress(planId: string): PlanProgress {
  if (typeof window === "undefined") return emptyPlanProgress();
  try {
    const saved = window.localStorage.getItem(storageKey(planId));
    // { ...empty, ...saved } fills in anything that is missing in an older saved entry
    return saved ? { ...emptyPlanProgress(), ...JSON.parse(saved) } : emptyPlanProgress();
  } catch {
    // Storage can be blocked, or the saved text can be broken. Then we start fresh
    return emptyPlanProgress();
  }
}

// Saves the progress of one plan
export function savePlanProgress(planId: string, progress: PlanProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(planId), JSON.stringify(progress));
  } catch {
    // Storage can be blocked or full. Then the progress is just not saved
  }
}

// ---- Works for any plan, with any number of steps ----

// A step only counts as done when all the steps before it are done too. The steps unlock one after the other,
// so a step can not be done while an earlier one is still open (for example when the user clears a date later)
export function countedSteps(flags: boolean[]): boolean[] {
  let allBeforeAreDone = true;
  return flags.map((isDone) => {
    allBeforeAreDone = allBeforeAreDone && isDone;
    return allBeforeAreDone;
  });
}

// The progress in percent: the steps that count as done, divided by all the steps. 4 steps: 25% each, 5 steps: 20% each
export function percentageDone(flags: boolean[]): number {
  if (flags.length === 0) return 0;
  return (countedSteps(flags).filter((isDone) => isDone).length / flags.length) * 100;
}

// ---- Only for the "get a driving licence" plan ----

// The title to show: the saved one, or "Rijbewijs BE" when the plan has none yet (sample data for now).
// The plan page and the card on the plan overview both use this, so they always show the same title
export function drivingLicenceTitle(progress: PlanProgress): string {
  return progress.title !== "" ? progress.title : "Rijbewijs BE";
}

// Which of its four steps are done, in order (with the rule that every step needs the ones before it)
export function drivingLicenceDoneSteps(progress: PlanProgress): boolean[] {
  return countedSteps([progress.hasLicenseB, progress.examDone, progress.appointmentDate !== "", progress.licenseReceived]);
}
