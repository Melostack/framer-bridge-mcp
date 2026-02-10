import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "framer-bridge",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const ANIMATION_LIBRARY: Record<string, { code: string; description: string }> = {
  "spring-bounce": {
    description: "Um efeito de mola elástica usado em botões e modais do Framer.",
    code: `<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>`,
  },
  "scroll-parallax": {
    description: "Efeito de parallax que reage ao scroll da página.",
    code: `const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

return <motion.div style={{ y }} />`,
  },
  "fade-in-up": {
    description: "Entrada suave de baixo para cima.",
    code: `<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
/>`,
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "framer_get_motion_snippet",
        description: "Obtém snippets de código Framer Motion para efeitos específicos.",
        inputSchema: {
          type: "object",
          properties: {
            effect_name: {
              type: "string",
              enum: Object.keys(ANIMATION_LIBRARY),
              description: "O nome do efeito desejado.",
            },
          },
          required: ["effect_name"],
        },
      },
      {
        name: "framer_scaffold_component",
        description: "Gera o código inicial para um 'Code Component' do Framer com controles de interface.",
        inputSchema: {
          type: "object",
          properties: {
            component_name: { type: "string", description: "Nome do componente (Ex: CustomButton)" },
            props: {
              type: "array",
              items: { type: "string" },
              description: "Lista de propriedades (Ex: title, color, toggle)",
            },
          },
          required: ["component_name"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "framer_get_motion_snippet") {
    const effectName = (args as any).effect_name;
    const effect = ANIMATION_LIBRARY[effectName];

    if (!effect) {
      return { content: [{ type: "text", text: "Efeito não encontrado." }], isError: true };
    }

    return {
      content: [
        { 
          type: "text", 
          text: `### ${effectName}\n${effect.description}\n\n\`\`\`tsx\n${effect.code}\n\`\`\`` 
        },
      ],
    };
  }

  if (name === "framer_scaffold_component") {
    const componentName = (args as any).component_name;
    const props = (args as any).props || [];

    const controls = props
      .map(
        (p: string) => `  ${p}: { type: ControlType.String, title: "${p.charAt(0).toUpperCase() + p.slice(1)}" },`
      )
      .join("\n");

    const code = `import * as React from "react"
import { Frame, addPropertyControls, ControlType } from "framer"

export function ${componentName}(props) {
    return (
        <div style={style}>
            {props.text || "${componentName}"}
        </div>
    )
}

${componentName}.defaultProps = {
    text: "Olá Framer!",
}

addPropertyControls(${componentName}, {
${controls}
})

const style: React.CSSProperties = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#8855FF",
    background: "rgba(136, 85, 255, 0.1)",
    overflow: "hidden",
}`;

    return {
      content: [{ type: "text", text: `\`\`\`tsx\n${code}\n\`\`\`` }],
    };
  }

  throw new Error(`Ferramenta não encontrada: ${name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((error) => {
  console.error("Erro ao iniciar o servidor:", error);
  process.exit(1);
});