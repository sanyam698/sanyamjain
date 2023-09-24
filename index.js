
let screen="home";
let heroList=[];

//authenticate up URL to fetch API
let ts=Date.now();
let PUBLIC_KEY="32630d694678b4c84a99887106727d32";
const PRIVATE_KEY="d4399dbc429567a24fdd3ddd10d98e412564fb3b"
//md5 hash of ts+ privatekey+publickey using CDN
const hash=md5(ts+PRIVATE_KEY+PUBLIC_KEY);


const input=document.getElementById("search-bar");
const list=document.getElementById("list");
const profileDOM=document.getElementById("profile");


//to fetchAPIs 
async function fetchAPI(){
  heroList=await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)  
  .then(response => response.json())
  .then(task => task.data.results);

  displayHeroList(heroList,list);
  list.style.display="";
  return;


}

//returning to Home Screen
function backToHome(){
  screen="home";
  list.style.display="";
  profileDOM.style.display="none";
  displayHeroList(heroList, list);
}

//function to display List of all heroes
function displayHeroList(heroList,listDiv){

  listDiv.innerHTML="";
  for(let i=0;i<heroList.length;i++){
    let hero=document.createElement('li');
    hero.innerHTML=`
      <div  class="hero" >
      <span> <img class="heroImage" src=${heroList[i].thumbnail.path+"."+heroList[i].thumbnail.extension}> </span>
      <span class="heroTitle" onclick="openProfile(${i})"> ${heroList[i].name} </span>
      <span> <i class=" ${localStorage.getItem(i)=='true'? "fa-solid":"fa-regular"} fa-heart heroTitle" id="like+${i}" data-id=${i}></i></span>
      <span><input class="checkout" id=${i} ${localStorage.getItem(i)=='true'? "checked":""}   type="checkbox" > </span>
      </div>`;
    listDiv.append(hero);
  }
  return;
}


//to create and open a new profile page of A hero
const openProfile=(i)=>{
  screen="profile";  
  list.style.display="none";
  profileDOM.style.display="";
  profileDOM.innerHTML="";
  

  let profile=heroList[i];  
  const newHero=document.createElement("span");
  newHero.innerHTML=`
  <h1>${profile.name}</h1>
  <img class="heroImage" src="${profile.thumbnail.path}.${profile.thumbnail.extension}">
  <p class="description">${profile.description || "no desciption found"}</p> 
  <li> No of Comics :${profile.comics.available} </li>`

  profileDOM.append(newHero);
}

//creating seacrh bar function
const searchBarFn=()=>{

    let text=input.value.toUpperCase();
    const li=list.getElementsByTagName("li")

    for(let i=0;i<li.length;i++){
    if(li[i].textContent.toUpperCase().indexOf(text)>-1)
        li[i].style.display="";    
    else li[i].style.display="none";
    }
}
 

//function to display Fav List
function displayOnlyFavList(){

  screen="fav";
  // 1 favListDOM.style.display="";
  list.style.display="";
  profileDOM.style.display="none";

  let count=0;
  const li=list.getElementsByTagName("li")
  for(let i=0;i<li.length;i++){
      let check=li[i].getElementsByTagName("input") ;
      
      if(check[0].checked==0)
        li[i].style.display="none";
  }    
}


//marking a hero as Favourite after Liking it into localStorage
const addToFavList=(id)=>{
  let checkbox=document.getElementById(id);
  console.log(checkbox)
  if(checkbox.checked==1)
  localStorage.setItem(id,'true');

  else
    {
    localStorage.setItem(id,'false')
    if(screen=="fav")
    alert("Remove from favourites ? ")
    }

  //returning back to previous screen
  screen=="fav"?displayOnlyFavList():backToHome();

}


//event listener
const handleClickListener=(e)=>{
  console.log(e.target);
  console.log(e.target.id);


  // //function after checking/unchecking
  // if(e.target.className=="checkout")
  //      addToFavList(e.target.id);
    
  //eventListener after liking a hero
  if(e.target.id.indexOf("like")>-1)
      {
      let checkbox=document.getElementById(e.target.dataset.id);
      if(checkbox.checked==1)
      checkbox.checked=false;
      else
      checkbox.checked=true;
      addToFavList(e.target.dataset.id);
        
  }
}



async function initialise(){
await fetchAPI();
document.addEventListener('click', handleClickListener);

}
initialise();



