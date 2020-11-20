const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const _ = require('underscore');

async function runScript(configObj, callback) {
  const result = [];
  console.log('lets begin the action ::: ');
  const browser = await puppeteer.launch({headless: false});
  let page = await browser.newPage();
    
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

  (async() => {
    let pageObjects = _.sortBy(configObj.pageObjects, 'pageIndex');
    let lastIndex = pageObjects.length;
    console.log('pageObjects sorted :: ', lastIndex)
    for (i=0; i<lastIndex; i++) {
      let pageObj = pageObjects[i];
      console.log('going to :: ' + pageObj.pageURL);
      await page.goto(pageObj.pageURL);
      page.waitForNavigation();
       page.$eval('#quote-main-zip-btn', elem => elem.click());
      let formData = pageObj.formData;
      if (formData && formData.length) {

        (async() => {
          formData.forEach(function(obj) {
            if ('dropdown' == obj.type) {
               page.select('#' + obj.key, obj.value);
            } else if ('input' == obj.type) {
               page.type('#' + obj.key, obj.value);
            }
          });
          if ('Submit' == pageObj.pageAction) {
              console.log('in SUBMIT :: ');
              //page.$eval('#quote-main-zip-btn', elem => elem.click());
              if (pageObj.actionEventType && 'selector' == pageObj.actionEventType) {
                  Promise.all([ page.click('#' + pageObj.actionEventId)]);
                  callback({
                    status: 'SUCCESS',
                    result: result
                  });
              } else {
                console.log('in else :: ');
                 page.click('#' + pageObj.actionEventId);
                 /*page.click('#quote-main-zip-btn');
                 page.keyboard.press('Enter');
                 page.type('#quote-main-zip-code-input',String.fromCharCode(13));*/
                 //page.$eval('#quote-main-zip-btn', elem => elem.click());
                 console.log('after click');
                 page.waitForNavigation();
                callback({
                  status: 'SUCCESS',
                  result: result
                });
              }
          }
        })();
      }
    }
    //page.click('#quote-main-zip-btn');
    console.log('this will print last');
  })();
}

async function setFormData(formData, page, callback) {
  let lastIndex = formData.length;
  formData.forEach(function(obj) {
    if ('dropdown' == obj.type) {
       page.select('#' + obj.key, obj.value);
       lastIndex = lastIndex - 1;
       if (lastIndex <= 0) {
        page.keyboard.press('Enter');
        callback({'status': 'completed'})
       }
    } else if ('input' == obj.type) {
       page.type('#' + obj.key, obj.value);
       lastIndex = lastIndex - 1;
       if (lastIndex <= 0) {
        page.keyboard.press('Enter');
        callback({'status': 'completed'})
       }
    }
  });
}


module.exports.runScript = runScript;
