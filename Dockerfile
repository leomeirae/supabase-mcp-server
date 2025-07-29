# Use uma imagem base oficial do Node.js. A versão 20 é uma LTS estável.
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Define variáveis de ambiente que receberão os valores do Coolify.
# Estes são os valores padrão; eles serão sobrescritos pelas configurações do seu serviço no Coolify.
ENV SUPABASE_ACCESS_TOKEN=""
ENV PROJECT_REF=""
# Recomendado para segurança, conforme a documentação
ENV READ_ONLY="--read-only"
# Opcional: para habilitar/desabilitar grupos de ferramentas, ex: "database,docs"
ENV FEATURES=""

# O comando para iniciar o servidor.
# Ele usa as variáveis de ambiente para configurar a execução.
CMD npx -y @supabase/mcp-server-supabase@latest \
    --access-token="$SUPABASE_ACCESS_TOKEN" \
    --project-ref="$PROJECT_REF" \
    $READ_ONLY \
    $( [ ! -z "$FEATURES" ] && echo "--features=$FEATURES" ) 