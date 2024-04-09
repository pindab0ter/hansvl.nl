import { Help } from "./commands/Help";
import { Command } from "./Command";
import { Clear } from "./commands/Clear";
import { Kitties } from "./commands/Kitties";
import { List } from "./commands/List";
import { ChangeDirectory } from "./commands/ChangeDirectory";

export const commands: Command[] = [
  new ChangeDirectory(),
  new Clear(),
  new Help(),
  new Kitties(),
  new List(),
];
