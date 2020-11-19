//載入遠端json
var odata = new XMLHttpRequest();
odata.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
odata.send(null);

odata.onload = function(){
  odata = JSON.parse(odata.responseText);
  data = odata.result.records;
  listShow()
}

//處理下拉式選單顯示(第一次)
function listShow(){
  var arrZone = [];//建一個空陣列放 區域
  for(var zo = 0 ; zo < data.length ; zo++){
    arrZone.push(data[zo].Zone);
  };

  //把重複的過濾掉
  arrZone = arrZone.filter(function(e, index, arr){
    return arr.indexOf(e) === index;
  });
  var selectOption = '';
  for(var n = 0; n<arrZone.length;n++){
    selectOption+= `<option value="${arrZone[n]}">${arrZone[n]}</option>`;
    selectName.innerHTML = '<option>--請選擇行政區--</option>'+selectOption;
  };
}

//處理同步按鈕選擇的區域(有動作時)
function updataList(txt){
  var arrZone = [];//建一個空陣列放 區域
  for(var zo = 0 ; zo < data.length ; zo++){
    arrZone.push(data[zo].Zone);
  };

  //把重複的過濾掉
  arrZone = arrZone.filter(function(e, index, arr){
    return arr.indexOf(e) === index;
  });

  selectOption = '';//先清空option
  for(var n = 0; n < arrZone.length ; n++){
    if(txt == arrZone[n]){
      selectOption+= `<option value="${arrZone[n]}" selected>${arrZone[n]}</option>`;
    }else{
      selectOption+= `<option value="${arrZone[n]}">${arrZone[n]}</option>`;
    }
    selectName.innerHTML = '<option>--請選擇行政區--</option>'+selectOption;
  };
}

// 改文字用
var titleMain = document.querySelector('.title-main');
var list = document.querySelector('.list');


var selectName = document.getElementById('selectName'); //下拉式選單
// var menuBtn1 = document.querySelector('.menuBtn1'); //苓雅區
// var menuBtn2 = document.querySelector('.menuBtn2'); //三民區
// var menuBtn3 = document.querySelector('.menuBtn3'); //新興區
// var menuBtn4 = document.querySelector('.menuBtn4'); //茂林區
var menuBtn = document.querySelectorAll('.menu input'); //將按鈕觸動再簡化


selectName.addEventListener('change',selectNamechange);
// menuBtn1.addEventListener('click',menuBtn1click);
// menuBtn2.addEventListener('click',menuBtn2click);
// menuBtn3.addEventListener('click',menuBtn3click);
// menuBtn4.addEventListener('click',menuBtn4click);
for(var btn = 0 ; btn < menuBtn.length ; btn++){
  menuBtn[btn].addEventListener('click',menuBtnclick);
}


function selectNamechange(e){
  var txt = selectName.value;
  txtList(txt);
}
// function menuBtn1click(e){
//   var txt = e.target.defaultValue;
//   txtList(txt);
// }
// function menuBtn2click(e){
//   var txt = e.target.defaultValue;
//   txtList(txt);
// }
// function menuBtn3click(e){
//   var txt = e.target.defaultValue;
//   txtList(txt);
// }
// function menuBtn4click(e){
//   var txt = e.target.defaultValue;
//   txtList(txt);
// }
function menuBtnclick(e){
  var txt = e.target.defaultValue;
  txtList(txt);
}

/*
Picture1   = 圖片
Name = 名稱
Zone = 區域
Opentime   = 開放時間
Add  = 地址
Tel  = 電話
Ticketinfo = 免費參觀
*/

function txtList(txt){  
  titleMain.innerHTML = txt;
  var str = '';
  for (var i = 0 ; i < data.length ; i++){
    if( data[i].Zone == txt ){
      var ticTxt = '';//如果沒有免費參觀的就不顯示
      if(data[i].Ticketinfo !== ''){
        ticTxt = '<img src="img/icons_tag.png"> '+data[i].Ticketinfo;
      }
      str+=`
      <div class="list-main">
        <div class="img" style="background-image: url(${data[i].Picture1});">
          <div class="img-title">
            <p class="title-24px">${data[i].Name}</p>
            <p class="title-16px">${data[i].Zone}</p>
            <p style="clear:both"></p>
          </div>
        </div>
        <div class="conten">
          <p class="clock"><img src="img/icons_clock.png"> ${data[i].Opentime}</p>
          <p class="pin"><img src="img/icons_pin.png"> ${data[i].Add}</p>
          <p class="phone"><img src="img/icons_phone.png"> ${data[i].Tel}</p>
          <p class="tag">${ticTxt}</p>
        </div>
      </div>`;
      list.innerHTML = str;
    }
    if(str == ''){
      list.innerHTML = '此區域無資料';
    }
  }
  updataList(txt);//同步更新下拉選單選的區域
}