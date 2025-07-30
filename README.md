# Supabase MCP Server - Deploy no Coolify

Este repositório contém os arquivos necessários para fazer o deploy do Supabase MCP Server no Coolify usando Docker, configurado para **gestão completa de leads e imagens de contas de energia**.

## 🚀 **Servidor Ativo e Funcionando**

**URL do Servidor**: `http://egkccc8ow4kw40gokgkw0.157.180.32.249.sslip.io`

**Status**: ✅ **OPERACIONAL** - Pronto para uso em produção

**Configuração de Porta**: 
- **Interna**: 45678 (dentro do container)
- **Externa**: Gerenciada automaticamente pelo Coolify
- **Acesso**: Via proxy reverso do Coolify (sem configuração manual de porta)

**Endpoints Disponíveis**:
- `GET /` - Informações do servidor
- `GET /health` - Status de saúde
- `GET /status` - Status detalhado
- `GET /test` - Endpoint de teste
- `POST /test` - Teste POST
- `POST /mcp` - **Endpoint principal para comunicação MCP**

## O que é o Supabase MCP Server?

O Supabase MCP Server permite conectar seu projeto Supabase a assistentes de IA como Cursor, Claude, Windsurf e outros através do Model Context Protocol (MCP). Ele oferece ferramentas para:

- **Gestão de Leads**: Cadastro, consulta e atualização de leads
- **Gestão de Imagens**: Upload e gerenciamento de imagens de contas de energia
- **Operações de Banco**: Tabelas, migrações, SQL completo
- **Edge Functions**: Funções personalizadas
- **Storage**: Gerenciamento de arquivos e buckets
- **Documentação**: Acesso à documentação atualizada

## 🛠️ **Tools Disponíveis para Agentes de IA**

### 📊 **Database Tools (Operações de Banco)**

#### **Tabelas e Schemas**
- `list_tables` - Lista todas as tabelas do banco
- `list_extensions` - Lista extensões instaladas
- `list_migrations` - Lista migrações aplicadas

#### **Operações SQL**
- `execute_sql` - Executa SQL customizado
- `apply_migration` - Aplica migrações DDL
- `generate_typescript_types` - Gera tipos TypeScript

#### **Tabelas Específicas para Gestão de Leads**
- `leads` - Tabela principal de leads
- `energy_bill_images` - Imagens das contas de energia (BLOB)
- `image_metadata` - Metadados das imagens
- `energy_bills` - Registro de contas processadas

### 🎯 **Funções Específicas para Gestão de Leads**

#### **Operações de Lead**
- `cadastrar_lead` - Cadastra ou atualiza lead
- `buscar_leads` - Consulta dados de leads
- `buscar_lead_por_id` - Busca lead por ID
- `atualizar_lead` - Atualiza dados do lead
- `validar_qualificacao_lead` - Valida qualificação

#### **Campos de Lead Disponíveis**
```json
{
  "id": "UUID",
  "phone_number": "String (normalizado)",
  "name": "String",
  "city": "String",
  "state": "String",
  "invoice_amount": "Decimal",
  "client_type": "String",
  "email": "String",
  "additional_data": "JSON",
  "created_at": "Timestamp",
  "updated_at": "Timestamp"
}
```

### 📸 **Storage Tools (Gestão de Imagens)**

#### **Upload e Gestão de Imagens**
- `upload_energy_bill_image` - Upload de imagem como BLOB
- `generate_signed_url` - Gera URL assinada para acesso
- `save_image_metadata` - Salva metadados da imagem
- `salvar_energy_bill` - Registra conta processada

#### **Buckets e Arquivos**
- Gerenciamento de buckets de storage
- Upload/download de arquivos
- URLs públicas e privadas
- Políticas de acesso

### 🔧 **Edge Functions**

#### **Funções Disponíveis**
- `list_edge_functions` - Lista funções disponíveis
- `deploy_edge_function` - Deploy de nova função
- Execução de funções personalizadas

### 📚 **Documentação**

#### **Acesso à Documentação**
- `search_docs` - Busca na documentação
- Documentação atualizada do Supabase
- Guias e tutoriais

### 🐛 **Debug e Desenvolvimento**

#### **Ferramentas de Debug**
- `get_logs` - Acesso aos logs
- `get_advisors` - Conselhos de segurança e performance
- `get_project_url` - URL do projeto
- `get_anon_key` - Chave anônima

## 🔄 **Como Usar com Agentes de IA**

### **Configuração do Agente MCP**

