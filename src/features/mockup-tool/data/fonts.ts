import type { FontOption } from "@/features/mockup-tool/types";

export type FontMeta = {
  id: FontOption;
  name: string;
  family: string;
};

export const fontOptions: FontMeta[] = [
  { id: "inter",        name: "Inter",              family: "'Inter', sans-serif" },
  { id: "outfit",       name: "Outfit",             family: "'Outfit', sans-serif" },
  { id: "space-grotesk",name: "Space Grotesk",      family: "'Space Grotesk', sans-serif" },
  { id: "dm-sans",      name: "DM Sans",            family: "'DM Sans', sans-serif" },
  { id: "syne",         name: "Syne",               family: "'Syne', sans-serif" },
  { id: "plus-jakarta", name: "Plus Jakarta Sans",  family: "'Plus Jakarta Sans', sans-serif" },
  { id: "manrope",      name: "Manrope",            family: "'Manrope', sans-serif" },
  { id: "playfair",     name: "Playfair Display",   family: "'Playfair Display', serif" },
  { id: "poppins",      name: "Poppins",            family: "'Poppins', sans-serif" },
  { id: "sora",         name: "Sora",               family: "'Sora', sans-serif" },
];

export function getFontFamily(id: FontOption): string {
  return fontOptions.find((f) => f.id === id)?.family ?? "'Inter', sans-serif";
}
