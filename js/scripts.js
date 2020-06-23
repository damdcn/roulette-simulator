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
var resSum = "";
var resDetail = "";


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

$('#submit').on('click', function(){
    clearValues();
    let wonLastGame = true;
    let nbPartie = 0;
    let play = true;
    let nbTirage = $('#nb-tirage').val();
    setWalletStart($('#balance-depart').val());
    resSum = "";
    resDetail = "";
    let successRound = new Array();
    let valJeton = $('#val-jeton').val();
    while(document.getElementById('res-sum').firstChild){
        document.getElementById('res-sum').removeChild(document.getElementById('res-sum').firstChild);
    }
    while(document.getElementById('res-detail').firstChild){
        document.getElementById('res-detail').removeChild(document.getElementById('res-detail').firstChild);
    }
    for(i=0;i<=36;i++){
        let c = document.getElementById('c'+i).getElementsByTagName("input")[0].value;
        if(c && c != 0){
            let betOn = Math.round(c*valJeton*100) / 100;
            resSum += "<label>Mise sur le "+i+" : "+c+" jeton(s) soit "+betOn+"€</label><br>";
            misePlateau[i] = betOn;
            mise += betOn;
            nbJeton += (c*1);
        } else {
            misePlateau[i] = 0.0;
        }
    }
    resSum += "<label><br>Mise totale : "+nbJeton+" jeton(s) soit "+mise+"€</label><br>";

    if(mise>0 && nbTirage>0 && walletStart>0){
        for(i=0;i<nbTirage;i++) {
            resDetail += "<label>----------------------------------------------------</label><br>";
            resDetail += "<div id=p"+(i+1)+" class=p"+(i+1)+">";			
            resDetail += "<label>"+(i+1)+"ème partie</label><br><br>";			
            resDetail += "<label>Wallet debut partie = "+(wallet+gain)+"</label><br>";
        
            if((wallet+gain)>=mise) {
                play = true;			
            } else {
                        resDetail += "<label><br>--<br>Pas assez pour rejouer..</label><br>";
                        resDetail += "</div>";
                        i=nbTirage;
                        play = false;
            }
                
            if(play) {
                
                let tirage = getRandomInt();
                resDetail += "<label>Valeur tirée : "+tirage+"</label><br><br>";
                resDetail += "<label>Mise sur le "+tirage+" : "+misePlateau[tirage]+"€</label><br>";
                wonLastGame = gameResult(tirage, mise, wonLastGame);
                if(wonLastGame) {
                    successRound.push(i+1);
                    resDetail += "<label>Partie gagné ! : +"+(36*misePlateau[tirage])+"€</label><br>";
                } else {
                    resDetail += "<label>Partie perdu.. : -"+mise+"€</label><br>";
                }
                nbPartie++;
                resDetail += "<label>Wallet fin partie = "+(wallet+gain)+"</label><br>";
                resDetail += "</div>";
                
            }
        }
        
        let total = wallet + gain;
        resSum += "<br><br><label>============= Recap =============</label><br><br>";
        resSum += "<label>Wallet debut partie = "+walletStart+"€</label><br>";
        resSum += "<label>Partie(s) Jouée(s) : "+nbPartie+" [ /"+nbTirage+" partie(s) lancée(s) ]</label><br>";
        resSum += "<label>Partie(s) Gagnée(s) : "+win+"</label><br>";
        resSum += "<label>Wallet max pendant la game : "+maxWallet+"€</label><br>";
        resSum += "<label>Suite perdante la plus longue : "+maxLooseSuit+"</label><br>";
        resSum += "<label>Wallet fin de partie : "+total+"€</label><br>";
    } else {
        resSum += "<br><br><label>Vous devez : <ul><li>Mise sur au moins un nombre</li><li>Définir le nombre de tirage</li><li>Définir la balance de départ</li></ul></label><br>";
    }

    $('#res-sum').append(resSum);
    $('#res-detail').append(resDetail);
    
    setTimeout(function(){
        for(j=0;j<successRound.length;j++){
            document.getElementById('p'+successRound[j]).style.backgroundColor = "#9cffaa";
        }
    }, 100);
});

