import type { Wizard, Spell, House, NewWizard, WizardUpdate, SpellCastEvent } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  protected items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);
    if (!item) return false;
    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  addNewWizard(data: NewWizard): Wizard {
    const nextId = Math.max(0, ...this.items.map(wizard => wizard.id)) + 1;
    const wizard: Wizard = { ...data, id: nextId };
    this.add(wizard);
    return wizard;
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}

export function getSpellCastEvents(events: import("./types").AcademyEvent[]): SpellCastEvent[] {
  return events.filter(
    (event): event is SpellCastEvent => event.type === "spell-cast"
  );
}
