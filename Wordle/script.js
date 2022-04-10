//cant use the same word twice
//local storage me words guessedWords store -> preserve game state, store word in local storage so that on refreshing you dont get a new word
// -> get a new word only if you have lost or won 
//color the keyboard keys



document.addEventListener("DOMContentLoaded",()=>{
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 0;

    let word;

    

    function getNewWord()
    {    
       
         fetch(
           `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
           {
             method: "GET",
             headers: {
               "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
               "X-RapidAPI-Key":
                 "a28cddfc98mshb64b5b3fde28c62p1fb800jsneeb4e362d124",
             },
           }
         )
           .then((response) => {
             return response.json();
           })
           .then((res) => (word = res.word))
           .catch((err) => console.error(err));
           

    }
    console.log(word)

   

    


    const keys = document.querySelectorAll(".keyboard-row button");

    function getTileColor(currentWord,wordMap,tiles)
    {   
        //grey -> rgb(58,58,60)
        //green -> rgb(83,141,78)
        //orange -> rgb(181,159,59)
        let letterInThatPosition;
        let isCorrectPosition;
        let isCorrectLetter;
        console.log(wordMap);
        for(let index = 0;index < currentWord.length;index++)
        {
             letterInThatPosition = currentWord.charAt(index);
             isCorrectPosition = word.charAt(index).toLowerCase() === letterInThatPosition.toLowerCase();
             //isCorrectLetter = word.toUpperCase().includes(letterInThatPosition.toUpperCase());
             if (isCorrectPosition)
             { 
               console.log(index);
               wordMap[letterInThatPosition] -= 1;
               tiles[index] = "rgb(83,141,78)";
             }
            //  else if (!isCorrectLetter) 
            //  { 
            //    tiles[index] = "rgb(58,58,60)";
            //  } 

        }
        //console.log(wordMap);
        for(let index = 0; index < currentWord.length; index++)
        {   
            console.log(
              index,
              tiles[index],
              wordMap[currentWord.charAt(index).toLowerCase()]
            );
            if (tiles[index] !== "rgb(83,141,78)" && wordMap[currentWord.charAt(index).toLowerCase()] > 0) 
            { 
              tiles[index] = "rgb(181,159,59)";
              wordMap[currentWord.charAt(index)] -= 1;
            }
            else if (!tiles[index]) 
            { 
               //console.log("grey , letter exists but already covered",index);
               tiles[index] = "rgb(58,58,60)";
            }

        }
        
        return tiles;
        

    }


    function handleSubmitWord()
    {   
        console.log(word);
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr.length !== 5)
        {
            window.alert("Word must be 5 letters");
            return;
        }

        const currentWord = currentWordArr.join("");

        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
            "X-RapidAPI-Key":
              "a28cddfc98mshb64b5b3fde28c62p1fb800jsneeb4e362d124",
          },
        }).then((res) =>{
            if(!res.ok) {
                throw Error()
            }
            let wordMap = {};
            let count;
            for (let i = 0; i < word.length; i++) {
              ch = word.charAt(i);
              count = wordMap[ch];
              wordMap[ch] = count ? count + 1 : 1;
            }

            let tiles = [];
            tiles.length = 5;
            tiles = getTileColor(currentWord, wordMap, tiles);

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
              setTimeout(() => {
                //const tileColor = getTileColor(letter,index);
                const tileColor = tiles[index];
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
              }, interval * index);
            });

            guessedWordCount += 1;

            if (currentWord === word) {
              window.alert("Congratulations!");
            }

            if (guessedWords.length === 6) {
              window.alert(
                `Sorry, you have no more guesses! The word is ${word}`
              );
            }

            guessedWords.push([]);
        }).catch(() => {
            window.alert("Entered word is invalid!")
        })

        
    }


    for(let i=0; i < keys.length; i++)
    {   
        keys[i].onclick = ({target}) => {
            const key = target.getAttribute("data-key");
            if(key === "enter")
            {   
                handleSubmitWord();
                return;
            }

            if(key === 'del')
            {
                handleDeleteLetter();
                return;
            }
            
            updateGuessedWords(key);

            
            
        };
    }

    function handleDeleteLetter()
    {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr;
        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = '';
        availableSpace = availableSpace - 1;
    }

    function getCurrentWordArr()
    {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];

    }

    function updateGuessedWords(letter) 
    {
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr && currentWordArr.length < 5)
        {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace)); //we gave numbers to each square
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;

        }

    } 

    function createSquares()
    {
        const gameBoard = document.getElementById("board");
        for(let index = 0;index < 30;index++)
        {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id",index + 1);
            gameBoard.appendChild(square);

        }
    }



}
);