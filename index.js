const puppeteer = require('puppeteer');
const json2csv = require("json2csv").Parser;
const fs = require("fs");


async function click(button) {
    await button.evaluate(button => button.click());
   
}

(async () => {
    page_list = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    const browser = await puppeteer.launch({
        headless : true,
        defaultViewport: null,
    });

    var i =0;
    for(i = 0; i< page_list.length ;i++){

    const target_url = 'https://www.eoddata.com/stocklist/FOREX/'+page_list[i]+'.htm';

    
    

    const page = await browser.newPage();

    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
    try{
        await page.setDefaultNavigationTimeout(0);
        await page.goto(target_url);
    }catch (e) {
        console.log(e);
    }

    const data = await page.evaluate(() => {
        
        const tds = Array.from(document.querySelectorAll('#ctl00_cph1_divSymbols > table > tbody > tr> td:nth-child(1) > a'))
        return tds.map(td =>{
            info ={};
            info.Symbols =  td.innerText;
            return info;
            
        })
      });
    
      //You will now have an array of strings
      //[ 'One', 'Two', 'Three', 'Four' ]
      console.log(data);
      
      //One
    const j2cp = new json2csv();
    const csv = j2cp.parse(data);

    fs.appendFileSync("./Team Info.csv", csv, "utf-8");

    }
    browser.close();
})();