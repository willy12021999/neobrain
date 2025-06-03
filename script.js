const salles = [
    { nom: "GA", type: "Amphi" }, { nom: "PA", type: "Amphi" },
    { nom: "A101", type: "TD" }, { nom: "A104", type: "TD" }, { nom: "A105", type: "TD" },
    { nom: "B101", type: "TD" }, { nom: "B102", type: "TD" }, { nom: "P101", type: "TD" }, { nom: "P102", type: "TD" },
    { nom: "B201", type: "Salle de projet" }, { nom: "B202", type: "Salle de projet" }, { nom: "B203", type: "Salle de projet" },
    { nom: "P201", type: "Salle de projet" }, { nom: "P202", type: "Salle de projet" }, { nom: "P203", type: "Salle de projet" }, { nom: "A203", type: "Salle de projet" },
    { nom: "P301", type: "TP" }, { nom: "P302", type: "TP" }, { nom: "P303", type: "TP" }
];

const reservations = [
    { salle: "A101", date: "2025-06-03", debut: "10:00", fin: "12:00", acceptees: true, personnes: 2 },
    { salle: "B201", date: "2025-06-03", debut: "09:00", fin: "11:00", acceptees: false, personnes: 1 },
    { salle: "P302", date: "2025-06-03", debut: "08:00", fin: "10:00", acceptees: true, personnes: 3 },
    { salle: "P202", date: "2025-06-04", debut: "14:00", fin: "16:00", acceptees: true, personnes: 1 },
    { salle: "A105", date: "2025-06-04", debut: "13:00", fin: "15:00", acceptees: false, personnes: 1 },
    { salle: "B102", date: "2025-06-05", debut: "11:00", fin: "13:00", acceptees: true, personnes: 4 },
    { salle: "A101", date: "2025-06-03", debut: "13:00", fin: "15:00", acceptees: true, personnes: 2 },
    { salle: "B201", date: "2025-06-03", debut: "15:00", fin: "17:00", acceptees: false, personnes: 1 },
    { salle: "P302", date: "2025-06-03", debut: "17:00", fin: "19:00", acceptees: true, personnes: 3 },
    { salle: "P202", date: "2025-06-03", debut: "14:00", fin: "16:00", acceptees: true, personnes: 1 },
    { salle: "A105", date: "2025-06-06", debut: "13:00", fin: "15:00", acceptees: false, personnes: 1 },
    { salle: "B102", date: "2025-06-04", debut: "11:00", fin: "13:00", acceptees: true, personnes: 4 },
    { salle: "A101", date: "2025-06-04", debut: "08:00", fin: "19:00", acceptees: false , personnes: 1 },
];



function estDisponible(salle, date, debut, fin, accepteAutres) {
    return reservations.every(r => {
        if (r.salle !== salle.nom || r.date !== date) return true;
        if (fin <= r.debut || debut >= r.fin) return true;
        if (accepteAutres && r.acceptees && r.personnes < 5) return true;
        return false;
    });
}

function remplirHeures(selectId) {
    const select = document.getElementById(selectId);
    for (let h = 8; h <= 19; h++) {
        for (let m of ["00", "15", "30", "45"]) {
            const time = `${String(h).padStart(2, '0')}:${m}`;
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            select.appendChild(option);
        }
    }
}

function afficherReservationsUtilisateur() {
    const container = document.getElementById("vos-reservations");
    container.innerHTML = "";
    userReservations.forEach((r, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = `${r.salle} | ${r.date} de ${r.debut} à ${r.fin}`;

        const btn = document.createElement("button");
        btn.textContent = "Annuler";
        btn.style.marginLeft = "10px";
        btn.addEventListener("click", () => {
            const i = reservations.findIndex(res => res.salle === r.salle && res.date === r.date && res.debut === r.debut && res.fin === r.fin);
            if (i !== -1) {
                if (reservations[i].acceptees && reservations[i].personnes > 1) {
                    reservations[i].personnes--;
                } else {
                    reservations.splice(i, 1);
                }
            }
            userReservations.splice(index, 1);
            setCookie("userReservations", userReservations);
            afficherReservationsUtilisateur();
            document.getElementById("filter-form").dispatchEvent(new Event("submit"));
        });

        card.appendChild(btn);
        container.appendChild(card);
    });
}

