# Use uma imagem base oficial do Node.js. A versão 20 é uma LTS estável.
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos do projeto
COPY package*.json ./
COPY server.js ./

# Instala as dependências
RUN npm install --production

# Define variáveis de ambiente que receberão os valores do Coolify.
# Estes são os valores padrão; eles serão sobrescritos pelas configurações do seu serviço no Coolify.
ENV SUPABASE_ACCESS_TOKEN=""
ENV PROJECT_REF=""
ENV FEATURES="database,docs,functions,storage,debug,development"
ENV PORT=45678

# Expõe a porta
EXPOSE 45678

# Comando para iniciar o servidor HTTP
CMD ["npm", "start"] 