class Kaddio{
    url;
    offset;

    constructor(url){
        if(!url){
            console.log('Kaddio: URL missing')
            throw new Error();
        };
    
        this.url = (url.search('//')) ? url : `https://${url}.kaddio.com`;

        this.offset = new Date().getTimezoneOffset();
    }

    async suggestions(query){
        const options = {
            mode: 'cors',
            method: 'GET',
            headers: {
                'x-tz-offset': this.offset
            }
        };

        const response = await fetch(`${this.url}/api/all-suggestions-ever/${query}`, options);
        return await response.json();
    }

    async parse(){            
        const nodes = document.querySelectorAll("[data-kaddio]");
    
        if(!nodes || nodes.length == 0){
            console.log('Kaddio: No nodes to populate')
            return;
        }
    
        nodes.forEach(async n => {
            const suggestions = await this.suggestions(n.dataset.kaddio);

            if(!suggestions) return;

            console.log(suggestions);

            const bookingTypes = Object.keys(suggestions);

            bookingTypes.forEach(bt => {
                suggestions[bt].forEach(suggestion => {
                    if(n.dataset.kaddioBook){
                        n.insertAdjacentHTML('afterbegin', `<a href="${suggestion.link}">${suggestion.start}</a`);
                    }
                    else{
                        n.insertAdjacentHTML('afterbegin', `<div>${suggestion.start}</div`);
                    }


                    // if(data.localDate){
                    //     n.insertAdjacentHTML('afterbegin', "<div>" + data.localDate + " (lokal tid)</div")
                    // }

                    // const bookNode = n.querySelector("[data-kaddio-book]");

                    // if(data.link && bookNode){
                    //     bookNode.setAttribute('href', data.link);
                    //     // n.insertAdjacentHTML('afterend', `<a href="${data.link}">Boka</a>`)
                    // }                        
                });
            });
        });   
    }

    async book(reservation){
        const options = {
            body: JSON.stringify(reservation),
            method: 'POST',
            headers: {
                'x-tz-offset': this.offset
            }
        };

        const response = await fetch(`${this.url}/api/book`, options);
        const json = await response.json();

        console.log(json);
    }
}

if(document.currentScript.dataset.disableAutostart){
    console.log('Not autostarting');
}

else{
    const kaddio = new Kaddio(document.currentScript.dataset.url);
    kaddio.parse();
}

// const kaddio = new Kaddio(document.currentScript.dataset.url);

// kaddio.book({
//     bookableTimeId: "xpcmCjN8TeAhPAdpT",
//     bookingTypeId: "Qg6u5fPhyXzhuspnH",

// });