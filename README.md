# Gini Fest — Site com API

Site estático feito com **HTML, CSS e JavaScript**, pronto para publicar no **GitHub Pages**.

## Recursos
- Visual preto + neon inspirado em som automotivo
- Responsivo para computador e celular
- Tela de confirmação 18+
- Contagem regressiva para 09/10/2026 às 21h
- Consumo de **API REST** com `fetch()`
- Tratamento de resposta **JSON**
- Previsão do tempo via **Open-Meteo API**
- RSVP salvo no navegador com `localStorage`

## Como abrir no computador
Basta abrir `index.html` no navegador. Para testar exatamente como no GitHub Pages, use uma extensão como Live Server no VS Code.

## Como publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie `index.html`, `style.css` e `script.js` para a raiz do repositório.
3. Vá em **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`.
6. Salve e aguarde o GitHub gerar o endereço do site.

## Onde está a API?
No arquivo `script.js`, procure por:

```js
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?...';
```

A função `loadWeather()` usa `fetch()` para buscar os dados, converte a resposta com `.json()` e altera o conteúdo da página.

## Observação
A confirmação de presença usa `localStorage`, portanto não cria uma lista central de convidados. Para isso seria necessário um backend ou serviço de banco de dados.
