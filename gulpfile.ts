import del from "del";
import { series, task } from "gulp";
import webpack from "webpack";
import * as yargs from "yargs";
import { Arguments } from "yargs";
import { getWebpackConfig } from "./webpack.config";

type BuildStage = "dev" | "qa" | "prod";

type BuildOptions = Arguments & {
  stage: string;
  watch: boolean;
};

const argv: BuildOptions = yargs.options({
  stage: { choices: ["dev", "qa", "prod"], demandOption: true },
  watch: { type: "boolean", default: false },
}).argv;

const stage = argv.stage;
const watch = argv.watch;

task("clean", () => {
  return del(["./dist"]);
});

task("webpack", () => {
  return new Promise<void>((resolve, reject) => {
    webpack(
      getWebpackConfig({
        stage: stage as BuildStage,
        watch,
      }),
      (err: Error | undefined, stats) => {
        if (err) return reject(err);
        if (stats && stats.hasErrors()) {
          return reject(new Error(stats.compilation.errors.join("\n")));
        }
        resolve();
      }
    );
  });
});

task("build", series(["clean", "webpack"]));
