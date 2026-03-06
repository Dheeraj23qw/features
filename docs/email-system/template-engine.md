# Template Engine

The template engine renderer isolates React-Email `.tsx` elements, transforming them safely into raw HTML string formats inside Node sequentially.

## Structure

Templates must be stored strictly mathematically as:
`templates / <name> / <version> / <locale>.tsx`

```text
src/features/email/templates/
└── welcome/
    ├── v1/
    │   ├── en.tsx    # English layout
    │   └── fr.tsx    # French layout
    └── v2/
        └── en.tsx    # Redesign layout
```

## Generating Templates

The renderer utilizes dual-format exports natively directly outside of provider scopes:

```typescript
import { sendTemplateEmail } from "@/features/email";

// The data parameters directly map to the React component properties.
await sendTemplateEmail(
  { to: [{ email: "user@prod.com" }] },
  { name: "welcome", version: "v1", locale: "en", data: { name: "User" } }
);
```

Behind the scenes:
1. It dynamically imports `welcome/v1/en.tsx`.
2. Hydrates the internal TSX elements to HTML DOM Nodes dynamically.
3. Compiles the HTML using `@react-email/components/render(element)`.
4. Transpiles a `<Plaintext/>` fallback synchronously via `render(element, { plainText: true })`.
