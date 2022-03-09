document.addEventListener('DOMContentLoaded', () => {
    
    // Genera funcionalidad de botones para cambio de menu
    // Selecciona todos los botones para agregar funcionalidad
    // al hacer click y activa la función para cargar pagina
    // con un determinado id 
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id != 'myForm' && button.id != 'submit_form'){
            button.addEventListener('click', () => {
                load_page(button.id)
            })
        }
        // Por defecto se carga meno principal "CaliRoad"
        
    })
    

})
//Arrays de datos:
var meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var lasemana=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var diassemana=["lun","mar","mié","jue","vie","sáb","dom"];

// funcion para cargar pagina
function load_page(event){

    // Cambia el estado de display de los divs que contienen las paginas según corresponda
    let page = event;
    divs = document.querySelectorAll('div.page');
    divs.forEach(div => {
        if (div.id.includes(page)){
            document.querySelector(`#${div.id}`).style.display = 'block';
        } else {
            document.querySelector(`#${div.id}`).style.display = 'none';
        }
    })

    // Construye el material correspondiente a cada pagina
    switch (page){
        case 'exercise':
            // Se renderiza el acordion con todos los ejercicios recuperados con la API mediante el fetch
            const div_exercise = document.querySelector('#div_exercise');
            div_exercise.innerHTML = '<h2>Listado de ejercicios</h2>';
            fetch('/exercises')
            .then(response => response.json())
            .then(menu => {
                // console.log(menu);
                const div_accordion = document.createElement('div');
                div_accordion.id = 'accordionexercises';
                div_accordion.className = 'accordion';
                menu.forEach(exercise => {
                    // console.log(exercise.imagen);
                    const div = document.createElement('div');
                    div.className = 'accordion-item';
                    div.innerHTML = `
                        <h2 class="accordion-header" id="heading${exercise.id}">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${exercise.id}" aria-expanded="true" aria-controls="collapse${exercise.id}">
                            ${exercise.name}
                        </button>
                        </h2>
                        <div id="collapse${exercise.id}" class="accordion-collapse collapse" aria-labelledby="heading${exercise.id}" data-bs-parent="#accordionexercises">
                            <div class="accordion-body">
                                <p><strong>Primary Muscles:</strong> ${exercise.primary_muscles}</p>
                                <p><strong>Secondary Muscles:</strong> ${exercise.secondary_muscles}</p>
                                <p><strong>Description:</strong> ${exercise.description}</p>
                                <div class="row">
                                    <div class="col-sm-6 text-center">
                                        <img src="${exercise.imagen}" class="img-fluid img-thumbnail" alt="Foto">
                                    </div>
                                    <div class="col-sm-6 text-center embed-responsive embed-responsive-1by1">
                                        <video class="embed-responsive-item rounded" controls="controls" >
                                            <source src="${exercise.video}" type="video/mp4" />
                                        </video>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-primary mt-2" onclick="menu_to_add(${exercise.id})">Add to Routine</button>
                                </div>
                            </div>
                        </div>
                    `;
                    div_accordion.appendChild(div);
                })
            div_exercise.appendChild(div_accordion);
            })
            break;
        // Genera pagina de planificación
        case 'my_routine':
            // Se despliega instrucciones y dos botones según planificacion deseada
            // Actualmente solo funciona planificacion semanal
            document.querySelector('#div_my_routine').innerHTML = `
            <h2 class="text-center">Planificación de Rutina</h2>
            <h4 class="text-center">Arma tu rutina ! </h4>
            <p>Selecciona planificación semanal o mensual. Puedes registrar ambas, te ayudarán a tener mejor control sobre tus entrenamientos. A continuación se presenta el modo de uso: </p>
            <ol>
                <li>Selecciona el tipo de planificación (semanal o mensual) para poder editar</li>
                <li>Escoge el día que quieras entrenar</li>
                <li>Elige la categoría de musculos a trabajar</li>
                <li>Selecciona el ejercicio, numero de series y repeticiones</li>
                <li>Cuando termines de agregar todos los ejercicios dale al boton guardar</li>
            </ol>
            <p><strong>Hay un bug que se esta resolviendo que impide la carga completa del calendario. Selecciona el mes que deseas planificar y pincha el boton buscar para que cargue correctamente</strong></p>
            <div class="row justify-content-center"">
                <div class="col-auto">
                    <button id="week" onclick="load_plan('week')">Semanal</button>
                </div>
                <div class="col-auto">
                    <button id="month" onclick="load_plan('month')">Mensual</button>
                </div>
            </div>
            <div id="calendario" class="m-2">
            </div>
            `
            break;
        case 'results':
            // Carga pagina de resultados
            // La idea es poder ver los ejercicios agregados, registrar el maximal por fecha
            document.querySelector('#div_results').innerHTML = `
            <h1> Pagina en construcción ! </h1>
            `;
            break;
            case 'others':
            document.querySelector('#div_others').innerHTML = `
            <h1> Pagina en construcción ! </h1>
            `;
    }
}

