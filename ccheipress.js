var version = "1.97";
var updateversion = 1.6;
var keycodes = {"a":65, "b":66, "c":67, "skip":74, "right":39, "left":37, "master":90};
var keyedits = {"a":false, "b":false, "c":false, "skip":false};
var key;
var keydown = false;
var cansend = true;
var sitter = "";
if (window.game_data.player.sitter !== "0") {
    sitter = "t=" + window.game_data.player.id + "&";
}
var link = ["https://" + window.location.host + "/game.php?" + sitter + "village=", "&screen=am_farm"];
var pos = {s:{order:0,dir:1,loadp:2,fp:3,lp:4,remaxes:5,remyellow:6,remred:7,remblue:8,remgreen:9,remredy:10,remredb:11,remattsince:12}};
var faTable, userkeys, userset, totalrows, countedrows = 0;
var pagesLoad = 0;
var pagesLoaded = false;
var pageLoading = false;
var start = false;
var lastAttackSent = 0; // Variabile per tenere traccia dell'ultimo attacco inviato

function run() {
    checkPage();
    if (checkCookie()) {
        if ($.cookie(cookieName).indexOf('{') === -1) {
            alert("Attempting to adapt existing settings to work with newer version. If there are problems with the settings transition, please try changing your cookie name.\n\n-crim");
            dodokeys = $.cookie(cookieName).split(',');
            resetCookie();
            userkeys[0] = dodokeys[0];
            userkeys[1] = dodokeys[1];
            userkeys[2] = dodokeys[2];
            keycodes.a = parseInt(userkeys[0]);
            keycodes.b = parseInt(userkeys[1]);
            keycodes.c = parseInt(userkeys[2]);
            setCookie(cookieName, 180);
        } else if (parseFloat($.cookie(cookieName).split("{")[1].split("}")[0]) <= updateversion) {
            UI.ErrorMessage("Due to an update, the user data must be reset to default settings. Please redefine your settings and keys, sorry for any inconvenience<br><br>-crim", 2000);
            resetCookie();
        } else {
            userkeys = $.cookie(cookieName).split("[")[1].split("]")[0].split(",");
            userset = $.cookie(cookieName).split("[")[2].split("]")[0].split(",");
            keycodes.a = parseInt(userkeys[0]);
            keycodes.b = parseInt(userkeys[1]);
            keycodes.c = parseInt(userkeys[2]);
            keycodes.skip = parseInt(userkeys[3]);
        }
    } else {
        UI.SuccessMessage("Welcome to FA KeyPress by Crimsoni", 1000);
        resetCookie();
    }
    faTable = $('#plunder_list');
    if (userset[pos.s.loadp] === "1") {
        removeFirstPage();
        showPages();
    } else {
        initStuff();
    }
}

function addPressKey() {
    window.onkeypress = function(e) {
        checkKeys();
    };
    window.onkeydown = function(e) {
        key = e.keyCode ? e.keyCode : e.which;
        keydown = true;
        if (key == keycodes.left) {
            getNewVillage("p");
        } else if (key == keycodes.right) {
            getNewVillage("n");
        }
    };
    window.onkeyup = function(e) {
        keydown = false;
    };
}

function checkKeys() {
    if (keyedits.a) {
        // Se il tasto A è premuto e non è già stato inviato un attacco negli ultimi 250ms
        if (keycodes.a === key && Date.now() - lastAttackSent >= 250) {
            lastAttackSent = Date.now(); // Aggiorna il timestamp dell'ultimo attacco inviato
            sendAllAttacks(); // Funzione per inviare tutti gli attacchi
        }
    } else if (keyedits.b) {
        keycodes.b = key;
        refresh();
    } else if (keyedits.c) {
        keycodes.c = key;
        refresh();
    } else if (keyedits.skip) {
        keycodes.skip = key;
        refresh();
    } else if (cansend) {
        if (key == keycodes.c) {
            click('c');
            doTime(201);
        } else if (key == keycodes.a) {
            click('a');
            doTime(201);
        }
