import * as React from 'react'

class Tracker extends React.Component<{trackerHostName:string},{}> {
    componentDidMount() {
        const script = document.createElement("script");
        script.innerHTML = `
            console.log("matomo tracker loading...")
            var _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
            var u="//${this.props.trackerHostName}/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '1']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
            window.addEventListener('hashchange', function() {
                // SPA tracking
                _paq.push(['setCustomUrl', '/' + window.location.hash.substr(1)]);
                _paq.push(['setDocumentTitle', document.title]);
                _paq.push(['trackPageView']);
            });`
        script.async = true;
        document.body.appendChild(script);
    }

    render() {
        return false
    }
}

export default Tracker;