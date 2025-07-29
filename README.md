# Supabase MCP Server - Deploy no Coolify

Este repositório contém os arquivos necessários para fazer o deploy do Supabase MCP Server no Coolify usando Docker, configurado para **gestão completa de leads e imagens de contas de energia**.

## O que é o Supabase MCP Server?

O Supabase MCP Server permite conectar seu projeto Supabase a assistentes de IA como Cursor, Claude, Windsurf e outros através do Model Context Protocol (MCP). Ele oferece ferramentas para:

- **Gestão de Leads**: Cadastro, consulta e atualização de leads
- **Gestão de Imagens**: Upload e gerenciamento de imagens de contas de energia
- **Operações de Banco**: Tabelas, migrações, SQL completo
- **Edge Functions**: Funções personalizadas
- **Storage**: Gerenciamento de arquivos e buckets
- **Documentação**: Acesso à documentação atualizada

## Arquivos Incluídos

- `Dockerfile`: Define como construir a imagem Docker do servidor
- `docker-compose.yml`: Configuração para orquestração no Coolify
- `instrucoes.md`: Instruções detalhadas em português

## Pré-requisitos

1. **Coolify Self-Hosted**: Uma instância do Coolify funcionando
2. **Conta no GitHub**: Para armazenar este repositório
3. **Supabase Personal Access Token (PAT)**: Token de acesso pessoal do Supabase

## Como Obter o Supabase PAT

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Vá para **Settings** > **Access Tokens**
3. Clique em **Generate new token**
4. Dê um nome descritivo como "Coolify MCP Server - Gestão Leads"
5. Copie o token gerado (você não conseguirá vê-lo novamente)

## Deploy no Coolify

### Passo 1: Preparar o Repositório

1. Faça fork ou clone este repositório
2. Envie para seu GitHub (pode ser privado)

### Passo 2: Configurar no Coolify

1. No dashboard do Coolify, vá para **Create New Resource**
2. Selecione **"Deploy from a Git Repository"**
3. Conecte sua conta do GitHub e selecione este repositório
4. Dê um nome ao serviço, como "Supabase MCP Server - Gestão Leads"

### Passo 3: Configurar Variáveis de Ambiente

Na aba **Environment Variables** do Coolify, configure:

#### Variáveis Obrigatórias:
- `SUPABASE_ACCESS_TOKEN`: Seu Personal Access Token do Supabase
  - **IMPORTANTE**: Marque como "Build-time variable" e "Is secret"
- `PROJECT_REF`: ID de referência do seu projeto Supabase
  - Exemplo: `abcdefghijklmnopqrst`

#### Variáveis Opcionais (Configuradas por Padrão):
- `READ_ONLY`: Deixe vazio (`""`) para permitir operações de escrita
- `FEATURES`: `database,docs,functions,storage,debug,development`

### Passo 4: Fazer o Deploy

1. Clique em **Deploy**
2. Acompanhe os logs na aba **Logs**
3. Aguarde a inicialização completa

## Funcionalidades Disponíveis

### 🎯 Gestão de Leads
- **cadastrar_lead**: Cadastra ou atualiza leads
- **buscar_leads**: Consulta dados de leads
- **buscar_lead_por_id**: Busca lead por ID
- **atualizar_lead**: Atualiza dados do lead
- **validar_qualificacao_lead**: Valida qualificação

### 📸 Gestão de Imagens
- **Upload de imagens**: Contas de energia como BLOB
- **Metadados**: Informações sobre imagens
- **URLs assinadas**: Acesso seguro às imagens
- **Storage buckets**: Gerenciamento de arquivos

### 🗄️ Operações de Banco
- **Tabelas**: `leads`, `energy_bill_images`, `image_metadata`, `energy_bills`
- **SQL completo**: Consultas e modificações
- **Migrações**: Alterações de schema
- **Funções**: Edge Functions personalizadas

## Configuração de Segurança

### ⚠️ Avisos Importantes:

1. **Modo de Escrita**: Este servidor permite operações de escrita
2. **Acesso Completo**: Pode modificar dados e estrutura do banco
3. **Monitoramento**: Monitore os logs regularmente
4. **Backup**: Mantenha backups regulares do banco
5. **Testes**: Teste em ambiente de desenvolvimento primeiro

### Recomendações:

1. **Use branches de desenvolvimento** quando possível
2. **Monitore os logs** regularmente
3. **Configure alertas** para operações críticas
4. **Mantenha backups** automáticos
5. **Teste as operações** antes de usar em produção

### Grupos de Ferramentas Habilitadas:

- `database`: Operações completas de banco de dados
- `docs`: Documentação
- `functions`: Edge Functions
- `storage`: Storage buckets e arquivos
- `debug`: Logs e debugging
- `development`: Configurações de desenvolvimento

## Conectando ao Cliente MCP

Após o deploy, configure seu cliente MCP (como Cursor) com:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "http://seu-coolify-url:porta",
        "-H", "Content-Type: application/json",
        "-d", "{\"jsonrpc\": \"2.0\", \"method\": \"initialize\", \"params\": {}}"
      ]
    }
  }
}
```

## Troubleshooting

### Problemas Comuns:

1. **Erro de permissão**: Verifique se o token tem permissões de escrita
2. **Erro de projeto**: Confirme se o `PROJECT_REF` está correto
3. **Timeout**: Verifique se o Coolify tem acesso à internet
4. **Storage**: Confirme se o storage está habilitado no projeto

### Logs Úteis:

- Verifique os logs do Coolify para erros de inicialização
- Use `docker logs` se necessário para debug adicional

## Recursos Adicionais

- [Documentação oficial do Supabase MCP](https://supabase.com/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Documentação do Coolify](https://coolify.io/docs)

## Licença

Este projeto segue a licença Apache 2.0 do projeto original. 