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
  // Optional: the text the user wrote in "Notities" when adding the document
  notes?: string;
  // Optional: the name of the uploaded file, for example "cv.pdf". The file itself is not stored yet (there is no server)
  fileName?: string;
}

// The categories of the vault, with the icon of each (the same as in the "Toevoegen" sheet of the vault design)
export const vaultCategories = [
  { value: "certificates", label: "Certificaten", icon: "award" },
  { value: "work", label: "Arbeid", icon: "file-lines" },
  { value: "portfolio", label: "Portfolio", icon: "briefcase" },
  { value: "medical", label: "Medisch", icon: "stethoscope" },
  { value: "other", label: "Overig", icon: "folder" },
];

// The sample documents the vault starts with. The user can rename and delete them, just like their own documents
export const vaultDocuments: VaultDocument[] = [
  { id: "cv", title: "CV", category: "work", date: "2026-09-17" },
  { id: "hbo-diploma", title: "HBO Diploma - ICT", category: "certificates", date: "2026-09-15" },
  { id: "portfolio-assignment", title: "Portfolio-opdracht", category: "portfolio", date: "2026-07-12" },
  { id: "dyslexia-statement", title: "Dyslexieverklaring", category: "medical", date: "2025-04-01" },
  { id: "driving-licence-a", title: "A-Rijbewijs", category: "other", date: "2026-08-20" },
  { id: "havo-diploma", title: "HAVO diploma", category: "certificates", date: "2022-06-06" },
  { id: "internship-reference", title: "Stage referentie", category: "work", date: "2026-06-30" },
];

// The key under which the whole vault is saved in the browser (localStorage)
const storageKey = "gear-vault-documents";

// All documents in the vault. The first time (nothing saved yet, or on the server, where there is no browser storage)
// these are the sample documents. As soon as the user adds, renames or deletes a document, the whole list is saved
export function loadVaultDocuments(): VaultDocument[] {
  if (typeof window === "undefined") return [...vaultDocuments];
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [...vaultDocuments];
  } catch {
    // Storage can be blocked, or the saved text can be broken. Then we start with the sample documents
    return [...vaultDocuments];
  }
}

// Saves the whole list of documents
function saveVaultDocuments(documents: VaultDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(documents));
  } catch {
    // Storage can be blocked or full. Then the change is just not saved
  }
}

// Saves a new document in the vault. The vault page and the vault drawer in the plans show it from then on
export function addVaultDocument(document: VaultDocument): void {
  saveVaultDocuments([...loadVaultDocuments(), document]);
}

// Changes a document, for example { title: "Nieuwe titel" } or { notes: "...", fileName: "cv.pdf" }.
// Partial<VaultDocument> means: an object with some of the fields of a document.
// The plans show a new title too, because they look up the title by the id
export function updateVaultDocument(id: string, changes: Partial<VaultDocument>): void {
  const documents = loadVaultDocuments().map((document) => (document.id === id ? { ...document, ...changes } : document));
  saveVaultDocuments(documents);
}

// Takes a document out of the vault. Plans that used it don't show it anymore (see findVaultDocument)
export function deleteVaultDocument(id: string): void {
  saveVaultDocuments(loadVaultDocuments().filter((document) => document.id !== id));
}

// Finds a document by its id. Returns undefined when it is not in the vault (anymore)
export function findVaultDocument(id: string): VaultDocument | undefined {
  return loadVaultDocuments().find((document) => document.id === id);
}

// The label of a category, for example "Certificaten" for "certificates"
export function vaultCategoryLabel(category: string): string {
  return vaultCategories.find((item) => item.value === category)?.label ?? "Overig";
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
