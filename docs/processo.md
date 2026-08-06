# Processo

Time de 2 pessoas. O processo é proporcional a isso: o suficiente para não
perder trabalho e não repetir discussão, nada além.

## Cadência

| Ritual | Quando | Duração | Para quê |
| --- | --- | --- | --- |
| Alinhamento diário | Toda manhã | 10 min | O que travou. Não é relatório de status — isso está no quadro |
| Revisão de marco | Ao fechar cada M | 45 min | Esforço real × estimado, riscos, ajuste do roadmap |
| Repriorização | Início de cada marco | 30 min | Confirmar que a ordem do backlog ainda faz sentido |

Sem sprint de duas semanas. Com dois marcos deste tamanho, cerimônia de sprint
custa mais do que entrega.

## Fluxo de trabalho

1. Pegue a tarefa mais alta do épico em andamento. **Não pule épico** — a ordem
   em [backlog.md](backlog.md) reflete dependência real, não preferência.
2. Branch a partir de `main`: `tipo/descricao-curta`
   (`feat/auth-provider`, `fix/pglite-bootstrap`, `docs/rubrica-avaliacao`).
3. Commits pequenos, no imperativo, em português:
   `adiciona owner_id ao schema de projetos`.
4. Abra o PR quando estiver pronto para revisão, não antes. PR aberto é convite
   a revisar.
5. **Revisão obrigatória**, mesmo com duas pessoas. Especialmente com duas
   pessoas — é a única barreira que sobra.
6. `main` sempre publicável.

## Definição de pronto

Uma tarefa só é marcada como concluída quando **todos** os itens valem:

- [ ] Faz o que a descrição da tarefa diz, incluindo o critério de aceite.
- [ ] `npm run build` passa.
- [ ] `npx tsc --noEmit` passa sem erro.
- [ ] `npm run lint` passa sem aviso novo.
- [ ] Testado no navegador, no fluxo real — não só "compila".
- [ ] Se mexeu em consulta ao banco depois do M2: tem teste provando o
      isolamento por usuário.
- [ ] Se mudou decisão de arquitetura: registrada em
      [decisoes-tecnicas.md](decisoes-tecnicas.md).
- [ ] Se a estimativa errou por mais de 50%: o esforço real está anotado na
      tarefa. **Este item é o que vai calibrar as estimativas futuras — não
      pule.**

## Testes

Não perseguimos cobertura. Perseguimos as coisas que, quebrando, param o
produto:

| O que | Como | A partir de |
| --- | --- | --- |
| Cálculo PERT e agregação | Teste unitário de `src/lib/estimate.ts` | agora |
| Validação da saída do modelo | Teste de `PlanSchema` com respostas reais e malformadas | E1 |
| Isolamento entre usuários | Teste de integração com dois usuários | E2, bloqueante |
| Fluxo descrever → gerar → editar | Um teste ponta a ponta, só o caminho feliz | E5 |

Nada disso existe hoje. A tarefa 5.2 é onde entra, e ela vem antes do M2.

## Como registrar esforço real

É a prática que sustenta todas as estimativas futuras, e a mais fácil de
abandonar. Ao fechar cada tarefa, anote no PR uma linha:

```
Estimado (PERT): 13h · Real: 21h · Motivo: a documentação do provedor
estava desatualizada e o fluxo de callback mudou.
```

Depois de uns vinte pontos, o histórico do time vale mais que qualquer fórmula.
O motivo importa mais que o número: é ele que revela o padrão.

## Quando a estimativa fura

Furar estimativa não é problema — não avisar é.

- **Até 30% acima:** siga, anote o real ao fechar.
- **Entre 30% e 100%:** avise a outra pessoa no alinhamento do dia. Reavalie as
  tarefas parecidas do mesmo épico.
- **Acima de 100%:** pare. Não é mais uma tarefa mal estimada, é uma tarefa mal
  entendida. Reabra o escopo dela antes de continuar codando.

## Quando pedirem algo fora do escopo

Cite o não-escopo em [produto.md](produto.md) e trate como **troca**, não como
adição:

> "Cabe sim. Entra no lugar de quê? Se nada sair, a data do M3 anda duas
> semanas — sua escolha."

Isso não é burocracia. É a única forma de o número que você comunicou continuar
significando alguma coisa daqui a um mês.
