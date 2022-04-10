document.addEventListener('DOMContentLoaded', () => {

    // Carga información de los resultados del usuario
    user = window.location.href;
    user = user.split('/');
    info = load_info(user.pop());
    history.replaceState({state:'others'}, '', 'others');

    console.log(user);
    go_back = document.querySelector('#goback');
    go_back.onclick = () => {
        history.back();
    }

})

// Devuelve al estado de la pagina anterior cuando se apreta el boton atras
window.onpopstate = (event) => {
    event.preventDefault();
    window.location.replace('http://127.0.0.1:8000/');
    load_page(event.state.state);

}

function load_info(name){
    fetch('/plan/'+name)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        h1 = document.querySelector('h1');
        h1.innerText = `${data.plan.owner} Results`;
        var tbody = document.querySelector('tbody');
                data.exercises.forEach(exercise => {
                    // console.log(data);
                    tr = tbody.insertRow();
                    for (i=0;i<6;i++){
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
    })
    .catch(error => console.log(error))
}