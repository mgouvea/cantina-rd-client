import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com"],
  },

  // --- Adicione esta seção para configurar os aliases do Webpack ---
  webpack: (
    config,
    {
      /* isServer */
    }
  ) => {
    // Configura os aliases do Webpack para corresponder aos do tsconfig.json
    // Como os aliases apontam para a raiz do projeto (./*), usamos __dirname diretamente.
    config.resolve.alias["@"] = __dirname; // Aponta para a raiz do projeto
    config.resolve.alias["@app"] = path.join(__dirname, "app");
    config.resolve.alias["@components"] = path.join(__dirname, "components");
    config.resolve.alias["@contexts"] = path.join(__dirname, "contexts");
    config.resolve.alias["@mutations"] = path.join(__dirname, "hooks", "mutations");
    config.resolve.alias["@queries"] = path.join(__dirname, "hooks", "queries");
    config.resolve.alias["@services"] = path.join(__dirname, "services");
    config.resolve.alias["@types"] = path.join(__dirname, "types");
    config.resolve.alias["@utils"] = path.join(__dirname, "utils");

    return config;
  },
  // --- Fim da seção de webpack ---

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Previne MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Bloqueia iframes (clickjacking)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // Proteção XSS legada (mantém por compatibilidade)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // Controla informações de referrer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // CSP ajustado para MUI e Next.js
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline necessário pro MUI
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Google Fonts
              "font-src 'self' https://fonts.gstatic.com", // Google Fonts
              "img-src 'self' data: https://res.cloudinary.com", // Cloudinary
              "connect-src 'self' https://res.cloudinary.com https://backend.cantina-rd.shop http://localhost:3333", // APIs permitidas
              "frame-ancestors 'none'", // Reforça X-Frame-Options
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },

          // Bloqueia APIs sensíveis
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // HSTS - força HTTPS (só ativa em produção)
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
