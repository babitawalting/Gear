// app/utils/vaultDocuments.ts
// The documents in the user's vault ("Mijn kluis"). Sample data for now, copied from the vault design in Figma.
// Later this comes from the database, and only this file has to change.
// Nuxt auto-imports everything in app/utils, so pages and components can use this without an import.

// One document in the vault
export interface VaultDocument {
  // A fixed id. A plan remembers which documents it uses by their id
  id: string;
  // The name of the document, in Dutch
  title: string;
  // The category: one of the values in vaultCategories below
  category: string;
  // The date the document was added, written as "2026-09-17" (year-month-day)
  date: string;
}

// The categories of the vault, with the icon of each (the same as in the "Toevoegen" sheet of the vault design)
export const vaultCategories = [
  { value: "certificates", label: "Certificaten", icon: "award" },
  { value: "work", label: "Arbeid", icon: "file-lines" },
  { value: "portfolio", label: "Portfolio", icon: "briefcase" },
  { value: "medical", label: "Medisch", icon: "stethoscope" },
  { value: "other", label: "Overig", icon: "folder" },
];

export const vaultDocuments: VaultDocument[] = [
  { id: "cv", title: "CV", category: "work", date: "2026-09-17" },
  { id: "hbo-diploma", title: "HBO Diploma - ICT", category: "certificates", date: "2026-09-15" },
  { id: "portfolio-assignment", title: "Portfolio-opdracht", category: "portfolio", date: "2026-07-12" },
  { id: "dyslexia-statement", title: "Dyslexieverklaring", category: "medical", date: "2025-04-01" },
  { id: "driving-licence-a", title: "A-Rijbewijs", category: "other", date: "2026-08-20" },
  { id: "havo-diploma", title: "HAVO diploma", category: "certificates", date: "2022-06-06" },
  { id: "internship-reference", title: "Stage referentie", category: "work", date: "2026-06-30" },
];

// Finds a document by its id. Returns undefined when it is not in the vault (anymore)
export function findVaultDocument(id: string): VaultDocument | undefined {
  return vaultDocuments.find((document) => document.id === id);
}

// The icon of a category, for example "award" for "certificates". Unknown categories get the folder
export function vaultCategoryIcon(category: string): string {
  return vaultCategories.find((item) => item.value === category)?.icon ?? "folder";
}

// Turns "2026-09-17" into "17 september 2026", the way the vault design writes dates
export function formatVaultDate(date: string): string {
  const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const [year, month, day] = date.split("-");
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}
