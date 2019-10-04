import { EmbedField, GuildMember } from "discord.js";
import { join } from "path";
import { permissions } from "../../modules/permissions";
import { Command } from "@db-struct/command.struct";
export const command = new Command("options", "Change guild and user options.", [], ["opt"], [
	{ name: "selection", type: Command.OR("guild", "user"), default: "user" },
	{ name: "set", type: Boolean }
], permissions.everyone)
	.setExec(async(client, message, args, lang) => {
		const forbidden = ["id", "createdAt", "updatedAt"];
		const model = (() => {
			if (args.selection === "guild") return client.models.Guildoptions;
			else if (args.selection === "user") return client.models.Useroptions;
			else throw new Error(`This should never occur. ${args.selection}`);
		})();
		const [options] = await model.findOrCreate({ where: { id: message.author!.id }, defaults: { id: message.author!.id } });
		if (!args.set) {
			const embed = new client.Embed()
				.setTitle(`${{ guild: "Guild", user: "User" }[args.selection as "guild" | "user"]} Options`)
				.setDescription("The current options.");
			for (const option in model.rawAttributes) {
				if (forbidden.includes(option)) continue;
				embed.addField(option.toUpperCase(), options.get(option));
			};
			return message.channel.send(embed);
		} else {
			const toSet = await client.utils.getIndex<string>(message, Object.keys(model.rawAttributes).filter(x => !forbidden.includes(x)), undefined, "option to set");
			if (!toSet) return;
			const opt = toSet.item;
			const toVal = await client.utils.getText(message, "What do you want to set it to?");
			if (!toVal) return;
			try {
				await options.update({ [opt]: toVal.toLowerCase() === "null" ? null : toVal });
				await message.channel.send(`Option has been successfully set.`);
			} catch (e) {
				await message.channel.send(`Invalid value. ${e.message.split("Validation error: ")[1]}`);
			}
		}
	});
