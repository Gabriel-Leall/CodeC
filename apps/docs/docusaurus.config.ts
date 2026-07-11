import path from "node:path";
import { createRequire } from "node:module";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { ScalarOptions } from "@scalar/docusaurus";

const require = createRequire(__filename);
const scalarDistPath = path.dirname(require.resolve("@scalar/docusaurus"));

const config: Config = {
  title: "Kodan Docs",
  tagline: "Documentação de produto, arquitetura e API do Kodan.",
  favicon: "img/favicon.ico",

  url: "https://kodan.local",
  baseUrl: "/",

  organizationName: "kodan",
  projectName: "kodan",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    function scalarWebpackAliasPlugin() {
      return {
        name: "scalar-webpack-alias",
        configureWebpack() {
          const scalarComponentPath = path.join(
            scalarDistPath,
            "ScalarDocusaurus",
          );

          return {
            resolve: {
              alias: {
                [`${scalarComponentPath}$`]: `${scalarComponentPath}.js`,
              },
            },
          };
        },
      };
    },
    [
      "@scalar/docusaurus",
      {
        label: "API Reference",
        route: "/api-reference",
        showNavLink: false,
        configuration: {
          url: "/openapi.json",
        },
      } satisfies ScalarOptions,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Kodan",
      items: [
        {
          to: "/",
          label: "Docs",
          position: "left",
        },
        {
          to: "/api-reference",
          label: "API Reference",
          position: "left",
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
