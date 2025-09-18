console.log("안녕하세요_01javascript.js에서 출력합니다.");

// 웹브라우저 cinsole에 id=title인 태그를 찾아서 출력
const title = document.querySelector("#title");
console.log(title);

// 링크 클린 이벤트 연결하기
// const link = document.querySelector("a")
//link.addeventlistener ("click", () => {
//    console.log("링크를 클릭했습니다.");
//})

// 링크를 클릭해도 링크가 작동하지 않고 console.log만 작동되도록
// preventdefault()
const link = document.querySelector("a");
link.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("링크를 클릭했습니다.");
});

//html 요소에 마우스 이벤트 연결하기
const box = document.querySelector("#box");
box.addEventListener("mouseenter", ()=>{
    box.style.backgroundColor = "hotpink";
});
box.addEventListener("mouseleave", ()=>{
    box.style.backgroundColor = "aqua";
});


//반복되는 요소에 이벤트 한꺼번에 연결하기
const list = document.querySelectorAll(".list li");
console.log(list);
for (let el of list){
    el.addEventListener("click", (e)=>{
        e.preventDefault();
        console.log(e.currentTarget.innerText);
    });
};

//클릭 이벤트가 발생 할 때 숫자 증가, 감소하기
const btnPlus = document.querySelector(".btnPlus");
const btnMinus = document.querySelector(".btnMinus");

//num: 클릭한 숫자의 합을 저장하는 변수
let num =0;

//btnplus를 클릭할때
btnPlus.addEventListener("click", (e)=>{
    e.preventDefault();
    // num의 값을 1씩 증가
    num++;
    console.log(num);
})
//btnMinus를 클릭할때
btnMinus.addEventListener("click", (e)=>{
    e.preventDefault();
    // num의 값을 1씩 감소
    num--;
    console.log(num);
})

// 버튼을 클릭하면 좌우로 회전하는 박스 만들기
const btnLeft = document.querySelector(".btnLeft");
const btnRight = document.querySelector(".btnRight");
const box2=document.querySelector("#box2");
const deg = 45;
let num2 = 0;

// 버튼을 클릭하면 좌우로 회전하는 박스 만들기
btnLeft.addEventListener("click", (e)=>{
    e.preventDefault();
    num2--;
    console.log(`btnLeft를 클랙했을 때 num2에 있는 값: ${num2}`);
    box2.style.transform=`rotate(${num2 * deg}deg)`;
});
btnRight.addEventListener("click", (e)=>{
    e.preventDefault();
    num2++;
    console.log(`btnRight를 클랙했을 때 num2에 있는 값: ${num2}`);
    box2.style.transform=`rotate(${num2 * deg}deg)`;
});