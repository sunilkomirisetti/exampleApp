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
    
    let pageObjects = _.sortBy(configObj.pageObjects, 'pageIndex');
    let lastIndex = pageObjects.length;
    console.log('pageObjects sorted :: ', lastIndex)
    for (i=0; i<lastIndex; i++) {
      let pageObj = pageObjects[i];
      console.log('going to :: ' + pageObj.pageURL);
      await page.goto(pageObj.pageURL);
      page.waitForTimeout(3000).then(() => console.log('Waited a second!'));
      if (pageObj.formData && pageObj.formData.length) {
        let formData = pageObj.formData;
       formData.forEach(function(obj) {
          if ('dropdown' == obj.type) {
             page.select('#' + obj.key, obj.value);
          } else if ('input' == obj.type) {
             page.type('#' + obj.key, obj.value);
          }
        });
        if ('Submit' == pageObj.pageAction) {
            console.log('in SUBMIT :: ');
            if (pageObj.actionEventType && 'selector' == pageObj.actionEventType) {
                await Promise.all([await page.click('#' + pageObj.actionEventId)]);
                callback({
                  status: 'SUCCESS',
                  result: result
                });
            } else {
              await page.click('#' + pageObj.actionEventId);
              callback({
                status: 'SUCCESS',
                result: result
              });
            }
            
            
            
        }
      }
    }
}

/*async function runScript(configObj, callback) {
  const result = [];
  console.log('lets begin the action ::: ');
  const browser = await puppeteer.launch({headless: false});
  //Open new page/tab
  const page = await browser.newPage();
  //Setting timeout 0 to avoid any timeout issues
  await page.setDefaultNavigationTimeout(0);


  await page.on('response', async response => {
    let request = response.request();
      if (request.url().startsWith('https://smetrics.statefarm.com/b/ss')) {
        let capturedData = {
          'requestUrl' : request.url(),
          'requestHeaders': request.headers(),
          'requestPostData': request.postData(),
          'responseHeaders': response.headers,
          'responseSize': response.headers['content-length'],
          'responseBody': response.body,
        };
        result.push(capturedData);
        console.log('*************');
        console.log(request.method());
        console.log('*************');
      }
      request.continue();
    });


  let pageObjects = _.sortBy(configObj.pageObjects, 'pageIndex');
  let lastIndex = pageObjects.length;
  console.log('pageObjects sorted :: ', lastIndex)
  for (var i=0; i<lastIndex; i++) {
    let pageObj = pageObjects[i];
    console.log('going to :: ' + pageObj.pageURL);
    await page.goto(pageObj.pageURL);
    if (pageObj.formData && pageObj.formData.length) {
      let formData = pageObj.formData;
      formData.forEach(function(obj) {
        if ('dropdown' == obj.type) {
           page.select('#' + obj.key, obj.value);
        } else {
           page.type('#' + obj.key, obj.value);
        }
      });
      if ('Submit' == pageObj.pageAction) {
          await page.click('#' + pageObj.actionEventId);
          callback({
            status: 'SUCCESS',
            result: result
          });
      }
    }
  }
}*/

module.exports.runScript = runScript;
