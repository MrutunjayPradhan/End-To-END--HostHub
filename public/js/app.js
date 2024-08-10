const profile = document.querySelector("#profile");
const details = document.querySelector("#details");
profile.addEventListener("click",()=>{
    details.classList.toggle("none")
    console.log("button clicked")
})