function load_plan(data) {

    div_calendario = document.querySelector('#calendario');
    // Carga calendario semanal o mensual segun corresponda
    
    switch (data){
        case 'week':
            div_calendario.innerHTML = `
            <table id="week_days" class="table table-bordered">
                <thead>
                    <tr class="table-success text-center">
                        <th scope="col">Lunes</th>
                        <th scope="col">Martes</th>
                        <th scope="col">Miercoles</th>
                        <th scope="col">Jueves</th>
                        <th scope="col">Viernes</th>
                        <th scope="col">Sabado</th>
                        <th scope="col">Domingo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="dias">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            `;
            window.onload = () => {
                cuerpo_semana();
            }
            break;
     
        case 'month':
             // Limpia el div calendario para que no se adjunte cada vez que dan click al boton
            // div_calendario.innerHTML = '';
            //fecha actual
            // cuerpo();
            // hoy=new Date(); //objeto fecha actual
            // diasemhoy=hoy.getDay(); //dia semana actual
            // diahoy=hoy.getDate(); //dia mes actual
            // meshoy=hoy.getMonth(); //mes actual
            // annohoy=hoy.getFullYear(); //año actual
            // // Elementos del DOM: en cabecera de calendario 
            // tit=document.getElementById("titulos"); //cabecera del calendario
            // ant=document.getElementById("anterior"); //mes anterior
            // pos=document.getElementById("posterior"); //mes posterior
            // // Elementos del DOM en primera fila
            // f0=document.getElementById("fila0");
            // //Pie de calendario
            // pie=document.getElementById("fechaactual");
            // pie.innerHTML+=lasemana[diasemhoy]+", "+diahoy+" de "+meses[meshoy]+" de "+annohoy;
            // //formulario: datos iniciales:
            // document.buscar.buscaanno.value=annohoy;
            // // Definir elementos iniciales:
            // mescal = meshoy; //mes principal
            // annocal = annohoy; //año principal
            // //iniciar calendario:
            // window.onload = () => {
            //     cabecera(); 
            //     primeralinea();
            //     escribirdias();
            // }
            div_calendario.innerHTML = '<h1>Esta sección esta en desarrollo!</h1>';
            break;
    }
}

function cuerpo_semana(){
    div_calendario = document.querySelector('#calendario');
    dias = document.querySelector('#dias');
    dias = dias.querySelectorAll('td');
    int = 0;
    dias.forEach(dia => {
        dia.innerHTML = `${diassemana[int]}`;
        int+=1;
    })
}

function menu_to_add(id){
    document.getElementById("myForm").style.display = "block";
}

function close_menu_to_add(){
    document.getElementById("myForm").style.display = "none";
}

function add_exercise(id){
    fetch('/exercises/'+id,{
        method: 'POST',
        body: JSON.stringify({
            recipients: document.querySelector('#compose-recipients').value,
            subject: document.querySelector('#compose-subject').value,
            body: document.querySelector('#compose-body').value
        })
    })
}


function load_routine(){
    // fetch
}

// ########################################################### //

//FUNCIONES de creación del calendario:
//cabecera del calendario
function cuerpo_mes() {
    const div_calendario = document.querySelector('#calendario');
    // Instrucciones para que el usuario pueda utilizar la app
    div_calendario.innerHTML = `
        <div id="anterior" onclick="mesantes()"></div>
        <div id="posterior" onclick="mesdespues()"></div>
        <h2 id="titulos"></h2>
        <table id="diasc">
            <tr id="fila0"><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
            <tr id="fila1"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            <tr id="fila2"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            <tr id="fila3"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            <tr id="fila4"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            <tr id="fila5"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            <tr id="fila6"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
        <div id="fechaactual"><i onclick="actualizar()">HOY: </i></div>
        <div id="buscafecha">
            <form action="#" name="buscar">
                <p>Buscar ... MES
                    <select name="buscames">
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                    </select>
                ... AÑO ...
                    <input type="text" name="buscaanno" maxlength="4" size="4" />
                ... 
                    <input type="button" value="BUSCAR" onclick="mifecha()" />
                </p>
            </form>
        </div>
        `;
}

function cabecera() {
    tit.innerHTML=meses[mescal]+" de "+annocal;
    mesant=mescal-1; //mes anterior
    mespos=mescal+1; //mes posterior
    if (mesant<0) {mesant=11;}
    if (mespos>11) {mespos=0;}
    ant.innerHTML=meses[mesant]
    pos.innerHTML=meses[mespos]
    } 
