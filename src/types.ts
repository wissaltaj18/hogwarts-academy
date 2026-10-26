export type House =
  | "Gryffindor"
  | "Slytherin"
  | "Ravenclaw"
  | "Hufflepuff";

export interface Wizard {
  id: number;
  name: string;
  house: House;
  level: number;
  active: boolean;
  patronus?: string;
  // Index signature: dynamic properties must use these value types.
  [key: string]: string | number | boolean | undefined;
}

export type SpellCategory = "attack" | "defense" | "healing";

export interface Spell {
  id: number;
  name: string;
  category: SpellCategory;
  power: number;
}

export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellName: string }
  | { type: "level-up"; wizardId: number; newLevel: number }
  | { type: "wizard-expelled"; wizardId: number };

export type SpellOutput<T extends SpellCategory> =
  T extends "attack" ? number :
  T extends "defense" ? boolean :
  T extends "healing" ? string :
  never;

export type ArrayElement<T> =
  T extends (infer Item)[] ? Item : never;

// The explicit fields preserve the required Wizard properties alongside its index signature.
export type NewWizard = Omit<Wizard, "id"> & {
  name: string;
  house: House;
  level: number;
  active: boolean;
  patronus?: string;
};
export type WizardSummary = Pick<Wizard, "id" | "name" | "house">;
export type WizardUpdate = Partial<Wizard>;

export type AttackSpell = Extract<Spell, { category: "attack" }>;
export type NonHealingCategory = Exclude<SpellCategory, "healing">;
export type HousePoints = Record<House, number>;

export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;
