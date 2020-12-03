/*
 以下針對助教提出的可加強地方做改寫
1. json更改為抓遠端資料
2. 載入網頁時 預設抓 「美濃區」 的資料
3. 熱門地區調整為用判斷 nodeName 是否為 INPUT 標籤處理
4. 分頁功能
5. goTop ICON...抱歉忽視了它的存在，已更新只用簡單的A標籤href='#'
 */
// let、const，最大差異在於後者為唯獨變數無法變動

//載入遠端json
let odata = new XMLHttpRequest();
odata.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
odata.send(null);

odata.onload = function(){
  odata = JSON.parse(odata.responseText);
  data = odata.result.records;
  txtList('美濃區');//預設網頁載入時
}
/* 助教的寫法
fetch('https://raw.githubusercontent.com/hsiangfeng/JSHomeWork/master/JSON/datastore_search.json',{method:'get'})
.then((response)=>{
    return response.json();
}).then((data)=>{
  tempItem = data.result.records;
  getMenus(tempItem);
})
*/


let titleMain = document.querySelector('.title-main');
let list = document.querySelector('.list');
let pageid = document.querySelector('.pageid')
let sdata = [];//建一個空陣列放篩選後的區域資料

let selectName = document.getElementById('selectName'); //下拉式選單

// 將熱門區按鈕觸動簡化
// 寫法一
// var menuBtn = document.querySelectorAll('.menu input'); 
// for(var btn = 0 ; btn < menuBtn.length ; btn++){
//   menuBtn[btn].addEventListener('click',menuBtnclick);
// }
// function menuBtnclick(e){  
//   var txt = e.target.defaultValue;
//   txtList(txt);
// }

// 寫法二
let menuBtn = document.querySelector('.menu');
function menuBtnclick(e){
  if(e.target.nodeName == 'INPUT'){
    let txt = e.target.defaultValue;
    txtList(txt);
  }
}

selectName.addEventListener('change',selectNamechange);
menuBtn.addEventListener('click',menuBtnclick);

function selectNamechange(e){
  let txt = selectName.value;
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
  titleMain.innerHTML = txt; // 中間小標題 顯示 xx區
  sdata = [];//清空陣列放新的篩選後的區域資料
  // 此為for寫法，下面的displayData(data)有forEach。 
  // 筆記做比對用
  for (let i = 0 ; i < data.length ; i++){
    if( data[i].Zone == txt ){
      sdata.push(data[i]);//將篩選後的區域資料存到sdata陣列裡
    
      // let ticTxt = '';//如果沒有免費參觀的就不顯示
      // if(data[i].Ticketinfo !== ''){
      //   ticTxt = '<img src="img/icons_tag.png"> '+data[i].Ticketinfo;
      // }
      // str+=`
      // <div class="list-main">
      //   <div class="img" style="background-image: url(${data[i].Picture1});">
      //     <div class="img-title">
      //       <p class="title-24px">${data[i].Name}</p>
      //       <p class="title-16px">${data[i].Zone}</p>
      //       <p style="clear:both"></p>
      //     </div>
      //   </div>
      //   <div class="conten">
      //     <p class="clock"><img src="img/icons_clock.png"> ${data[i].Opentime}</p>
      //     <p class="pin"><img src="img/icons_pin.png"> ${data[i].Add}</p>
      //     <p class="phone"><img src="img/icons_phone.png"> ${data[i].Tel}</p>
      //     <p class="tag">${ticTxt}</p>
      //   </div>
      // </div>`;
      // list.innerHTML = str;
    }
  }

  pagination(sdata,1);//將sdata陣列、預設第1頁傳入分頁處理
  updataList(txt);//同步更新下拉選單選的區域
}

//處理同步按鈕選擇的區域(有動作時)
function updataList(txt){
  let arrZone = [];//建一個空陣列放 區域
  for(let zo = 0 ; zo < data.length ; zo++){
    arrZone.push(data[zo].Zone);
  };

  //把重複的過濾掉
  arrZone = arrZone.filter(function(e, index, arr){
    return arr.indexOf(e) === index;
  });

  selectOption = '';//先清空option
  for(let n = 0; n < arrZone.length ; n++){
    if(txt == arrZone[n]){
      selectOption+= `<option value="${arrZone[n]}" selected>${arrZone[n]}</option>`;
    }else{
      selectOption+= `<option value="${arrZone[n]}">${arrZone[n]}</option>`;
    }
    selectName.innerHTML = '<option>--請選擇行政區--</option>'+selectOption;
  };
}

