import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js';

// Enable dark mode
document.documentElement.classList.add('cc--darkmode');

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

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
    onChange: ({cookie, changedCategories, changedPreferences}) => {
        if(changedCategories.includes('Tournament')){

            if(CookieConsent.acceptedCategory('Tournament')){
                console.log("accepted" )
            } else {
                deleteCookie("tournament-id")
                deleteCookie("trndata")                
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
                            description: "Some necessary Cookies are still needed to remember your choice."
                        },

                    ]
                }
            }
        }
    }
});