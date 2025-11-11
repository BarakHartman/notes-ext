async function doSomething() {
   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
   chrome.scripting.executeScript({
     target: { tabId: tab.id },
     function: () => {
       document.getElementsByTagName('h1')[0].innerText = 'Button Clicked!';
     }
   });
}

document.getElementById('myButton').addEventListener('click', doSomething);