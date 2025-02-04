#!/usr/bin/env node
import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { actions } from "./actions.js";
import type { WPMMconfig, WPMMpaths } from "./types.js";
import { getConfig, printTimePassed } from "./utils/data.js";
import { getWordPressPaths } from "./utils/wordpress.js";

/** @var {number} startTime - the time at which the script started. */
export const startTime = Date.now();

/** @var argv - The command line arguments. */
const argv: Argv<object> = yargs(hideBin(process.argv));

/**
 * The main function for the script.
 * Get the configuration and invoke the actions based on the provided arguments.
 * @param argv - The command line arguments.
 */
getConfig(argv)
	.then(
		/** @param {WPMMconfig} config - The configuration object for the script. */
		(config: WPMMconfig) => {
			/**
			 * The object that will hold the paths for the script.
			 */
			const paths: WPMMpaths = getWordPressPaths(config.wordpress.name);

			/**
			 * The launcher object.
			 */
			const launcher = actions({ config, paths });

			// DEBUG console.log(argv)

			for (const key of Object.keys(argv)) {
				// Skip the loop iteration when the key is '_' or '$0'
				if (key === "_" || key === "$0") continue;

				launcher.invokeAction(key, argv);
			}
		},
	)
	.catch((err: Error) => console.error(err))
	.finally(() => {
		/**
		 * That's it 🎉! We're done! let's print how long it took to run the script and exit with a success code.
		 */
		printTimePassed(startTime);
		process.exit(0);
	});
