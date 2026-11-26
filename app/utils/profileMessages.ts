// app/utils/profileMessages.ts
// Static example messages for the profile screens, copied from the Figma designs "Profiel berichtenoverzicht V3" and "Profiel bericht V3".
// There is no real messaging system yet: no API, no database, nothing is saved. Later only this file has to change.
// Nuxt auto-imports everything in app/utils, so pages can use these values and functions without an import.

// The plan a message is about, shown as "Gerelateerd plan" on the message screen
export interface ProfileMessagePlan {
  title: string;
  // Name of the icon in the blue square, see app/utils/icons.ts
  icon: string;
  // Percentage completed, from 0 to 100
  progress: number;
}

// One message in the inbox
export interface ProfileMessage {
  // Part of the address: id "1" opens /profile/messages/1
  id: string;
  senderName: string;
  senderInitials: string;
  // The company of the sender, shown as a blue label
  senderCompany: string;
  subject: string;
  // The date as the user reads it ("5 nov 2026") and as a machine reads it ("2026-11-05", for the <time> element)
  dateLabel: string;
  dateIso: string;
  // True shows the red dot: the user has not read the message yet. Static for now, opening the message does not change it
  isUnread: boolean;
  relatedPlan: ProfileMessagePlan;
  // The message text, one item per paragraph. "\n" is a new line inside a paragraph
  paragraphs: string[];
}

export const profileMessages: ProfileMessage[] = [
  {
    id: "1",
    senderName: "Ben Kampen",
    senderInitials: "BK",
    senderCompany: "Scaleway",
    subject: "Uitnodiging kennismakingsgesprek",
    dateLabel: "5 nov 2026",
    dateIso: "2026-11-05",
    isUnread: true,
    relatedPlan: { title: "Software developer", icon: "industry", progress: 100 },
    paragraphs: [
      "Beste Ravi,",
      "We hebben jouw sollicitatie voor de functie software developer goed ontvangen en nodigen wij je hierbij uit voor een kennismakingsgesprek.",
      "De gesprekken staan gepland voor 10 en 12 november, komt dit uit?",
      "Wij horen het graag.",
      "Met vriendelijke groet,\nBen Hoogakkers\nRecruiter bij Scaleway",
    ],
  },
];

// True when at least one message is unread. The profile page uses it for the red dot on "Berichten"
export function hasUnreadProfileMessages(): boolean {
  return profileMessages.some((message) => message.isUnread);
}

// The message with this id, or undefined when there is no such message
export function findProfileMessage(id: string): ProfileMessage | undefined {
  return profileMessages.find((message) => message.id === id);
}
