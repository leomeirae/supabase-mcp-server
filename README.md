# Supabase MCP Server - Deploy no Coolify

Este repositório contém os arquivos necessários para fazer o deploy do Supabase MCP Server no Coolify usando Docker.

## O que é o Supabase MCP Server?

O Supabase MCP Server permite conectar seu projeto Supabase a assistentes de IA como Cursor, Claude, Windsurf e outros através do Model Context Protocol (MCP). Ele oferece ferramentas para:

- Gerenciar tabelas e consultar dados
- Aplicar migrações
- Gerenciar Edge Functions
- Acessar documentação atualizada
- E muito mais

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
4. Dê um nome descritivo como "Coolify MCP Server"
5. Copie o token gerado (você não conseguirá vê-lo novamente)

## Deploy no Coolify

### Passo 1: Preparar o Repositório

1. Faça fork ou clone este repositório
2. Envie para seu GitHub (pode ser privado)

### Passo 2: Configurar no Coolify

1. No dashboard do Coolify, vá para **Create New Resource**
2. Selecione **"Deploy from a Git Repository"**
3. Conecte sua conta do GitHub e selecione este repositório
4. Dê um nome ao serviço, como "Supabase MCP Server"

### Passo 3: Configurar Variáveis de Ambiente

Na aba **Environment Variables** do Coolify, configure:

#### Variáveis Obrigatórias:
- `SUPABASE_ACCESS_TOKEN`: Seu Personal Access Token do Supabase
  - **IMPORTANTE**: Marque como "Build-time variable" e "Is secret"
- `PROJECT_REF`: ID de referência do seu projeto Supabase
  - Exemplo: `abcdefghijklmnopqrst`

#### Variáveis Opcionais:
- `READ_ONLY`: Para modo somente leitura (recomendado)
  - Valor: `--read-only` (padrão) ou `""` para permitir escrita
- `FEATURES`: Grupos de ferramentas específicas
  - Exemplo: `database,docs,functions`

### Passo 4: Fazer o Deploy

1. Clique em **Deploy**
2. Acompanhe os logs na aba **Logs**
3. Aguarde a inicialização completa

## Configuração de Segurança

### Recomendações:

1. **Use sempre modo read-only** para produção
2. **Limite o acesso a um projeto específico** usando `PROJECT_REF`
3. **Use branches de desenvolvimento** quando possível
4. **Monitore os logs** regularmente
5. **Não compartilhe tokens** com usuários finais

### Grupos de Ferramentas Disponíveis:

- `account`: Gerenciamento de conta (padrão)
- `database`: Operações de banco de dados (padrão)
- `docs`: Documentação (padrão)
- `debug`: Logs e debugging (padrão)
- `development`: Configurações de desenvolvimento (padrão)
- `functions`: Edge Functions (padrão)
- `branching`: Branches de desenvolvimento (padrão)
- `storage`: Storage buckets (desabilitado por padrão)

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

1. **Erro de autenticação**: Verifique se o `SUPABASE_ACCESS_TOKEN` está correto
2. **Erro de projeto**: Confirme se o `PROJECT_REF` está correto
3. **Timeout**: Verifique se o Coolify tem acesso à internet
4. **Permissões**: Confirme se o token tem as permissões necessárias

### Logs Úteis:

- Verifique os logs do Coolify para erros de inicialização
- Use `docker logs` se necessário para debug adicional

## Recursos Adicionais

- [Documentação oficial do Supabase MCP](https://supabase.com/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Documentação do Coolify](https://coolify.io/docs)

## Licença

Este projeto segue a licença Apache 2.0 do projeto original. 