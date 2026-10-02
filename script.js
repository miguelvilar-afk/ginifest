const EVENT_DATE = new Date('2026-10-09T21:00:00-03:00');

// ---------- CONTAGEM REGRESSIVA ----------
function updateCountdown() {
  const now = new Date();
  let diff = EVENT_DATE - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div><b>COMEÇOU!</b><small>GINI FEST</small></div>';
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  diff %= 60000;
  const seconds = Math.floor(diff / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- VERIFICAÇÃO 18+ ----------
const ageGate = document.getElementById('ageGate');
const confirmAge = document.getElementById('confirmAge');
const denyAge = document.getElementById('denyAge');

document.body.classList.add('locked');

if (sessionStorage.getItem('giniFestAgeOk') === 'true') {
  ageGate.classList.add('hidden');
  document.body.classList.remove('locked');
}

confirmAge.addEventListener('click', () => {
  sessionStorage.setItem('giniFestAgeOk', 'true');
  ageGate.classList.add('hidden');
  document.body.classList.remove('locked');
});

denyAge.addEventListener('click', () => {
  ageGate.querySelector('.age-card').innerHTML = `
    <div class="mini-tag">ACESSO NEGADO</div>
    <h2>Evento 18+</h2>
    <p>O acesso a esta página do evento é destinado a maiores de idade.</p>
  `;
});

// ---------- API OPEN-METEO ----------
// API usada no trabalho: previsão diária de Brasília para 09/10/2026.
// A resposta chega em JSON e é usada para atualizar a interface.
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=-15.7939&longitude=-47.8828&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo&start_date=2026-10-09&end_date=2026-10-09';

const weatherCodes = {
  0: ['Céu limpo', '☀'],
  1: ['Predominantemente limpo', '🌤'],
  2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁'],
  45: ['Neblina', '🌫'],
  48: ['Neblina', '🌫'],
  51: ['Garoa leve', '🌦'],
  53: ['Garoa', '🌦'],
  55: ['Garoa forte', '🌧'],
  61: ['Chuva leve', '🌦'],
  63: ['Chuva', '🌧'],
  65: ['Chuva forte', '🌧'],
  80: ['Pancadas leves', '🌦'],
  81: ['Pancadas de chuva', '🌧'],
  82: ['Pancadas fortes', '⛈'],
  95: ['Trovoadas', '⛈'],
  96: ['Trovoadas com granizo', '⛈'],
  99: ['Trovoadas fortes', '⛈']
};

async function loadWeather() {
  const loading = document.getElementById('weatherLoading');
  const content = document.getElementById('weatherContent');
  const error = document.getElementById('weatherError');

  try {
    const response = await fetch(WEATHER_API);
    if (!response.ok) throw new Error('Erro HTTP: ' + response.status);

    const data = await response.json();
    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new Error('Resposta da API sem dados diários.');
    }

    const max = Math.round(data.daily.temperature_2m_max[0]);
    const min = Math.round(data.daily.temperature_2m_min[0]);
    const rain = data.daily.precipitation_probability_max?.[0] ?? 0;
    const code = data.daily.weather_code[0];
    const [description, icon] = weatherCodes[code] || ['Condição variável', '◌'];

    document.getElementById('weatherTemp').textContent = `${max}°`;
    document.getElementById('weatherMin').textContent = `${min}°C`;
    document.getElementById('weatherRain').textContent = `${rain}%`;
    document.getElementById('weatherDesc').textContent = description;
    document.getElementById('weatherIcon').textContent = icon;

    loading.classList.add('hidden');
    content.classList.remove('hidden');
  } catch (err) {
    console.error('Falha ao consultar Open-Meteo:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
  }
}
loadWeather();

// ---------- RSVP LOCAL ----------
const rsvpForm = document.getElementById('rsvpForm');
const rsvpMessage = document.getElementById('rsvpMessage');
const guestName = document.getElementById('guestName');

const savedGuest = localStorage.getItem('giniFestGuest');
if (savedGuest) {
  guestName.value = savedGuest;
  rsvpMessage.textContent = `✓ ${savedGuest}, sua presença já está salva neste navegador.`;
}

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = guestName.value.trim();
  const adult = document.getElementById('adultCheck').checked;

  if (!name || !adult) {
    rsvpMessage.textContent = 'Preencha seu nome e confirme que você tem 18+.';
    return;
  }

  localStorage.setItem('giniFestGuest', name);
  rsvpMessage.textContent = `✓ ${name}, presença confirmada!`;
  rsvpForm.reset();
  guestName.value = name;
});
