import { join } from "path";
import { Formattable } from "../structures/formattable.struct";
export const constants: Constants = {
	prefix: "b:",
	channels: {
		e: "f",
	},
	messages: {
		"112213:1221": "f",
	},
	emojis: {
		brick: "609823798031810560",
	},
	roles: {
		e: "f",
	},
	guild: "602945093762154507",
	arguments: [
		[String, (arg: string) => arg],
		[Number, (arg: string) => isNaN(Number(arg)) ? null : Number(arg)],
		[Boolean, (arg: string) => ["yes", "true", "y", "on"].some((x) => arg.toLowerCase() === x) ? true : ["no", "false", "n", "off"].some((x) => arg.toLowerCase() === x) ? false : null],
	],
	admins: [
		"413143886702313472",
	],
	eval: new Formattable(`(async () => { const { client } = await import(require("path").join(__rootname, "/modules/client")); {} })()`), // ")
};
