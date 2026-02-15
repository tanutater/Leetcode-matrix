// 
document.addEventListener('DOMContentLoaded',function(){
    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");

    // returns true or falses based on regex
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty ")
            return false;
        }
        const regex =/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid username ");
        }
        return isMatching;
    }
    
    async function fetchUserDetails(username) {
        const url= `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent="Searching....";
            // statsContainer.style.display="block";

            searchButton.disabled=true;
            const response= await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log("Logging data",parsedData);

            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data found</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
            statsContainer.style.display="block"
            // usernameInput.value="";
            // usernameInput.placeholder="Enter your username";
        }

    }

    function updateProgress(solved,total,label,circle){
        // statsContainer.style.display="block";
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    async function displayUserData(parsedData){
        const totalQ=parsedData.totalQuestions;
        const totalHardQuestions=parsedData.totalHard;
        const totalEasyQuestions=parsedData.totalEasy;
        const totalMediumQuestions=parsedData.totalMedium;
        const totalQSolved=parsedData.totalSolved;
        const totalHardQuestionsSolved=parsedData.hardSolved;
        const totalEasyQuestionsSolved=parsedData.easySolved;
        const totalMediumQuestionsSolved=parsedData.mediumSolved;
        updateProgress(totalEasyQuestionsSolved,totalEasyQuestions,easyLabel,easyProgressCircle); 
        updateProgress(totalMediumQuestionsSolved,totalMediumQuestions,mediumLabel,mediumProgressCircle); 
        updateProgress(totalHardQuestionsSolved,totalHardQuestions,hardLabel,hardProgressCircle); 

        const cardData=[
            {label:"Total Solved",value:parsedData.totalSolved},
            {label:"Total Questions",value:parsedData.totalQuestions},
            {label:"Overall Contribution points",value:parsedData.contributionPoints},
            {label:"Overall Ranking",value:parsedData.ranking},
        ];
        cardStatsContainer.innerHTML=cardData.map(
            data=>
                 `
                    <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>
                `
        ).join("")
        console.log("Card data ",cardData);
        console.log(totalQ);
        console.log(totalEasyQuestions);
        console.log(totalEasyQuestionsSolved);
        console.log(totalMediumQuestions);
        console.log(totalMediumQuestionsSolved);
        console.log(totalHardQuestions);
        console.log(totalHardQuestionsSolved);
    }

    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("Logging user name : ",username)
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})