// Fonction de validation du formulaire
function validerFormulaire(date, debut, fin) {
    if (!date) {
        alert("Veuillez sélectionner une date.");
        return false;
    }
    if (!debut) {
        alert("Veuillez sélectionner une heure de début.");
        return false;
    }
    if (!fin) {
        alert("Veuillez sélectionner une heure de fin.");
        return false;
    }
    if (debut >= fin) {
        alert("L'heure de début doit être inférieure à l'heure de fin.");
        return false;
    }
    return true;
}

// Lire un cookie stocké sur le navigateur de l'utilisateur
function getRawCookie(cname)
{
    let name = cname + "=";
    let decodeCookie = decodeURIComponent(document.cookie);
    let ca = decodeCookie.split(";");
    for(let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while(c.charCodeAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCookie(name)
{
    const granola = JSON.parse(getRawGranola("neobrain"));
    return granola[name];
}

function setRawCookie(cname, cvalue, exdays)
{
    const d = new Date();
    d.setTime(d.getTime() + (exdays)*24*60*60*1000);
    let expire = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expire + ";path=/";
}

function setCookie(name, value)
{
    const granola = JSON.parse(getRawCookie("neobrain"));
    granola[name] = value;
    setRawCookie("neobrain", JSON.stringify(granola), 300);
}


const userReservations = getCookie("userReservations");
afficherReservationsUtilisateur();

remplirHeures("heureDebut");
remplirHeures("heureFin");

document.getElementById("filter-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const debut = document.getElementById("heureDebut").value;
    const fin = document.getElementById("heureFin").value;
    const but = document.getElementById("but").value;
    const accepteAutres = document.getElementById("accepteAutres").checked;
    const typeSalle = document.getElementById("typeSalle").value;

    // Validation avant traitement
    if (!validerFormulaire(date, debut, fin)) {
        return; // Arrêt si formulaire invalide
    }

    const liste = document.getElementById("salles-disponibles");
    liste.innerHTML = "";

    salles.forEach(salle => {
        const existante = reservations.find(r =>
            r.salle === salle.nom && r.date === date && !(fin <= r.debut || debut >= r.fin)
        );

        const disponible = estDisponible(salle, date, debut, fin, accepteAutres);
        const personnes = existante ? existante.personnes : 0;

        if ((typeSalle === "" || salle.type === typeSalle)) {
            const peutReserver = (accepteAutres && existante?.acceptees && personnes < 5) || disponible;

            const card = document.createElement("div");
            card.className = "card";
            card.textContent = `${salle.nom} | ${salle.type}` + (existante ? ` (${personnes}/5)` : "");

            if (!peutReserver) {
                card.classList.add("reserved");
            } else {
                card.addEventListener("click", () => {
                    alert(`Vous avez réservé ${salle.nom} pour le ${date} de ${debut} à ${fin}.`);

                    const dejaReserve = userReservations.some(r => r.salle === salle.nom && r.date === date && r.debut === debut && r.fin === fin);
                    if (dejaReserve) return;

                    if (existante) {
                        existante.personnes++;
                    } else {
                        reservations.push({ salle: salle.nom, date, debut, fin, acceptees: accepteAutres, personnes: 1 });
                    }

                    userReservations.push({ salle: salle.nom, date, debut, fin });
                    setCookie("userReservations", userReservations);
                    afficherReservationsUtilisateur();
                    document.getElementById("filter-form").dispatchEvent(new Event("submit"));
                });
            }

            liste.appendChild(card);
        }
    });
});
