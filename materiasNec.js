
var materias = [];

function start(){

    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('change', busqueda);
    searchInput.addEventListener('keyup', busqueda);
    const endpoint = 'materiasInformatica.json';
    fetch(endpoint)
      .then(blob => blob.json())
      .then(data => materias.push(...data));
  
    document.getElementById('seleccionarCarrera').innerHTML = 'Ingeniería Informática'

}

function encontrarMateria(materiaBuscada, materias) {
  if (materiaBuscada.length < 3){
    return [];
  }
  materiaBuscada = cadenaLimpiar(materiaBuscada)
  const regex = new RegExp(materiaBuscada, 'gi');
    return materias.filter(materia => {
      materia_limpia = cadenaLimpiar(materia.materia);
      return materia_limpia.match(regex);
    });
}

function cadenaLimpiar(cadena){
  cadena = cadena.toLowerCase();
  cadena = cadena.replace(/á/gi,"a");
  cadena = cadena.replace(/é/gi,"e");
  cadena = cadena.replace(/í/gi,"i");
  cadena = cadena.replace(/ó/gi,"o");
  cadena = cadena.replace(/ú/gi,"u");
  cadena = cadena.replace(/ñ/gi,"n");
  return cadena;
}

function busqueda(){
    const correlativas = encontrarMateria(this.value, materias);
    const html = correlativas.map(correlativa => {
      return `
        <div class="materia ${correlativa.departamento}" id="${correlativa.materia}" onclick="mostrarInformacion(this)">
          ${correlativa.materia}
        </div>
      `;
    }).join('');
    var sugerencias = document.querySelector('.sugerencias');
    sugerencias.innerHTML = html;
}  

function devolverMateria(materiaNombre){
    for (var i = 0; i < materias.length; i++){
        if(materias[i].materia == materiaNombre){
          return materias[i];
        }
    }
}

function encontrarCorrelativas(materia){
    var materiasNecesarias = materia.correlativas
    var correlativas = [];
    for (var i = 0; i < materias.length; i++){
        if(materiasNecesarias.includes(materias[i].codigo)){
          correlativas.push(materias[i]);
        }
    }
    return correlativas;
}

function encontrarRequeridas(materia){
  var codigo = materia.codigo
  var requeridas = [];
  for (var i = 0; i < materias.length; i++){
      if((materias[i].correlativas).includes(codigo)){
        requeridas.push(materias[i]);
      }
  }
  return requeridas;
}

function mostrarCorrelativas(correlativas){
    const html = correlativas.map(materia => {
      return `
        <div class="materia ${materia.departamento}" id="${materia.materia}" onclick="mostrarInformacion(this)">
          ${materia.materia}
        </div>
      `;
    }).join('');
    var necesarias = document.querySelector('.necesarias');
    necesarias.innerHTML = html;
}

function mostrarRequeridas(correlativas){
  const html = correlativas.map(materia => {
    return `
      <div class="materia ${materia.departamento}" id="${materia.materia}" onclick="mostrarInformacion(this)">
        ${materia.materia}
      </div>
    `;
  }).join('');
  var necesarias = document.querySelector('.requeridas');
  necesarias.innerHTML = html;
}

function mostrarInformacion(materia){
  var materiaBuscada = devolverMateria(materia.id);
  mostrarCorrelativas(encontrarCorrelativas(materiaBuscada));
  mostrarRequeridas(encontrarRequeridas(materiaBuscada));
  document.getElementById('eleccion').innerHTML = materia.id;
  document.getElementById('creditos').innerHTML = "Creditos: " + (materiaBuscada.creditos).toString();
  var sugerencias = document.querySelector('.sugerencias');
  sugerencias.innerHTML = '';
}
