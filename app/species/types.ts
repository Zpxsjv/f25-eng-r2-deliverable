import type { Database } from "@/lib/schema";

export type Species = Database["public"]["Tables"]["species"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type SpeciesWithAuthor = Species & {
  author_profile: Pick<Profile, "id" | "display_name" | "email" | "biography"> | null;
};
