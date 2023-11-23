// Tenta obter eventos do armazenamento local
const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

// Atualiza a lista de eventos ao carregar a página
atualizarListaEventos();

function criarEvento() {
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  // Cria um objeto evento
  const evento = { data, hora, titulo, descricao };

  // Adiciona o evento ao array
  eventos.push(evento);

  // Atualiza a lista de eventos
  atualizarListaEventos();

  // Salva os eventos no armazenamento local
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

function excluirEvento(index) {
  // Remove o evento do array pelo índice
  eventos.splice(index, 1);

  // Atualiza a lista de eventos
  atualizarListaEventos();

  // Salva os eventos no armazenamento local
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

function atualizarListaEventos() {
  const listaEventos = document.getElementById("lista-eventos");
  listaEventos.innerHTML = "";

  // Itera sobre o array de eventos
  eventos.forEach((evento, index) => {
    const eventoElemento = document.createElement("div");
    eventoElemento.classList.add("evento");

    eventoElemento.innerHTML = `
      <h2>${evento.titulo}</h2>
      <p>Data: ${evento.data}</p>
      <p>Hora: ${evento.hora}</p>
      <p>Descrição: ${evento.descricao}</p>
      <button onclick="excluirEvento(${index})">Excluir</button>
    `;

    // Adiciona o evento à lista
    listaEventos.appendChild(eventoElemento);
  });
}
