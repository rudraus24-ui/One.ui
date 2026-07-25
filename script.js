const button = document.getElementById("openBtn");
const gift = document.getElementById("gift");
const message = document.getElementById("message");

button.addEventListener("click", () => {

    gift.style.display = "block";

    button.style.display = "none";

    typeMessage();

});

function typeMessage(){

    const text =
    "🎉 Happy Birthday Didi ❤️ Wishing you endless happiness, success, good health and lots of smiles. May all your dreams come true. Have an amazing birthday! 🎂✨";

    let i = 0;

    message.innerHTML = "";

    const typing = setInterval(() => {

        message.innerHTML += text.charAt(i);

        i++;

        if(i >= text.length){

            clearInterval(typing);

        }

    },40);

}
