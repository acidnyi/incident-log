class PolyNavigationDestination {
    constructor(url: string) {
        this.url = url;
    }

    url: string;
}

class PolyNavigateEvent extends Event {
    constructor(destination: string | URL, info?: any) {
        super('navigate', { bubbles: true, cancelable: true });

        const rebased = new URL(destination, document.baseURI);

        this.canIntercept =
            location.protocol === rebased.protocol &&
            location.host === rebased.host &&
            location.port === rebased.port;

        this.destination = new PolyNavigationDestination(rebased.href);
        this.info = info;
    }

    destination: PolyNavigationDestination;
    canIntercept = true;
    info: any;
    isIntercepted = false;

    intercept(_options?: any) {
        this.isIntercepted = true;
    }

    scroll(_options?: any) {
        // not implemented
    }
}

export function registerNavigationApi() {
    const win = window as any;

    if (!win.navigation) {
        win.navigation = new EventTarget();

        const oldPushState = window.history.pushState.bind(window.history);

        window.history.pushState = ((f) =>
            function pushState(...args: any[]) {
                const ret = f.apply(window.history, args as any);
                const url = args[2];

                if (url) {
                    win.navigation.dispatchEvent(new PolyNavigateEvent(url));
                }

                return ret;
            })(window.history.pushState);

        window.addEventListener('popstate', () => {
            win.navigation.dispatchEvent(new PolyNavigateEvent(document.location.href));
        });

        let previousUrl = '';

        const observer = new MutationObserver(() => {
            if (location.href !== previousUrl) {
                previousUrl = location.href;
                win.navigation.dispatchEvent(new PolyNavigateEvent(location.href));
            }
        });

        observer.observe(document, { subtree: true, childList: true });

        window.onunload = () => {
            observer.disconnect();
        };

        win.navigation.navigate = (
            url: string,
            options?: { state?: any; info?: any; history?: 'auto' | 'replace' | 'push' }
        ) => {
            const ev = new PolyNavigateEvent(url, options?.info);
            win.navigation.dispatchEvent(ev);

            if (ev.isIntercepted) {
                oldPushState(options?.state || {}, '', url);
            } else {
                window.open(url, '_self');
            }

            return {
                committed: Promise.resolve({} as NavigationHistoryEntry),
                finished: Promise.resolve({} as NavigationHistoryEntry),
            };
        };

        win.navigation.back = (_options?: { info?: any }) => {
            window.history.back();

            return {
                committed: Promise.resolve({} as NavigationHistoryEntry),
                finished: new Promise<NavigationHistoryEntry>((resolve) =>
                    setTimeout(() => resolve({} as NavigationHistoryEntry), 0)
                ),
            };
        };
    }
}