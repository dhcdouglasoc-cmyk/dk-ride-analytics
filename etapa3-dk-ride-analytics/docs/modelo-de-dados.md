# DK Ride Analytics: modelo de dados (rascunho para validação)

Status: **proposta**. O app ainda grava no `localStorage`. Nada disto foi aplicado em banco algum.

## Princípios

- Dinheiro em **centavos (inteiros)**; distância em km com até 2 casas.
- Valores **informados** ficam gravados. Valores **calculados** (bruto, líquido, duração derivada, médias, lucro) **não** são gravados: saem sempre das fórmulas abaixo.
- Dados de demonstração **nunca** vão para o banco.
- Cada linha pertence a um usuário (`user_id`) e só ele a enxerga (RLS).

## `rides` (corridas)

| Campo | Tipo | Origem | Regra |
|---|---|---|---|
| id | uuid | sistema | chave primária |
| user_id | uuid | sistema | dono do registro (usuário autenticado) |
| ride_date | date | informado | obrigatório; não pode ser futura (validada no app) |
| start_time, end_time | time | informado | opcionais; **ou os dois ou nenhum**; fim menor que início = virou a meia-noite |
| duration_minutes | int | informado | opcional, 1 a 720; só gravada quando **não** há horários |
| distance_km | numeric(6,2) | informado | opcional, > 0 e ≤ 300 |
| base_amount_cents | int | informado | obrigatório, > 0 |
| tip_amount_cents | int | informado | padrão 0 |
| bonus_amount_cents | int | informado | padrão 0 |
| platform_fees_cents | int | informado | padrão 0; não pode exceder base + gorjeta + bônus |
| platform | text | informado | opcional, até 40 caracteres |
| notes | text | informado | até 200 caracteres |
| created_at, updated_at | timestamptz | sistema | `updated_at` muda a cada edição |

**Desconhecido não é zero:** sem horários e sem duração, a duração é desconhecida; sem distância, a distância é desconhecida. Essas corridas ficam fora das médias que dependem do dado.

## `expenses` (despesas)

Registradas **à parte**, por data e categoria (decisão aprovada). Cada gasto existe uma única vez e entra no período pela sua data.

| Campo | Tipo | Regra |
|---|---|---|
| id, user_id, created_at, updated_at | | como em `rides` |
| expense_date | date | obrigatório |
| category | text | `combustivel`, `manutencao`, `seguro_documentacao`, `plano_celular`, `equipamentos`, `outros` |
| amount_cents | int | obrigatório, > 0 |
| notes | text | até 200 caracteres |

## Fórmulas (período P, corridas R, despesas D)

- Valor bruto da corrida = base + gorjeta + bônus
- Ganhos brutos = soma do bruto das corridas de R
- Líquido = ganhos brutos − soma das taxas
- Média por corrida = ganhos brutos ÷ nº de corridas
- Média por hora = líquido ÷ horas, **só** sobre corridas com duração conhecida
- Ganho por km = líquido ÷ km, **só** sobre corridas com distância conhecida
- Custos = soma de D no período
- **Lucro estimado = líquido − custos**
- Custo por km = custos ÷ km total (indicativo)
- Divisão por zero resulta em "sem dados", nunca em 0 ou NaN.

## Segurança (RLS)

Em ambas as tabelas: RLS ligado; usuários autenticados só leem, inserem, alteram e apagam linhas com `user_id = auth.uid()`. Nenhuma chave `service_role` no frontend; só a chave pública (anon/publishable).

## Decisões em aberto

1. **Turnos** (hora de ligar/desligar o app): hoje o tempo trabalhado só soma as corridas, o que superestima o ganho por hora. Criar tabela `shifts` agora ou depois?
2. **Aplicativos:** `platform` segue texto livre ou vira lista/tabela?
3. **Registros atuais no `localStorage`:** migrar para o banco ou recomeçar?
4. **Fuso horário:** datas e horários são locais do usuário (sem conversão). Aceitável para uso pessoal no Brasil?