//primera línea de tabla: días de la semana.
function primeralinea() {
    for (i=0;i<7;i++) {
        celda0=f0.getElementsByTagName("th")[i];
        celda0.innerHTML=diassemana[i]
        }
    }
//rellenar celdas con los días
function escribirdias() {
    //Buscar dia de la semana del dia 1 del mes:
    primeromes=new Date(annocal,mescal,"1") //buscar primer día del mes
    prsem=primeromes.getDay() //buscar día de la semana del día 1
    prsem--; //adaptar al calendario español (empezar por lunes)
    if (prsem==-1) {prsem=6;}
    //buscar fecha para primera celda:
    diaprmes=primeromes.getDate() 
    prcelda=diaprmes-prsem; //restar días que sobran de la semana
    empezar=primeromes.setDate(prcelda) //empezar= tiempo UNIX 1ª celda
    diames=new Date() //convertir en fecha
    diames.setTime(empezar); //diames=fecha primera celda.
    //Recorrer las celdas para escribir el día:
    for (i=1;i<7;i++) { //localizar fila
        fila=document.getElementById("fila"+i);
        for (j=0;j<7;j++) {
            midia=diames.getDate() 
            mimes=diames.getMonth()
            mianno=diames.getFullYear()
            celda=fila.getElementsByTagName("td")[j];
            celda.innerHTML=midia;
            //Recuperar estado inicial al cambiar de mes:
            celda.style.backgroundColor="#9bf5ff";
            celda.style.color="#492736";
            //dias restantes del mes en gris
            if (mimes!=mescal) { 
               celda.style.color="#a0babc";
               }
            //destacar la fecha actual
            if (mimes==meshoy && midia==diahoy && mianno==annohoy ) { 
               celda.style.backgroundColor="#f0b19e";
               celda.innerHTML="<cite title='Fecha Actual'>"+midia+"</cite>";
               }
            // Se agrega función click para permitir añadir ejercicio
            celda.onclick = ()=> {
                
            }
            //pasar al siguiente día
            midia=midia+1;
            diames.setDate(midia);
            }
        }
    }


//Ver mes anterior
function mesantes() {
    nuevomes=new Date() //nuevo objeto de fecha
    primeromes--; //Restamos un día al 1 del mes visualizado
    nuevomes.setTime(primeromes) //cambiamos fecha al mes anterior 
    mescal=nuevomes.getMonth() //cambiamos las variables que usarán las funciones
    annocal=nuevomes.getFullYear()
    cabecera() //llamada a funcion de cambio de cabecera
    escribirdias() //llamada a funcion de cambio de tabla.
    }
//ver mes posterior
function mesdespues() {
    nuevomes=new Date() //nuevo obejto fecha
    tiempounix=primeromes.getTime() //tiempo de primero mes visible
    tiempounix=tiempounix+(45*24*60*60*1000) //le añadimos 45 días 
    nuevomes.setTime(tiempounix) //fecha con mes posterior.
    mescal=nuevomes.getMonth() //cambiamos variables 
    annocal=nuevomes.getFullYear()
    cabecera() //escribir la cabecera 
    escribirdias() //escribir la tabla
    }
//volver al mes actual
function actualizar() {
    mescal=hoy.getMonth(); //cambiar a mes actual
    annocal=hoy.getFullYear(); //cambiar a año actual 
    cabecera() //escribir la cabecera
    escribirdias() //escribir la tabla
    }
//ir al mes buscado
function mifecha() {
    //Recoger dato del año en el formulario
    mianno=document.buscar.buscaanno.value; 
    //recoger dato del mes en el formulario
    listameses=document.buscar.buscames;
    opciones=listameses.options;
    num=listameses.selectedIndex
    mimes=opciones[num].value;
    //Comprobar si el año está bien escrito
    if (isNaN(mianno) || mianno<1) { 
       //año mal escrito: mensaje de error
       alert("El año no es válido:\n debe ser un número mayor que 0")
       }
    else { //año bien escrito: ver mes en calendario:
         mife=new Date(); //nueva fecha
         mife.setMonth(mimes); //añadir mes y año a nueva fecha
         mife.setFullYear(mianno);
         mescal=mife.getMonth(); //cambiar a mes y año indicados
         annocal=mife.getFullYear();
         cabecera() //escribir cabecera
         escribirdias() //escribir tabla
         }
    }

// https://aprende-web.net/jspracticas/tiempo/cod5.html
// Se utiliza el codigo fuente de este repositorio para generar
// calendario de planificación. Desde la estructura hasta la funcionalidad
// estan implementadas en javascript ! Se modifican aspectos y 
// características que permitan al usuario manipular la planificación
// según lo estipulado en la descripción de la pagina.
