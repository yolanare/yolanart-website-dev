// TRANSLATIONS DATABASE

const translations = {
    "translate-id" : {
        en : {
            "change-language-button": "EN",

            "landing-scroll-down-notice" : "Scroll down!",

            "recent-proj-title" : "<p>Here are my <h>most recent</h> projects</p>",
            "recent-proj-goto_filters" : "Want to see them all at once?",

            "filters-title": "<p><h>What kind</h> of projects do you want to see?</p>",
            "filters-nothing-found-title" : "Oops!",
            "filters-nothing-found-txt" : "Seems like there's nothing corresponding to these filters.",
            "filters-clear-filters" : "Clear filters",
            "plist-projects-found" : "projects found",
            "plist-projects-found-singular" : "project found",
        },
        fr : {
            "change-language-button": "FR",

            "landing-scroll-down-notice" : "Défilez vers le bas !",

            "recent-proj-title" : "<p>Voici mes projets les <h>plus récents</h></p>",
            "recent-proj-goto_filters" : "Tous les voir en même temps",

            "filters-title": "<p><h>Quels genres</h> de projets voulez-vous voir ?</p>",
            "filters-nothing-found-title" : "Mince !",
            "filters-nothing-found-txt" : "On dirait qu'il n'y a rien qui corresponde à votre sélection de filtres.",
            "filters-clear-filters" : "Réinitialiser les filtres",
            "plist-projects-found" : "projets trouvés",
            "plist-projects-found-singular" : "projet trouvé",
        }
    },
    "translate-bubble-id" : {
        en : {
            "change-language-button": "Language",

            "filters-date-false": "Most Recent",
            "filters-date-true": "Oldest",

            "plist-video-quick-popup-btn": "Open the video (pop-up)",
        },
        fr : {
            "change-language-button": "Langue",

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
            "motion" : "Motion-Design",
            "compo" : "Composition",
            "illustration" : "Illustration",
            "3D" : "3D",
            "vector" : "Vector",
            "type" : "Typography",
            "branding" : "Branding",
            "experiment" : "Experiment",

            "print" : "Prints",
            "ad" : "Advertising",
            "photo" : "Photography",
            "poster" : "Poster",
            "logo" : "Logo",
            "layout" : "Layout",
            "date" : "Date",
        },
        plural : {
            "experiment" : "Experiments",
            "photo" : "Photography",
            "illustration" : "Illustration",
            "3D" : "3D",
            "motion" : "Motion-Design",
            "type" : "Typography",
            "poster" : "Posters",
            "print" : "Prints",
            "logo" : "Logos",
            "branding" : "Branding",
            "vector" : "Vectors",
            "layout" : "Layouts",
            "compo" : "Compositions",
            "ad" : "Advertising",
            "date" : "Dates",
            "comm" : "Communication",
        }
    },
    fr : {
        format : {
            "experiment" : "Expérimentation",
            "photo" : "Photographie",
            "illustration" : "Illustration",
            "3D" : "3D",
            "motion" : "Motion-Design",
            "type" : "Typographie",
            "poster" : "Affiche",
            "print" : "Print",
            "logo" : "Logo",
            "branding" : "Branding",
            "vector" : "Vectoriel",
            "layout" : "Mise en forme",
            "compo" : "Composition",
            "ad" : "Publicité",
            "date" : "Date",
            "comm" : "Communication",
        },
        plural : {
            "experiment" : "Expérimentations",
            "photo" : "Photographie",
            "illustration" : "Illustration",
            "3D" : "3D",
            "motion" : "Motion-Design",
            "type" : "Typographie",
            "poster" : "Affiches",
            "print" : "Prints",
            "logo" : "Logos",
            "branding" : "Branding",
            "vector" : "Vectoriel",
            "layout" : "Mise en forme",
            "compo" : "Compositions",
            "ad" : "Publicités",
            "date" : "Dates",
            "comm" : "Communication",
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
            "pti" : "Psychoid: the Industriax"
        },
        plural : {
            "personal": "Personal Projects",
            "fun" : "Fun",
            "order" : "Orders",
            "school" : "School Projects",
            "sc" : "Service Civique",
            "ppm" : "Pamplemousse",
            "retrosaturn" : "Retrosaturn",
            "pti" : "Psychoid: the Industriax"
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