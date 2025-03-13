import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js';

// Enable dark mode
document.documentElement.classList.add('cc--darkmode');

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/chess-pairing-dev;';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/chess-pairing;';

}

// https://github.com/orestbida/cookieconsent
CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom left",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        Tournament: {
            enabled: true
        },

    },
	// https://cookieconsent.orestbida.com/advanced/callbacks-events.html
	onFirstConsent: ({cookie}) => {
		const preferences = CookieConsent.getUserPreferences();

		if (preferences.acceptType === 'all') {
		}
		else if (preferences.acceptType === 'necessary') {
			// after reject or 'setting Tournament to off and save prefs on 
			// initial cookie question box'

			// this is needed if app was used before this feature was added
			CookieConsent.eraseCookies(["tournament-id", "trndata"])
		}
		else if (preferences.acceptType === 'custom') {
			// Now, this is not triggered, but if more possibilities will be added,
			// this part must be updated.
			// Triggers after reject or 'setting Tournament to off and save prefs on 
			// initial cookie question box'

			// this is needed if app was used before this feature was added
            if(CookieConsent.acceptedCategory('Tournament')) {
            } else {
				CookieConsent.eraseCookies(["tournament-id", "trndata"])
            }
		}
    },
	// brx: I don't see, when and how use this:
	//onConsent: ({cookie}) => { ... },
    onChange: ({cookie, changedCategories, changedPreferences}) => {
        if(changedCategories.includes('Tournament')){

            if(CookieConsent.acceptedCategory('Tournament')){
            } else {
				CookieConsent.eraseCookies(["tournament-id", "trndata"])
            }
        }
    },
    language: {
        default: "en",
        autoDetect: "browser",
        translations: {
            en: {
                consentModal: {
                    title: "Hello Chess Lover! It's cookie time!",
                    description: "This web site can store Tournament data in your browser by accepting cookies. If you reject them, you will be able to save your data manually.",
                    acceptAllBtn: "Accept",
                    acceptNecessaryBtn: "Reject",
                    showPreferencesBtn: "Manage preferences",
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    //acceptAllBtn: "Accept all",
                    //acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie Usage",
                            description: "You can allow storing your Tournament data in your Browser's Cookie"
                        },
                        {
                            title: "Tournament Cookie",
                            linkedCategory: "Tournament"
                        },
                        {
                            title: "Information",
                            description: "Some necessary Cookies are still needed to remember your choice. This site is also monitored by Google Analytics."
                        },

                    ]
                }
            }
        }
    }
});
