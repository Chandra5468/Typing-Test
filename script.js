//Random Quotes Api url

const quoteApiurl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote")
const userInput = document.getElementById("quote-input")

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
async function renderNewQuote(){

    // Fetch contents from url
    const response = await fetch(quoteApiurl);

    //store response
    let data = await response.json();

    // console.log(data)
    //access quote
    quote = data.content
    // console.log(quote)

    // Array of characters in the quote
    let arr = quote.split("").map((value)=>{
        //wrap the characters in a span tag
        return "<span class='quote-chars'>"+value+"</span>"
    });

    //join array for displaying 
    quoteSection.innerHTML += arr.join("");
    //console.log(arr)



}

//Logic for comparing input words with quote
userInput.addEventListener("input",()=>{
    let quoteChars = document.querySelectorAll(".quote-chars");
    // console.log(quoteChars)

    //Create an array from received span tags
    quoteChars = Array.from(quoteChars)

    // Array of user input characters
    let userInputCharacters = userInput.value.split("");

    // Loop through each character in quote
    quoteChars.forEach((char,index)=>{
        //chec if char(quotecharacter) = userINputCharacter[index](inputCharacter)
        if(char.innerText == userInputCharacters[index]){
            char.classList.add("success");
        }
        // If user hasn't entered anything or backspaced
        else if(userInputCharacters[index] == null){
            // Remove class if any
            if(char.classList.contains("success")){
                char.classList.remove("success")
            }else{
                char.classList.remove("fail")
            }
        }
        // If user enters wrong character
        else{
            //Checks if we already have added fail class
            if(!char.classList.contains("fail")){
                //increment and display mistakes
                mistakes +=1;
                char.classList.add("fail")
            }
            document.getElementById("mistakes").innerText = mistakes;

        }

        // Returns true if all the characters are entered correctly

        let check = quoteChars.every((element)=>{
            return element.classList.contains("success");
        });
        //ENd test if all characters are correct
        if(check){
            displayResult();

        }
    })
})

//Update Timer on screen
function updateTimer(){
    if(time == 0){
        //End test if timer reaches 0
        displayResult()
    }else{
        document.getElementById("timer").innerText = --time + 's'
    }
}


//Sets timer
const timeReduce = ()=>{
    time = 60;
    timer = setInterval(updateTimer,1000)
}

//End Test
const displayResult = ()=>{
    //display result div
    document.querySelector(".result").style.display = 'block'
    clearInterval(timer);
    document.getElementById("stop-test").style.display = 'none'
    userInput.disabled= true;
    let timeTaken = 1;
    if(time!=0){
        timeTaken = (60- time)/100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + 'wpm';
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) +'%'
}



//Start Test
const startTest = () =>{
    mistakes = 0;
    timer = '';
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = 'none';
    document.getElementById("stop-test").style.display='block'

}

window.onload = ()=>{
    userInput.value = "";
    document.getElementById("start-test").style.display = 'block';
    document.getElementById("stop-test").style.display = 'none';
    userInput.disabled = true;
    renderNewQuote();
}