// TRANSLATIONS DATABASE

const translations = {
    "translate-id" : {
        en : {
            "change-language-button": "EN",

            "landing-scroll-down-notice" : "Scroll down to see my portfolio",

            "recent-proj-title" : "<p>Here are my <h>most recent</h> projects</p>",
            "recent-proj-goto_filters" : "Want to see them all at once?",

            "filters-title": "<p><h>What kind</h> of projects do you want to see?</p>",
            "filters-nothing-found-title" : "Oops!",
            "filters-nothing-found-txt" : "Seems like there's nothing corresponding to these filters.",
            "filters-clear-filters" : "Clear filters",
            "plist-projects-found" : "projects found",
            "plist-projects-found-singular" : "project found",

            "access" : "Access",
        },
        fr : {
            "change-language-button": "FR",

            "landing-catch" : "Apprendre sans s'arrêter.",
            "landing-scroll-down-notice" : "Défilez pour voir mon portfolio",

            "recent-proj-title" : "<p>Voici mes projets les <h>plus récents</h></p>",
            "recent-proj-goto_filters" : "Tous les voir en même temps",

            "filters-title": "<p><h>Quels genres</h> de projets voulez-vous voir ?</p>",
            "filters-nothing-found-title" : "Mince !",
            "filters-nothing-found-txt" : "On dirait qu'il n'y a rien qui corresponde à votre sélection de filtres.",
            "filters-clear-filters" : "Réinitialiser les filtres",
            "plist-projects-found" : "projets trouvés",
            "plist-projects-found-singular" : "projet trouvé",

            "access" : "Accéder",
        }
    },
    "translate-bubble-id" : {
        en : {
            "change-language-button": "Change language",

            "filters-date-false": "Most Recent",
            "filters-date-true": "Oldest",

            "plist-video-quick-popup-btn": "Open the video (pop-up)",
        },
        fr : {
            "change-language-button": "Changer la langue",

            "filters-date-false": "Plus récent",
            "filters-date-true": "Plus vieux",

            "plist-video-quick-popup-btn": "Ouvrir la vidéo (pop-up)",
        }
    }

};


const filters = {
    en : {// "motion|3D|vector|type|branding|ad|compo|print|illustration|experiment"
        format : {
            "comm" : "Communication",
            "layout" : "Layout",
            "motion" : "Motion-Design",
            "photo" : "Photography",
            "3D" : "3D",
            "illustration" : "Illustration",
            "vector" : "Vector",
            "type" : "Typography",
            "branding" : "Branding",
            "experiment" : "Experiment",

            "compo" : "Composition",
            "print" : "Print",
            "poster" : "Poster",
            "ad" : "Advertising",
            "logo" : "Logo",

            "anim" : "Animated",
            "web" : "Webdesign",
            "uiux" : "UI/UX",

            "date" : "Date",
        },
        plural : {
            "comm" : "Communication",
            "layout" : "Layouts",
            "motion" : "Motion-Design",
            "photo" : "Photography",
            "3D" : "3D",
            "illustration" : "Illustrations",
            "vector" : "Vectors",
            "type" : "Typography",
            "branding" : "Branding",
            "experiment" : "Experiments",

            "compo" : "Composition",
            "print" : "Prints",
            "poster" : "Posters",
            "ad" : "Advertising",
            "logo" : "Logos",

            "anim" : "Animated",
            "web" : "Webdesigns",
            "uiux" : "UI/UX",

            "date" : "Dates",
        }
    },
    fr : {
        format : {
            "comm" : "Communication",
            "layout" : "Mise en forme",
            "motion" : "Motion-Design",
            "photo" : "Photographie",
            "3D" : "3D",
            "illustration" : "Illustration",
            "vector" : "Vectoriel",
            "type" : "Typographie",
            "branding" : "Branding",
            "experiment" : "Expérimentation",

            "compo" : "Composition",
            "print" : "Imprimable",
            "poster" : "Affiche",
            "ad" : "Publicité",
            "logo" : "Logo",

            "anim" : "Animé",
            "web" : "Webdesign",
            "uiux" : "UI/UX",

            "date" : "Date",
        },
        plural : {
            "comm" : "Communication",
            "layout" : "Mise en forme",
            "motion" : "Motion-Design",
            "photo" : "Photographie",
            "3D" : "3D",
            "illustration" : "Illustrations",
            "vector" : "Vectoriel",
            "type" : "Typographie",
            "branding" : "Branding",
            "experiment" : "Expérimentations",

            "compo" : "Composition",
            "print" : "Imprimables",
            "poster" : "Affiches",
            "ad" : "Publicités",
            "logo" : "Logos",

            "anim" : "Animés",
            "web" : "Webdesigns",
            "uiux" : "UI/UX",

            "date" : "Dates",
        }
    }
};


const contexts = {
    en : {
        format : {
            "personal": "Personal Project",
            "fun" : "Fun",
            "order" : "Order",
            "school" : "School Project",
            "sc" : "Service Civique",
            "ppm" : "Pamplemousse",
            "retrosaturn" : "Retrosaturn",
            "pti" : "Psychoid: The Industriax"
        },
        plural : {
            "personal": "Personal Projects",
            "fun" : "Fun",
            "order" : "Orders",
            "school" : "School Projects",
            "sc" : "Service Civique",
            "ppm" : "Pamplemousse",
            "retrosaturn" : "Retrosaturn",
            "pti" : "Psychoid: The Industriax"
        }
    },
    fr : {
        format : {
            "personal": "Projet Personnel",
            "fun" : "Fun",
            "order" : "Commande",
            "school" : "Projet d'École",
            "sc" : "Service Civique",
            "ppm" : "Pamplemousse",
            "retrosaturn" : "Retrosaturn",
            "pti" : "Psychoid: the Industriax"
        },
        plural : {
            "personal": "Projets Personnel",
            "fun" : "Fun",
            "order" : "Commandes",
            "school" : "Projets d'École",
            "sc" : "Service Civique",
            "ppm" : "Pamplemousse",
            "retrosaturn" : "Retrosaturn",
            "pti" : "Psychoid: the Industriax"
        }
    }
};

export {
    translations,
    filters,
    contexts
};