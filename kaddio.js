function kaddio(url){
    if(!url){
        console.log('Kaddio: URL missing')
        return;
    };

    
    url = (url.search('//')) ? url : `https://${url}.kaddio.com`;

    const offset = new Date().getTimezoneOffset();

    const options = {
        mode: 'cors',
        method: 'GET',
        headers: {
            'x-tz-offset': offset
        }
    };

    const nodes = document.querySelectorAll("[data-kaddio]");

    if(!nodes || nodes.length == 0){
        console.log('Kaddio: No nodes to populate')
        return;
    }

    nodes.forEach(n => {
        fetch(`${url}/api/next-free-time/${n.dataset.kaddio}`, options)
            .then(response => response.json())
            .then(data => {
                if(data.nextFreeTime){
                    console.log(data);
    
                    n.insertAdjacentHTML('afterend', "<div>" + data.nextFreeTime + "</div");
    
                    if(data.localDate){
                        n.insertAdjacentHTML('afterend', "<div>" + data.localDate + " (lokal tid)</div")
                    }
    
                    n.insertAdjacentHTML('afterend', `<a href="${data.link}">Boka</a>`)
                }
            })
    
    });    
}

kaddio(document.currentScript.dataset.url);
