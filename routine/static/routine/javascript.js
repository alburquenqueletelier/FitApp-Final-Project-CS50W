document.addEventListener('DOMContentLoaded', () => {
    
    // Generate button functionality for menu change
     // Select all buttons to add functionality
     // on click and activate the function to load page
     // with a certain id
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id != 'close_form' && button.id != 'submit_form'){
            button.addEventListener('click', () => {
                try {
                    if (document.querySelector('#myForm').style.display == 'block'){
                        close_menu_to_add();
                    }
                } catch (e) {}
                history.pushState({state : `${button.id}`}, `${button.id}`, `${button.id}`);
                load_page(button.id);
            })
        } 
    })
    
    // By defautl load index
    document.querySelector('#index').click();
    history.pushState({state:'index'}, 'index', 'index');

    // Add even listener to Add exercise Form
    div_form = document.querySelector('#myForm');
    form = div_form.querySelector('form');
    // Se procesa el submit con validación previa.
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
        id=form.querySelector('input[name="exercise_id"]').value;
        action=form.querySelector('input[name="action_value"]').value;
        if (checkedOne){
            add_exercise(id, action);
            form.reset();
        } else {
            alert("You must fill at least one day");
        }
        return false;
    });
    
})

// Function to generate random number to use in color rgb
function generarNumero(numero){
	return (Math.random()*numero).toFixed(0);
}
// Generate rgb color random
function colorRGB(){
	var coolor = "("+generarNumero(255)+"," + generarNumero(255) + "," + generarNumero(255) +")";
	return "rgb" + coolor;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Return to the state of the previous page when the back button is pressed
window.onpopstate = function(event) {
    event.preventDefault;
    page = event.state.state;
    if (document.querySelector('#myForm').style.display == 'block'){
        close_menu_to_add();
    }
    load_page(page);
    console.log(page);
}

// Control the addeventlistener from add form
var was_submit = false;

//Arrays:
var lasemana=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var diassemana=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
// function to load page
// Each button modifies the DOM as appropriate
function load_page(event){
    
    // Request user from template
    var request_user = JSON.parse(document.getElementById('request_user').textContent);
    // Change the display state of the divs that contain the pages as appropriate
    let page = event;
    divs = document.querySelectorAll('div.page');
    divs.forEach(div => {
        if (div.id.includes(page)){
            document.querySelector(`#${div.id}`).style.display = 'block';
        } else {
            document.querySelector(`#${div.id}`).style.display = 'none';
        }
    })

    // Build the material corresponding to each page
    switch (page){
        case 'exercise':
            // The accordion is rendered with all the exercises retrieved with the API through the fetch
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
                        div.querySelector('button.btn-primary').disabled=true;
                    }
                    div_accordion.appendChild(div);
                })
                div_exercise.appendChild(div_accordion);
            })
            .catch(error => {
                console.log(error);
            })
            // Load plan user info with fetch
            // If the exercise is already added, the button is changed to edit
             // and add button to remove exercise.
            // if (request_user){
            //     fetch('/plan', {
            //         method: 'GET'
            //     })
            //     .then(response => response.json())
            //     .then(data => {
            //         add_buttons = document.querySelectorAll('button.btn-primary');
            //         add_buttons.forEach(button => {
            //             data.exercises.forEach(exercise => {
            //                 if(exercise.exercise.name == button.dataset.name){
            //                     button.removeAttribute("onclick");
            //                     button.innerText = 'Edit exercise';
            //                     button.className = 'btn btn-warning mt-2 me-2';
            //                     button.onclick = () => menu_to_add(button.dataset.id, 'PUT');
            //                     remove_button = document.createElement('button');
            //                     remove_button.id = `remove_button${exercise.exercise.id}`;
            //                     remove_button.className = 'btn btn-danger mt-2';
            //                     remove_button.innerText = 'Remove exercise';
            //                     remove_button.onclick = () => remove_exercise(button.dataset.id);
            //                     button.insertAdjacentElement("afterend", remove_button);
            //                 }
            //             })
            //         });
            //     })
            //     .catch(error => {
            //         console.log(error, request_user);
            //     })
            // }
            break;
        // Generate planning page
        case 'my_routine':
            // Instructions and two buttons are displayed according to the desired planning
             // Currently only weekly planning works
            document.querySelector('#div_my_routine').innerHTML = `
            <h2 class="text-center">Planificación de Rutina</h2>
            <h4 class="text-center">Arma tu rutina ! </h4>
            <p>Selecciona planificación semanal o mensual. Puedes registrar ambas, te ayudarán a tener mejor control sobre tus entrenamientos.
            Por el momento solo funciona la opción semanal, que te permite ver tu rutina, editar o remover los ejercicios que tienes añadidos.</p>
            <p> 
            Si quieres <strong> AGREGAR más ejercicios </strong> debes hacerlo en la pestaña de ejercicios.
            </p>
            <ol>
                <li>Selecciona el ejercicio que quieras modificar o eliminar</li>
                <li>Modifica la información del formulario si quieres editar la rutina para ese ejercicio</li>
                <li>Para eliminar puedes desmarcar todos los días y enviar el formulario o presionar el boton remover ejercicio</li>
                <li>Cada acción que modifique el plan de la rutina genera una alerta indicando que fue exitoso el cambio.</li>
            </ol>
            <div class="row justify-content-center"">
                <div class="col-auto">
                    <button id="week" onclick="load_plan('week')">Semanal</button>
                </div>
                <div class="col-auto">
                    <button id="month" onclick="load_plan('month')">Mensual</button>
                </div>
            </div>
            `
            break;
        case 'results':
            // Load results page
             // The idea is to be able to see the added exercises, record the maximal by date
            //  and allow add new track to the exercise
            div_results = document.querySelector('#div_results');
            div_results.innerHTML = `<h2> Track Your Results ! </h2>`;
            fetch('/plan')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                // Create the table where the information will be displayed
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
                                <th>All register</th>
                            </tr>
                        </thead>
                        <tbody class="bg-info">
                        </tbody>
                    </table>
                `;
                var tbody = div_tracker.querySelector('#table_tracker');
                tbody = tbody.querySelector('tbody');
                tbody.style.background = 'rgb(150,10,230)';
                // Load the info to the Table
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
                                    if(exercise.id == track.owner){
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
                                    if(exercise.id == track.owner){
                                        info_reps[`${exercise.exercise.name}`] = track.reps;
                                    } 
                                })
                                if (Object.keys(info_reps).length === 0){
                                    info_reps[`${exercise.exercise.name}`] = '-';
                                }
                                td.appendChild(document.createTextNode(info_reps[`${exercise.exercise.name}`]));
                                break;
                            case 5:
                                // Create a form to add a series record. 
                                // It only allows sending information if the rep form is with information and vice versa
                                td.innerHTML = `
                                    <form id="series_${exercise.exercise.id}" class="form-inline series">
                                        <div class="form-group row">
                                            <div class="col">
                                                <input required class="form-control" type="number">
                                            </div>
                                            <div class="col">
                                                <input class="form-control" type="submit" value="Save">
                                            </div>
                                        </div>
                                        <input type="hidden" name="id_exercise" value="${exercise.id}">
                                    </form>
                                `;
                                break;
                            case 6:
                                // Create a form to add a reps record. 
                                td.innerHTML = `
                                <form id="reps_${exercise.exercise.id}" class="form-inline reps">
                                    <div class="form-group row">
                                        <div class="col">
                                            <input required class="form-control" type="number">
                                        </div>
                                        <div class="col">
                                            <input class="form-control" type="submit" value="Save">
                                        </div>
                                    </div>
                                    <input type="hidden" name="id_exercise" value="${exercise.id}">
                                </form>
                                `;
                                break;
                            case 7:
                                // Button to see al the tracker of the exercise
                                // not yet implemented
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
                // Handling of forms. Conditions are added here
                all_forms = div_results.querySelectorAll('form');
                count = 0;
                all_forms.forEach(form => {
                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                        // forms series are render by par index
                        search = form.id
                        search = search.substring(search.indexOf('_')+1,);
                        if (count%2==0){
                            rep_form = div_results.querySelector(`#reps_${search}`)
                            if (form.querySelector('input').value <= 0 || rep_form.querySelector('input').value <= 0){
                                alert('error: series and reps must be greater than 0');
                                return false;
                            }
                            if (form.querySelector('input').type != 'number' || rep_form.querySelector('input').type != 'number'){
                                alert('error: series and reps must be numeric');
                                return false;
                            }
                            value_series = form.querySelector('input').value;
                            value_reps = rep_form.querySelector('input').value;
                        } else {
                            // Forms reps are render by impar index
                            serie_form = div_results.querySelector(`#series_${search}`)
                            if (form.querySelector('input').value <= 0 || serie_form.querySelector('input').value <= 0){
                                alert('error: series and reps must be greater than 0');
                                return false;
                            }
                            if (form.querySelector('input').type != 'number' || serie_form.querySelector('input').type != 'number'){
                                alert('error: series and reps must be numeric');
                                return false;
                            }
                            value_series = serie_form.querySelector('input').value;
                            value_reps = form.querySelector('input').value;
                        }
                        id_exercise = form.querySelector('input[name="id_exercise"]').value;
                        upload_track(id_exercise, value_series, value_reps);
                        return false;
                    })
                    count+=1;
                })
            })
            .catch(error => console.log(error))
            break;
        case 'others':
            // Load page with a list of all user except the request user
            div_others = document.querySelector('#div_others');
            div_others.innerHTML = '<h2>View of other users tracker</h2>';
            // Fetch of all users and adds a link to visit a page 
            // that allows you to see all the results of the selected user.
            fetch('/users')
            .then(response => response.json())
            .then(users => {
                ul = document.createElement('ul');
                users.forEach(user => {
                    console.log(user);
                    li = document.createElement('li');
                    li.innerHTML = `<a href="routine/${user.name}">${user.name}</a>`;
                    ul.appendChild(li);
                })
                div_others.appendChild(ul);
            })
            .catch(error => console.log(error))
            break;
    }
}

