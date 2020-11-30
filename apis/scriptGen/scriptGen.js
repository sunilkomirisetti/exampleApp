const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const _ = require('underscore');
const URL = require('url');
const { PendingXHR } = require('pending-xhr-puppeteer');

function runScript(configObj, callback) {
  let result = [];
  let pageObjConfig = {};
  console.log('lets begin the action ::: ');

  (async() => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const pendingXHR = new PendingXHR(page);
    
  await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(0);
  await page.setCacheEnabled(true);

  /*await page.on('response', async response => {
    let request = response.request();
    let capturedData = {
      'requestUrl' : request.url(),
      'requestType': request.method(),
      'requestHeaders': request.headers(),
      'requestPostData': request.postData(),
      'responseHeaders': response.headers,
      'responseSize': response.headers['content-length'],
      'responseBody': response.body,
      'queryParams': URL.parse(request.url(), true).query
    };
    result.push(capturedData);
    console.log('*************');
    console.log('result captured :: ');
    console.log('*************');
  });*/

  await page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    }).then(response => {
        let capturedData = {
          'requestUrl' : request.url(),
          'requestType': request.method(),
          'requestHeaders': request.headers(),
          'requestPostData': request.postData(),
          'responseHeaders': response.headers,
          'responseSize': response.headers['content-length'],
          'responseBody': response.body,
          'queryParams': URL.parse(request.url(), true).query
        };
        if (pageObjConfig.captureURLs) {
          if (_.some(pageObjConfig.captureURLs, function(url) { return request.url().indexOf(url) > -1 ? true : false;})) {
            console.log('url matched :::')
            if (pageObjConfig.captureMethods) {
              console.log('methods :: ', pageObjConfig.captureMethods);
              if (_.some(pageObjConfig.captureMethods, function(method) { return method == request.method();})) {
                  result.push(capturedData);
                  console.log('result captured :: ');
              } else {
                console.log('no method matched :: ', request.method());
              }
            } else {
              result.push(capturedData);
              console.log('result captured :: ');
            }
          }
        } else {
          if (pageObjConfig.captureMethods) {
            if (_.some(pageObjConfig.captureMethods, function(method) { method == request.method();})) {
                result.push(capturedData);
                console.log('result captured :: ');
            }
          } else {
            result.push(capturedData);
            console.log('result captured :: ');
          }
        }      
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

    for (i=0; i<lastIndex; i++) {
      let pageObj = pageObjects[i];
      pageObjConfig = pageObj;
      console.log('going to :: ' + pageObj.pageURL);
      await page.goto(pageObj.pageURL, {"waitUntil" : "networkidle0"});
      page.waitForNavigation();
      await page.bringToFront();
      let formData = pageObj.formData || [];
      let formDataIndex = formData.length;
      formData.forEach(function(obj) {
        console.log(formDataIndex, obj.key, obj.value);
        if ('dropdown' == obj.type) {
          (async() => {
           page.select('#' + obj.key, obj.value);
           formDataIndex = formDataIndex - 1;
           if (formDataIndex <= 0) {
            console.log('before click ::', '#' + pageObj.actionEventId);
              if ('Submit' == pageObj.pageAction) {
                await page.keyboard.press('Enter');
                await page.waitForNavigation({waitUntil: 'networkidle2'});
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
                    await page.keyboard.press('Enter');
                    //page.$eval('#' + pageObj.actionEventId, elem => elem.click());
                    await page.waitForNavigation({waitUntil: 'networkidle2'});            
              }       
          }
          })();
        }
      });
    }
    try {
      await page.waitForNavigation({waitUntil: 'networkidle2'});
      const finalResponse = await page.waitForResponse(response =>  response.status() === 200);
      console.log('finalResponse :: ', finalResponse);
      await Promise.race([
        new Promise(resolve => {
          setTimeout(resolve, 20000);
        }),
        new Promise(resolve => {
          setTimeout(resolve, 20000)
        })
      ]);
      console.log('################# ::' + pendingXHR.pendingXhrCount());
      callback({
        status: 'SUCCESS',
        result: result
      });
    } catch(e) {
      console.log('error while await timeout ::: ');
      callback({
        status: 'SUCCESS',
        result: result
      });
    }
    
  })();
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pageDataLoader(page, pageObj) {
  let formData = pageObj.formData;
  let lastIndex = formData.length || 0;
  return new Promise(resolve => {
    //setTimeout(() => {
      formData.forEach(function(obj) {
        if ('dropdown' == obj.type) {
           page.select('#' + obj.key, obj.value);
           lastIndex = lastIndex - 1;
           if (lastIndex <= 0) {
            resolve('resolved');
           }
        } else if ('input' == obj.type) {
           lastIndex = lastIndex - 1;
           if (lastIndex <= 0) {
            resolve('resolved');
           }
        }
      });
      
    //}, 2000);
  });
}

/*async function pageDataLoader(page, pageObj, callback) {
  let formData = pageObj.formData;
  let lastIndex = formData.length || 0;

  if (lastIndex) {
    formData.forEach(function(obj) {
      if ('dropdown' == obj.type) {
         page.select('#' + obj.key, obj.value);
         lastIndex = lastIndex - 1;
         if (lastIndex <= 0) {
          callback('done');
         }
      } else if ('input' == obj.type) {
         page.type('#' + obj.key, obj.value);
         page.$eval('#' + pageObj.actionEventId, elem => elem.click());
         lastIndex = lastIndex - 1;
         if (lastIndex <= 0) {
          callback('done');
         }
      }
    });
  } else {
    callback('done');
  }  
}*/


module.exports.runScript = runScript;
