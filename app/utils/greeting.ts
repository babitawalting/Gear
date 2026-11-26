// app/utils/greeting.ts
// Helpers for the greeting on the home screen ("Goedemorgen", "Goedemiddag" or "Goedenavond").
// Files in app/utils are auto-imported by Nuxt, so components can call getGreeting() without an import.

// The hour (0 to 23) in the Netherlands at the given moment.
// The time zone "Europe/Amsterdam" is used on purpose, not the time zone of the user's phone or the server.
// Intl.DateTimeFormat is built into JavaScript and knows the Dutch summer and winter time (CEST and CET),
// so the switch in March and October is handled automatically.
export function getAmsterdamHour(date: Date): number {
  const formatter = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "numeric",
    // h23: midnight is hour 0 (not 24), so the hours always run from 0 to 23
    hourCycle: "h23",
  });
  // formatToParts splits the formatted time into pieces. We only need the piece with the hour
  const hourPart = formatter.formatToParts(date).find((part) => part.type === "hour");
  return Number(hourPart?.value);
}

// The Dutch greeting for the given moment:
// 00:00 to 11:59 Goedemorgen, 12:00 to 17:59 Goedemiddag, 18:00 to 23:59 Goedenavond
export function getGreeting(date: Date): string {
  const hour = getAmsterdamHour(date);
  if (hour < 12) {
    return "Goedemorgen";
  }
  if (hour < 18) {
    return "Goedemiddag";
  }
  return "Goedenavond";
}
