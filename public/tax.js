const DATA_KEY = 'ShopifyProductTaxAppDSata';

const addTax = function(proxy_res) {
  let formatter = new Intl.NumberFormat(proxy_res.locale, {
    style: 'currency',
    currency: proxy_res.currency
  });

  let textToValue = function(text) {
    return text.trim().replace(/"/g, '').replace(/'/g, '').replace(/¥/g, '').replace(/\$/g, '').replace(/,/g, '');
  };  

  let tax = 1 + parseFloat(proxy_res.tax);
  console.log(tax);

  let label = proxy_res.locale === 'ja-JP' ? '税込' : 'Tax included';

  let current_path = window.location.pathname;
  console.log(current_path);

  var p = null;
  var xpath = null;
  var nodes = null;    
  var f = -1;
  var t = "";
  var n = null;
  let size = proxy_res.products.length;
  for (let i=0; i<size; i++) {
    p = proxy_res.products[i];
    console.log(p.handle);
    console.log(p.price);       
    /* -- Top/Collection/Product page -- */
    console.log(window.location.pathname);   
    if (current_path == '/' || current_path.indexOf('collections/') > 0 || current_path.endsWith(`/products/${p.handle}`)) {
      xpath = `//p[contains(., '${p.price}')]/text()|//span[contains(., '${p.price}')]/text()`;
      console.log(xpath);
      f = -1;
      t = "";
      nodes = window.document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      while (n = nodes.iterateNext()) {
        console.log(`Node: ${n}`);
        t += n.nodeValue;
        console.log(t);
        console.log(textToValue(t));
        try {
          f = parseFloat(textToValue(t));
          if(!isNaN(f)) {
            n.nodeValue = `${formatter.format(f * tax)} (${label})`;
            break;
          }            
        } catch(error) {
          console.error(`error ${error}`);
        } 
      }           
    }
  }    
};

let stored_res = localStorage.getItem(DATA_KEY);
if (!stored_res) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.responseText);
      localStorage.setItem(DATA_KEY, JSON.stringify(res));
      addTax(res); 
    }
  };
  /* --- Calling App proxies (https://shopify.dev/tutorials/display-data-on-an-online-store-with-an-application-proxy-app-extension) --- */
  xhttp.open("GET", "/apps/tax", true);
  xhttp.send();
} else {
  console.log(stored_res);
  addTax(JSON.parse(stored_res));  
}







