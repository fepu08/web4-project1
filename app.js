// UI Elements
const nav = document.getElementById('side-nav');
const showNav = document.getElementById('show-nav-btn');
const hideNav = document.getElementById('hide-nav-btn');
const showNavHeader = document.getElementById('show-nav-header');
const select = document.getElementById('cikkek-listaja');
const min = document.getElementById('min3');
const range = document.getElementById('range');
const prev20Btn= document.getElementById('button-double-left');
const prevBtn= document.getElementById('button-left');
const nextBtn= document.getElementById('button-right');
const next20Btn= document.getElementById('button-double-right');

// Variables
var title = "";
var atleast3 = false;
var accuracy = 0.5;
var text = "";
var arrayObject = [];
var currentLead = 0;
var arrayData = [];
var arraySpecial_Original = [];
var offset = 20;
var arrayOriginal = [];
var arraySpecial_Recommended = [];

// Show nav
showNav.addEventListener('click', () => {
    //if small screen
    if(window.matchMedia(("(max-width: 767px)")).matches || nav.style.transform === 'translateX(-100%)'){
        nav.style.transform = 'translateX(0%)';
    }
    document.body.classList.add('show-nav');
    showNavHeader.classList.add('d-none');

    /*document.body.classList.add('show-nav')
    showNav.classList.add('d-none');*/
});
// Hide nav
hideNav.addEventListener('click', () => {
    if(window.matchMedia(("(max-width: 767px)")).matches || nav.style.transform === 'translateX(0%)'){
        nav.style.transform = 'translateX(-100%)';
    }
    document.body.classList.remove('show-nav');
    showNavHeader.classList.remove('d-none');
});

select.addEventListener('change', function(e) {
    var option = arrayData.find(d => d.title == e.target.value);
    getDataFromText(option);
});

// Previous and next buttons
prev20Btn.addEventListener('click', () => {
    currentLead = currentLead - 20;
    if(currentLead < 0) {
        currentLead = arrayData.length - 20;
    }
    getData();
});

prevBtn.addEventListener('click', () => {
    currentLead = currentLead - 1;
    if(currentLead < 0) {
        currentLead = arrayData.length - 20;
    }
    getData();
});

nextBtn.addEventListener('click', () => {
    currentLead = currentLead + 1;
    if(currentLead + offset >= arrayData.length) {
      currentLead = 0;
    }
    getData();
  });

  next20Btn.addEventListener('click', () => {
    currentLead = arrayData.length + 20;
    getData();
  });


function getData(url = 'data.txt') {
    arrayData = [];
    fetch(url).then((response) => response.text()).then((text) => text.split('\n')).then((text) => text.map((line) => line.split('$$$'))).then((text) => {
        var obj = {};
        var indx = 0;
        text.forEach((line) => {
            obj.ajanlott = line[0];
            obj.ajanlottEgyeb = line[1];
            obj.eredeti = line[2];
            obj.title = line[3];
            obj.text = line[4];
            obj.id = indx++;

            arrayData.push(obj);
            obj = {};
        });
        select.innerHTML = "";

        arrayData.map((data, index) => {
            if(index >= currentLead && index < (currentLead + offset)) {
            var option = document.createElement('option');
            option.innerText = data.title;
            option.value = data.title;
            select.appendChild(option);
            }
        });
    });
};

var getDataFromText = function(data) {
    arrayObject = [];
    arraySpecial_Recommended = [];
    arrayOriginal = [];
    arraySpecial_Original = [];
    var tempObj = {};
    var ajanlott = data.ajanlott.split(' '); 
    var ajanlottEgyeb = data.ajanlottEgyeb.split(' '); 
    var eredeti = data.eredeti.split(' ');
    title = data.title;
    text = data.text;

    ajanlott.forEach(item => {
        if(item.trim().startsWith('__label__')) {
        tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
        }else if(item != "") {
        tempObj.accuracy = item.trim();
        arrayObject.push(tempObj);
        tempObj = {};
        }
    });

    ajanlottEgyeb.forEach(item => {
        if(item.trim().startsWith('__label__')) {
        tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
        }else if(item != "") {
        tempObj.accuracy = item.trim();
        arraySpecial_Recommended.push(tempObj);
        tempObj = {};
        }
    });

    eredeti.forEach(item => {
        if(item.trim().startsWith('__label__')) {
        tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
        arrayOriginal.push(tempObj);
        tempObj = {};
        }else if(item != "") {
        tempObj.label = item.replace(/@{2}/g, " ");
        arraySpecial_Original.push(tempObj);
        tempObj = {};
        }
    });

    var elem = document.getElementById("cikk-szovege-content");
    elem.innerHTML = text;

    addlabel("eredeti-cimkek", arrayOriginal);
    addlabel("ajanlott-cimkek", arrayObject);
    addlabel("ajanlott-egyeb-cimkek", arraySpecial_Recommended);
    addlabel("eredeti-egyeb-cimkek", arraySpecial_Original);
}

var addlabel = function(nodeId, data = []) {
    var node = document.getElementById(nodeId);
    node.innerHTML = "";
    if(atleast3) {
        for(var i = 0; i < data.length && i < 3; i++) {
        var list = document.createElement('li');
            if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} (${data[i].accuracy})`;
            }else {
                list.textContent = data[i].label;
            }
            node.appendChild(list);
        }

        for(var i = 3; i < data.length; i++) {
        if(data[i].accuracy !== undefined) {
            if(data[i].accuracy >= accuracy) {
                var list = document.createElement('li');
                if (data[i].accuracy !== undefined) {
                    list.textContent = `${data[i].label} (${data[i].accuracy})`;
                }else {
                    list.textContent = data[i].label;
                }
                node.appendChild(list);
            }
        } else {
            var list = document.createElement('li');
            if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} '('${data[i].accuracy}')'`;
            }else {
            list.textContent = data[i].label;
            }
            node.appendChild(list);
        }
        }
    } else {
        for(var i = 0; i < data.length; i++) {
        if(data[i].accuracy !== undefined) {
            if(data[i].accuracy >= accuracy) {
            var list = document.createElement('li');
            if (data[i].accuracy !== undefined) {
                list.textContent = `${data[i].label} (${data[i].accuracy})`;
            }else {
                list.textContent = data[i].label;
            }
            node.appendChild(list);
            }
        } else {
            var list = document.createElement('li');
            if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} (${data[i].accuracy})`;
            }else {
            list.textContent = data[i].label;
            }
            node.appendChild(list);
        }
        }
    }
};

min.addEventListener('change', function() {
    atleast3 = !atleast3;
    addlabel("eredeti-cimkek", arrayOriginal);
    addlabel("ajanlott-cimkek", arrayObject);
    addlabel("ajanlott-egyeb-cimkek", arraySpecial_Recommended);
    addlabel("eredeti-egyeb-cimkek", arraySpecial_Original);
});

(function () {
    getData();
    accuracy = range.value;
    document.getElementById('range-value').textContent = range.value;
})();

    range.addEventListener('input', function(e) {
    accuracy = e.target.value;
    document.getElementById('range-value').textContent = e.target.value;
    addlabel("eredeti-cimkek", arrayOriginal);
    addlabel("ajanlott-cimkek", arrayObject);
    addlabel("ajanlott-egyeb-cimkek", arraySpecial_Recommended);
    addlabel("eredeti-egyeb-cimkek", arraySpecial_Original);
});