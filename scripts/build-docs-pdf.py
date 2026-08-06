"""Monta um HTML único de impressão a partir dos documentos em docs/.

Uso:

    python -m pip install markdown
    python scripts/build-docs-pdf.py

O HTML sai em docs/. Para virar PDF, imprima com o Chrome em modo headless
(o Edge funciona igual, trocando o executável):

    chrome --headless --disable-gpu --no-pdf-header-footer \\
      --print-to-pdf=docs/kickoff-planejamento.pdf \\
      file:///caminho/absoluto/docs/kickoff-planejamento.html

Rode de novo sempre que mudar qualquer arquivo de docs/ — o PDF não se
atualiza sozinho.
"""

import re
from pathlib import Path

import markdown

DOCS = Path(__file__).resolve().parent.parent / "docs"
OUT = DOCS / "kickoff-planejamento.html"

# ordem de leitura -> (arquivo, id da ancora, titulo, subtitulo)
SECTIONS = [
    ("README.md", "indice", "Visão geral e premissas",
     "Por onde começar, o que assumimos e o que ainda não sabemos"),
    ("produto.md", "produto", "Produto",
     "O problema, quem usa, o que está dentro e fora do escopo"),
    ("roadmap.md", "roadmap", "Roadmap",
     "Marcos, critérios de saída e datas projetadas"),
    ("backlog.md", "backlog", "Backlog",
     "Épicos e tarefas com estimativa de três pontos"),
    ("riscos.md", "riscos", "Riscos",
     "O que pode dar errado e o que fazemos a respeito"),
    ("decisoes-tecnicas.md", "decisoes", "Decisões técnicas",
     "Arquitetura já definida, com motivo e gatilho de revisão"),
    ("processo.md", "processo", "Processo",
     "Cadência, definição de pronto, testes e escopo"),
]

ANCHORS = {name: anchor for name, anchor, _, _ in SECTIONS}


def fix_links(text: str) -> str:
    """Troca links entre arquivos .md por ancoras internas do PDF."""

    def repl(match: re.Match[str]) -> str:
        target = match.group(1).split("/")[-1]
        anchor = ANCHORS.get(target)
        return f"](#{anchor})" if anchor else "]()"

    return re.sub(r"\]\(([A-Za-z0-9_/.-]+\.md)\)", repl, text)


def strip_first_heading(html: str) -> str:
    """O titulo da secao ja aparece no cabecalho da pagina."""
    return re.sub(r"^\s*<h1>.*?</h1>", "", html, count=1, flags=re.S)


