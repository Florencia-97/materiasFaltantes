
var materias = [];
var materiasDisponiblesCodigo = [];
var materiasRealizadasCodigo = [];
var materiasDisponibles = [];
var materiasRealizadas = [];

document.onload = start

function start(){
  const endpoint = 'https://gist.githubusercontent.com/Florencia-97/e5a7e230bfffb28bf73283d3e4338d25/raw/818f2da92f5dd0333436ccb3e7e2f670d06ae473/materias.json';

  fetch(endpoint)
    .then(blob => blob.json())
    .then(data => materias.push(...data));

    const searchInput = document.querySelector('.search')
    searchInput.addEventListener('keyup', mostrarOpciones);
}



function encontrarMateria (materiaBuscada, materias) {
  return materias.filter(asignatura => {
    const regex = new RegExp(materiaBuscada, 'gi');
    return asignaturaPosible(asignatura, regex);
  });
}

function asignaturaPosible(asignatura, regex){
  if(! materiasRealizadas.join().includes(asignatura.codigo)){
    return asignatura.materia.match(regex) || asignatura.departamento.match(regex);
  }
  return false;
}

//CARGA INICIAL DE INFO

function agregarMateriasIniciales(){

  //Esto dps lo cambio cuando agrego más materias
  document.getElementById('seleccionarCarrera').innerHTML = 'Ingeniería Informática'
  var sugerencias = document.querySelector('.sugerencias');
  sugerencias.innerHTML = "";
  var realizadas = document.querySelector('.realizadas');
  realizadas.innerHTML = "";

  const sinCorrelativas =  materias.filter(materia => {
    return noPoseeCorrelativa(materia)
  });
  const html = sinCorrelativas.map(sinCorrelativa => {
    materiasDisponibles.push(sinCorrelativa);
    return `
      <div class="materia ${sinCorrelativa.departamento}" id="${sinCorrelativa.materia}" onclick="agregarMateriaRealizada(this)">
        ${sinCorrelativa.materia}
      </div>
    `;
  }).join('');
  var disponibles = document.querySelector('.disponibles');
  disponibles.innerHTML = html;
}

function noPoseeCorrelativa(materia){
  return materia.correlativas == ""
}

function mostrarOpciones(){
    const searchInput = document.querySelector('.search').value;
    const matchMaterias = encontrarMateria(searchInput, materias);
    const html = matchMaterias.map(posibleMateria => {
    return `
      <li class="elegirMateria">
        <span class="elegir" id="${posibleMateria.materia}" onclick="agregarMateriaRealizada(this)" >${posibleMateria.materia}</span>
      </li>
    `;
  }).join('');
  var sugerencias = document.querySelector('.sugerencias');
  sugerencias.innerHTML = html;
}

function agregarMateriaRealizada(element){
  var materia = materias.filter(asignatura => {
  const regex = new RegExp(element.id, 'gi');
      return asignatura.materia.match(regex) || asignatura.departamento.match(regex)
  });
  if( !materiaYaAgregada(materia[0].codigo)){
    materiasRealizadasCodigo.push(materia[0].codigo);
    materiasRealizadas.push(materia[0]);
    actualizarMateriasDisponibles();
    displayMateriasRealizadas();
    displayMateriasDisponibles();
    var sugerencias = document.querySelector('.sugerencias');
    sugerencias.innerHTML = "";
  }
}

function displayMateriasRealizadas(){
  const html = materiasRealizadas.map(materia => {
    return `
      <div class="materia ${materia.departamento}" id="${materia.materia}" onclick="removerMateriaRealizada(this)">
        ${materia.materia}
      </div>
    `;
  }).join('');
  var realizadas = document.querySelector('.realizadas');
  realizadas.innerHTML = html;
}

function displayMateriasDisponibles(){
  const html = materiasDisponibles.map(materia => {
    return `
      <div class="materia ${materia.departamento}" id="${materia.materia}" onclick="agregarMateriaRealizada(this)">
        ${materia.materia}
      </div>
    `;
  }).join('');
  var disponibles = document.querySelector('.disponibles');
  disponibles.innerHTML = html;
}

function actualizarMateriasDisponibles(){
  var materiasNuevas = materias.filter(asignatura => {
    return tieneMateriasNecesarias(asignatura);
  });
  materiasDisponibles = materiasNuevas;
  }

function removerMateriaRealizada(elem){
  var nomMateria = elem.id;
  materiasRealizadas = materiasRealizadas.filter(materia => {
    return materia.materia != nomMateria;
  });
  var codigo = "";
  for(var i = 0 ; i < materias.length ; i++){
    if (materias[i].materia == nomMateria){
      codigo = materias[i].codigo;
    }
  }
  materiasRealizadasCodigo = materiasRealizadasCodigo.filter(materiaCod =>{
    return materiaCod != codigo;
  });
  actualizarMateriasDisponibles()
  displayMateriasDisponibles()
  displayMateriasRealizadas()
}


function tieneMateriasNecesarias(asignatura){
  if(materiasRealizadasCodigo.join().includes(asignatura.codigo)){
    return false;
  }
  var materiasNecesarias = asignatura.correlativas.split(" ");
  for (var i = 0; i < materiasNecesarias.length; i++){
    if(!materiasRealizadasCodigo.join().includes(materiasNecesarias[i])){
      return false;
    }
  }
  return true;
}

function materiaYaAgregada(codigo){
  return materiasRealizadasCodigo.join().includes(codigo);
}
