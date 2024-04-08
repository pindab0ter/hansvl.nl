import { Help } from "./commands/Help";
import { Command } from "./Command";
import { Clear } from "./commands/Clear";
import { Kitties } from "./commands/Kitties";

export const commands: Command[] = [new Clear(), new Help(), new Kitties()];
