# Imagem base
FROM node:18-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json* ./
RUN npm install

# Update de dependências
RUN npm update

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construir o aplicativo
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expor porta e definir comando de inicialização
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
