# Documentação do Kickoff

Documentação de planejamento do próprio Kickoff. A ordem abaixo é a ordem de
leitura para quem chega no projeto.

| Documento | Para quê | Quem mantém |
| --- | --- | --- |
| [produto.md](produto.md) | O problema, quem usa, o que está dentro e fora do escopo, como saberemos que deu certo | Produto |
| [roadmap.md](roadmap.md) | As fases, os marcos e as datas projetadas | Gerência de projeto |
| [backlog.md](backlog.md) | Épicos e tarefas com estimativa de três pontos | Time todo |
| [riscos.md](riscos.md) | O que pode dar errado e o que fazemos a respeito | Gerência de projeto |
| [decisoes-tecnicas.md](decisoes-tecnicas.md) | Decisões de arquitetura já tomadas, com o motivo | Time técnico |
| [processo.md](processo.md) | Como trabalhamos: branches, revisão, pronto, cadência | Time todo |

**Versão em PDF:** [kickoff-planejamento.pdf](kickoff-planejamento.pdf) — os sete
documentos num arquivo só, para leitura ou impressão. Para regerar depois de
mudar a documentação:

```bash
python scripts/build-docs-pdf.py
```

O script monta o HTML de impressão; o PDF sai daí com o Chrome em modo headless
(veja o cabeçalho do script).

## Premissas que sustentam todo o resto

Estas premissas foram assumidas para produzir números. **Se qualquer uma delas
for falsa, o roadmap muda** — corrija aqui primeiro e recalcule depois.

1. **Time de 2 pessoas desenvolvedoras**, 30h semanais efetivas cada (60h/semana
   de capacidade). Não estão contadas reuniões longas, suporte e férias.
2. **Início em 06/08/2026**, com a v0 já pronta e funcionando.
3. **Ferramenta interna agora, produto depois.** Sem requisito de cobrança nesta
   fase, mas nenhuma decisão de arquitetura pode inviabilizar a virada.
4. **3 pessoas usando no primeiro trimestre**, em regime de teste.
5. **Uma pessoa decide escopo.** Sem isso, as estimativas não valem — a maior
   fonte de atraso em projeto pequeno é decisão travada, não código difícil.

## Decisões tomadas em 05/08/2026

As quatro perguntas em aberto foram respondidas. O que mudou:

| Pergunta | Resposta | Consequência no plano |
| --- | --- | --- |
| Interna ou produto? | Interna agora; venda depende do desempenho | Cobrança fica fora da v1. Isolamento por usuário continua obrigatório — é o que torna a virada possível sem reescrita |
| Orçamento de API por plano? | Sem teto por enquanto | Podemos rodar em esforço alto sem restrição. **Continuamos medindo** — o número vira crítico no dia da decisão de vender |
| Integrar com Jira, Linear ou Azure DevOps? | **Não.** Construir a nossa, no mesmo patamar, menos burocrática e mais intuitiva | Mudança grande: entra o épico E7 (execução do plano) e o não-escopo muda. **+106h, roadmap vai de 7,4 para 9,2 semanas** |
| Quantas pessoas no 1º trimestre? | 3, em teste | Espaço compartilhado pode ser simples: convite direto, sem hierarquia de organização, papéis ou cotas |

A terceira resposta é a de maior impacto e merece ser lida com atenção: o Kickoff
deixa de ser só um **gerador de plano** e passa a ser também o lugar onde o plano
é **executado**. Isso quase dobra a superfície do produto. A aposta que a
justifica está em [produto.md](produto.md): planejar e executar no mesmo lugar
elimina a tradução manual entre a ferramenta que planeja e a que executa — que é
onde os planos costumam morrer.

## Perguntas ainda em aberto

- Quando a decisão de vender for tomada, o isolamento passa a ser por
  organização, não por usuário. Vale antecipar o modelo de dados agora ou
  aceitar a migração depois? (Recomendação: aceitar depois — antecipar
  multi-organização sem cliente pagante é custo especulativo.)
- Qual das três pessoas do teste tem autoridade para decidir escopo?

## Estado atual: v0 entregue

Funciona hoje, ponta a ponta:

- Formulário de descrição livre → plano gerado → visualização e edição.
- Épicos, tarefas, riscos, marcos, premissas e perguntas em aberto.
- Estimativa de três pontos com agregação PERT e faixa de 85% de confiança.
- Recálculo ao vivo quando se muda estimativa, capacidade ou estado de tarefa.
- Exportação em Markdown.
- Banco embutido (PGlite), sem nada para instalar.

**Ainda não validado:** o caminho de geração com Claude nunca rodou de verdade —
falta a chave de API. Todos os planos gerados até agora vieram do motor
heurístico local. Isso é o item número um do backlog, e é bloqueante.
