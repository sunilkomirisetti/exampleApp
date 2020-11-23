const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const _ = require('underscore');

function runScript(configObj, callback) {
  const result = [];
  console.log('lets begin the action ::: ');

  (async() => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
    
  await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(0);

  await page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    }).then(response => {
      //if (request.url().startsWith('https://smetrics.statefarm.com/b/ss')) {
        let capturedData = {
          'requestUrl' : request.url(),
          'requestHeaders': request.headers(),
          'requestPostData': request.postData(),
          'responseHeaders': response.headers,
          'responseSize': response.headers['content-length'],
          'responseBody': response.body,
        };
        result.push(capturedData);
        /*console.log('*************');
        console.log('result :: ', result);
        console.log('*************');*/
      //}
      request.continue();
    }).catch(error => {
      //console.error(error);
      request.abort();
    });
  }); 

  //(async() => {
    let pageObjects = _.sortBy(configObj.pageObjects, 'pageIndex');
    let lastIndex = pageObjects.length;
    console.log('pageObjects sorted :: ', lastIndex);

    let pageObj = pageObjects[0];
    console.log('going to :: ' + pageObj.pageURL);
    await page.goto(pageObj.pageURL);
    page.waitForNavigation();
    await page.bringToFront();
    let formData = pageObj.formData;
    let formDataIndex = formData.length || 0;
    formData.forEach(function(obj) {
      console.log(formDataIndex, obj.key, obj.value);
      if ('dropdown' == obj.type) {
        (async() => {
         page.select('#' + obj.key, obj.value);
         formDataIndex = formDataIndex - 1;
         if (formDataIndex <= 0) {
          console.log('before click ::', '#' + pageObj.actionEventId);
            if ('Submit' == pageObj.pageAction) {
                  //await Promise.all([await page.click('#' + pageObj.actionEventId)]);
                  await page.keyboard.press('Enter');
                
            }
         }
         })();
      } else {
        (async() => {
        await page.type('#' + obj.key, obj.value);
         formDataIndex = formDataIndex - 1;
         if (formDataIndex <= 0) {
            console.log('before click ::', '#' + pageObj.actionEventId);
            if ('Submit' == pageObj.pageAction) {
                  //await Promise.all([await page.click('#' + pageObj.actionEventId)]);
                  await page.keyboard.press('Enter');
                  page.waitForNavigation();
                
            }
          //page.click('#quote-main-zip-btn');
          
          /*Promise.all([ page.click('#' + pageObj.actionEventId)]);
          page.$eval('#' + pageObj.actionEventId, elem => elem.click());
          page.click('#' + pageObj.actionEventId);*/
       
        }
        })();
      }
    });
    
    //page.click('#quote-main-zip-btn');
    //console.log('this will print last');
    callback({
      status: 'SUCCESS',
      result: result
    });
    
  })();
}
