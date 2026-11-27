// app/utils/sortOptions.ts
// The choices in the "Sorteren" menu of the FilterBar, and one function that puts a list in that order.
// The vault, the shared plans and the messages all use this, so sorting works the same on every page.
// Nuxt auto-imports everything in app/utils, so pages can use this without an import.

// One choice in the menu: `value` is for the code, `label` is the Dutch text the user sees
export interface SortOption {
  value: string;
  label: string;
}

// All choices: on date (newest or oldest first) and alphabetical (A to Z or the reverse)
export const sortOptions: SortOption[] = [
  { value: "newest", label: "Nieuwste eerst" },
  { value: "oldest", label: "Oudste eerst" },
  { value: "a-z", label: "Naam (A-Z)" },
  { value: "z-a", label: "Naam (Z-A)" },
];

// Only the alphabetical choices, for lists without dates (the shared plans don't have a date yet)
export const alphabeticalSortOptions: SortOption[] = sortOptions.filter(
  (option) => option.value === "a-z" || option.value === "z-a",
);

// Returns a new list in the chosen order. The original list is not changed.
// <T> means: this works for any kind of item (documents, plans, messages).
// The page tells how to read the title of an item, and its date written as "2026-09-17"
export function sortItems<T>(items: T[], sort: string, getTitle: (item: T) => string, getDate: (item: T) => string = () => ""): T[] {
  // [...items] makes a copy first: sort() changes the list it is called on
  const copy = [...items];
  if (sort === "a-z" || sort === "z-a") {
    // localeCompare compares two texts the Dutch way, so the list is in alphabetical order
    copy.sort((a, b) => getTitle(a).localeCompare(getTitle(b), "nl"));
  } else {
    // "2026-09-17" texts can be compared like words: a later date comes later in the alphabet
    copy.sort((a, b) => getDate(a).localeCompare(getDate(b)));
  }
  // The two "reverse" choices are the same order, turned around
  if (sort === "z-a" || sort === "newest") {
    copy.reverse();
  }
  return copy;
}
