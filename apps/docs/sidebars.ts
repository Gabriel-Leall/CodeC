import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    "product",
    "design",
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