Configure seu agente para usar o servidor:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "http://egkccc8ow4kw40gokgkw0.157.180.32.249.sslip.io/mcp",
        "-H", "Content-Type: application/json",
        "-d", "{\"jsonrpc\": \"2.0\", \"method\": \"initialize\", \"params\": {}}"
      ]
    }
  }
}
```

### **Exemplos de Uso para Agentes**

#### **1. Cadastrar um Novo Lead**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "cadastrar_lead",
    "arguments": {
      "phone_number": "5511999999999",
      "name": "João Silva",
      "city": "São Paulo",
      "state": "SP",
      "invoice_amount": 150.50,
      "client_type": "residencial",
      "email": "joao@email.com",
      "additional_data": {
        "source": "website",
        "campaign": "energia_verde"
      }
    }
  }
}
```

#### **2. Buscar Leads por Telefone**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "buscar_leads",
    "arguments": {
      "phone_number": "5511999999999"
    }
  }
}
```

#### **3. Upload de Imagem de Conta**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "upload_energy_bill_image",
    "arguments": {
      "lead_id": "uuid-do-lead",
      "image_data": "base64-encoded-image",
      "filename": "conta_energia_janeiro.pdf",
      "metadata": {
        "month": "01",
        "year": "2024",
        "utility_company": "CPFL"
      }
    }
  }
}
```

#### **4. Executar SQL Customizado**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "execute_sql",
    "arguments": {
      "query": "SELECT * FROM leads WHERE city = 'São Paulo' AND created_at >= NOW() - INTERVAL '30 days'"
    }
  }
}
```

## 📋 **Casos de Uso Específicos**

### **Gestão de Leads - Fluxo Completo**

1. **Cadastro de Lead**
   - Normalização automática de telefone
   - Validação de dados
   - Armazenamento de dados adicionais em JSON

2. **Consulta e Atualização**
   - Busca por múltiplos formatos de telefone
   - Atualização de dados existentes
   - Rastreamento de origem (source)

3. **Qualificação**
   - Validação automática
   - Score de qualificação
   - Histórico de interações

### **Gestão de Imagens - Processo Completo**

1. **Upload de Imagem**
   - Conversão para BLOB
   - Compressão automática
   - Validação de formato

2. **Metadados**
   - Extração de informações
   - Indexação para busca
   - Associação com lead

3. **Acesso Seguro**
   - URLs assinadas
   - Controle de acesso
   - Expiração automática

## 🔧 **Configuração Técnica**

### **Variáveis de Ambiente**

#### **Obrigatórias**
- `SUPABASE_ACCESS_TOKEN`: Token de acesso pessoal
- `PROJECT_REF`: ID de referência do projeto

#### **Opcionais**
- `FEATURES`: `database,docs,functions,storage,debug,development`
- `PORT`: `45678` (padrão)

### **Arquivos de Configuração**

- `Dockerfile`: Imagem Docker
- `docker-compose.yml`: Orquestração
- `server.js`: Servidor HTTP wrapper
- `package.json`: Dependências Node.js

## 🚨 **Segurança e Boas Práticas**

### **Configurações de Segurança**
- ✅ Modo de escrita habilitado
- ✅ Acesso completo ao banco
- ✅ Operações de storage
- ✅ Edge Functions

### **Monitoramento**
- Logs detalhados em `/status`
- Health checks automáticos
- Endpoints de diagnóstico

### **Backup e Recuperação**
- Backup regular do banco
- Versionamento de migrações
- Logs de auditoria

## 📞 **Suporte e Troubleshooting**

### **Endpoints de Diagnóstico**
- `GET /health` - Status básico
- `GET /status` - Status detalhado com variáveis
- `GET /test` - Teste de conectividade
- `POST /test` - Teste de POST

### **Logs Úteis**
- Logs de inicialização
- Logs de requisições MCP
- Logs de erros e warnings

### **Problemas Comuns**
1. **Token inválido**: Verificar `SUPABASE_ACCESS_TOKEN`
2. **Projeto não encontrado**: Verificar `PROJECT_REF`
3. **Timeout**: Verificar conectividade
4. **Permissões**: Verificar permissões do token

## 🔗 **Links Úteis**

- **Servidor Ativo**: http://egkccc8ow4kw40gokgkw0.157.180.32.249.sslip.io
- **Documentação Supabase**: https://supabase.com/docs
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Coolify**: https://coolify.io

## 📄 **Licença**

Este projeto segue a licença Apache 2.0 do projeto original.

---

**🎉 Servidor 100% operacional e pronto para uso em produção!** 