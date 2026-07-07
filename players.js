const teamPlayers = {
    A: [
        "선수1",
        "선수2",
        "선수3",
        "선수4",
        "선수5"
    ],

    B: [
        "선수1",
        "선수2",
        "선수3",
        "선수4",
        "선수5"
    ]
};

function loadPlayers(){

    let team=document.getElementById("team").value;
    let input=document.getElementById("player");

    input.setAttribute(
        "list",
        "playerList"
    );

    let old=document.getElementById("playerList");

    if(old){
        old.remove();
    }

    let datalist=document.createElement("datalist");
    datalist.id="playerList";

    teamPlayers[team].forEach(function(name){

        let option=document.createElement("option");
        option.value=name;
        datalist.appendChild(option);

    });

    document.body.appendChild(datalist);

}