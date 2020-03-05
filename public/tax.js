var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    let proxy_res = JSON.parse(this.responseText);

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

    var xpath = null;
    var nodes = null;
    var n = null;
    var f = null;
    proxy_res.products.forEach(p => {
      console.log(p.handle);
      console.log(p.price);       
      /* -- Top/Collection/Product page -- */
      console.log(window.location.pathname);   
      if (current_path == "" || current_path.indexOf('collections/') > 0 || current_path.endsWith(`/products/${p.handle}`)) {
        xpath = `//span[contains(., '${p.price}')]/text()`;
        console.log(xpath);
        f = -1;
        nodes = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        n = nodes.iterateNext();
        if (n) {
          try {
            f = parseFloat(textToValue(n.textContent));
            n.textContent = `${formatter.format(f * tax)} (${label})`;
          } catch(error) {
            console.error(error);
          } 
        }
      }
    });        

  }
};
xhttp.open("GET", "/apps/tax", true);
xhttp.send();





