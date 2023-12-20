// Tenta obter eventos do armazenamento local
const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

// Atualiza a lista de eventos ao carregar a página
atualizarListaEventos();

function criarEvento() {
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const emailInput = document.getElementById("e-mail");

  // Adicionado campo de e-mail
  let email = emailInput.value;

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!data || !hora || !titulo || !descricao || !email) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Limpa espaços em branco extras e divide os e-mails
  const emails = email.split(",").map(e => e.trim());

  // Cria um objeto evento
  const evento = { data, hora, titulo, descricao, email: emails.join(", ") }; // Incluído campo de e-mail

  // Adiciona o evento ao array
  eventos.push(evento);

  // Atualiza a lista de eventos
  atualizarListaEventos();

  // Salva os eventos no armazenamento local
  localStorage.setItem('eventos', JSON.stringify(eventos));

  // Envia um e-mail com as informações do evento para todos os e-mails informados no campo "E-mail"
  for (const email of emails) {
    enviarEmail(evento, email);
  }

  // Limpa os valores dos campos do formulário após a criação do evento
  document.getElementById("data").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  emailInput.value = "";
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
      <p>E-mail: ${evento.email}</p> <button onclick="excluirEvento(${index})">Excluir</button>
    `;

    // Adiciona o evento à lista
    listaEventos.appendChild(eventoElemento);
  });
}

function enviarEmail(evento, email) {
  // Crie um objeto de parâmetros para o modelo de e-mail no EmailJS
  const templateParams = {
    titulo: evento.titulo,
    data: evento.data,
    hora: evento.hora,
    descricao: evento.descricao,
    email: email,
  };

  // Use o método 'send' do EmailJS para enviar o e-mail
  emailjs.send("service_f638rr3", "template_x2kqx7s", templateParams)
    .then(function(response) {
      console.log("E-mail enviado com sucesso para:", email);
    }, function(error) {
      console.log("Erro ao enviar o e-mail para:", email, "Erro:", error);
    });
}
