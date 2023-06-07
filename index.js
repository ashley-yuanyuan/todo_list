import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove,update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


let oldList =""
let itemList =""


const appSettings = {
    databaseURL: "https://test-8a5dd-default-rtdb.firebaseio.com/"
}


const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "todoList")

const inputFieldEl = document.getElementById("input-field")
const dateFieldEl = document.getElementById("date-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

const toggleHide = document.getElementById("switch-input")

//const sortBy = document.querySelector('#sort-by')

const sortBy = document.getElementById("sort-by")

const findBy = document.getElementById("find-by-date")

const findBtn = document.getElementById("find-btn")

const resetBtn = document.getElementById("reset-btn")

const switchHide =  document.getElementById("switch-input")



switchHide.addEventListener("change",function(){
  

    if(switchHide.checked){
        oldList = [...itemList]
        
        itemList = itemList.filter(a=> a[1].checked != 1)
        
    } else {
        itemList = [...oldList]
        
    }

    renderList(itemList)

})




findBtn.addEventListener("click", function(){
   
    
    let filterDate = findBy.value
   

    let filterList = itemList.filter(function(item){
        let dt =  item[1].date

        return (dt == filterDate);

    
    })


    renderList(filterList)
    
})

resetBtn.addEventListener("click", function(){

    renderList(itemList);


})


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    let date = dateFieldEl.value
    const inputTotal = {"value":inputValue, "checked":0, "date":date}

    push(shoppingListInDB, inputTotal)
    console.log("success")

    clearInputFieldEl()
})




sortBy.addEventListener("change",function(){
    renderList(itemList);

})





onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        
        let itemsArray = Object.entries(snapshot.val());
        itemList = itemsArray /* reference */

        renderList(itemsArray);
    
       
    } else {
        shoppingListEl.innerHTML = "No items"
    }
})


function renderList(itemsArray){
     
     clearShoppingListEl()

     if(itemsArray.length === 0){
        shoppingListEl.innerHTML = "No items"

        

     } else {

     
     if(sortBy.selectedIndex == 0){//alpha
        itemsArray = itemsArray.sort((a,b) => a[1].value > b[1].value ? 1: -1)
    
        } else {//deadline
           itemsArray = sortByDate(itemsArray);
        }

      
       
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToShoppingListEl(currentItem)
    }
}


}



function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}



//use sort

function sortByDate(itemsArray){
   const sortedArray = itemsArray.sort(function(a,b){
    let da = new Date(a[1].date)
    let db = new Date(b[1].date)

  
    if(da >= db){
      
        return 1;
    }else {
        return -1;
    }

    })
   
    
    return sortedArray;


}





function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1].value
    let deadline = item[1].date
    let checkState = item[1].checked



    let newEl = document.createElement("li")



    let newBox = document.createElement("input")
    newBox.type="checkbox"
    newBox.id = "checkbox"
    newBox.name = itemID
    newBox.value="Java"

    let label = document.createElement('label')
    label.htmlFor = 'checkbox';
    label.textContent = `${itemValue}   ${deadline}`;
    label.id = "label" + itemID

    

    


    newEl.append(newBox)
    newEl.appendChild(label);

    if(checkState == 1){
        label.style.textDecoration ="line-through";
        label.style.color = "#808080";
        newBox.checked = true;
       
    }

    //TODO: fix double-click bug

    newBox.addEventListener("change", function() {
        let exactLocationOfItemInDB = ref(database, `todoList/${itemID}`)

            if(newBox.checked){
                label.style.textDecoration ="line-through";
                label.style.color = "#808080";
               update(exactLocationOfItemInDB,{checked: 1 })
                //remove(exactLocationOfItemInDB)

            } else {
                update(exactLocationOfItemInDB,{checked: 0 })
                label.style.textDecoration = null;
                label.style.color = "#000000";
            }



    })




   
    shoppingListEl.append(newEl)
}




