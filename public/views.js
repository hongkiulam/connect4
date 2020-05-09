// >> Views
const gamePage = `<div class="wrapper">
<h1 class="title"><a href="/">cnct 4</a></h1>
<div class="game_wrapper"><span class="game_loading">it's a bit lonely here...</span></div>
<div class="info">
  <span class="playerText one">player 1</span>
  <span class="playerText two">player 2</span>
</div>
</div>`;

const landingPage = `<form class="join_room_form">
<input type="text" class="room_id_input" autofocus />
<button type="submit" class="join_room_btn" onclick="(e)=>{e.preventDefault();}"><span>join</span> <img class="join_arrow" src="./arrow.svg" /></button>
</form>
`;

export { gamePage, landingPage };
