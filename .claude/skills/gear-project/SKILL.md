---
name: gear-project
description: Write Nuxt 4 + Tailwind code for the Gear project in the team's own style - fixed colors, Public Sans font and the chosen icon set. Use whenever creating or editing pages, components, layouts or styling in this project.
---

# Gear project coding guide

## Who you are writing for
Second-year university of applied sciences students. They know HTML, CSS and JavaScript and are **still learning Nuxt/Next**. So:

- Keep code **simple and readable**. No clever tricks, no heavy abstractions.
- Use `<script setup lang="ts">` with plain `ref`, `computed` and `defineProps`. Avoid advanced generics, render functions and custom composable chains unless asked.
- Add a **short comment** where Nuxt-specific magic happens (auto-imports, file-based routing, `useFetch`, etc.), because it is new to them.
- Use clear names (`isMenuOpen`, not `flag`). Prefer small components with one job.
- Prefer Tailwind classes over custom CSS. Only write CSS when Tailwind can't do it.
- When you introduce a new Nuxt concept, explain it in one sentence in your reply.

## Language
**The website is in Dutch**, even when the team prompts in English.

- All text users see is Dutch: headings, buttons, labels, placeholders, error messages, `alt` text, `aria-label`s and page `<title>`s.
- Set `<html lang="nl">` (for example `useHead({ htmlAttrs: { lang: "nl" } })`).
- Code stays in English: variable, function, component and file names, and code comments.
- Use clear, simple Dutch and the same word for the same thing everywhere (for example always "Opslaan", not sometimes "Bewaren").
- Replies to the team follow the language they write in.

## Stack
Nuxt 4 (`app/` directory), Vue 3, Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`), `@nuxt/fonts`, `@nuxt/image`, `@nuxt/content`.

- Pages: `app/pages/` (file name = route)
- Components: `app/components/` (auto-imported, no `import` needed)
- Layouts: `app/layouts/`
- Helpers: `app/utils/` (auto-imported)
- Global CSS: `app/assets/css/main.css`

## Colors (only these, unless the user says otherwise)

| Name (Tailwind) | Hex | Typical use |
|---|---|---|
| `blue` | `#01689B` | Normal and active buttons, active selections, subheaders, accent color |
| `navy` | `#0A0D41` | **Text only** (headers and body text) |
| `grey` | `#697782` | Buttons like cancel, and buttons that can't be used (yet) or are inactive |
| `sand` | `#E3DED9` | **Border color only** |
| `white` | `#FCFCFC` | Main background color, and text on blue backgrounds |

Define them once in `@theme` (see `templates/main.css`), then use `bg-blue`, `text-navy`, `bg-grey`, `border-sand`, `bg-white`. **Never** use other Tailwind colors (`bg-gray-100`, `text-red-500`, ...) or random hex values. If something needs another color (e.g. an error), ask first.

## Font
**Public Sans is the only font.**

- **Regular (400)**: small text, paragraphs, labels, buttons → `font-normal`
- **Semibold (600)**: headers and subheaders (`h1`–`h6`) → `font-semibold`
- Never use bold (700), light, italic styles or another family.

Load it with `@nuxt/fonts` in `nuxt.config.ts`:

```ts
fonts: {
  families: [{ name: "Public Sans", weights: [400, 600] }],
},
```

Heading example:

```vue
<h1 class="text-3xl font-semibold text-navy">Header</h1>
<h2 class="text-xl font-semibold text-blue">Subheader</h2>
<p class="text-sm font-normal text-navy">Small text</p>
```

## Icons
Only use the icons below (Font Awesome Free, files in `assets/icons/`). Do not add other icons or an icon library.

| Name |
|---|
| `arrow-down-short-wide` |
| `arrow-up-from-bracket` |
| `award` |
| `bell` |
| `ellipsis` |
| `file-arrow-up` |
| `file-lines` |
| `floppy-disk` |
| `folder` |
| `gear` |
| `house` |
| `id-card` |
| `industry` |
| `magnifying-glass` |
| `people-arrows` |
| `school` |
| `share` |
| `stethoscope` |

### Setup (once)
Copy these files if they don't exist yet:

1. `templates/icons.ts` → `app/utils/icons.ts` (icon name → SVG path)
2. `templates/AppIcon.vue` → `app/components/AppIcon.vue`
3. `templates/main.css` → merge into `app/assets/css/main.css`

