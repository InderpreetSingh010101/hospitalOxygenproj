const puppy = require("puppeteer");

async function main() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
// Find the list of Hospitals in need of Oxygen
    await tab.goto("https://www.firstpost.com/india/no-oxygen-in-six-private-hospitals-in-delhi-others-running-low-on-supply-manish-sisodia-writes-letter-to-centre-9556311.html");
     await tab.waitForSelector(".inner-copy.article-full-content",{visible:true});
         
         const data = await tab.evaluate(()=>{
        const tds = Array.from(document.querySelectorAll('tbody tr td'));
      
        return tds.map(td => td.innerText);

    });
   
    let hnames = [];
    for(let i=5; i<data.length ; i+=4){
        hnames.push(data[i]);
    }
   
    
    // To collect info about Oxygen Suppliers in delhi
    
    await tab.goto("https://dir.indiamart.com/delhi/oxygen-plants.html");
    await tab.waitForSelector(".lcname");
    let Osuppliers = await tab.$$(".lcname");
    let OsuppliersN = [];
    for(let i=0;i<Osuppliers.length;i++){
    let n = await tab.evaluate(function(ele){
       
        return ele.innerText;
    },Osuppliers[i]);
    
    OsuppliersN.push(n);
    }
  

// To collect info Oxygen Suppliers addresses in delhi
await tab.waitForSelector(".sm.clg");
let OsuppliersA = await tab.$$(".sm.clg");
let OsuppliersAdd = [];
for(let i=0;i<OsuppliersA.length;i++){
let n = await tab.evaluate(function(ele){
  
    return ele.innerText;
},OsuppliersA[i]);
;
OsuppliersAdd.push(n);
}




    // To Calaculate distances between Hospitals and Oxygen Plants
    await tab.goto("https://www.mapdevelopers.com/distance_from_to.php");
    
    
    for(let i =0 ; i<5 /* hnames.length*/ ; i++){                       // Capable of processing all hospitals and oxygen plants
        console.log(hnames[i]);                                          // but to demonstrate I used small values
        console.log(" ");
       for(let j=0 ; j<5/*OsuppliersN.length*/ ; j++){
        
        await tab.waitForSelector("#fromInput");
        await tab.click("#fromInput");
        await tab.keyboard.down("Control");
        await tab.keyboard.press("A");
        await tab.keyboard.up("Control");
        await tab.type("#fromInput", hnames[i] +" Delhi");
        await tab.click("#toInput");
        await tab.keyboard.down("Control");
        await tab.keyboard.press("A");
        await tab.keyboard.up("Control");    

    await tab.type("#toInput", OsuppliersAdd[j]);
    await tab.click("a.link_button");
    await tab.waitForSelector("#status");
    await tab.waitForTimeout(4000);
    let dir = await tab.$$("#status");
    console.log("         " + OsuppliersN[j] +"------> "+ await tab.evaluate(function(ele){return ele.innerText},dir[0]));
        }
}

//To Display the no of new Covid-19 cases in 14 days & No of deaths in Delhi
   
await tab.goto("https://news.google.com/covid19/map?hl=en-IN&mid=%2Fm%2F09f07&gl=IN&ceid=IN%3Aen");
console.log(" ");
await tab.waitForSelector(".DlOivf strong",{visible:true});
let d  = await tab.$$(".DlOivf strong");
console.log("TOTAL NO CASES REGISTERED IN 14 DAYs   --> "+ await tab.evaluate(function(ele){return ele.innerText},d[0]));
let d1  = await tab.$$(".fNm5wd.ckqIZ .UvMayb");
console.log("TOTAL NO DEATHS REGISTERED   -->  "+ await tab.evaluate(function(ele){return ele.innerText},d1[0]));


            console.log("---------=====Now Loading Latest news regarding covid-19=====---------");
            const page = await browser.newPage();
            await page.goto('https://www.ndtv.com/coronavirus');
 }

main();
