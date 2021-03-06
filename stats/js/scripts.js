var misePlateau = new Array(); // tableau du plateau de jeu
var gain = 0;                  // gain total
var win = 0;                   // nombre de partie gagné
var walletStart = 0;           // balance de début de jeu
var wallet = 0;      // balance actuelle
var mise = 0;                  // mise totale (en euro) en jeu sur le plateau
var nbJeton = 0                 // nombre de jeton sur le plateau
var maxWallet = 0;   // la balance maximale au cours des parties
var actualLooseSuit = 0;       // suite perdante actuelle
var maxLooseSuit = 0;          // suite perdante la plus longue
var precision = 30;
var resSum = "";
var resDetail = "";
var actualBet = "";
var dataSet = new Array();


function clearValues(){
    misePlateau = new Array();
    gain = 0;                 
    win = 0;                  
    walletStart = 0;          
    wallet = 0;      
    mise = 0;
    nbJeton = 0;
    maxWallet = 0;
    actualLooseSuit = 0;
    maxLooseSuit = 0;
    precision = 30;
    actualBet = "";
    resSum = "";
    resDetail = "";
    dataSet = new Array();
}

function clearWallets(){
    gain = 0;                 
    win = 0;                  
    actualLooseSuit = 0;
    maxLooseSuit = 0;
}

function resetRes(){
    while(document.getElementById('res-sum').firstChild){
        document.getElementById('res-sum').removeChild(document.getElementById('res-sum').firstChild);
    }
    while(document.getElementById('res-detail').firstChild){
        document.getElementById('res-detail').removeChild(document.getElementById('res-detail').firstChild);
    }
    while(document.getElementById('res-chart').firstChild){
        document.getElementById('res-chart').removeChild(document.getElementById('res-chart').firstChild);
    }
    while(document.getElementById('actual-bet').firstChild){
        document.getElementById('actual-bet').removeChild(document.getElementById('actual-bet').firstChild);
    }
}

function setWalletStart(n){
    walletStart = n;
    wallet = n;
    maxWallet = n;
}

function getRandomInt() { // fonction de tirage d'un nombre entre 0 et 36
    return Math.floor(Math.random() * Math.floor(36));
}

function gameResult(res, mise, wonLastGame) { // fonction qui renvoie le resultat d'une partie
    isWin = false;
    gainPartie = 0.0;
    if(misePlateau[res]>0) {
        gainPartie+=(36*misePlateau[res]);
        gain+=(36*misePlateau[res]);
        win++;
        isWin = true;
    }
    wallet-=mise;
    if(isWin) {
        if(gain+wallet > maxWallet) maxWallet = gain+wallet;
    }
    else {
        if(!wonLastGame) {
            actualLooseSuit++;
            if(actualLooseSuit > maxLooseSuit) maxLooseSuit = actualLooseSuit;
        }
        else 
            actualLooseSuit = 1;
    }
    return isWin;
}


/*
 * SUBMIT
 */
$('#submit').on('click', function(){
    clearValues();
    let wonLastGame = true;
    let nbPartie = 0;
    let play = true;
    let nbTirage = $('#nb-tirage').val();
    setWalletStart($('#balance-depart').val());
    let valJeton = $('#val-jeton').val();
    precision = $('#precision').val();
    resetRes();

    for(let i=0;i<=36;i++){
        misePlateau[i] = 0.0;
    }
    let chips = document.getElementsByClassName('chip');
    for(chip of chips){
        let i = parseInt(chip.id.substr(4));
        let c = parseInt(chip.firstChild.nodeValue);
        let betOn = Math.round(c*valJeton*100) / 100;
        actualBet += "<label>Mise sur le "+i+" : "+c+" jeton(s) soit "+betOn+"€</label><br>";
        misePlateau[i] = betOn;
        mise += betOn;
        nbJeton += (c*1);
    };

    actualBet += "<label><br>Mise totale : "+nbJeton+" jeton(s) soit "+mise+"€</label><br>";

    if(mise>0 && nbTirage>0 && walletStart>0 && precision>0){
        for(let j=0;j<precision;j++) {
            clearWallets();
            setWalletStart($('#balance-depart').val());
            for(let i=0;i<nbTirage;i++) {            
                if((wallet+gain)>=mise) {
                    play = true;			
                } else {
                            resDetail += "</div>";
                            i=nbTirage;
                            play = false;
                }
                    
                if(play) {
                    let tirage = getRandomInt();
                    wonLastGame = gameResult(tirage, mise, wonLastGame);
                    nbPartie++;
                }
            }
            resDetail += "<label>-------------------------------------------</label><br>";
            resDetail += "<div id=p"+(j+1)+" class=p"+(j+1)+">";			
            resDetail += "<label>"+(j+1)+"ème série de "+nbTirage+" tirage(s)</label><br><br>";
            resDetail += "<label>Wallet fin série = "+(wallet+gain)+"</label><br>";
            resDetail += "</div>";
            
            let total = wallet + gain;
            dataSet.push(total-walletStart);
        }
        var sWin = 0;
        dataSet.map(function(e){
            if(e>0) sWin++
        });
        resSum += "<label>============= Stats =============</label><br><br>";
        resSum += "<label>Série rentable : "+Math.round(sWin/precision*100)+"%</label><br>";

        // Création du graphique
        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "chart");
        document.getElementById('res-chart').appendChild(canvas);
        var ctx = document.getElementById('chart');
        var Chart = initChart(ctx, nbTirage, dataSet, precision);
    } else {
        resSum += "<br><br><label>Vous devez : <ul><li>Mise sur au moins un nombre</li><li>Définir le nombre de tirage</li><li>Définir la balance de départ</li><li>Définir la précision</li></ul></label><br>";
    }

    $('#actual-bet').append(actualBet);
    $('#res-sum').append(resSum);
    $('#res-detail').append(resDetail);

});


/*
 * RESET
 */
$('#reset-button').on('click', function(){
    clearValues();
    resetRes();
    $('.chip').remove();
});


/*
 * SET JETON
 */
function placeChip(e){ // place un jeton sur la case e
    let c = e.id.substr(1); // numéro de la case
    var chipElement = '<div class="chip" id="chip'+c+'">1</div>';
    if(e.firstChild.tagName != 'DIV'){
        $('#'+e.id).prepend(chipElement);
        //$('#res-sum').append("<label>Mise sur le "+c+" : 1 jeton soit "+betOn+"€</label><br>");
    } else {
        let n = parseInt(document.getElementById(e.firstChild.id).firstChild.nodeValue); // nombre de jetons sur c
        n++;
        $('#'+e.firstChild.id).empty().append(n);
        if(n>=5 && n<10) $('#'+e.firstChild.id).css("background", "#0000f2")
        if(n>=10 && n<50) $('#'+e.firstChild.id).css("background", "#7800a1")
        if(n>=50 && n<100) $('#'+e.firstChild.id).css("background", "#008f0a")
    }
}