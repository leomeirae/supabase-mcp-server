# Use uma imagem base oficial do Node.js. A versão 20 é uma LTS estável.
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Define variáveis de ambiente que receberão os valores do Coolify.
# Estes são os valores padrão; eles serão sobrescritos pelas configurações do seu serviço no Coolify.
ENV SUPABASE_ACCESS_TOKEN=""
ENV PROJECT_REF=""
# Modo de escrita habilitado para operações de leads e imagens
ENV READ_ONLY=""
# Todas as features necessárias para gestão completa
ENV FEATURES="database,docs,functions,storage,debug,development"

# O comando para iniciar o servidor.
# Comando simplificado para evitar problemas com argumentos vazios
CMD npx -y @supabase/mcp-server-supabase@latest --access-token="$SUPABASE_ACCESS_TOKEN" --project-ref="$PROJECT_REF" --features="$FEATURES" 