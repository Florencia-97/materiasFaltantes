var materias = [];

document.onload = start

function start(){

    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('change', busqueda);
    const endpoint = 'materiasInformatica.json';
    fetch(endpoint)
      .then(blob => blob.json())
      .then(data => materias.push(...data));
  
}

function encontrarMateria(materiaBuscada, materias) {
    return materias.filter(materia => {
      const regex = new RegExp(materiaBuscada, 'gi');
      return materia.materia.match(regex)
    });
}

function busqueda(){
    const correlativas = encontrarMateria(this.value, materias);
    const html = correlativas.map(correlativa => {
    return `
      <li class="elegirMateria">
        <span class="elegir" id="${correlativa.materia}" onclick="mostrarCorrelativas(this)" >${correlativa.materia}</span>
      </li>
    `;
    }).join('');
    var sugerencias = document.querySelector('.sugerencias');
    sugerencias.innerHTML = html;
}

function devolverMateria(materiaNombre){
    for (var i = 0; i < materias.length; i++){
        if(materias[i].materia == materiaNombre){
          return materias[i].correlativas;
        }
    }
}

function encontrarCorrelativas(nombre){
    var materiasNecesarias = devolverMateria(nombre)
    var correlativas = [];
    for (var i = 0; i < materias.length; i++){
        if(materiasNecesarias.includes(materias[i].codigo)){
          correlativas.push(materias[i]);
        }
    }
    return correlativas;
}


function mostrarCorrelativas(materia){
    const correlativas = encontrarCorrelativas(materia.id);
    const html = correlativas.map(materia => {
      return `
        <div class="materia ${materia.departamento}" id="${materia.materia}">
          ${materia.materia}
        </div>
      `;
    }).join('');
    var necesarias = document.querySelector('.materiasNecesarias');
    necesarias.innerHTML = html;
  }