//分頁處理
function pagination(sdata, nowPage){
  let dataTotal = sdata.length;
  const perpage = 4; //每頁只顯示四筆，不可變動
  // 計算頁數 dataTotal資料長度 / perpage要顯示的筆數
  const pageTotal = Math.ceil(dataTotal / perpage); //小數無條件進位

  let currentPage = nowPage;
  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"，預防一些無法預期的狀況
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  // 一頁四筆，第二頁要從第五筆資料開始...
  // 顯示第 minData (5) ~ maxData (8)筆 的資料
  const minData = (currentPage * perpage) - perpage + 1 ; //第2頁的話 2*4-4+1=5
  const maxData = (currentPage * perpage) ;//第2頁的話 2*4=8 
  
  const showdata = [];// 先建立新陣列, 存放只要顯示的4筆資料
  // 這邊將會使用 ES6 forEach 做資料處理
  // forEach說明：https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // forEach = for迴圈。 for(i=0;i<length;i++)
  // forEach((item, index))
  // item是整個sdata陣列。index等於 for中的 i 
  // 首先必須使用索引來判斷資料位子，所以要使用 index
  sdata.forEach((item, index) => { 
    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
    const num = index + 1;
    // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
    // 目的是讓陣列只唯持只顯示指定的筆數
    if ( num >= minData && num <= maxData) {
      showdata.push(item);
    }
  })
  //console.log(showdata)
  
  // 用物件方式來傳遞資料
  const page = {
    pageTotal, //總頁數
    currentPage, //當前頁數
    hasPage: currentPage > 1, //判斷當前的頁數有沒有大於1
    hasNext: currentPage < pageTotal, //判斷當前的頁數有沒有小於總頁數
  }
  displayData(showdata);
  pageBtnShow(page);
}

//顯示篩選過後的資料且一頁只顯示四筆
function displayData(data) {
  let str = '';
  let ticTxt = '';//如果沒有免費參觀的就不顯示
  data.forEach((item) => {
    // console.log(item) , item 是 sdata 的陣列資料
    if(item.Ticketinfo !== ''){
      ticTxt = '<img src="img/icons_tag.png"> '+item.Ticketinfo;
    }
    str += `
    <div class="list-main">
        <div class="img" style="background-image: url(${item.Picture1});">
          <div class="img-title">
            <p class="title-24px">${item.Name}</p>
            <p class="title-16px">${item.Zone}</p>
            <p style="clear:both"></p>
          </div>
        </div>
        <div class="conten">
          <p class="clock"><img src="img/icons_clock.png"> ${item.Opentime}</p>
          <p class="pin"><img src="img/icons_pin.png"> ${item.Add}</p>
          <p class="phone"><img src="img/icons_phone.png"> ${item.Tel}</p>
          <p class="tag">${ticTxt}</p>
        </div>
      </div>`;
  });
  list.innerHTML = str;
  if(str === ''){
    list.innerHTML = '此區域無資料';
  }
};

//顯示分頁按鈕
function pageBtnShow(page){
  let str = '';
  const total = page.pageTotal;  
  if(page.hasPage) { //如果當前的頁數大於1，Prev 的按鈕就可以按
    str += `<td><a href="#" data-page="${Number(page.currentPage) - 1}">Prev</a></td>`;
  } /*else { //否則不顯示
    str += `<td disabled><span>Prev</span></td>`;
  }  */

  for(let i = 1; i <= total; i++){
    if(Number(page.currentPage) === i) {
      str +=`<td active style="background-color: #8A82CC;"><a href="#" data-page="${i}">${i}</a></td>`;
    } else {
      str +=`<td><a href="#" data-page="${i}">${i}</a></td>`;
    }
  };

  if(page.hasNext) {//如果當前的頁數小於總頁數，Next 的按鈕就可以按
    str += `<td><a href="#" data-page="${Number(page.currentPage) + 1}">Next</a></td>`;
  } /*else { //否則不顯示
    str += `<td disabled><span>Next</span></td>`;
  }*/
  pageid.innerHTML = str;
}

function switchPage(e){
  e.preventDefault(); // 取消 a 元素的默認行為
  if(e.target.nodeName !== 'A') return; //當按下的元素非 A 時跳出，是的話繼續往下執行
  const page = e.target.dataset.page; //查當下點擊的dataset的page值
  //console.log(sdata);
  pagination(sdata, page);
};

pageid.addEventListener('click', switchPage);


let goTop = document.querySelector('.goTop');
goTop.addEventListener('click', pagegoTop);
function pagegoTop(){
  document.body.scrollTop=0;
  document.documentElement.scrollTop=0;
}