CSS = """
@page { size: A4; margin: 20mm 18mm 18mm 18mm; }
@page :first { margin: 0; }

* { box-sizing: border-box; }

html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 10.2pt;
  line-height: 1.55;
  color: #16191d;
}

/* ---------- capa ---------- */
.cover {
  page-break-after: always;
  height: 297mm;
  padding: 38mm 24mm 20mm;
  background: #0f1216;
  color: #eef1f5;
  display: flex;
  flex-direction: column;
}
.cover .mark {
  display: inline-grid;
  place-items: center;
  width: 15mm; height: 15mm;
  border-radius: 3.5mm;
  background: #f5a524;
  color: #0f1216;
  font-size: 24pt; font-weight: 700;
  margin-bottom: 14mm;
}
.cover h1 { font-size: 34pt; line-height: 1.08; margin: 0 0 5mm; letter-spacing: -0.6pt; }
.cover .sub { font-size: 13pt; color: #a9b3c0; max-width: 120mm; margin: 0 0 auto; line-height: 1.5; }
.cover .numbers { display: flex; gap: 9mm; margin: 0 0 12mm; flex-wrap: wrap; }
.cover .numbers div { border-left: 2px solid #f5a524; padding-left: 4mm; }
.cover .numbers .k { display: block; font-size: 8.5pt; letter-spacing: 1pt;
  text-transform: uppercase; color: #8f9aa8; margin-bottom: 1.5mm; }
.cover .numbers .v { font-size: 17pt; font-weight: 600; font-variant-numeric: tabular-nums; }
.cover .meta { font-size: 9.5pt; color: #7f8a99; border-top: 1px solid #2a3038; padding-top: 5mm; }

/* ---------- sumario ---------- */
.toc { page-break-after: always; padding-top: 4mm; }
.toc h2 { font-size: 15pt; margin: 0 0 8mm; letter-spacing: -0.2pt; }
.toc ol { list-style: none; counter-reset: s; padding: 0; margin: 0; }
.toc li { counter-increment: s; border-bottom: 1px solid #e6e9ee; padding: 3.5mm 0; }
.toc li::before {
  content: counter(s, decimal-leading-zero);
  font-variant-numeric: tabular-nums; color: #c07f10;
  font-weight: 700; margin-right: 5mm; font-size: 10pt;
}
.toc a { color: #16191d; text-decoration: none; font-weight: 600; font-size: 11pt; }
.toc .d { display: block; margin-left: 12mm; color: #5d6875; font-size: 9.2pt; margin-top: 1mm; }

/* ---------- secoes ---------- */
section { page-break-before: always; }
.head { border-bottom: 2px solid #16191d; padding-bottom: 3mm; margin-bottom: 7mm; }
.head .n { font-size: 8.5pt; letter-spacing: 1.4pt; text-transform: uppercase; color: #c07f10; font-weight: 700; }
.head h2 { font-size: 21pt; margin: 1.5mm 0 1mm; letter-spacing: -0.4pt; }
.head p { margin: 0; color: #5d6875; font-size: 10pt; }

h3 { font-size: 13pt; margin: 8mm 0 2.5mm; letter-spacing: -0.2pt; page-break-after: avoid; }
h4 { font-size: 10.5pt; margin: 6mm 0 2mm; page-break-after: avoid; }
p { margin: 0 0 3.2mm; }
ul, ol { margin: 0 0 3.5mm; padding-left: 6mm; }
li { margin-bottom: 1.4mm; }
strong { font-weight: 650; }
a { color: #b06f00; text-decoration: none; }

hr { border: 0; border-top: 1px solid #e6e9ee; margin: 7mm 0; }

table {
  width: 100%; border-collapse: collapse;
  margin: 3mm 0 5mm; font-size: 9.2pt;
  page-break-inside: avoid;
}
th, td { border: 1px solid #dde1e8; padding: 2mm 2.6mm; text-align: left; vertical-align: top; }
th { background: #f4f6f9; font-weight: 650; font-size: 8.8pt;
     text-transform: uppercase; letter-spacing: 0.4pt; color: #3c4652; }
td:has(+ td), td { font-variant-numeric: tabular-nums; }
tbody tr:nth-child(even) { background: #fafbfc; }

blockquote {
  margin: 4mm 0; padding: 3mm 4mm;
  border-left: 3px solid #f5a524; background: #fdf7ec;
  color: #45403a; font-size: 9.6pt;
  page-break-inside: avoid;
}
blockquote p:last-child { margin-bottom: 0; }

code {
  font-family: "Cascadia Mono", Consolas, monospace;
  font-size: 8.8pt; background: #f1f3f7;
  padding: 0.4mm 1.2mm; border-radius: 1mm;
}
pre { background: #f4f6f9; border: 1px solid #e2e6ec; border-radius: 1.5mm;
      padding: 3mm; overflow: hidden; page-break-inside: avoid; }
pre code { background: none; padding: 0; font-size: 8.6pt; line-height: 1.45; }

input[type=checkbox] { margin-right: 1.5mm; }
"""


def build() -> Path:
    md = markdown.Markdown(
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"]
    )

    toc_items, body = [], []

    for index, (filename, anchor, title, subtitle) in enumerate(SECTIONS, start=1):
        raw = (DOCS / filename).read_text(encoding="utf-8")
        md.reset()
        html = strip_first_heading(md.convert(fix_links(raw)))
        # checkbox de lista de tarefas -> caixinha de verdade
        html = html.replace("[ ]", "&#9744;")

        toc_items.append(
            f'<li><a href="#{anchor}">{title}</a>'
            f'<span class="d">{subtitle}</span></li>'
        )
        body.append(
            f'<section id="{anchor}">'
            f'<div class="head"><div class="n">Documento {index:02d}</div>'
            f"<h2>{title}</h2><p>{subtitle}</p></div>{html}</section>"
        )

    document = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Kickoff — Documentação de Planejamento</title>
<style>{CSS}</style></head><body>

<div class="cover">
  <div class="mark">K</div>
  <h1>Kickoff</h1>
  <p class="sub">Documentação de planejamento da ferramenta que transforma a
  descrição de um projeto de software em plano de execução.</p>
  <div class="numbers">
    <div><span class="k">Esforço esperado</span><span class="v">529 h</span></div>
    <div><span class="k">85% de confiança</span><span class="v">553 h</span></div>
    <div><span class="k">Duração</span><span class="v">9,2 sem</span></div>
    <div><span class="k">Marcos</span><span class="v">5</span></div>
  </div>
  <div class="meta">Versão de 05/08/2026 &nbsp;·&nbsp; v0 entregue, M1 em aberto
  &nbsp;·&nbsp; Premissa: 2 pessoas &times; 30 h/semana</div>
</div>

<div class="toc">
  <h2>Sumário</h2>
  <ol>{"".join(toc_items)}</ol>
</div>

{"".join(body)}
</body></html>"""

    OUT.write_text(document, encoding="utf-8")
    return OUT


if __name__ == "__main__":
    print(build())
