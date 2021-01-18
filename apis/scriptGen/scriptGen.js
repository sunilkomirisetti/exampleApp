const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const _ = require('underscore');
const URL = require('url');
const { PendingXHR } = require('pending-xhr-puppeteer');

let browser;
let result = [];

function scriptLauncher(configObj) {
  return new Promise((resolve, reject) => {
    (async() => {
      browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      const pendingXHR = new PendingXHR(page);
      let pageObjects = _.sortBy(configObj.pageObjects, 'pageIndex');
      let lastIndex = pageObjects.length;
      let forIndex = 0;
      await page.setDefaultNavigationTimeout(0);
      await page.setCacheEnabled(false);      

      for (forIndex=0; forIndex<lastIndex; forIndex++) {
        await pageGraber(page, pageObjects[forIndex]);
        console.log('forIndex :: ', forIndex);
        if (forIndex + 1 == lastIndex) {
          resolve({
            status: 'SUCCESS',
            result: result
          });
        }
      }            
    })();
  });
}


async function pageGraber(page, pageObj) {
  await page.on('response', async response => {
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
    if (pageObj.captureURLs) {
      if (_.some(pageObj.captureURLs, function(url) { return request.url().indexOf(url) > -1 ? true : false;})) {
        if (pageObj.captureMethods) {
          if (_.some(pageObj.captureMethods, function(method) { return method == request.method();})) {
              result.push(capturedData);
          } else {
            console.log('no method matched :: ', request.method());
          }
        } else {
          result.push(capturedData);
        }
      } else {
        //console.log('URL NOT MATCHED @@@@@ ', _.some(pageObj.captureURLs, function(url) { return request.url().indexOf(url)}));
      }
    } else {
      if (pageObj.captureMethods) {
        if (_.some(pageObj.captureMethods, function(method) { method == request.method();})) {
            result.push(capturedData);
        }
      } else {
        result.push(capturedData);
      }
    } 
  });
  if (pageObj.pageURL) {
    await page.goto(pageObj.pageURL);
  }
  page.waitForNavigation({"waitUntil" : ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
  page.bringToFront();

  let formData = pageObj.formData || [];
  let formDataIndex = formData.length;
  
    formData.forEach(function(obj) { 
      (async() => {
        await formFiller(page, obj);
      })();
    });
  
  if ('Submit' == pageObj.pageAction) {
    if (pageObj.actionEventSelector) {
      await page.click(pageObj.actionEventSelector);
      await page.waitForNavigation({waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
    } else if (pageObj.actionEventId) { 
      page.bringToFront();     
      await page.$eval('#'+pageObj.actionEventId, element => element.click());
      await page.click('[id="'+pageObj.actionEventId+'"]');
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      console.log('SUBMITTED ::: ');
      page.waitForNavigation({waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
    } else {
      await page.keyboard.press('Enter');
      await page.waitForNavigation({waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
    }
  }
  console.log('PAGE pageGraber DONE :: ');
}


async function formFiller(page, obj) {
  page.waitForSelector('#' + obj.key);
  if ('dropdown' == obj.type) {
    page.select('#' + obj.key, obj.value);
  } else if ('radio' == obj.type) {

  } else if ('checkbox' == obj.type) {

  } else {
    page.type('#' + obj.key, obj.value);
  }
}

function delay() {
  return new Promise(resolve=>setTimeout(resolve,5000));
}

module.exports.scriptLauncher = scriptLauncher;
