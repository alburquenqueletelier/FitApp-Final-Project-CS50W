document.addEventListener('DOMContentLoaded', () => {
    
    // Genera funcionalidad de botones para cambio de menu
    // Selecciona todos los botones para agregar funcionalidad
    // al hacer click y activa la función para cargar pagina
    // con un determinado id 
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id != 'close_form' && button.id != 'submit_form'){
            button.addEventListener('click', () => {
                if (document.querySelector('#myForm').style.display == 'block'){
                    close_menu_to_add();
                    load_page(button.id);
                } else {
                    load_page(button.id);
                }
            })
        } 
    })

})
//Arrays de datos:
var lasemana=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var diassemana=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

// funcion para cargar pagina
function load_page(event){

    let request_user = JSON.parse(document.getElementById('request_user').textContent);
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
                                    <button class="btn btn-primary mt-2" data-name="${exercise.name}" data-id="${exercise.id}" onclick="menu_to_add(${exercise.id})">Add to Routine</button>
                                </div>
                            </div>
                        </div>
                    `;
                    if (!request_user){
                        div.querySelector('button.btn-primary').style.display="none";
                    }
                    div_accordion.appendChild(div);
                })
                div_exercise.appendChild(div_accordion);
            })
            .catch(error => {
                console.log(error);
            })
            // Si ya esta agregado el ejercicio se cambia el button para que edite
            // y se agrega boton para remover ejercicio
            fetch('/plan', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                add_buttons = document.querySelectorAll('button.btn-primary');
                add_buttons.forEach(button => {
                    data.exercises.forEach(exercise => {
                        if(exercise.exercise.name == button.dataset.name){
                            button.removeAttribute("onclick");
                            button.innerText = 'Edit exercise';
                            button.className = 'btn btn-warning mt-2 me-2';
                            button.onclick = () => menu_to_add(button.dataset.id, 'PUT');
                            remove_button = document.createElement('button');
                            remove_button.id = `remove_button${exercise.exercise.id}`;
                            remove_button.className = 'btn btn-danger mt-2';
                            remove_button.innerText = 'Remove exercise';
                            remove_button.onclick = () => remove_exercise(button.dataset.id);
                            button.insertAdjacentElement("afterend", remove_button);
                        }
                    })
                });
            })
            .catch(error => {
                console.log(error);
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
            div_results = document.querySelector('#div_results');
            div_results.innerHTML = `<h2> Track Your Results ! </h2>`;
            fetch('/plan')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                div_tracker = document.createElement('div');
                div_tracker.className = 'table-responsive';
                div_tracker.innerHTML = `
                    <table id="table_tracker" class="table table-bordered">
                        <thead>
                            <tr class="table-success text-center">
                                <th>Exercise</th>
                                <th>Original Series</th>
                                <th>Original Reps</th>
                                <th>Last Series</th>
                                <th>Last Reps</th>
                                <th>Enter Series</th>
                                <th>Enter Reps</th>
                                <th>All register<th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                `;
                var tbody = div_tracker.querySelector('#table_tracker');
                tbody = tbody.querySelector('tbody');
                data.exercises.forEach(exercise => {
                    // console.log(data);
                    tr = tbody.insertRow();
                    for (i=0;i<8;i++){
                        td = tr.insertCell();
                        switch (i){
                            case 0:
                                td.appendChild(document.createTextNode(`${exercise.exercise.name}`));
                                break;
                            case 1:
                                td.appendChild(document.createTextNode(`${exercise.series}`));
                                break;
                            case 2:
                                td.appendChild(document.createTextNode(`${exercise.reps}`));
                                break;
                            case 3:
                                info_series = new Object();
                                data.tracker.forEach(track => {
                                    if(exercise.exercise.name == track.owner){
                                        info_series[`${exercise.exercise.name}`] = track.series;
                                    } 
                                })
                                if (Object.keys(info_series).length === 0){
                                    info_series[`${exercise.exercise.name}`] = '-';
                                }
                                td.appendChild(document.createTextNode(info_series[`${exercise.exercise.name}`]));
                                break;
                            case 4:
                                info_reps = new Object();
                                data.tracker.forEach(track => {
                                    if(exercise.exercise.name == track.owner){
                                        info_reps[`${exercise.exercise.name}`] = track.reps;
                                    } 
                                })
                                if (Object.keys(info_reps).length === 0){
                                    info_reps[`${exercise.exercise.name}`] = '-';
                                }
                                td.appendChild(document.createTextNode(info_reps[`${exercise.exercise.name}`]));
                                break;
                            case 5:
                                td.innerHTML = `
                                    <form class="form-inline series">
                                        <div class="form-group row">
                                            <div class="col">
                                                <input required class="form-control" type="number">
                                            </div>
                                            <div class="col">
                                                <input class="form-control" type="submit" value="Save">
                                            </div>
                                        </div>
                                        <input type="hidden" name="id_exercise" value="${exercise.exercise.id}">
                                    </form>
                                `;
                                break;
                            case 6:
                                td.innerHTML = `
                                <form class="form-inline reps">
                                    <div class="form-group row">
                                        <div class="col">
                                            <input required class="form-control" type="number">
                                        </div>
                                        <div class="col">
                                            <input class="form-control" type="submit" value="Save">
                                        </div>
                                    </div>
                                    <input type="hidden" name="id_exercise" value="${exercise.exercise.id}">
                                </form>
                                `;
                                break;
                            case 7:
                                all_regs = document.createElement('button');
                                all_regs.innerText = 'Click';
                                all_regs.addEventListener('click', () => {
                                    alert('Pagina en construcción !');
                                })
                                td.appendChild(all_regs);
                                break;
                                
                        }
                    }
                    tbody.appendChild(tr);
                })
                div_results.appendChild(div_tracker);
                all_forms = div_results.querySelectorAll('form');
                all_forms.forEach(form => {
                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                        if (form.querySelector('input').value <= 0 || form.querySelector('input').value <= 0){
                            alert('error: series and reps must be greater than 0');
                            return false;
                        }
                        if (form.querySelector('input').type != 'number' || form.querySelector('input').type != 'number'){
                            alert('error: series and reps must be numeric');
                            return false;
                        }
                        value_series = form.querySelector('input').value;
                        value_reps = form.querySelector('input').value;
                        id_exercise = form.querySelector('input[name="id_exercise"]').value;
                        upload_track(id_exercise, value_series, value_reps);
                        return false;
                    })
                })
            })
            .catch(error => console.log(error))
            break;
        case 'others':
            div_others = document.querySelector('#div_others');
            div_others.innerHTML = '<h1>View of other users tracker</h1>'
            fetch('/users')
            .then(response => response.json())
            .then(users => {
                ul = document.createElement('ul');
                users.forEach(user => {
                    console.log(user);
                    li = document.createElement('li');
                    li.innerHTML = `<a href="#">${user.name}</a>`;
                    ul.appendChild(li);
                })
                div_others.appendChild(ul);
            })
            .catch(error => console.log(error))
            break;
    }
}

// Carga calendario semanal o mensual segun corresponda
function load_plan(data) {

    div_calendario = document.querySelector('#calendario');
    switch (data){
        case 'week':
            div_calendario.innerHTML = `
            <div class="table-responsive">
                <table id="week_days" class="table table-bordered">
                    <thead>
                        <tr id="week_head" class="table-success text-center">
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
            </div>
            `;
            week_info();
            break;
     
        case 'month':
            div_calendario.innerHTML = '<h1>Esta sección esta en desarrollo!</h1>';
            break;
    }
}

function week_info(){
    fetch('/plan',{
        method: 'GET'
    })
    .then(response =>response.json())
    .then(data => {
        // console.log(data);
        tr = document.querySelector('#dias');
        dias_info = tr.querySelectorAll('td');
        let i = 0;
        dias_info.forEach(celda => {
            let lista = document.createElement('ol');
            data.exercises.forEach(exercise => {
                if (exercise.day.includes(diassemana[i])){
                    li = document.createElement('li');
                    li.id = `li${exercise.exercise.id}`;
                    li.className = 'list_exercises';
                    li.innerHTML = `
                    <p class='close'><strong>${exercise.exercise.name}</strong></p>
                    <p class='close'>Series: ${exercise.series}</p>
                    <p class='close'>Reps: ${exercise.reps}</p>
                    `;
                    li.onclick = () => {
                        menu_to_add(exercise.exercise.id, 'PUT');
                    }
                    celda.className = 'bg-info';
                    lista.appendChild(li);
                    celda.appendChild(lista);
                }
            })
            i+=1;
        })
    })
    .catch(error => {
        console.log(error);
    })
}

// Carga información del ejercicio si es que ya esta agregado a la rutina y así poder modificarlo
// function load_exercise(id){
//     fetch('/exercise/'+id)
//     .then(response => response.json())
//     .then(exercise => {

//     })
// }

// Genera el menu para añadir ejercicio, reps y series a los días seleccionados
// Recoge div contenedor desde HTML y crea los elementos del formulario para luego ser apendd.
function menu_to_add(id, action='POST'){
    // Crea div contenedor del form
    let div_form = document.querySelector("#myForm");
    // Boton submit que se añade al final
    let submit = div_form.querySelector('#submit_form');
    if (div_form.style.display == 'none'){
        if (document.querySelector(`#heading${id}`)){
            div_form.querySelector('h1').innerHTML = `Add <strong id="form-add-h1">${document.querySelector(`#heading${id}`).innerText}</strong>`;
        } else {
            div_form.querySelector('h1').innerHTML = `Add <strong id="form-add-h1">${document.querySelector(`#li${id}`).innerText}</strong>`;
        }
        // Input para numero de series
        series = document.createElement('input');
        series.type = 'number'
        series.className = 'form-control';
        series.id = 'series';
        series.required = true;
        label_series = document.createElement('label');
        label_series.htmlFor = 'series';
        label_series.innerText = 'N° Series';
        label_series.className = 'form-check-label';
        // Input para numero de repeticiones por serie
        reps = document.createElement('input');
        reps.type = 'number'
        reps.className = 'form-control';
        reps.id = 'reps';
        reps.required = true;
        label_reps = document.createElement('label');
        label_reps.innerText = 'N° Repeticiones';
        label_reps.htmlFor = 'reps';
        label_reps.className = 'form-check-label';
        // Se añade inputs y etiquetas a nuevo div que se integra al formulario
        div_inputs = document.createElement('div');
        div_inputs.id = 'div_inputs';
        div_inputs.appendChild(label_series);
        div_inputs.appendChild(series);
        div_inputs.appendChild(label_reps);
        div_inputs.appendChild(reps);
        div_form.querySelector('form').insertBefore(div_inputs, div_form.querySelector('div.row'));
        // Crea los checkbox para seleccionar dias
        diassemana.forEach(dia => {
            div_check = document.createElement('div');
            div_check.className = "form-check";
            checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = dia;
            checkbox.value = dia;
            checkbox.className = "form-check-input";
            label = document.createElement('label');
            label.htmlFor = dia;
            label.className = "form-check-label";
            label.appendChild(document.createTextNode(`${dia}`));
            div_check.appendChild(checkbox);
            div_check.appendChild(label);
            div_form.querySelector('form').insertBefore(div_check, div_form.querySelector('div.row'));
        })
    }
    // Carga la información del ejercicio en el formulario
    if (action=='PUT'){
        // Se añade botton para eliminar solo sí ya está agregado el ejercicio
        // remove_button = document.createElement('button');
        // remove_button.onclick = () => {remove_exercise(id)}
        // remove_button.className = 'btn cancel';
        // remove_button.innerText = 'Remove Exercise';
        // remove_button.style.width = 'fit-content';
        // div_row = document.createElement('div');
        // div_row.id = 'remove_button';
        // div_row.className = 'row mt1 justify-content-center';
        // div_col = document.createElement('div');
        // div_col.className = 'col-auto';
        // div_col.appendChild(remove_button);
        // div_row.appendChild(div_col);
        // div_form.querySelector('form').appendChild(div_row);
        // div_form.querySelector('form').insertAfter(div_row, div_form.querySelector('div.row'));
        delete_button = document.createElement('button');
        delete_button.id = 'delete_button';
        delete_button.className = 'btn danger mt-2';
        delete_button.innerText = 'Remove Exercise';
        delete_button.onclick = (event) => {
            event.preventDefault();
            remove_exercise(id);
        }
        div_form.querySelector('div.row').insertAdjacentElement("afterend", delete_button);
        fetch('/exercises/info/'+id)
        .then(response => response.json())
        .then(data => {
            reps.value = data.reps;
            series.value = data.series;
            data.day.forEach(day => {
                if (diassemana.includes(day)){
                    document.querySelector(`#${day}`).checked = true;
                }
            })
            // console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
    }
    div_form.style.display = "block";
    submit = div_form.querySelector('form');
    checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Se procesa el submit con validación previa.
    submit.addEventListener('submit', (event) => {
        event.preventDefault();
        checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
        if (checkedOne){
            add_exercise(id, action);
        } else {
            alert("You must fill at least one day");
        }
        return false;
    });
}

function close_menu_to_add(){
    div_form = document.querySelector('#myForm');
    form = div_form.querySelector('form');
    div_inputs = form.querySelector('#div_inputs');
    form.removeChild(div_inputs);
    delete_check = form.querySelectorAll('div.form-check');
    delete_check.forEach(div => {
        form.removeChild(div);
    })
    if (div_form.querySelector('#remove_button')){
        div_form.removeChild('#remove_button');
    }
    div_form.style.display = "none";
}

function add_exercise(id, action='POST'){
    if(action == 'PUT'){
        url = '/exercises/edit/';
    } else {
        url = 'exercises/add/'
    }
    let arr = [];
    document.querySelectorAll('input.form-check-input').forEach(dia => {
        if (dia.checked){
            arr.push(dia.value)
        }
    });
    fetch(url+id,{
        method: action,
        body: JSON.stringify({
            series: document.querySelector('#series').value,
            reps: document.querySelector('#reps').value,
            days: arr
        })
    })
    .then(response => response.json())
    .then(response => {
        alert(response.message);
    })
    .catch(error => {
        console.log(error);
    })
}

function remove_exercise(id){
    fetch('/exercises/remove/'+id)
    .then(response => response.json())
    .then(response => alert(response.message))
    .catch(error => console.log(error))
}

function upload_track(id, val_series, val_reps){
    fetch('/exercises/track/'+id, {
        method: 'PUT',
        body: JSON.stringify({
            series: val_series,
            reps: val_reps
        })
    })
    .then(response => response.json())
    .then(response => alert(response.message))
    .catch(error => console.log(error))
}