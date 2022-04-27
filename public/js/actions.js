if (document.querySelector('#container-slider')) {
    setInterval('fntExecuteSlide("next")', 5000);
}
//------------------------------ LIST SLIDER -------------------------
if (document.querySelector('.listslider')) {
    let link = document.querySelectorAll(".listslider li a");
    link.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let item = this.getAttribute('itlist');
            let arrItem = item.split("_");
            fntExecuteSlide(arrItem[1]);
            return false;
        });
    });
}

function fntExecuteSlide(side) {
    let parentTarget = document.getElementById('slider');
    let elements = parentTarget.getElementsByTagName('li');
    let curElement, nextElement;

    for (var i = 0; i < elements.length; i++) {

        if (elements[i].style.opacity == 1) {
            curElement = i;
            break;
        }
    }
    if (side == 'prev' || side == 'next') {

        if (side == "prev") {
            nextElement = (curElement == 0) ? elements.length - 1 : curElement - 1;
        } else {
            nextElement = (curElement == elements.length - 1) ? 0 : curElement + 1;
        }
    } else {
        nextElement = side;
        side = (curElement > nextElement) ? 'prev' : 'next';

    }
    //RESALTA LOS PUNTOS
    let elementSel = document.getElementsByClassName("listslider")[0].getElementsByTagName("a");
    elementSel[curElement].classList.remove("item-select-slid");
    elementSel[nextElement].classList.add("item-select-slid");
    elements[curElement].style.opacity = 0;
    elements[curElement].style.zIndex = 0;
    elements[nextElement].style.opacity = 1;
    elements[nextElement].style.zIndex = 1;
}

// Handle form
const formSendBtn = document.getElementById('form-send');
const toast = document.getElementById('toasts');
const types = [
    'info',
    'success',
    'error',
    'warning'
];

function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}

formSendBtn.onclick = async (e) => {
    e.preventDefault();
    const payload = `{
        "form-nombre": "${document.getElementById('form-nombre').value}",
        "form-email": "${document.getElementById('form-email').value}",
        "form-telefono": "${document.getElementById('form-telefono').value}",
        "form-mensaje": "${jsonEscape(document.getElementById('form-mensaje').value)}",
        "form-producto": "${document.getElementById('form-producto').value}"
       }`;
    const response = await fetch('mailing.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: payload,
    });

    response.json().then(data => {
        console.log(data);
        createToast(data.message, data.type);
    });
};

function createToast(message = null, type = null) {
    let properties

    const notif = document.createElement('div')
    const notifIcon = document.createElement('span')
    const notificationType = type ? type : getRandomType()
    
    properties = setProperties(notificationType)

    notif.classList.add('toast')
    notif.classList.add(notificationType)
    
    notifIcon.classList.add(properties[0])
    notifIcon.classList.add(properties[1])

    notif.innerText = message

    toast.appendChild(notif)
    notif.append(notifIcon)

    setTimeout(() => {
        notif.remove()
    }, 3000)
}

function setProperties(notificationType){
    let propertyList

    switch (notificationType) {
        case 'info':
            propertyList = ['fas', 'fa-info-circle', 0]
            break
        case 'error':
            propertyList = ['fas', 'fa-exclamation-circle', 1]
            break
        case 'success':
            propertyList = ['fas', 'fa-check-circle', 2]
            break
        case 'warning':
            propertyList = ['fas', 'fa-exclamation-triangle', 3]
            break
    }

    return propertyList;
}