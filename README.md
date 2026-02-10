# 🌉 Framer Bridge MCP

Um servidor MCP (Model Context Protocol) para conectar IDEs (como Cursor, Antigravity, VS Code) ao ecossistema **Framer** e **Framer Motion**.

[English] | [Português]

---

## 🚀 Funcionalidades / Features

- **Animation Snippets**: Coleção de efeitos de alta fidelidade do Framer Motion (Springs, Parallax, Layout).
- **Component Scaffolding**: Gera componentes React `.tsx` prontos para serem colados na aba "Code" do Framer, já com `addPropertyControls`.
- **IDE Intelligence**: Projetado para ajudar IAs a "espelharem" efeitos visuais de sites de referência em código real.

---

## 🛠 Instalação / Installation

1. **Clonar / Clone**:
```bash
git clone https://github.com/SeuUsuario/framer-bridge.git
cd framer-bridge
npm install
```

2. **Compilar / Build**:
```bash
npm run build
```

3. **Configurar no IDE / IDE Setup**:
Adicione o servidor ao seu arquivo de configuração MCP (ex: `mcp_config.json` ou `framer.toml`):

```json
"framer-bridge": {
  "command": "node",
  "args": ["/caminho/para/framer-bridge/index.js"]
}
```

---

## 🤝 Contribuindo / Contributing

Este é um projeto **Open Source**. Sinta-se à vontade para abrir Issues ou enviar Pull Requests com novos snippets de animação ou melhorias no scaffolding de componentes.

---

## ⚠️ Segurança / Security

Este servidor não armazena chaves de API por padrão. Se você adicionar integrações com o CMS do Framer, utilize variáveis de ambiente.

---

**Desenvolvido com ❤️ para a comunidade Framer & Antigravity.**
