var budgetController=(function(){
    
    var Expense=function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var Income=function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var calcTotal= function(type){
            var sum=0;
            data.items[type].forEach(function(current){
                sum += parseInt(current.value);
            });
            data.total[type]=sum;
        };
    
    var data={
        items:{
        exp: [],
        inc: []
    },
         total:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }
    return{
        addItem: function(type, des,val){
            //create new id number
            if (data.items[type].length > 0) {
            ID=data.items[type][data.items[type].length-1].id +1;
            }
            else{
                ID=0;
            }
            
            
            //create new item based on inc or exp
            if (type==='exp'){
                newItem=new Expense(ID,des,val);
            }else if (type==='inc'){
                newItem=new Income(ID,des,val);
            }
            
            //push it into the arrays
            data.items[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type, id){
            var ids, index
             ids= data.items[type].map(function(current){
                return current.id;
            });
            
        var index=ids.indexOf(id);
            
            if(index !== -1){
                data.items[type].splice(index,1);
            }
        },
        
        calcBudget:function(){
          calcTotal('inc');
          calcTotal('exp');
          data.budget=data.total.inc-data.total.exp;
            if(data.total.exp>0 && data.total.inc>0){
            data.percentage=Math.round(data.total.exp/data.total.inc*100);
            }else{
                data.percentage=-1;
            }
        },
        getBudget:function(){
            return{
                tot: data.budget,
                totInc:data.total.inc,
                totExp: data.total.exp,
                per: data.percentage
            }
        },
        
        testing: function(){
        console.log(data);
    }
    };
})();


var UIController = (function(){

    return{
        getInput:function(){
            return{
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: parseFloat(document.querySelector('.add__value').value)
            }
        },
        addListItem: function(obj,type){
            
            if (type==='inc'){
            var ele='.income__list';
            var html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type==='exp'){
                ele='.expenses__list';
            var html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            var newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%desc%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);
        
            document.querySelector(ele).insertAdjacentHTML('beforeend',newHtml);
        },
        
        deleteListItem:function(selectorID){
          var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearList:function(){
            var field1=document.querySelectorAll('.add__description, .add__value ');
            var field1Arr=Array.prototype.slice.call(field1);
            field1Arr.forEach(function(current,index,array){
            current.value="";
            });
            field1Arr[0].focus();  
        }
    }
    
})();


var controller = (function(budgetCtrl, UICtrl){
    
var setupEventListeners=function(){
document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)
document.addEventListener('keypress',function(event){
    if (event.keyCode===13 || event.which===13){
        ctrlAddItem();
    }
});
  document.querySelector('.container').addEventListener('click', ctrlDeleteItem);  
};

var updateBudget=function(){
    //calc and update the budget up there in this function
    budgetCtrl.calcBudget();
    var budget=budgetCtrl.getBudget();
    console.log(budget);
    document.querySelector('.budget__value').innerHTML= "$"+budget.tot;
    document.querySelector('.budget__income--value').innerHTML= budget.totInc;
    document.querySelector('.budget__expenses--value').innerHTML= budget.totExp;
    if(budget.per>0)document.querySelector('.budget__expenses--percentage').innerHTML= budget.per+"%";
       else document.querySelector('.budget__expenses--percentage').innerHTML= "--";
}
var ctrlAddItem=function(){

    var input=UICtrl.getInput();
    if (input.description!=="" && !isNaN(input.value) && input.value>0 ){
    var newItem= budgetCtrl.addItem(input.type,input.description, input.value);
    
    UICtrl.addListItem(newItem,input.type);
    UICtrl.clearList();
    
    updateBudget();
    }
};
    
var ctrlDeleteItem=function(event){
    var itemID, splitID, type,ID;
     itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
         splitID = itemID.split('-');
         type=splitID[0];
         ID=parseInt(splitID[1]);
        
        budgetCtrl.deleteItem(type,ID);
        UICtrl.deleteListItem(itemID);
        updateBudget();
    }
};
return{
    init: function(){
        setupEventListeners();
    }
}; 
    
})(budgetController, UIController);

controller.init();