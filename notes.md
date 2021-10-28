

If you want to collect data from the web, you’ll come across a lot of resources teaching you how to do this using more established back-end tools like Python or PHP. But there’s a lot less guidance out there for the new kid on the block, Node.js.
Thanks to Node.js, JavaScript is a great language to use for a web scraper: not only is Node fast, but you’ll likely end up using a lot of the same methods you’re used to from querying the DOM with front-end JavaScript. Node.js has tools for querying both static and dynamic web pages, and it is well-integrated with lots of useful APIs, node modules and more.
In this article, I’ll walk through a powerful way to use JavaScript to build a web scraper. We’ll also explore one of the key concepts useful for writing robust data-fetching code: asynchronous code.
Asynchronous Code
Fetching data is often one of the first times beginners encounter asynchronous code. By default, JavaScript is synchronous, meaning that events are executed line-by-line. Whenever a function is called, the program waits until the function is returned before moving on to the next line of code.
But fetching data generally involves asynchronous code. Such code is removed from the regular stream of synchronous events, allowing the synchronous code to execute while the asynchronous code waits for something to occur: fetching data from a website, for example.
Combining these two types of execution — synchronous and asynchronous — involves some syntax which can be confusing for beginners. We’ll be using the async and await keywords, introduced in ES7. They’re syntactic sugar on top of ES6’s Promise syntax, and this — in turn — is syntactic sugar on top of the previous system of callbacks.
Passed-in Callbacks
In the days of callbacks, we were reliant on placing every asynchronous function within another function, leading to what’s sometimes known as the ‘pyramid of doom’ or ‘callback hell’. The example below is on the simple side!
/* Passed-in Callbacks */
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log(finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
Promise, Then and Catch
In ES6, a new syntax was introduced, making it much simpler and easier-to-debug asynchronous code. It is characterised by the Promise object and the then and catch methods:
/* "Vanilla" Promise Syntax */
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(finalResult);
})
.catch(failureCallback);
Async and Await
Finally, ES7 brought async and await , two keywords which allow asynchronous code to look much closer to synchronous JavaScript, as in the example below. This most recent development is generally considered the most readable way to do asynchronous tasks in Javascript — and may even boost memory efficiency in comparison to regular Promise syntax.
/* Async/Await Syntax */
(async () => {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(finalResult); 
  } catch(err) {
    console.log(err);
  }
})();
Static Websites
In the past, retrieving data from another domain involved the XMLHttpRequest or XHR object. Nowadays, we can use JavaScript’s Fetch API. The fetch() method. It takes one mandatory argument — the path to the resource you want to fetch (usually a URL) — and returns a Promise .
To use fetch in Node.js, you’ll want to import an implementation of fetch. Isomorphic Fetch is a popular choice. Install it by typing npm install isomorphic-fetch es6-promise into the terminal, and then require it at the top of your document like so: const fetch = require('isomorphic-fetch') .
JSON
If you’re fetching JSON data, then you should use the json() method on your response before processing it:
(async () => {
  const response = await fetch('https://wordpress.org/wp-json');
  const json = await response.json();
  console.log(JSON.stringify(json));
})()
JSON makes it relatively straightforward to grab the data you want from the and process it. But what if JSON data isn’t available?
HTML
For most websites, you’ll need to extract the data you want from the HTML. With regards to static websites, there are two main ways to go about this.
Option A: Regular Expressions
If your needs are simple or you’re comfortable writing regex, you can simply use the text() method, and then extract the data you need using the match method. For example, here’s is some code to extract the contents of the first h1 tag on a page:
(async () => {
  const response = await fetch('https://example.com');
  const text = await response.text();
  console.log(text.match(/(?<=\<h1>).*(?=\<\/h1>)/));
})()
Option B: A DOM Parser
If you’re dealing with a more complicated document, it can be helpful to make use of JavaScript’s array of in-built methods for querying the DOM: methods like getElementById , querySelector and so on.
If we were writing front-end code, we could use the DOMParser interface. As we’re using Node.js, we can grab a node module instead. A popular option is jsdom, which you can install by typing npm i jsdom into the terminal and requiring like this:
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
With jsdom, we can query our imported HTML as its own DOM object using querySelector and related methods:
(async () => {
  const response = await fetch('https://example.com');
  const text = await response.text();
  const dom = await new JSDOM(text);
  console.log(dom.window.document.querySelector("h1").textContent);
})()
Dynamic Websites
What if you want to grab data from a dynamic website, where content is generated in real-time, such as on a social media site? Performing a fetch request won’t work because it will return the site’s static code, and not the dynamic content that you probably want to get access to.
If that’s what you’re looking for, the best node module for the job is puppeteer — not least because the main alternative, PhantomJS, is no longer being developed.
Puppeteer allows you to run Chrome or Chromium over the DevTools Protocol, with features such as automatic page navigation and screen capture. By default, it runs as a headless browser, but changing this setting can be helpful for debugging.
Getting Started
To install, navigate to your project directory in the terminal and type npm i puppeteer . Here’s some boilerplate code to get you started:
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();
await page.setRequestInterception(true);
await page.goto('http://www.example.com/');
First, we launch puppeteer (disabling headless mode, so we can see what we’re doing). Then we open a new tab. The method page.setRequestInterception(true) is optional, allowing us to use abort , continue and respond methods later on. Lastly, we go to our chosen page.
As in the “DOM Parser” example above, we can now query elements using document.querySelector and the related methods.
Logging In
If we need to log in, we can do so easily using the type and click methods, which identify DOM elements using the same syntax as querySelector :
await page.type('#username', 'UsernameGoesHere');
await page.type('#password', 'PasswordGoesHere');
await page.click('button');
await page.waitForNavigation();
Handling Infinite Scroll
It is increasingly common for dynamic sites to display content via an infinite scrolling mechanism. To cope with that, you can set puppeteer to scroll down based on certain criteria.
Here’s a simple example that will scroll down 5 times, waiting for 1 second between each scroll to account for loading content.
for (let j = 0; j < 5; j++) {
  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
  await page.waitFor(1000);
}
Because load times will differ, the above code will not necessarily load the same number of results every time. If that’s a problem, you may want to scroll until a certain number of elements is found, or some other criteria.
Making Optimisations
Lastly, there are several ways that you can make optimisations to your code, so that is runs as quickly and smoothly as possible. As an example, here’s a way to get puppeteer to avoid loading fonts or images.
await page.setRequestInterception(true);
page.on('request', (req) => {
 if (req.resourceType() == 'font' || req.resourceType() == 'image'){
   req.abort();
 }
 else {
   req.continue();
 }
});
You could also disable CSS in a similar way, although sometimes the CSS is integral to the dynamic data you want — so I’d err on the side of caution with this one!
And that’s pretty much all you need to know to make a functioning web scraper in JavaScript! Once you’ve stored the data in memory, you can then add it to a local document (using the fs module), upload it to a database, or use an API (such as the Google Sheets API ) to send the data directly to a document.
If you’re new to web scraping — or you know about web scraping but you’re new to Node.js — I hope this article has made you aware of some of the powerful tools that make Node.js a very capable scraping tool. I’d be happy to answer any questions in the comments!