const audio = document.getElementById('audio'); 
const playBtn = document.getElementById('play');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const favoriteBtn = document.getElementById('favorite');
const songTitleEl = document.getElementById('song-title');
const artistNameEl = document.getElementById('artist-name');
const albumArtImg = document.querySelector('.album-art img');
const spotifyCodeImg = document.querySelector('.spotify-code img');
const spotifyCodeDiv = document.querySelector('.spotify-code');
const footerDots = document.querySelector('.footer-dots');

let isShuffle = false;
let isRepeat = false;
let isPlaying = false;
let isFavorite = false;
let musicaAtual = 0;

const musicas = [
  {
    titulo: 'Quando Bate Aquela Saudade',
    artista: 'Rubel',
    arquivo: 'Rubel - Quando Bate Aquela Saudade.mp3',
    imagem: 'casal.png',
    spotifyCode: 'code1.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/6hFKP7kl22184msxWDhXLL?si=aca0b055a253470f'
  },
  {
    titulo: 'Farol das Estrelas',
    artista: 'Soweto',
    arquivo: 'Soweto - Farol das Estrelas.mp3',
    imagem: 'primeira.jpg',
    spotifyCode: 'code2.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/4aWvRjHweMAoB1RzUcXUUu?si=2497670cbd174bc9'
  },
  {
    titulo: 'Meu Abrigo',
    artista: 'Melim',
    arquivo: 'Melim - Meu Abrigo.mp3',
    imagem: 'quinta.jpg',
    spotifyCode: 'code3.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/5U28PY9MekLyCBYtLHGQpe?si=94945f196cb34de4'
  },
  {
    titulo: 'Mais Ninguém',
    artista: 'Banda do Mar',
    arquivo: 'Banda do Mar - Mais Ninguém.mp3',
    imagem: 'quarta.jpg',
    spotifyCode: 'code4.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/6uFwhB7gVs7ExCAfJD5BWg?si=9e558b8c08d74a8d'
  },
  {
    titulo: 'Paixão Verdadeira',
    artista: 'Turma no Quintal',
    arquivo: 'Paixão Verdadeira - Nem Pensar - Será que é Amor - Turma no Quintal.mp3',
    imagem: 'terceira.jpg',
    spotifyCode: 'code5.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/3l88IX36yYjFTtE9X45N6N?si=c7a9f9ebf3964726'
  },
  {
    titulo: 'Saturno',
    artista: 'BIN',
    arquivo: 'BIN - Saturno (prod. Ajaxx).mp3',
    imagem: 'segunda.jpg',
    spotifyCode: 'code6.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/68cPbG7hJnwDW9nPX1uQcX?si=b3f4a4459d904c43'
  },
  {
    titulo: 'Sunshine (Nonsense . Vol 1)',
    artista: 'Delacruz',
    arquivo: 'Delacruz - Sunshine (Nonsense . Vol 1).mp3',
    imagem: 'sexta.jpg',
    spotifyCode: 'code7.svg',
    spotifyUrl: 'https://open.spotify.com/intl-pt/track/1UVquahdeg6mRYDTHFKRx0?si=3adf51d819b847a3'
  },
];

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

function animarElemento(el, classe = 'animate') {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

function salvarFavorita(index, status) {
  localStorage.setItem(`favorita_${index}`, status ? '1' : '0');
}

function carregarFavorita(index) {
  return localStorage.getItem(`favorita_${index}`) === '1';
}

function carregarMusica(index) {
  const musica = musicas[index];
  audio.src = `./assets/${musica.arquivo}`;
  songTitleEl.textContent = musica.titulo;
  artistNameEl.textContent = musica.artista;
  albumArtImg.src = `./assets/${musica.imagem}`;
  spotifyCodeImg.src = `./assets/${musica.spotifyCode}`;
  audio.load();

  animarElemento(albumArtImg);
  animarElemento(spotifyCodeDiv);
  animarElemento(songTitleEl);
  animarElemento(artistNameEl);

  isFavorite = carregarFavorita(index);
  favoriteBtn.classList.toggle('active', isFavorite);
}

function tocarMusica() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '&#10073;&#10073;';
}

function pausarMusica() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '&#9654;';
}

playBtn.addEventListener('click', () => isPlaying ? pausarMusica() : tocarMusica());

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatarTempo(audio.currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatarTempo(audio.duration);
});

progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

favoriteBtn.addEventListener('click', () => {
  isFavorite = !isFavorite;
  favoriteBtn.classList.toggle('active', isFavorite);
  salvarFavorita(musicaAtual, isFavorite);
});

document.getElementById('next').addEventListener('click', proximaMusica);
document.getElementById('prev').addEventListener('click', musicaAnterior);

document.getElementById('shuffle').addEventListener('click', (e) => {
  isShuffle = !isShuffle;
  e.currentTarget.classList.toggle('active', isShuffle);
});

document.getElementById('repeat').addEventListener('click', (e) => {
  isRepeat = !isRepeat;
  e.currentTarget.classList.toggle('active', isRepeat);
});

audio.addEventListener('ended', () => {
  isRepeat ? tocarMusica() : proximaMusica();
});

footerDots.addEventListener('click', () => {
  const musica = musicas[musicaAtual];
  if (musica?.spotifyUrl) {
    window.open(musica.spotifyUrl, '_blank');
  } else {
    alert('Link do Spotify não disponível para esta música.');
  }
});

function proximaMusica() {
  if (isShuffle) {
    let nova;
    do {
      nova = Math.floor(Math.random() * musicas.length);
    } while (nova === musicaAtual && musicas.length > 1);
    musicaAtual = nova;
  } else {
    musicaAtual = (musicaAtual + 1) % musicas.length;
  }
  carregarMusica(musicaAtual);
  tocarMusica();
}

function musicaAnterior() {
  musicaAtual = (musicaAtual - 1 + musicas.length) % musicas.length;
  carregarMusica(musicaAtual);
  tocarMusica();
}

function atualizarRelogioAmor() {
  const inicio = new Date('2022-09-06T00:00:00');
  const agora = new Date();
  let diff = Math.floor((agora - inicio) / 1000);

  const anos = Math.floor(diff / (365.25 * 24 * 60 * 60));
  diff %= Math.floor(365.25 * 24 * 60 * 60);
  const meses = Math.floor(diff / (30.44 * 24 * 60 * 60));
  diff %= Math.floor(30.44 * 24 * 60 * 60);
  const dias = Math.floor(diff / (24 * 60 * 60));
  diff %= 24 * 60 * 60;
  const horas = Math.floor(diff / 3600);
  diff %= 3600;
  const minutos = Math.floor(diff / 60);
  const segundos = diff % 60;

  document.getElementById('timeTogether').textContent =
    `${anos} ano${anos !== 1 ? 's' : ''}, ` +
    `${meses} mês${meses !== 1 ? 'es' : ''}, ` +
    `${dias} dia${dias !== 1 ? 's' : ''}, ` +
    `${horas}h ${minutos}min ${segundos}s`;
}

carregarMusica(musicaAtual);
setInterval(atualizarRelogioAmor, 1000);
atualizarRelogioAmor();
