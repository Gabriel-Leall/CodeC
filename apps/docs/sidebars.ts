import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    "application",
    "product",
    "design",
    {
      type: "category",
      label: "Contribuir",
      items: [
        "contributing/getting-started",
        "contributing/architecture",
        "contributing/pull-requests",
      ],
    },
    {
      type: "category",
      label: "Banco de Perguntas",
      items: [
        "question-bank/authoring-guide",
        "question-bank/seed-template",
      ],
    },
  ],
};

export default sidebars;
