window.addEventListener("load", function(){
  setTimeout(function(){
    if(typeof updateScoreboard2 === "function") updateScoreboard2();
    if(typeof renderPlayers2 === "function") renderPlayers2();
  }, 500);
});