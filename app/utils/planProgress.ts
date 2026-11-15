// app/utils/planProgress.ts
// What we remember about the progress of a plan. It is saved in the browser (localStorage), one entry per plan id,
// so the progress is still there after a reload and the plan overview can show the same percentage as the plan page.
// Nuxt auto-imports everything in app/utils, so pages can use these functions without an import.
// Later this can move to a database. Only these functions would have to change.

// All the things the plan page remembers
export interface PlanProgress {
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
}

// A plan where nothing is done yet
export function emptyPlanProgress(): PlanProgress {
  return { hasLicenseB: false, examDone: false, hasAppointment: false, appointmentDate: "", licenseReceived: false, notes: "" };
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

// Which of the four steps are done, in order
export function doneSteps(progress: PlanProgress): boolean[] {
  return [progress.hasLicenseB, progress.examDone, progress.appointmentDate !== "", progress.licenseReceived];
}

// The progress of the plan in percent: every step that is done is 25%
export function progressPercentage(progress: PlanProgress): number {
  return (doneSteps(progress).filter((isDone) => isDone).length / 4) * 100;
}