// Load weekly or monthly calendar as appropriate
function load_plan(data) {
    
    div_calendario = document.createElement('div');
    div_calendario.id = 'calendario';
    div_calendario.className = 'table-responsive';
    switch (data){
        // Load Weekly Calendar
        case 'week':
            div_calendario.innerHTML = `
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
            `;
            if (!document.querySelector('#calendario')){
                div = document.querySelector('#div_my_routine');
                div.appendChild(div_calendario);
                // div.querySelector('div.row').insertAdjacentElement("afterend", div_calendario);
                week_info();
            }
            break;
     
        case 'month':
            // Load monthly calendar
            // currently under construction
            div_calendario.innerHTML = '<h1>Esta sección esta en desarrollo!</h1>';
            if (!document.querySelector('#calendario')){
                div = document.querySelector('#div_my_routine');
                div.appendChild(div_calendario);
            }
            break;
    }
}

function week_info(){
    fetch('/plan',{
        method: 'GET'
    })
    .then(response =>response.json())
    .then(data => {
        console.log(data);
        tr = document.querySelector('#dias');
        dias_info = tr.querySelectorAll('td');
        let i = 0;
        color = new Object();
        dias_info.forEach(celda => {
            let lista = document.createElement('ol');
            data.exercises.forEach(exercise => {
                if (!color[`${exercise.id}`]){
                    color[`${exercise.id}`] = colorRGB();
                }
                // console.log(exercise);
                if (exercise.day.includes(diassemana[i])){
                    li = document.createElement('li');
                    li.className = 'list_exercises';
                    li.style.color = color[`${exercise.id}`];
                    li.innerHTML = `
                    <button  style="color: ${color[`${exercise.id}`]}" class="no-button" onclick="menu_to_add(${exercise.id}, 'PUT')">
                        <p id="p${exercise.id}" class='close';"><strong>${exercise.exercise.name}</strong></p>
                    </button>
                    <p class='close'>Series: ${exercise.series}</p>
                    <p class='close'>Reps: ${exercise.reps}</p>
                    `;
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


// Genera el menu para añadir ejercicio, reps y series a los días seleccionados
// Recoge div contenedor desde HTML y crea los elementos del formulario para luego ser apendd.
function menu_to_add(id, action='POST'){
    // Crea div contenedor del form
    let div_form = document.querySelector("#myForm");
    if (div_form.style.display == 'none'){
        if (document.querySelector(`#heading${id}`)){
            div_form.querySelector('h1').innerHTML = `Add <strong id="form-add-h1">${document.querySelector(`#heading${id}`).innerText}</strong>`;
        } else {
            div_form.querySelector('h1').innerHTML = `Add <strong id="form-add-h1">${document.querySelector(`#p${id}`).innerText}</strong>`;
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
        // Añade input escondido con id exercise y action
        id_hidden = document.createElement('input');
        id_hidden.setAttribute('type', 'hidden');
        id_hidden.setAttribute("name", "exercise_id");
        id_hidden.setAttribute("value", id);
        id_action = document.createElement('input');
        id_action.setAttribute('type', 'hidden');
        id_action.setAttribute("name", "action_value");
        id_action.setAttribute("value", action);
        // Se añade inputs y etiquetas a nuevo div que se integra al formulario
        div_inputs = document.createElement('div');
        div_inputs.id = 'div_inputs';
        div_inputs.appendChild(label_series);
        div_inputs.appendChild(series);
        div_inputs.appendChild(label_reps);
        div_inputs.appendChild(reps);
        div_inputs.appendChild(id_hidden);
        div_inputs.appendChild(id_action);
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
        if (!document.querySelector('#delete_button')){
            delete_button = document.createElement('button');
            delete_button.id = 'delete_button';
            delete_button.className = 'btn danger mt-2';
            delete_button.innerText = 'Remove Exercise';
            delete_button.onclick = (event) => {
                event.preventDefault();
                remove_exercise(id);
            }
            div_form.querySelector('div.row').insertAdjacentElement("afterend", delete_button);
        }
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
}

function close_menu_to_add(){
    div_form = document.querySelector('#myForm');
    form = div_form.querySelector('form');
    form.reset();
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
    form = document.querySelector('form');
    const csrftoken = getCookie('csrftoken');
    fetch(url+id,{
        method: action,
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin',
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
    const csrftoken = getCookie('csrftoken');
    fetch('/exercises/track/'+id, {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin',
        body: JSON.stringify({
            series: val_series,
            reps: val_reps
        })
    })
    .then(response => response.json())
    .then(response => alert(response.message))
    .catch(error => console.log(error))
}