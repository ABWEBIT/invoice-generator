'use strict';
/* date */
let iDate = () =>{
  let nDate,nowDate,nowDay,nowMonth,nowYear,invNowDate,invNewDate;
  invNowDate = document.getElementById('invNowDate');
  invNewDate = document.getElementById('invNewDate');
  nDate = new Date();

  nowDate = nDate;
  nowDay = nowDate.getDate();
  nowMonth = nowDate.getMonth()+1;
  nowYear = nowDate.getFullYear();

  if(nowDay.toString().length === 1){nowDay = '0'+nowDay};
  if(nowMonth.toString().length === 1){nowMonth = '0'+nowMonth};
  invNowDate.value += nowDay+'/'+nowMonth+'/'+nowYear;

  nDate.setDate(nDate.getDate()+7);
  nowDate = nDate;
  nowDay = nowDate.getDate();
  nowMonth = nowDate.getMonth()+1;
  nowYear = nowDate.getFullYear();

  if(nowDay.toString().length === 1){nowDay = '0'+nowDay};
  if(nowMonth.toString().length === 1){nowMonth = '0'+nowMonth};
  invNewDate.value += nowDay+'/'+nowMonth+'/'+nowYear;
};
iDate();

/* format numbers */
let num2Dec = document.getElementsByClassName('2Dec');
let format2Dec = () =>{
  for(let el of num2Dec){
    if(el.value){
      el.value = parseFloat(Math.round(el.value * 100) / 100).toFixed(2);
    }
    else if(el.textContent){
      el.textContent = parseFloat(Math.round(Number(el.textContent) * 100) / 100).toFixed(2);
    };
  };
};
format2Dec();

/* generate invoice number */
let invoiceNumber = () =>{
  let iNumber,d,yer,mth,day,hrs,min,sec,mil;
  iNumber = document.getElementById('iNumber');
  d   = new Date();
  yer = d.getFullYear(); // not used
  mth = d.getMonth()+1;
  day = d.getDate();
  hrs = d.getHours();
  min = d.getMinutes();
  sec = d.getSeconds();
  mil = d.getMilliseconds();

  if(mth.toString().length === 1){mth = '0'+mth};
  if(day.toString().length === 1){day = '0'+day};
  if(hrs.toString().length === 1){hrs = '0'+hrs};
  if(min.toString().length === 1){min = '0'+min};
  if(sec.toString().length === 1){sec = '0'+sec};
  mil = mil.toString().slice(0,1);
  iNumber.innerHTML = mth+day+hrs+min+sec+mil;
  document.title = mth+day+hrs+min+sec+mil;
};
invoiceNumber();

/* calculation */
let calculation = () =>{
  let item = document.getElementsByClassName('res');

  for(let el of item){
    let q,p,s;
    q = el.querySelector('.iQua').value;
    p = el.querySelector('.iPri').value;
    if(q && p){
      s = parseFloat(Math.round((Number(q) * Number(p)) * 100) / 100).toFixed(2);
      el.querySelector('.iSum').value = s;
    }
    else el.querySelector('.iSum').value = '';
    let sumAll = document.querySelectorAll('.iSum');
    let cSum = 0;
    for(let el of sumAll){
      cSum += Number(el.value);
    };
    let iTax = document.getElementById('iTax').value;
    if(Number(iTax) < 1) iTax = 0;
    let cTax = (cSum / 100) * iTax;
    document.getElementById('cTax').innerHTML = cTax;
    let cTot = cSum + cTax;
    document.getElementById('cTot').innerHTML = cTot;
  };
  format2Dec();
};

let bindCalc = function (){
  let fCalc = document.getElementsByClassName('fCalc');
  for(let el of fCalc){
    el.addEventListener('input', function(){
      calculation();
    });
  };
};
bindCalc();

/* print */
let invPrt = document.getElementById('invPrt');
invPrt.addEventListener('click',function(){
  window.print();
  return false;
});

/* refresh invoice number */
let numRef = document.getElementById('numRef');
numRef.addEventListener('click',function(){
  invoiceNumber();
});

/* remove row */
let removeEvent = function (){
  let removeRow = document.getElementsByClassName('remove');
  for(let el of removeRow){
    el.addEventListener('click', function(){
      this.parentElement.remove();
      calculation();
    });
  };
};

/* add row */
let rowAdd = document.getElementById('rowAdd');
let bMid = document.getElementById('bMid');

rowAdd.addEventListener('click',function(){
  let template =`
    <div class="item res">
      <div class="remove">
        <svg class="icon">
          <line x1="10%" y1="10%" x2="90%" y2="90%" />
          <line x1="10%" y1="90%" x2="90%" y2="10%" />
        </svg>            
      </div>
      <div class="name" contenteditable="true">
        Описание...
      </div>
      <div class="units">
        <input type="text" class="iUni" placeholder="шт"/>
      </div>
      <div class="quantity">
        <input type="number" class="iQua fCalc" placeholder="0"/>
      </div>
      <div class="price">
        <input type="number" class="iPri fCalc" placeholder="0.00"/>
      </div>
      <div class="sum">
        <input type="number" class="iSum 2Dec" placeholder="0.00"/>
      </div>
    </div>
  `;
  bMid.insertAdjacentHTML('beforeend', template);
  bindCalc();
  format2Dec();
  removeEvent();
});

/* currency */
let currency = function (){
  let pCur = document.getElementsByClassName('pCur');
  for(let el of pCur){
    el.innerHTML = document.getElementById('iCur').value;
  };
};
currency();

let bCur = document.getElementById('iCur');
bCur.addEventListener('input',function(){
  currency();
});

/* tax */
let tax = function (){
  let pTax = document.getElementById('pTax');
  let iTax = document.getElementById('iTax').value;
  if(iTax > 0){
    document.getElementById('rTax').classList.add('on');
    pTax.innerHTML = iTax;
  }
  else{
    document.getElementById('rTax').classList.remove('on');
    pTax.innerHTML = '';
  };
};
tax();

let bTax = document.getElementById('iTax');
bTax.addEventListener('input',function(){
  tax();
  calculation();
});
