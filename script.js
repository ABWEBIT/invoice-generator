'use strict';
/* date */
(()=>{
  let d,year,month,day;
  d = new Date();
  let gen = () =>{
    year = d.getFullYear();
    month = d.getMonth()+1;
    day = d.getDate();
    day = day.toString().length === 1 ? '0'+day : day;
    month = month.toString().length === 1 ? '0'+month : month;
  };
  gen();
  document.getElementById('invNowDate').value += day+'/'+month+'/'+year;
  d.setDate(d.getDate()+7);
  gen();
  document.getElementById('invNewDate').value += day+'/'+month+'/'+year;
})();

/* format numbers */
let num2Dec = document.getElementsByClassName('2Dec');
let format2Dec = () =>{
  for(let el of num2Dec){
    if(el.value) el.value = parseFloat(Math.round(el.value * 100) / 100).toFixed(2);
    else if(el.textContent) el.textContent = parseFloat(Math.round(Number(el.textContent) * 100) / 100).toFixed(2);
  };
};
format2Dec();

/* invoice number */
let invoiceNumber = () =>{
  let d,n,year,month,day,hours,minutes,seconds,milliseconds;
  d = new Date();
  year = d.getFullYear(); // not used
  month = d.getMonth()+1;
  day = d.getDate();
  hours = d.getHours();
  minutes = d.getMinutes();
  seconds = d.getSeconds();
  milliseconds = d.getMilliseconds();
  month = month.toString().length === 1 ? '0'+month : month;
  day = day.toString().length === 1 ? '0'+day : day;
  hours = hours.toString().length === 1 ? '0'+hours : hours;
  minutes = minutes.toString().length === 1 ? '0'+minutes : minutes;
  seconds = seconds.toString().length === 1 ? '0'+seconds : seconds;
  milliseconds = milliseconds.toString().slice(0,1);
  n = month+day+hours+minutes+seconds+milliseconds;
  document.getElementById('iNumber').innerHTML = n;
  document.title = n;
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

let bindCalc = () =>{
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
let removeEvent = () =>{
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
        <input type="text" class="iUni" placeholder="шт">
      </div>
      <div class="quantity">
        <input type="number" class="iQua fCalc" placeholder="0">
      </div>
      <div class="price">
        <input type="number" class="iPri fCalc" placeholder="0.00">
      </div>
      <div class="sum">
        <input type="number" class="iSum 2Dec" placeholder="0.00">
      </div>
    </div>
  `;
  bMid.insertAdjacentHTML('beforeend', template);
  bindCalc();
  format2Dec();
  removeEvent();
});

/* currency */
let currency = () =>{
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
let tax = () =>{
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

/* calendar */
let eID,calendar,date,cYear,cMonth,cDay,totalDays,firstDay,daysList,init = 0;

const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Обктябрь','Ноябрь','Декабрь'];
const daysNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const navButtons = ['calendarPrev','calendarNext'];

let initCalender = () =>{
  let template = `
  <section id="calender" class="noPrint">
    <div id="calendarTop">
      <div id="calendarPrev">&lang;</div>
      <div id="month"></div>
      <div id="calendarNext">&rang;</div>
    </div>
    <div id="daysNames"></div>
    <div id="days"></div>
    <div id="calendarClose">ЗАКРЫТЬ</div>
  </section>`;
  document.querySelector('#hMid .block').insertAdjacentHTML('beforeend', template);

  for(let d of daysNames){
    let div = document.createElement('div');
    div.innerText = d;
    document.getElementById('daysNames').appendChild(div);
  };
  for(let b of navButtons){
    document.getElementById(b).addEventListener('click',function(){
      if(b === 'calendarPrev'){
        cMonth--;
        if(cMonth < 0){cMonth = 11;cYear --;};
      }
      else if(b === 'calendarNext'){
        cMonth++;
        if(cMonth > 11){cMonth = 0;cYear++;};
      }
      renderCalender();
    });
  };
  document.getElementById('calendarClose').addEventListener('click', function(){
    init = 0;
    document.getElementById('calender').remove();
  });

  date = new Date();
  cYear = date.getFullYear();
  cMonth = date.getMonth();
  init = 1;
};

let renderCalender = (e) =>{
  daysList = [];

  if(init === 1){
    document.getElementById('month').innerHTML = '';
    document.getElementById('days').innerHTML = '';
  };

  if(typeof e !== 'undefined') eID = e.id;
  let monthDays = (y,m) => new Date(y,m+1,0).getDate();
  totalDays = monthDays(cYear,cMonth);
  document.getElementById('month').innerText = `${monthNames[cMonth]}, ${cYear}`;
  firstDay = new Date(cYear,cMonth,0).getDay();
  for(let i = 0; i < firstDay; i++){
    daysList.push(0);
  };
  for(let i = 1; i <= totalDays; i++){
    daysList.push(i);
  };
  for(let d of daysList){
    let b = document.createElement('div');
    if(cMonth == date.getMonth() && d == date.getDate() && cYear == date.getFullYear()){
      b.classList.add('active');
    };
    if(d === 0){
      b.innerText = '';
      b.classList.add('empty');
    }
    else b.innerText = `${d}`;
    document.getElementById('days').appendChild(b);
  };

  let iDay = document.getElementById('days').getElementsByTagName('div');
  for(let el of iDay){
    el.addEventListener('click', function(){
      let fDay,fMonth,fYear;
      fDay = el.textContent;
      fMonth = cMonth + 1;
      fYear = cYear;

      if(fDay.toString().length === 1) fDay='0'+fDay;
      if(fMonth.toString().length === 1) fMonth='0'+fMonth;

      let formatDate = [fDay,fMonth,fYear].join('/');
      document.getElementById(eID).value = formatDate;
      document.getElementById('calender').remove();
      init = 0;
    });
  };
};

let datePick = document.getElementsByClassName('datePick');
for(let el of datePick){
  el.addEventListener('click', function(){
    if(init === 0) initCalender();
    renderCalender(el);
  });
};