### Usage
```vue
<AppIcon name="house" class="size-6 text-blue" />
```
The icon uses `currentColor`, so color it with `text-*` and size it with `size-*`. Add `aria-label`/visible text next to icon-only buttons for accessibility.

To use a new icon the user adds later, add its path to `app/utils/icons.ts` and the table above.

## Code style
- Mobile first: write base classes for phones, then `md:` / `lg:` for bigger screens.
- **No hover states.** The site is mobile first, so never use `hover:` classes. Use `active:` for tap feedback only if needed, and `focus-visible:` for keyboard focus.
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>`, `<a>` / `<NuxtLink>` for navigation).
- Use `<NuxtImg>` for images and `<NuxtLink>` for internal links.
- Keep contrast accessible: `text-navy` on `bg-white`, `text-white` on `bg-blue` and `bg-grey`.
- Button states: normal/active = `bg-blue text-white`, cancel/inactive/disabled = `bg-grey text-white`.
- Every interactive element needs a visible focus state, e.g. `focus-visible:outline-2 focus-visible:outline-blue`.
- 2-space indentation, double quotes, ESLint rules from the project must pass.

## Example component

```vue
<!-- app/components/ActionButton.vue -->
<script setup lang="ts">
// Props are the values a parent component passes in
defineProps<{ label: string; icon?: string }>();
</script>

<template>
  <button
    class="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-normal text-white disabled:bg-grey focus-visible:outline-2 focus-visible:outline-blue"
  >
    <AppIcon v-if="icon" :name="icon" class="size-4" />
    {{ label }}
  </button>
</template>
```

## Accessibility (A11y)
Always keep accessibility in mind. The project has `@nuxt/a11y` installed, so check its warnings in the dev tools.

- Use semantic HTML first (`<button>` for actions, `<a>`/`<NuxtLink>` for navigation, `<label>` for inputs, headings in order `h1` → `h2` → `h3`). Add ARIA only when HTML can't do it.
- Every image needs `alt` text (empty `alt=""` if purely decorative).
- Icon-only buttons need an `aria-label` (for example `aria-label="Zoeken"`). Icons next to text are decorative and already hidden from screen readers.
- Every form input has a visible `<label>` connected to it.
- Everything must work with a keyboard: logical tab order, visible `focus-visible` outline, no `div` or `span` used as a button.
- Touch targets are at least 44x44px (`min-h-11 min-w-11`) because the site is mobile first.
- Don't use color alone to show meaning (add text or an icon). Inactive buttons need `disabled` (not just grey styling).
- Keep text readable: no text smaller than `text-sm`, and respect the contrast pairs in the code style section.
- Set the page language to Dutch (`<html lang="nl">`) and give each page a clear `<title>` with `useHead` or `useSeoMeta`.

## Git branches
Every branch you create must be named `type/name/branchname`: a type, the short name of the person prompting, then a short lowercase name with hyphens.

- `feature/babita/login-page`
- `fix/deshae/navbar-overflow`
- `chore/marie-lou/add-eslint-rules`

**Types**
- `feature/` new functionality
- `fix/` bug fixes
- `chore/` setup, config, dependencies, cleanup
- `docs/` documentation
- `refactor/` restructuring code without changing behavior
- `test/` adding or changing tests

**Finding the name:** the team works on separate devices, so run `git config user.name` and look it up (case-insensitive):

| Git username | Short name in branches |
|---|---|
| `babitawalting` | `babita` |
| `DeshaeD` | `deshae` |
| `loujunior` | `marie-lou` |

If the git username is missing or isn't in the table, ask who is prompting. Never guess.

Never use other formats (`my_branch`, `Feature-Login`, `login`). Never work directly on `main`.

## Commits, pushes and pull requests
**Ask the person you are chatting with once, for all three together:** committing, pushing and opening a pull request. Show what changed, the commit message, the branch name and the PR title, and wait for a "yes". After a "yes", do all three without asking again.

## Before you finish
- All visible text is Dutch.
- Code is accessible (semantic HTML, alt text, labels, aria-labels, keyboard, touch targets).
- Branch name follows the `type/name/branchname` format.
- Nothing is committed, pushed or opened as a pull request without asking first.
- Colors only used for their role (navy text, grey inactive/cancel buttons, sand borders, white background, blue accent), only the 5 colors, only Public Sans (400 / 600), only the icons listed.
- Code is something a second-year student can read and explain.
- Run `npm run dev` or lint when you changed config files, and report anything not verified.
