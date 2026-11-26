// app/utils/overviewPlans.ts
// The plans of the user, as the cards in the overviews need them. The plans overview (/plans-overview) shows all of them,
// the shared plans overview (/shared) only the shared ones. Both pages use this file, so the list of plans is in one place.
// Nuxt auto-imports everything in app/utils, so pages can use this without an import.
// Later the plans can come from a database. Then only this file has to change.

// Everything a plan card in an overview needs
export interface OverviewPlan {
  id: number;
  title: string;
  // "career", "education" or "personal"
  category: string;
  // The address of the page of the plan
  to: string;
  // Percentage completed, from 0 to 100
  progress: number;
  // True when the user shared this plan ("Plan delen" on the plan page)
  isShared: boolean;
  isArchived: boolean;
  // The date the plan was archived ("2026-11-14"). Empty means not archived
  archivedAt: string;
}

// The plans that exist for now (sample data, there is no database yet).
// The creation flows save a new plan under a fixed id, see the plan-details pages in app/pages
const overviewPlanList = [
  { id: 1, category: "personal", to: "/plans/1" },
  { id: 7, category: "career", to: "/plans/job-application/7" },
];

// Reads the saved progress of every plan (app/utils/jobApplicationProgress.ts and app/utils/planProgress.ts)
// and turns it into what a card needs. Call it in mounted(): the browser storage does not exist on the server
export function loadOverviewPlans(): OverviewPlan[] {
  return overviewPlanList.map((plan) => {
    if (plan.category === "career") {
      // A job application plan ("Sollicitatie") has its own saved progress
      const progress = loadJobApplicationProgress(String(plan.id));
      return {
        ...plan,
        // The title can be changed on the plan page (the three dots), so the card reads it from the saved progress
        title: jobApplicationTitle(progress),
        progress: Math.round(percentageDone(jobApplicationDoneSteps(progress))),
        isShared: progress.isShared,
        isArchived: progress.archivedAt !== "",
        archivedAt: progress.archivedAt,
      };
    }
    const progress = loadPlanProgress(String(plan.id));
    return {
      ...plan,
      title: drivingLicenceTitle(progress),
      progress: percentageDone(drivingLicenceDoneSteps(progress)),
      // The driving licence plan can not be shared or archived yet (its page has no buttons for it)
      isShared: false,
      isArchived: false,
      archivedAt: "",
    };
  });
}
