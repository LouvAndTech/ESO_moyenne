// ==UserScript==
// @name        Moyenne ESEO
// @require  http://code.jquery.com/jquery-1.9.1.js
// @description This is your new file, start writing code
// @match        https://reseaueseo.sharepoint.com/sites/etu/Pages/Mes-notes*
// ==/UserScript==

//txt-note

(async function() {
    console.log(">>>>>>>> USER SCRIPT START HERE ! ")
    $(document).ready(function(){
        console.log(">>>>>>>>>>>> Page loaded")
        //Faire apparaitre un bouton
        let header = document.getElementsByClassName('e_breadcrumb')[0];

        let div = document.createElement('div');
        div.style = 'display:flex;align-item:center;margin-top:20px;';

        // Create the button element
        let button = document.createElement('a');
        button.textContent = 'Calculer ma moyenne';

        // Optional: Add styling or other attributes to the button
        button.style = 'margin: 0;padding: 4px 10px;background-color: #0066a7;color: #fff;text-decoration: none;font-weight: 700;font-size: 13px;cursor: pointer;';

        // Add hover effect
        button.onmouseover = function() {
            this.style.textDecoration = 'underline';
        }
        button.onmouseout = function() {
            this.style.textDecoration = 'none';
        }

        let result = document.createElement('span');
        result.textContent = '';
        result.style='display: flex;align-items: center;margin-left: 10px;font-weight: 700;'

        // Append the button to the header element
        div.appendChild(button);
        div.appendChild(result);
        header.appendChild(div);

        // Add click event to the button
        button.onclick = async function() {
            let moy = await computeMoy();
            if (!isNaN(moy)){
                result.textContent = 'Moyenne : ' + moy.toFixed(2) + "/20";
            }else{
                result.textContent = 'Moyenne not defined'
            }
        }
    });
})();

async function computeMoy(){
    'use strict';
    console.log(">>>>>>> Computing grades moy")
    let sum = 0;
    let sumCoef = 0;
    await $(".txt-note").each(function(index, element){
        //extract the grade
        var gradeEl = $(this).find('span');
        let grade = -1; // Set to -1 if there is no grade
        if (gradeEl.length > 0) {
            if (/^[+-]?\d+([.,]\d+)?$/.test(gradeEl.text())){ // If there is a grade retrieve it
                grade = parseFloat(gradeEl.text().replace(',','.'));
            }
         } else { //Prevent locking
            return;
         }
        
        //Extract coeficient 
        var match = $(this).text().match(/\(Coef (\d+(\.\d+)?)\)/);
        let coef = 0;
        if (match && match[1]) {
            coef = parseFloat(match[1]);
        }
        
        // Add to sum
        if (grade != -1){
            sum += (grade*coef);
            sumCoef += coef;
        }else{
            return;
        }
    });
    
    //Compute the whole moy
    let moy = sum/sumCoef
    return moy;
    
}