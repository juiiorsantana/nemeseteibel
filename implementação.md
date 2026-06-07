# PROJETO Reconstrução do site Nemes & Teibel Advocacia

## CONTEXTO
Estou reconstruindo o site de um escritório de advocacia especializado em Direito Agrário, Fundiário e Ambiental, localizado em Cuiabá, Mato Grosso. O site atual está no WordPress + Elementor e quero reimplementá-lo em HTMLCSSJS puro — mais rápido, sem dependências, fácil de hospedar em qualquer servidor ou CDN.

## OBJETIVO TÉCNICO
- Stack HTML5 + CSS3 + JavaScript vanilla (sem frameworks)
- Uma pasta por página, index.html dentro de cada uma
- CSS em arquivo separado (style.css) compartilhado entre páginas
- JS em arquivo separado (main.js) para interações
- Mobile-first, responsivo
- Rápido sem bibliotecas desnecessárias, imagens otimizadas
- Preparado para SEO title, meta description, Open Graph e Schema markup em cada página
- Preparado para AEO blocos de FAQ com schema FAQ markup, conteúdo estruturado em seções claras com headings hierárquicos (H1  H2  H3)

## ESTRUTURA DE ARQUIVOS

├── index.html               → Home
├── sobreindex.html         → Quem somos
├── blogindex.html          → Listagem de artigos
├── blog[slug]index.html   → Artigo individual
├── lpregularizacao-fundiariaindex.html   → LP Ads
├── lpregularizacao-ambientalindex.html
├── lpdue-diligenceindex.html
├── cssstyle.css
├── jsmain.js
└── assets                  → imagens, logo, fontes

## IDENTIDADE DO ESCRITÓRIO
- Nome Advocacia Nemes & Teibel
- Site atual nemeseteibeladv.com.br
- Posicionamento Especialistas em Regularização e Consultoria Preventiva — Sua Propriedade Rural Regularizada com Segurança Jurídica Total
- Público produtores rurais, fazendeiros, empresas do agronegócio, herdeiros de propriedades rurais — Mato Grosso e Centro-Oeste
- Tom autoridade técnica + proximidade com o mundo do agro. Sério, mas acessível. Nunca distante ou frio.

## SÓCIAS
- Paula Teibel — +20 anos, ex-servidora do INTERMAT (Instituto de Terras do MT)
- Manuela Nemes — +15 anos, Vice-Presidente da Comissão de Assuntos Fundiários da OABMT

## COMO VAMOS TRABALHAR
Vou te mandar prints do site atual seção por seção, junto com os textos de cada bloco. Sua tarefa é

1. Replicar fielmente o layout visual da seção mostrada no print
2. Usar os textos que eu fornecer — não invente conteúdo
3. Escrever HTML semântico limpo (usar nav, main, section, article, footer corretamente)
4. Manter o CSS organizado com variáveis no root para cores e fontes
5. Me avisar se identificar algo que pode melhorar para SEO ou performance

## VARIÁVEIS CSS BASE (extrair do print quando eu mandar, mas reserve espaço para isso)
```css
root {
  --color-primary ;        cor principal — extrair do print 
  --color-secondary ;      cor secundária 
  --color-accent ;         destaque  CTA 
  --color-text ;           texto principal 
  --color-bg ;             fundo 
  --font-heading ;         fonte dos títulos 
  --font-body ;            fonte do corpo 
}
```

## PRIMEIRA TAREFA
Aguarde. Vou mandar agora o print da primeira seção do site (headerhero) junto com os textos correspondentes. Crie apenas essa seção por vez — não antecipe as próximas.