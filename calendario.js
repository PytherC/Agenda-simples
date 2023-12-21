// Tenta obter eventos do armazenamento local
const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

// Índice do evento em edição (inicializado como undefined para indicar que não está em edição)
let indiceEdicao = undefined;

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

  // Se há um índice de edição, substitua o evento existente
  if (indiceEdicao !== undefined) {
    eventos[indiceEdicao] = evento;
    // Redefina o índice de edição para indicar que não está mais em edição
    indiceEdicao = undefined;
  } else {
    // Adiciona o evento ao array
    eventos.push(evento);
  }

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

function editarEvento(index) {
  // Define o índice de edição e preenche o formulário com os detalhes do evento selecionado
  indiceEdicao = index;
  const eventoEditar = eventos[index];

  document.getElementById("data").value = eventoEditar.data;
  document.getElementById("hora").value = eventoEditar.hora;
  document.getElementById("titulo").value = eventoEditar.titulo;
  document.getElementById("descricao").value = eventoEditar.descricao;
  document.getElementById("e-mail").value = eventoEditar.email;
}

function salvarEdicao() {
  if (indiceEdicao !== undefined) {
    const eventoEditado = eventos[indiceEdicao];
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const emailInput = document.getElementById("e-mail");

    let email = emailInput.value;

    if (!data || !hora || !titulo || !descricao || !email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const emails = email.split(",").map(e => e.trim());

    // Atualiza os dados do evento editado
    eventoEditado.data = data;
    eventoEditado.hora = hora;
    eventoEditado.titulo = titulo;
    eventoEditado.descricao = descricao;
    eventoEditado.email = emails.join(", ");

    // Atualiza a lista e o armazenamento local
    atualizarListaEventos();
    localStorage.setItem('eventos', JSON.stringify(eventos));

    // Envia um novo e-mail com as informações editadas
    for (const email of emails) {
      enviarEmail(eventoEditado, email);
    }

    // Limpa os campos do formulário
    document.getElementById("data").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    emailInput.value = "";

    // Redefine o índice de edição para indicar que não está mais em edição
    indiceEdicao = undefined;
  }
}

function excluirEvento(index) {
  // Obtém o evento que será excluído
  const eventoExcluido = eventos[index];

  // Remove o evento do array pelo índice
  eventos.splice(index, 1);

  // Atualiza a lista de eventos
  atualizarListaEventos();

  // Salva os eventos no armazenamento local
  localStorage.setItem('eventos', JSON.stringify(eventos));

  // Envia um e-mail de evento cancelado para todos os e-mails associados ao evento excluído
  for (const email of eventoExcluido.email.split(",")) {
    enviarEmailEventoCancelado(eventoExcluido, email);
  }
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
      <br>
      <p>Data: ${evento.data}</p>
      <br>
      <p>Hora: ${evento.hora}</p>
      <br>
      <p>Descrição: ${evento.descricao}</p>
      <br>
      <p>E-mail: ${evento.email}</p>
      <button onclick="excluirEvento(${index})">Excluir</button>
      <button onclick="editarEvento(${index})">Editar</button>
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

function enviarEmailEventoCancelado(evento, email) {
  // Crie um objeto de parâmetros para o modelo de e-mail no EmailJS
  const templateParams = {
    titulo: `Evento Cancelado: ${evento.titulo}`,
    data: evento.data,
    hora: evento.hora,
    descricao: evento.descricao,
    email: email,
  };

  // Use o método 'send' do EmailJS para enviar o e-mail
  emailjs.send("service_f638rr3", "template_rs2gnlr", templateParams)
    .then(function(response) {
      console.log("E-mail de evento cancelado enviado com sucesso para:", email);
    }, function(error) {
      console.log("Erro ao enviar e-mail de evento cancelado para:", email, "Erro:", error);
    });
}
