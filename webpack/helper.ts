import path from "path";

export function getPathAliases(): { [key: string]: string } {
  const packages = ["auth", "core", "db", "sentry", "types", "user"];

  const aliases: { [key: string]: string } = {};

  packages.map((x) => {
    aliases[`@KPBBFC/${x}`] = path.resolve(__dirname, `../libs/${x}/src`);
  });

  return aliases;
}
