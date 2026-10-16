(() => {
  'use strict';
  if (document.getElementById('marito-widget')) return;
  const asset = new URL('marito-v1.png', document.currentScript.src).href;
  const booking = 'https://wa.me/5493884844813?text=' + encodeURIComponent('¡Hola! Quiero reservar una mesa en La Peña de Marito.');
  const instagram = 'https://www.instagram.com/restomarito.purma/';
  const answers = {
    vegetarian: {title: 'Opciones vegetarianas', text: 'Tenemos estas opciones vegetarianas:\n• Milanesa de quesillo.\n• Medallón de quinoa.\n• Humitas.\n• Empanadas de queso o de queso de cabra.\n• Papines con queso de cabra.\n\nConsultá al mozo para más información.'},
    gluten: {title: 'Opciones sin gluten', text: 'Estas son las opciones sin gluten informadas por la Peña:\n• Cazuela de llama.\n• Cazuela de cordero.\n• Cazuela de cabrito.\n• Lomo de ternera con papines.\n• Pechuga de pollo grillada.\n\nConsultá al mozo para más información. Si sos celíaco/a, avisale para confirmar los cuidados durante la preparación.'},
    vegan: {title: 'Comida vegana', text: 'La lista confirmada es de opciones vegetarianas. Algunas llevan queso o huevo, por eso no puedo presentarlas como veganas. Consultá al mozo para más información.'},
    hours: {title: 'Horarios', text: 'La cocina abre de martes a domingo de 11:00 a 23:30, de corrido.\nLos lunes abre de 19:00 a 23:30; al mediodía está cerrada.\n\nEl menú del día se sirve de martes a domingo, de 11:00 a 16:00.'},
    music: {title: 'Música en vivo', text: '¡Hay folklore todas las noches! De lunes a domingo, desde las 20:00, sin derecho de espectáculo.\n\nPara conocer el grupo de esa noche o si hay música al mediodía, consultá al mozo.'},
    location: {title: 'Dónde estamos', text: 'Estamos en Rivadavia Centro, Purmamarca, Jujuy, Argentina.'},
    payment: {title: 'Medios de pago', text: 'Aceptamos efectivo, transferencia y tarjetas de crédito y débito.'},
    deposit: {title: 'Seña de la reserva', text: 'La seña es de $10.000 por reserva y se descuenta del total de la cuenta. Al pagar, recordá el descuento y presentá el comprobante. Si cancelás o no asistís, la seña no se devuelve.'},
    reserve: {title: 'Reservar', text: 'Podés solicitar tu mesa por WhatsApp con el botón Reservar. El equipo de la Peña confirma la disponibilidad y tu reserva.', link: booking, label: 'Reservar por WhatsApp'},
    instagram: {title: 'Ver la Peña', text: 'Conocé el ambiente y las novedades de la Peña en nuestro Instagram.', link: instagram, label: 'Ver la Peña en Instagram'},
    menu: {title: 'La carta', text: 'La carta está en esta misma página. Cerrá el chat y bajá para ver los platos y sus precios.'},
    greeting: {title: '¡Hola!', text: '¡Hola! Soy Marito. ¿En qué te puedo ayudar? Elegí una consulta o escribime tu pregunta.'},
    thanks: {title: '¡Gracias!', text: '¡De nada! Te esperamos en La Peña de Marito.'},
    unknown: {title: 'Consultas', text: 'Todavía no tengo una respuesta para esa consulta. Puedo ayudarte con opciones vegetarianas o sin gluten, horarios, música, ubicación, medios de pago y reservas. Elegí una opción o probá con otra pregunta.'}
  };
  function classify(value) {
    const q = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    // Dietary safety takes precedence over generic food or booking keywords.
    if (/celiac|gluten|sin\s+tacc/.test(q)) return 'gluten';
    if (/vegan/.test(q)) return 'vegan';
    if (/vegetarian|sin carne|quesillo|quinoa|humita|queso|papines/.test(q)) return 'vegetarian';
    if (/sena|anticipo|cancel|devol|reembols|comprobante/.test(q)) return 'deposit';
    if (/reserv|mesa|whatsapp|watsap/.test(q)) return 'reserve';
    if (/instagram|redes|ver la pena|ambiente|foto/.test(q)) return 'instagram';
    if (/musica|folkl|folcl|show|espectaculo|grupo|cant|tocan/.test(q)) return 'music';
    if (/horario|hora|abren|abre|cierr|lunes|martes|miercoles|jueves|viernes|sabado|domingo|mediodia/.test(q)) return 'hours';
    if (/ubicacion|direccion|donde|llegar/.test(q)) return 'location';
    if (/pago|pagar|tarjeta|efectivo|transferencia|debito|credito/.test(q)) return 'payment';
    if (/menu|carta|precio|comida|plato/.test(q)) return 'menu';
    if (/gracias|gracia|chau|adios/.test(q)) return 'thanks';
    if (/\b(hola|buenas|buenos|marito)\b/.test(q)) return 'greeting';
    return 'unknown';
  }
  const root = document.createElement('div');
  root.id = 'marito-widget';
  root.lang = 'es';
  root.innerHTML = `
    <button class="marito-launch" type="button" aria-expanded="false" aria-controls="marito-panel">
      <span class="marito-invite"><strong>¡Hola! Soy Marito.</strong><span>¿En qué te puedo ayudar?</span></span>
      <img src="${asset}" alt="Marito, una llamita con poncho" width="76" height="114">
    </button>
    <section id="marito-panel" hidden role="dialog" aria-label="Consultas a Marito">
      <header class="marito-header"><img src="${asset}" alt="" width="40" height="60"><div><h2>Marito</h2><p>Tu guía en la Peña</p></div><button class="marito-close" type="button" aria-label="Cerrar chat">×</button></header>
      <div class="marito-messages" role="log" aria-label="Conversación" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <div class="marito-options" aria-label="Consultas frecuentes"></div>
      <nav class="marito-links" aria-label="Reservas y redes"><a href="${booking}" target="_blank" rel="noopener noreferrer">Reservar ↗</a><a href="${instagram}" target="_blank" rel="noopener noreferrer">Ver la Peña ↗</a></nav>
      <form class="marito-form"><label class="marito-sr" for="marito-question">Escribí tu consulta</label><input id="marito-question" maxlength="300" placeholder="Escribí tu consulta…" autocomplete="off"><button type="submit" aria-label="Enviar consulta">↑</button></form>
    </section>`;
  document.body.append(root);
  const panel = root.querySelector('#marito-panel'), launch = root.querySelector('.marito-launch');
  const input = root.querySelector('input'), log = root.querySelector('.marito-messages');
  function message(text, user = false, answer = null) {
    const bubble = document.createElement('div');
    bubble.className = 'marito-message' + (user ? ' marito-user' : '');
    const label = document.createElement('span');
    label.className = 'marito-sr'; label.textContent = user ? 'Vos: ' : 'Marito: ';
    bubble.append(label, document.createTextNode(text));
    if (answer?.link) {
      const link = document.createElement('a'); link.href = answer.link; link.textContent = answer.label;
      link.target = '_blank'; link.rel = 'noopener noreferrer'; bubble.append(link);
    }
    log.append(bubble);
    while (log.children.length > 40) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function respond(question, key) {
    message(question, true);
    const answer = answers[key || classify(question)]; message(answer.text, false, answer);
  }
  ['vegetarian', 'gluten', 'hours', 'music', 'location', 'payment'].forEach(key => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = answers[key].title;
    button.addEventListener('click', () => respond(answers[key].title, key)); root.querySelector('.marito-options').append(button);
  });
  function toggle(open) {
    panel.hidden = !open; launch.setAttribute('aria-expanded', String(open)); root.classList.toggle('marito-open', open);
    if (open) { root.querySelector('.marito-close').focus(); log.scrollTop = log.scrollHeight; }
    else launch.focus();
  }
  launch.addEventListener('click', () => toggle(panel.hidden));
  root.querySelector('.marito-close').addEventListener('click', () => toggle(false));
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { event.stopPropagation(); toggle(false); } });
  root.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); const question = input.value.trim(); if (!question) return;
    input.value = ''; respond(question); input.focus();
  });
  message(answers.greeting.text);
})();
