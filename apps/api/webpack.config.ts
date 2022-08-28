import NodemonPlugin from "nodemon-webpack-plugin";
import path from "path";
import webpack, { EnvironmentPlugin } from "webpack";
import NodeExternals from "webpack-node-externals";

import { getPathAliases } from "../../webpack/helper";

interface WebpackOptions {
  stage?: "dev" | "qa" | "prod";
  watch?: boolean;
}

const defaultOptions = {
  stage: "development",
  watch: false,
};

export const getWebpackConfig = (
  options?: WebpackOptions
): webpack.Configuration => {
  const opts = Object.assign(defaultOptions, options);

  const config: webpack.Configuration = {
    entry: ["./src/index.ts"],
    target: "node",
    mode: opts.stage === "dev" ? "development" : "production",
    devtool: opts.stage === "dev" ? "inline-source-map" : "source-map",
    resolve: {
      extensions: [".ts", "..."],
      alias: getPathAliases(),
    },
    cache: opts.watch
      ? {
          type: "filesystem",
        }
      : undefined,
    stats: "minimal",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "server.js",
      libraryTarget: "commonjs",
    },
    plugins: [
      new EnvironmentPlugin({
        IS_LOCAL: opts.watch,
      }),
    ],
    externals: [
      NodeExternals({
        allowlist: [/^@kopeka/],
        modulesFromFile: true,
        modulesDir: path.resolve(__dirname, "../../node_modules"),
      }),
    ],
    node: {
      __dirname: true,
    },
  };

  if (opts.watch) {
    config.watch = true;
    config.plugins?.push(
      new NodemonPlugin({
        verbose: true,
      })
    );
    config.watchOptions = {
      ignored: /node_modules/,
    };
  }

  return config;
};
