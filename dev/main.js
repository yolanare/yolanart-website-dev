// - IMPORTS -
import "../node_modules/overlayscrollbars/css/OverlayScrollbars.css";
import "../node_modules/overlayscrollbars/js/OverlayScrollbars.js";
import { CountUp } from "countup.js";
//import anime from "animejs/lib/anime.es.js";

import * as Prj from "./assets/js/projects.js";
import * as Lang from "./assets/js/lang.js";
import "./index.html"
import "./main.scss"


//#region - HELPER VARIABLES -
var doc = document.documentElement,
    isMini, isTablet, // boolean if viewport is small like a phone
    isTouchDevice = (() => { try { document.createEvent("TouchEvent"); return true; } catch (e) { return false; } })(), // boolean if touch device
    pageContentContainer = document.querySelector("main#content-container"); // main container of page

// convert to radian or to degrees
const deg2rad = Math.PI/180,
      rad2deg = 180/Math.PI;

// check the viewport size, set boolean "isMini" if vp goes small
function checkWinSize() { isMini = (window.innerWidth < 800); isTablet = (window.innerWidth < 950); };
checkWinSize(); window.addEventListener("resize", checkWinSize);

// CURSOR POSITION AT ANY TIME
// window.addEventListener("mousemove", (cursorEv) => {
//     doc.style.setProperty("--cursor-x", cursorEv.clientX +"px");
//     doc.style.setProperty("--cursor-y", cursorEv.clientY +"px");
// })
//#endregion

//#region - CSS HELPERS -
// is browser chromium based
if (!!window.chrome) { document.querySelector("html").classList.add("isChr"); }
// is browser safari
if (navigator.vendor.match(/apple/i) && !navigator.userAgent.match(/crios/i) && !navigator.userAgent.match(/fxios/i) && !navigator.userAgent.match(/Opera|OPT\//))
    { document.querySelector("html").classList.add("isSafari"); }
// is touch device
if (isTouchDevice) { document.querySelector("html").classList.add("isTouch"); }
//#endregion

//#region - HELPER FUNCTIONS -
// convert to float and round to .01
function float(str) { return parseFloat(str.toFixed(2)) }

// get random integer between two values (inclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min + 1) + min);
}

// take a value, convert it from a range to another range, and rounded to .01
function mapRange(value, low1, high1, low2, high2) { // Processing's map function
    return float(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}
function mapRangePrecise(value, low1, high1, low2, high2) { // Processing's map function
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function constrain(value, low, high) { // Processing's constrain function
    return Math.min(Math.max(value, low), high);
}

// check if var is string
function isString(check) { return (typeof check === "string"); }

// call function at end of css transition of element (no propagation, option to do it only once)
function eventAtTransitionEnd(elem, func, {property = false, once = true, debug = false}) {
    if (!property) { // will check for all css properties
        elem.addEventListener("transitionend", () => { func(); }, { once : once });
    } else { // will check only for specified css property
        elem.addEventListener("transitionend", (ev) => { if (ev.propertyName == property) { func(); }}, { once : once });
    }

    // debug transition events
    if (debug) { elem.addEventListener("transitionend", (ev) => { console.debug("tr end: "+ ev.propertyName + ((property) ? (" (selected)") : "")); }); }

    var isNotAlready = true;
    trEndAlready.forEach((e) => { isNotAlready &= (e == elem) ? false : true; }); // check if already checking for trEnd
    if (isNotAlready) {
        trEndAlready.push(elem);
        elem.childNodes.forEach((el) => { el.addEventListener("transitionend", (ev) => { ev.stopPropagation(); })});
    }
} var trEndAlready = [];

// divide an array into chunks with itemsPerChunks number of items max in each chunks (stackoverflow.com/a/37826698)
function divideArrayByChunks(array, itemsPerChunks = 4) {
    return array.reduce((all, one, i) => {
        const ch = Math.floor(i / itemsPerChunks);
        all[ch] = [].concat((all[ch] || []), one);
        return all
     }, [])
}

// get scroll speed
// var checkScrollSpeed = (function(){ // (stackoverflow.com/a/22599173)
    // var lastPos, newPos, timer, delta, direction, delay = 100;
    // function clear() { lastPos = null; delta = 0; direction = true; }
    // clear();
    // return function(){
        // newPos = scrollbarMain.scroll().position.y;
        // if (lastPos != null ) { delta = newPos -  lastPos; }
        // if (lastPos > newPos) { direction = false; } // true = down ; false = up
        // lastPos = newPos;
        // clearTimeout(timer);
        // timer = setTimeout(clear, delay);
        // return [delta * 2.75, direction]; // [speed, up or down]
    // };
// })();

// clean url hash, and if specified after separator
function cleanURL(sep = undefined, push) {
    if (push) {
        history.pushState({}, "", (!sep) ? window.location.pathname : window.location.hash.split(sep)[0]);
    } else {
        history.replaceState({}, "", (!sep) ? window.location.pathname : window.location.hash.split(sep)[0]);
    }
}

// push string to url hash, and if specified after separator, default: "#"
function hashURL(ID, sep = "#") {
    history.pushState({}, "", window.location.hash + sep + ID);
}

// add/remove class to query selected elements
function addClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if (elems) { elems.forEach((el) => { el.classList.add(c); }); }
}
function removeClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if (elems) { elems.forEach((el) => { el.classList.remove(c); }); }
}

// get tuple of center position of specified element
function getCenterOfEl(el) {
    const elRect = el.getBoundingClientRect();
    return [elRect.left + (elRect.width / 2),
            elRect.top + (elRect.height / 2)]
}

// get "project-id" attribute from an element
function getProjectID(i) { return i.getAttribute("project-id"); }
// get "filter-id" attribute from an element
function getFilterID(i) { return i.getAttribute("filter-id"); }

// replace placeholder image with different one when this one is loaded / (stackoverflow.com/a/54123157)
function imgReplaceWithOnceLoaded(elem, newImgSrc, { dummy, dummyReturn = false, customParent }) {
    // initial element should have the placeholder image in "src" and "style:background-image"
    if(elem) {
        if (!dummy) {
            dummy = document.createElement("img");
            dummy.classList.add("dummy");
            dummy.setAttribute("fetchpriority", "high");
            dummy.src = newImgSrc;

            if (customParent) { customParent.appendChild(dummy); }
        }
        dummy.addEventListener("load", function() {
            // when the new one is loaded, replace
            // setTimeout(() => { // debug
                elem.src = newImgSrc;
                setTimeout(() => { elem.style.backgroundImage = null; }, 500); // remove with delay to avoid flash

                // remove dummy element
                if (!dummyReturn) { return dummy; }
            // }, 0);
        });
        dummy.src = newImgSrc;
    }

    // in case the dummy element is needed for other purposes
    if (dummyReturn) { return dummy; }
};
//#endregion

// - Modules -
//#region PROJECTS (const shortcuts)
const pDataDefault = Prj.projectsDataSample.default,
      pContexts = Lang.contexts,
      pFilters = Lang.filters;

// TODO PROJECTS DATA FILL WITH DEFAULT VALUES so that we don't need to check everytime if exists
//function projectDataFillWithDefaults(projectData) {
//    // find and add default values to non existing/wrong project values
//    pDataDefault.forEach((pDefaultEntry) => {
//        const isExisting = Object.hasOwn(projectData, pDefaultEntry);
//    // play with Object.assign()
//
//        console.lo/g(pDefaultEntry, isExisting);
//    })
//}
//projectDataFillWithDefaults(Prj.projectsData[1])

// for each project data
//Prj.projectsData.forEach((projectData) => { projectDataFillWithDefaults(projectData); })

const pData = Prj.projectsData;

// SORT PROJECTS BY DATE
function projectsSortByDate() {
    var projectsDate = [], projectsDateInvalid = [], projectsHidden = [];

    // create list of tuples of all projects : [project_id, project_date]
    Object.entries(pData).forEach((projectData) => {
        const PROJECT = projectData[1];

        // if hidden, skip
        if (PROJECT.hidden == true) {
            projectsHidden.push([projectData[0], PROJECT.date])
            return;
        }

        // if date is invalid, don't sort
        if (!PROJECT.date || (["YYYY.MM", pDataDefault.date]).includes(PROJECT.date)) {
            projectsDateInvalid.push([projectData[0], PROJECT.date])
            return;
        }

        projectsDate.push([projectData[0], PROJECT.date])
    });

    // sort them
    projectsDate.sort((a, b) => {
        function getFinishingDate(date) {
            // separate year and month, get year
            var d = date.split("."),
                y, m;

            if (d.length > 1) {
                // ["2000-2001", "00"] | ["2000", "00-2001"] | ["2000", "01-2001", "00"] | ["2000", "00"] | ["2000", "00-01"]
                d.forEach((mm) => {
                    // year is always lenght 4, month is 2
                    if (![9, 7, 4].includes(mm.length)) { // check if month
                        m = mm.split("-").at(-1); // get finishing month
                        d.splice(d.indexOf(mm), 1); // remove month from "d" to get year later
                    }
                })
                // now we only have years, get the finishing year
                // first, get the last one, then separate month/year and get last one for year (can only be last now)
                y = (d.at(-1)).split("-").at(-1);
            } else { // there is only year : ["2000-2001"]
                y = d[0].split("-").at(-1); // get finishing year
            }

            return [y, m];
        }
        //console.lo/g( // debug for every case
        //    "\n2021-2022 : " + getFinishingDate("2021-2022"),
        //    "\n2000-2001.00 : " + getFinishingDate("2000-2001.00"),
        //    "\n2000.00-2001 : " + getFinishingDate("2000.00-2001"),
        //    "\n2000.01-2001.00 : " + getFinishingDate("2000.01-2001.00"),
        //    "\n2000.00 : " + getFinishingDate("2000.00"),
        //    "\n2000.00-01 : " + getFinishingDate("2000.00-01")
        //);

        const yA = getFinishingDate(a[1]),
              yB = getFinishingDate(b[1]);

        // Compare years first
        if (yA[0] > yB[0]) { return -1;
        } else if (yA[0] < yB[0]) { return 1;
        // if years are the same, compare months
        } else {
            if (yA[1] > yB[1]) { return -1;
            } else if (yA[1] < yB[1]) { return 1;
            // if months are the same, return 0
            } else { return 0; }
        }
    });

    // add invalid projects at the end of the list
    projectsDateInvalid.forEach((invalidProject) => {
        projectsDate.push(invalidProject);
    })

    // return sorted list of tuples [project_id, project_date]
    return projectsDate;
};
// sorted list of tuples of all projects by date
const projectsSortedDate = projectsSortByDate();

// get the project's title
function getProjectTextLang(projectID, nesting = "title", leaveEmpty) {
    return getTextLang({type : "project-id", id : projectID, langDB : "project", langDBNesting : nesting, leaveEmpty : leaveEmpty});
}
//#endregion

//#region LANGUAGE
const Translations = Lang.translations, // translations data-base
      langNavigator = (navigator.language).split("-")[0]; // navigator's language

// array of supported languages
var languagesSupported = [];
Object.entries(Translations).forEach((trID) => { Object.entries(trID[1]).forEach((lang) => { if (!languagesSupported.includes(lang[0])) { languagesSupported.push(lang[0]); } }) });

// check if navigator's language is supported
const langIsNavigatorSupported = languagesSupported.includes(langNavigator);

// current language var, will fallback english if not supported
var language = (langIsNavigatorSupported) ? langNavigator : "en";

// get from the data base the translation of specified entry
function getTextLang({
    type : translateType, // type of element (asked translation), used to get id dynamically
    id : input, // recognize the entry in which the translations are

    langDB, // search in specified language data-base with its id ; if not specified will check in global translations
    // main language data-bases id (string) : "filter", "context", "project"
    // custom data-base can be passed

    langDBNesting, // array of nested entries (string of key) the search goes through to get the translations (in order)
    // ignored if not specified

    leaveEmpty = false // if anything wrong happens, will not leave the id as a placeholder
}) {
    const isEl = (isString(input) || input instanceof String) ? false : true, // check if input is an element
          translateID = (isEl) ? input.getAttribute(translateType) : input,
          nestedDB = (!!langDBNesting); // check if nested DB

    // function to fallback to next language containing the translation (substitute)
    // DB2 : used when the nested entries where the translations are, are separated globally by language (see "filter" & "context" part)
    function findInOtherLang(DB, DB2) {
        console.error(`Translation [${translateType}] for [${translateID}] doesn't exist in language [${language}].\n`, input);

        // stops right when it finds first substitute (optimization)
        for (let l = 0; l < Object.entries(DB).length; l++) {
            const lang = Object.entries(DB)[l];

            var isNewLabel = (isString(lang[1])) ? lang[1]
                             : (DB2) ? lang[1][DB2][translateID] : lang[1][translateID];

            if (isNewLabel) { // found substitute
                console.warn(`Found translation substitute in [${lang[0]}] for [${translateID}].`);
                newLabel = isNewLabel;
                break; // use the first one found (generally english in order)
            }
        }
    }

    // get with the specified language data-base the entry where the translations are (will go through nested entries)
    function findUseDB(passedDB) {
        var findDB = passedDB[translateID]; // recipient in which will be the translations

        if (nestedDB) {
            // if not an array and nesting is directly specified : [nesting level 2]
            if (isString(langDBNesting) || !Array.isArray(langDBNesting)) { findDB = findDB[langDBNesting]; }

            else { // multiple nesting levels
                // go through every nesting level, if error cancel
                for (let level = 0; level < langDBNesting.length; level++) {
                    findDB = findDB[langDBNesting[level]];
                    if (!findDB) { console.error(`Could not find nested translations for [${translateID}] in ${langDB} data (nesting: ${langDBNesting}).`); break; }
                }
            }
        }

        return findDB;
    }

    // get if translation is only static string instead of per language translation
    function findIfStaticLoneStringTl(DB) {
        if (isString(DB)) { newLabel = DB; } // apply string
        else { return; } // leave as is
    }

    // TRANSLATING
    if (!langDB) { // DB depth : 1
        // default: get new label (from global translations)
        var newLabel = Translations[translateType][language][translateID];

        if (!newLabel) { findInOtherLang(Translations[translateType]); }
    }

    else if (["filter", "context"].includes(langDB)) { // DB depth : 2
        // same structure for [filters] and [contexts] so same way for both
        const useDB = (langDB == "filter") ? pFilters : pContexts;

        // data is nested ("format"/"plural"), check if [nesting lvl 2] specified, else get attribute from el
        const langDB_lv2 = (isEl && !langDBNesting) ? input.getAttribute("plural")
                         // if langDBNesting is array, use nesting level 2, else is string, so use it
                         : (isString(langDBNesting) || !Array.isArray(langDBNesting)) ? langDBNesting : langDBNesting[0];

        var newLabel = useDB[language][langDB_lv2][translateID];

        // since nested globally under languages, need to go up the nesting to check
        if (!newLabel) { findInOtherLang(useDB, langDB_lv2); }
    }

    else { // DB depth = 1+
        var useDB, newLabel;
        if (langDB == "project") { useDB = findUseDB(pData); } // projects
        else { useDB = findUseDB(langDB); } // if not corresponding to any known translation data-base, take the passed parameter

        findIfStaticLoneStringTl(useDB);

        if (useDB) {
            if (!newLabel) { newLabel = useDB[language] }
            if (!newLabel) { findInOtherLang(useDB); }
        }
    }

    // if no translation found at all
    if (!newLabel) {
        if (!leaveEmpty) {
            console.warn(`Using ID [${translateID}] as placeholder.`);
            if (isEl) {
                input.setAttribute("no-translation-found", "");
            }
            return `[${translateID}]`;
        }
        else { return ""; }
    }

    return newLabel;
}

// changes every "translatable" valid elements's innerText to the translation in the database
function translatePage() {
    // normal text
    document.querySelectorAll("[translate-id]").forEach((toTranslateEl) => {
        const tl = getTextLang({type : "translate-id", id : toTranslateEl});

        if (toTranslateEl.getAttribute("highlight-words") === "true") {
            toTranslateEl.innerHTML = tl;
        } else {
            toTranslateEl.innerText = tl;
        }
    })
    // bubble tips
    document.querySelectorAll("[translate-bubble-id]").forEach((toTranslateEl) => {
        toTranslateEl.setAttribute("tip", getTextLang({type : "translate-bubble-id", id : toTranslateEl}));
    })
    // filter pills
    document.querySelectorAll(".prj-pill[filter-id]").forEach((toTranslateEl) => {
        toTranslateEl.querySelector("span").innerText = getTextLang({type : "filter-id", id : toTranslateEl, langDB : "filter"});
    })
    // context pills
    document.querySelectorAll(".prj-pill[context-id]").forEach((toTranslateEl) => {
        toTranslateEl.querySelector("span").innerText = getTextLang({type : "context-id", id : toTranslateEl, langDB : "context"});
    })
    // project titles
    document.querySelectorAll("[project-id]:not(.actions)").forEach((toTranslateEl) => {
        const pID = toTranslateEl.getAttribute("project-id");
        toTranslateEl.querySelector(".project-title").innerText = getProjectTextLang(pID);

        // project files
        if (toTranslateEl.classList.contains("project-files")) {
            const catchphrase = toTranslateEl.querySelector(".catchphrase"),
                  secondaryProjects = toTranslateEl.querySelectorAll("[project-secondary-id]"), // project secondary (additional) comments
                  projectFilesDesc = toTranslateEl.querySelector(".desc-content");


            if (catchphrase) {
                catchphrase.innerText = getTextLang({type : "project-id", id : pID, langDB : "project", langDBNesting : "catchphrase", leaveEmpty : true});
            }

            if (secondaryProjects) {
                secondaryProjects.forEach((secondary) => {
                    secondary.querySelector(".comment").innerText = getTextLang({type : "project-id", id : pID, langDB : "project", langDBNesting : ["additional", secondary.getAttribute("project-secondary-id"), "comment"], leaveEmpty : true});
                })
            }

            projectFilesDesc.innerHTML = getProjectTextLang(pID, "desc", true);
            if (projectFilesDesc) {
                projectFileResizeDescImgs(toTranslateEl);
            }
        }
    })

}

// call to change to the next language
function changeLanguage(e, PARAMS = {specificLanguage : false, callTranslatePage : true}) {
    // force language if specified
    if (PARAMS.specificLanguage != false) { language = PARAMS.specificLanguage; return; }

    // use the next language in the list
    const index = languagesSupported.indexOf(language),
          newLanguage = languagesSupported[(index + 1 >= languagesSupported.length) ? 0 : index + 1];

    language = newLanguage;

    // "translate" the page, by default will always do
    if (PARAMS.callTranslatePage) { translatePage(); }

    // need to update some things because sometimes text can be longer/shorter and change scroll length
    scrollEvents();
}

// create menu button to change language
function languageButtonCreate() {
    var languageButton = document.createElement("div");
    languageButton.classList.add("change-language-button");
    languageButton.innerHTML = `
        <span translate-id="change-language-button">${getTextLang({type : "translate-id", id : "change-language-button"})}</span>
        <svg viewbox="0 0 24 12"></svg>
        `;

    document.querySelector("nav.menu").appendChild(languageButton);

    languageButton.addEventListener("click", () => { setTimeout(() => { changeLanguage(); }, 100); });
    boomAnimInit({target : languageButton, specialCase : "languageButton"});
}
//languageButtonCreate();
//#endregion

//#region LOADING
var L = {
    delayBeforeDisplay : 500,
    // load essential assets
    toLoad : {
        "image" : {
            "./assets/medias/" : [
                "cursor-glow.png",
                // "pattern-dot-average.png",
                "pattern-dot-small.png",
                "highlight-words-pattern.png"
            ]
        }
        // TODO "video" (later when needed)
    },
    loaded : {
        necessary : false, // true if page load event, fonts loaded
        assetsMajority : false, // true if "loadMajorityThreshold" assets loaded
        majority : false, // true if "assetsMajority" and "necessary" are true
        assetsAll : false, // true if all assets loaded
        everything : false, // true if "assetsAll" and "necessary" are true
    },
    assetsLoadMajorityThreshold : 0.66, // should not be higher than 1
    assetsLoaded : 0, // current amount of assets loaded
    assetsAmountNb : 0, // amount of assets to load
}

// add projects thumbnails to assets to load list (considering they all have thumbnail images (they should))
var projectsFileName = [];
projectsSortedDate.forEach((p) => { // using sorted list to load the most recent ones first
    const PROJECT = pData[p[0]];
    if (PROJECT.hidden != true) {
        if (PROJECT.type != "vid") {
        projectsFileName.push(p[0] +"_low."+ ((PROJECT.ext) ? PROJECT.ext : pDataDefault.ext));
        }
    }

});
L.toLoad.image["./assets/medias/projects/low/"] = projectsFileName;

// initialize loading screen
function loadingScreenDisplay(type) {
    // create loading screen
    var loadingScreenEl = document.querySelector("loading-screen");
    if (!loadingScreenEl) { // only one shoud exist
        // generate
        loadingScreenEl = document.createElement("loading-screen");
        loadingScreenEl.classList.add("anim-pre")

        loadingScreenEl.innerHTML = `
            <div class="loading-animation-container">
                <div class="head">
                    <span>Loading...</span>
                    <div class="loading-idle-animation"></div>
                </div>

                <div class="loading-percent">
                    <div class="loading-bar">
                        <div class="bar"></div>
                        <div class="flash-1"></div>
                        <div class="flash-2"></div>
                    </div>
                    <span class="percent"></span>
                </div>
                <div class="logs-container"></div>
            </div>
        `;

        // create
        document.body.appendChild(loadingScreenEl);
    }

    // animation in
    setTimeout(() => {
        loadingScreenEl.classList.remove("anim-pre");
    }, L.delayBeforeDisplay);

    if (type == "main") {
         // time in ms
        var loadTimer = 0, // count time
            loadTimerIncrements = 250;

        // avoid repeating logs
        var logsAlreadyDisplayed = [];
        function hasLogAlreadyBeenDisplayed(ID) {
            const check = (logsAlreadyDisplayed.includes(ID)) ? true : false;
            if (!check) { logsAlreadyDisplayed.push(ID); }
            return check;
        }

        // separating both "checks" and "validation" loops because I want "checks" to finish on its own
        var loadCheckMain = setInterval(() => {
            // most of the assets are loaded
            if (L.assetsLoaded > L.assetsAmountNb * L.assetsLoadMajorityThreshold) { L.loaded.assetsMajority = true; }
            // all assets are loaded
            if (L.assetsLoaded >= L.assetsAmountNb) { L.loaded.assetsAll = true; }

            // majority of needed things are loaded (page & most of assets)
            if (L.loaded.necessary && L.loaded.assetsMajority) { L.loaded.majority = true; }
            // all of needed things are loaded (page & assets)
            if (L.loaded.necessary && L.loaded.assetsAll) { L.loaded.everything = true; }

            // check if all checks are all true
            var stopChecks = true;
            Object.entries(L.loaded).forEach((loadCheck) => { stopChecks &= loadCheck[1]; });

            if (stopChecks) { clearInterval(loadCheckMain); } // stop checks loop when not needed anymore
        }, loadTimerIncrements);

        const validationStepsTiming = [1000, 5000, 15000, 30000]; // ["everything", "majority", "necessary", "fail"]
        var loadValidMain = setInterval(() => {
            // display current state
            const progressionPercent = ((L.assetsLoaded / L.assetsAmountNb) * 100).toFixed(0) + "%";
            loadingScreenEl.style.setProperty("--percent", progressionPercent)
            loadingScreenEl.querySelector(".loading-percent .percent").innerHTML = progressionPercent;

            // validation
            function finish() {
                if (loadValidMain) { clearInterval(loadValidMain); } // stop validation loop
                loadingScreenDismiss();
            }

            if (loadTimer >= validationStepsTiming[0] && loadTimer) { if (L.loaded.everything) {
                finish();
            }}
            if (loadTimer >= validationStepsTiming[1] && loadTimer <= validationStepsTiming[2]) { if (L.loaded.majority) {
                if (!hasLogAlreadyBeenDisplayed("majority")) {
                    loadingLogger({ log : "Majority of assets loaded. Dismissing the loading screen.", duration : 6000, callback : finish});
                }
            }}
            if (loadTimer >= validationStepsTiming[2] && loadTimer <= validationStepsTiming[3]) { if (L.loaded.necessary) {
                if (!hasLogAlreadyBeenDisplayed("necessary")) {
                    loadingLogger({ log : "Loading is taking too long. Forcefully dismissing the loading screen. Necessary things are loaded.", duration : 7000, callback : finish});
                }
            }}
            if (loadTimer >= validationStepsTiming[3] && loadTimer) { // last resort security (in case of unexpected errors)
                if (!hasLogAlreadyBeenDisplayed("fail")) {
                    loadingLogger({ log : "Loading is taking WAY too long. Forcefully dismissing the loading screen (what kind of Internet connection is this).", type : "error", duration : 8000, callback : finish});
                }
            }

            loadTimer += loadTimerIncrements;
        }, loadTimerIncrements);
    }
}

function loadingScreenDismiss() {
    // animation out
    const loadingScreenEl = document.querySelector("loading-screen"); // there should only be one existing
    if (loadingScreenEl) {
        loadingScreenEl.classList.add("anim-clear");
        eventAtTransitionEnd(loadingScreenEl, () => { loadingScreenEl.remove(); }, { property : "opacity"})
    }
}

// log anything in the loading UI
function loadingLogger({
    log,
    type = "info", // can be "info"|"error"
    duration = 3500, // duration the log will stay
    customStyle = "", // custom CSS style if specified (prefer properties: color, background-color, margin-top|bottom)
    callback, // do something the moment the log disappears
    callbackDelay, // delay before callback, default is half the log duration
}) {
    var loadingScreenEl = document.querySelector("loading-screen");
    if (loadingScreenEl) { // only if loading screen exists
        // generate
        var logEl = document.createElement("div");
        logEl.classList.add("log");
        logEl.classList.add("anim-pre");
        logEl.setAttribute("type", type);
        logEl.setAttribute("style", customStyle); // custom CSS style if specified
        logEl.innerText = log;

        // create
        loadingScreenEl.querySelector(".logs-container").appendChild(logEl);

        // animation in
        setTimeout(() => {
            logEl.classList.remove("anim-pre");
        }, 10);

        // anim out
        setTimeout(() => {
            logEl.classList.add('anim-clear');
            eventAtTransitionEnd(logEl, () => { logEl.remove(); }, {property : "opacity", once : false});
        }, duration);

        // callback
        setTimeout(() => {
            if (callback) { callback(); }
        }, (callbackDelay) ? callbackDelay : duration / 2);
    }
}

function loadAsset({url, type = "image", callbackWhenLoaded}) {
    // create invisible container for loading assets quietly
    var loaderAssets = document.querySelector("loader-assets");
    if (!loaderAssets) {
        loaderAssets = document.createElement("loader-assets");
        loaderAssets.classList.add("dummy");
        document.body.appendChild(loaderAssets);
    }

    if (type = "image") {
        var assetEl = document.createElement("img");
        assetEl.setAttribute("src", url);
    }

    function finish() {
        if (callbackWhenLoaded) { callbackWhenLoaded(); }
        assetEl.remove();
    }

    // when asset not existing
    assetEl.onerror = () => {
        finish();
        console.warn(`(loader) Load error of [${type}] "${url}".`);
    };

    // when asset loaded
    assetEl.addEventListener("load", () => {
        finish();
    })

    // create
    loaderAssets.appendChild(assetEl);
}

function loadMainAssets() {
    // load page necessary things
    var loadNecessaryChecks = [false, false];
    window.addEventListener("load", () => { // page load event
        loadingLogger({ log : "Page loaded." });
        // loadNecessaryChecks[0] = true;
        // checkNecessaryLoading();
    });
    loadNecessaryChecks[0] = true; // skipping pagel oad for the moment because when loading projectFile it waits to load all iframes (will need a workaround to set to true when project main loaded)
    document.fonts.ready.then(() => { // fonts // they are not too fast and not too long to load, that's good enough
        loadingLogger({ log : "Fonts loaded." });
        loadNecessaryChecks[1] = true;
        checkNecessaryLoading();
    });
    // check if every necessary thing has been loaded
    function checkNecessaryLoading() {
        var loadNecessaryChecksFinal = true;
        loadNecessaryChecks.forEach((nCheck) => { loadNecessaryChecksFinal &= nCheck; });
        if (loadNecessaryChecksFinal) { L.loaded.necessary = true; } // necessary things have been loaded
    }

    // load assets
    var differChunkLoading = 0;
    Object.entries(L.toLoad).forEach((toLoadType) => { // [type, {directories}]
        Object.entries(toLoadType[1]).forEach((toLoadDir) => { // [directory, [assets]]
            // divide by chunks with delay for perfomance reasons
            const toLoadAssetChunks = divideArrayByChunks(toLoadDir[1], 8);

            toLoadAssetChunks.forEach((toLoadAssets) => {
                setTimeout(() => {
                    toLoadAssets.forEach((assetFileName) => {
                        loadAsset({url : toLoadDir[0] + assetFileName, type : toLoadType[0], callbackWhenLoaded : () => { L.assetsLoaded++; }})
                    });
                }, differChunkLoading);
                differChunkLoading += 100;
            });

        });
    });


}

// get total amount of assets to load
Object.entries(L.toLoad).forEach((toLoadType) => {
    Object.entries(toLoadType[1]).forEach((toLoadDir) => {
        L.assetsAmountNb += toLoadDir[1].length;
    });
});

// run
loadingScreenDisplay("main");
loadMainAssets();
//#endregion

//#region OVERLAY SCROLLBARS
var scrollbarMain,
    o1 = [null, 33], OScrHDelay = 200; if (isMini) { o1 = [true, 33]; OScrHDelay = 800; };
document.addEventListener("DOMContentLoaded", function() {
    scrollbarMain = OverlayScrollbars(document.querySelector("[scroll-main]"), {
        autoUpdate : o1[0],
        autoUpdateInterval : o1[1],
        overflowBehavior : {
            x : "hidden",
            y : "scroll"
        },
        scrollbars : {
            visibility : "auto",
            autoHide : "never", // "scroll" "move" "never"
            autoHideDelay : OScrHDelay
        },
        callbacks : {
            //onContentSizeChanged : scrollContentSizeEvents,
            onUpdated : scrollUpdatesEvents,
            onScroll : scrollEvents,
            //onScrollStop : scrollStopEvents,
        }
    });
});

// enable/disable scroll
function scrollbarSetShowState(scrollbar = scrollbarMain, state = false) {
    if (!state) { // default
        scrollbar.options("overflowBehavior.y", "scroll");
    } else if (state == "hide") {
        scrollbar.options("overflowBehavior.y", "hidden");
    }
}

// scrollTo variables
const scrollToDuration = 1250,
      scrollToDurationCard = 1000,
      scrollToDurationElse = 2000;

// speed factor for ice scroll
const iceScrollFactor = (!window.chrome) ? 3 : 7; // chrome has "faster" scroll

// TODO cancel go-to scroll animation if user scrolls the opposite way
//var isScrollingTo = false, isScrollingToPrevPos = [];
//function scrollToForceStop() {
//    if (isScrollingTo) {
//       if (scrollbarMain.scroll().position.y > Math.min(...isScrollingToPrevPos) ||
//           scrollbarMain.scroll().position.y < Math.max(...isScrollingToPrevPos)) {
//           scrollbarMain.scrollStop();
//           isScrollingTo = false;
//       }
//       isScrollingToPrevPos.push(scrollbarMain.scroll().position.y);
//       if (isScrollingToPrevPos.length > 4) { isScrollingToPrevPos.shift(); }
//    }
//    console.lo/g(isScrollingTo, isScrollingToPrevPos, scrollbarMain.scroll().position.y);
//}
//#endregion

//#region BOOM
function boomAnimInit({target, container, specialCase, eventType = "mousedown"}) {
    target.addEventListener(eventType, (ev) => { boomAnim({boomOrigin : ev, target : target, container : container, specialCase : specialCase, eventType : eventType}); });
}

function boomAnim({
    // if specified ("mousedown" event var) will appear from cursor position,
    // else from center of target if specified,
    // else center of container
    boomOrigin = false,
    // if specified : will dismiss boom when "mouseup" or "mouseleave",
    // else will dismiss itself right away
    target = false,
    // boom will fill container
    // default: page viewport
    container = false,
    // custom styling (css class name goes here)
    specialCase = false,
    // dismiss delay (ms)
    fadeOutTime = 1300,

    eventType
}) {

    // container selector
    if (!container) { // if not specified, default to page viewport
        container = doc;
    }

    // origin position of boom
    var originX, originY;
    if (!boomOrigin) { // not at cursor position
        if (!target) { // not at target position
            // will be at center of container
            [originX, originY] = getCenterOfEl(container);
        } else {
            [originX, originY] = getCenterOfEl(target);
        }
    } else { // click position
        originX = boomOrigin.clientX,
        originY = boomOrigin.clientY;
    }

    const containerW = container.clientWidth, containerH = container.clientHeight,
          // get farthest corner from origin
          cornerX = Math.abs(originX - ((originX > containerW / 2) ? 0 : containerW)),
          cornerY = Math.abs(originY - ((originY > containerH / 2) ? 0 : containerH)),
          // use Pythagoras to get circle parameters
          circleDiameter = float(Math.sqrt(cornerX**2 + cornerY**2) + 5) * 2, // get diameter + add 5px to be sure it fills the whole container
          circleRotate = float(Math.atan(cornerX/cornerY)*180/Math.PI) * -1; // get angle to match middle of the circle div edge
          //console.table({containerW2,containerH2, originX,originY, cornerX,cornerY, circleDiameter,circleRotate}) // debug values

    // generate
    var boom = document.createElement("div"),
        boomCircle = document.createElement("div");

    boom.classList.add("boom");
    boomCircle.classList.add("circle");
    if(specialCase) { boom.classList.add(specialCase); }

    boom.style.setProperty("--boom-rotate", circleRotate +"deg");
    boom.style.setProperty("--boom-x", originX +"px");
    boom.style.setProperty("--boom-y", originY +"px");

    // create
    if (container) {
        var boomContainer = container.querySelector("[boom-container]")
        if (!boomContainer) {
            boomContainer = document.createElement("div");
            boomContainer.setAttribute("boom-container", "")
            container.appendChild(boomContainer);
        }
        boomContainer.appendChild(boom);
    } else {
        document.querySelector("[boom-main-container]").appendChild(boom);
    }

    boom.appendChild(boomCircle);

    // animation in
    setTimeout(function() { // delay for computing
        boomCircle.style.setProperty("--boom-size", circleDiameter +"px");
        boomCircle.style.setProperty("--boom-fadeout-time", fadeOutTime +"ms");
        boomCircle.classList.add("final-style");
    }, 10);

    // dismissing the boom
    function boomRemove() {
        setTimeout(function() { // delay for computing
            // animation out
            boomCircle.style.opacity = "0";
            setTimeout(function() {
                boom.remove();
            }, fadeOutTime);
        }, 10);
    }

    if (eventType == "mousedown") {
        // if there is a target element, wait for these events
        if(target) {
            target.addEventListener("mouseup", () => { boomRemove(); });
            target.addEventListener("mouseleave", () => { boomRemove(); });
        }
        // else dismiss right away
        else { boomRemove(); }
    }
    else { boomRemove(); }
}
//#endregion

//#region BUBBLE TIPS
function bubbleTipInit({target, delayAnimIn, force}) {
    var bubbleTipEl_;
    target.addEventListener("mouseenter", () => { bubbleTipEl_ = bubbleTipCreate({target : target, delayAnimIn : delayAnimIn, force : force}); });

    // out
    target.addEventListener("mouseleave", () => { bubbleTipRemove(bubbleTipEl_); })
    target.addEventListener("click", () => { bubbleTipRemove(bubbleTipEl_); })
}

function bubbleTipCreate({target, delayAnimIn = 500, force = false}) {
    delayAnimIn = Math.max(delayAnimIn, 50); // minimal value for delay

    const label = target.getAttribute("tip");
    // cancel if no tip to show
    if (!label) { console.error("no bubble tip specified"); return; }

    // not on touch devices
    if (!isTouchDevice && force) { return; }

    // generate
    var bubbleTipEl;
    bubbleTipEl = document.createElement("div");
    bubbleTipEl.classList.add("bubble-tip");
    bubbleTipEl.classList.add("anim-pre");
    bubbleTipEl.innerHTML = `<div class="point"></div><div class="content"><div class="bg"></div><span>${label}</span></div>`;

    // create
    document.querySelector("[bubble-tips-container]").appendChild(bubbleTipEl);

    // allow getting final size before animating (transform is fucking with size)
    bubbleTipEl.classList.add("normal-scale");
    setTimeout(() => { bubbleTipEl.classList.remove("normal-scale"); }, delayAnimIn / 2); // restore

    // position
    const targetRect = target.getBoundingClientRect(),
          //
          bubblePosX = targetRect.left + (targetRect.width / 2),
          bubblePosY = (targetRect.top + (targetRect.height / 2));

    bubbleTipEl.style.left = bubblePosX +"px";
    bubbleTipEl.style.top = bubblePosY +"px";

    // offset content if offscreen
    setTimeout(() => {
        const bubbleTipContentEl = bubbleTipEl.querySelector(".content"),
              bubbleTipContentRect = bubbleTipContentEl.getBoundingClientRect(),
              //
              borderOffset = 10,
              bubbleCPosXWR = bubblePosX + (bubbleTipContentRect.width / 2),
              bubbleCPosXWL = bubblePosX - (bubbleTipContentRect.width / 2);

        // default position
        var bContentPosX = 0;

        if (bubbleCPosXWR > doc.clientWidth) { // off to the right
            bContentPosX = doc.clientWidth - bubbleCPosXWR - borderOffset;
            bubbleTipContentEl.style.transformOrigin = `calc(75% + ${borderOffset * 2}px) 50%`;
        }
        if (bubbleCPosXWL < 0) { // off to the left
            bContentPosX = 0 - bubbleCPosXWL + borderOffset;
            bubbleTipContentEl.style.transformOrigin = `calc(25% - ${borderOffset * 2}px) 50%`;
        }
        if (bubblePosY + (bubbleTipContentRect.height / 2) + 35 > doc.clientHeight) { // off to the bottom
            bubbleTipEl.classList.add("reverse");
        }

        // TODO : have a better animation for offscreen cases

        bubbleTipContentEl.style.left = bContentPosX +"px";
        bubbleTipContentEl.style.top = 0 +"px";
    }, delayAnimIn / 4);

    // animation in
    setTimeout(() => {
        bubbleTipEl.classList.remove("anim-pre");
    }, delayAnimIn);

    return bubbleTipEl;
}

function bubbleTipRemove(bubbleTipEl) {
    bubbleTipEl.classList.add("anim-clear");
    eventAtTransitionEnd(bubbleTipEl, () => { bubbleTipEl.remove(); }, {property : "opacity", once : false});
    // TODO bubbleTip not removed because transition opacity 0 to 0 doesn't call transition-end event
}
//#endregion

//#region CURSOR CROSS
function cursorCrossShow(curCrossEl) {
    curCrossEl.classList.add("hover");
}
function cursorCrossHide(curCrossEl, force, surface) {
    curCrossEl.classList.remove("hover");

    // needs to be called when : removing element, force when creating element (then un-force after delay)
    if (force) { // force hide
        curCrossEl.classList.add("hidden");
        if (surface) { surface.style.cursor = "pointer"; }
    }
    else { // restore
        curCrossEl.classList.remove("hidden");
        if (surface) { surface.style.cursor = "none"; }
    }
}
function cursorCrossClick(curCrossEl, click) {
    if (click) { curCrossEl.classList.add("click"); }
    else { curCrossEl.classList.remove("click"); }
}
function cursorCrossMove(e, curCrossEl) {
    curCrossEl.classList.add("hover");
    curCrossEl.style.left = e.clientX + 'px';
    curCrossEl.style.top = e.clientY + 'px';
}

function cursorCrossCreate(surface, container, cursorEv) {
    if(!isTouchDevice) {
        // by default, the container will be the parent of the target surface, but it can be specified
        container = (container) ? container : surface.parentElement;

        // generate
        var curCrossEl;
        curCrossEl = document.createElement("div");
        curCrossEl.classList.add("cursor-cross");
        curCrossEl.innerHTML = `
            <svg viewBox="0 0 32 32">
                <g>
                    <line x1="26.3" y1="26.3" x2="5.7" y2="5.7"/>
                    <line x1="5.7" y1="26.3" x2="26.3" y2="5.7"/>
                </g>
            </svg>
        `;

        // create
        container.appendChild(curCrossEl);

        surface.style.cursor = "none";

        // events
        if (cursorEv) { cursorCrossMove(cursorEv, curCrossEl); }
        surface.addEventListener("mousemove", (ev) => { cursorCrossMove(ev, curCrossEl); });
        surface.addEventListener("mouseover", () => { cursorCrossShow(curCrossEl); });
        surface.addEventListener("mouseout", () => { cursorCrossHide(curCrossEl); });
        container.addEventListener("mousedown", () => { cursorCrossClick(curCrossEl, true); });
        container.addEventListener("mouseup", () => { cursorCrossClick(curCrossEl, false); });

        return curCrossEl;
    }
}
//#endregion

//#region CURSOR GLOW
function cursorGlowInit({target, applyTo = [], sizeREM = 65, onlyHover = true}) {
    if (!isTouchDevice) {
        if (onlyHover) {
            target.addEventListener("mousemove", (cursorEv) => { cursorGlowMove(cursorEv, target, applyTo, sizeREM); });
        }
    }
}
function cursorGlowMove(cursorEv, target, applyTo = [], sizeREM) {
    const targetRect = target.getBoundingClientRect();
    applyTo = (applyTo.length > 0) ? applyTo : target;

    Array.from(applyTo).forEach((appTo) => {
        appTo.style.setProperty("--cglow-size", `${sizeREM}rem`);
        appTo.style.setProperty("--cglow-x", `calc(${cursorEv.clientX - targetRect.left}px - (var(--cglow-size) / 2))`);
        appTo.style.setProperty("--cglow-y", `calc(${cursorEv.clientY - targetRect.top}px - (var(--cglow-size) / 2))`);
    })

}
//#endregion


function videoElPlayOnHover(video, hoverEl) {
    hoverEl.addEventListener("mouseover", function (e) { video.play(); })
    hoverEl.addEventListener("mouseout", function (e) { video.pause(); })
}


//#region QUICK VIDEO POPUPS
function quickPopupVideoInit(target, projectID, originEl) {
    target.addEventListener("click", (cursorEv) => { quickPopupVideoCreate(projectID, originEl, cursorEv); });
}
function quickPopupVideoCreate(projectID, originEl, cursorEv) { // popup video projects anywhere
    const PROJECT = pData[projectID];

    cleanURL(); hashURL(projectID + "?vid");

    // generate
    var popVid;
    popVid = document.createElement("div");
    popVid.classList.add("video-popup");
    popVid.classList.add("anim-pre");

    var embed = ``;
    if (PROJECT.type == "vid") {
        const ext = (PROJECT.ext) ? PROJECT.ext : pDataDefault.ext;
        embed = `
            <video autoplay controls loop poster="./assets/medias/projects/low/${projectID}_low.jpg">
                <source src="./assets/medias/projects/high/${projectID}.${ext}" type="video/${ext}">
                <img fetchpriority="high" src="./assets/medias/projects/low/${projectID}_low.jpg">
            </video>
        `;
    } else {
        embed = `<iframe width="1920" height="1080" src="https://www.youtube.com/embed/${(PROJECT.url_id) ? PROJECT.url_id : pDataDefault.url_id}?rel=0&color=white&loop=1&autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    }

    popVid.innerHTML = `
        <div class="bg"></div>
        <div class="ytplayer-c">
            <div class="ytplayer" style="background-color: ${(PROJECT.colorFill) ? PROJECT.colorFill : pDataDefault.colorFill}" aspect-ratio="${(PROJECT.aspectRatio) ? PROJECT.aspectRatio : pDataDefault.aspectRatio}">
                <div class="embed-player-loading"></div>
                ${embed}
            </div>
        </div>
    `;

    // create
    document.querySelector("[video-popups-container]").appendChild(popVid);

    const popVidBG = popVid.querySelector(".bg");

    // animation in : get from position
    // if target element, from center of element
    if (originEl) {
        const targetRect = (originEl.classList.contains("project-cards"))
            // if project card, take thumbnail's center
            ? originEl.querySelector(".thumbnail").getBoundingClientRect()
            : originEl.getBoundingClientRect();

        var popOriginX = targetRect.left + (targetRect.width / 2),
            popOriginY = targetRect.top + (targetRect.height / 2);
        // default position is set to center of viewport with css

        popVid.style.left = popOriginX +"px";
        popVid.style.top = popOriginY +"px";
    }

    // animation in
    setTimeout(() => {
        scrollbarSetShowState(scrollbarMain, "hide");
        popVid.classList.remove("anim-pre");
    }, 100);

    // out
    const curCrossEl = cursorCrossCreate(popVidBG, false, cursorEv);
    if (curCrossEl) { cursorCrossHide(curCrossEl, "force", popVidBG); }

    window.addEventListener("hashchange", () => { quickPopupVideoRemove(popVid, curCrossEl) }, { once:true }); // close on history back event

    setTimeout(() => {
        if (curCrossEl) { cursorCrossHide(curCrossEl, false, popVidBG); }
        popVidBG.addEventListener("click", () => { quickPopupVideoRemove(popVid, curCrossEl); })
    }, 300);
}
function quickPopupVideoRemove(popVid, curCrossEl) {
    cleanURL();
    window.removeEventListener("hashchange", () => { quickPopupVideoRemove(popVid, curCrossEl) }, { once:true });

    // hide curCross
    if (curCrossEl) { cursorCrossHide(curCrossEl, "force"); }
    // enable back main page scrolling
    scrollbarSetShowState(scrollbarMain);
    // remove pop-up
    popVid.classList.add("anim-clear");
    eventAtTransitionEnd(popVid, () => { popVid.remove(); }, {property : "opacity", once : false});
}
//#endregion

//#region STICK IT
function StickIt() {
    document.querySelectorAll(".sticky").forEach((stickyEl) => {
        const target = stickyEl.getBoundingClientRect(),
              targetContainer = stickyEl.parentElement.getBoundingClientRect();

        if (0 < targetContainer.top) { // if container goes out viewport at the top
            // position normal
            stickyEl.classList.remove("sticky-fixed");
            stickyEl.classList.remove("sticky-end");
            stickyEl.style.position = null;
            stickyEl.style.top = null;
            stickyEl.style.bottom = null;

        } else if (target.bottom >= targetContainer.bottom-1 // if sticky element hits the bottom
                && target.top <= 0) { // and if the element's top is under the top of viewport (scroll sticky)
            // position sticked to bottom
            stickyEl.classList.remove("sticky-fixed");
            stickyEl.classList.add("sticky-end");
            stickyEl.style.position = "absolute";
            stickyEl.style.top = "auto";
            stickyEl.style.bottom = 0 +"px";

        } else {
            // position sticked to scroll
            stickyEl.classList.add("sticky-fixed");
            stickyEl.classList.remove("sticky-end");
            stickyEl.style.position = "fixed";
            stickyEl.style.top = 0 +"px";
            stickyEl.style.bottom = null;
        }
    });
}

function StickIt_FlexSiblingsSpaceBetween() { // alternate for perfomance reasons
    document.querySelectorAll(".sticky-fssb").forEach((stickyElContainer) => {
        // there should only be 2 children
        const stickyElSib1 = stickyElContainer.firstElementChild,
            stickyElSib2 = stickyElContainer.lastElementChild,
            targetContainer = stickyElContainer.getBoundingClientRect(),
            target1 = stickyElSib1.getBoundingClientRect(),
            stickySib2Height = stickyElSib2.getBoundingClientRect().height;

        if (doc.clientHeight < targetContainer.bottom) {
            // 2
            // position sticked to bottom of scroll
            stickyElSib2.classList.add("sticky-fixed-end");
            stickyElSib2.style.position = "fixed";
            stickyElSib2.style.left = targetContainer.left +"px";
            stickyElSib2.style.bottom = 0 +"px";
            stickyElSib2.style.width = targetContainer.width +"px";
        } else {
            stickyElSib2.style.position = null;
            stickyElSib2.style.left = null;
            stickyElSib2.style.bottom = null;
            stickyElSib2.style.width = null;
        }

        if (0 < targetContainer.top) { // if container goes out viewport at the top
            // 1
            // position normal
            stickyElSib1.classList.remove("sticky-fixed");
            stickyElSib1.classList.remove("sticky-end");
            stickyElSib1.style.position = null;
            stickyElSib1.style.top = null;
            stickyElSib1.style.left = null;
            stickyElSib1.style.bottom = null;
            stickyElSib1.style.width = null;

            // 2
            stickyElContainer.style.justifyContent = null;

        } else if (target1.bottom >= targetContainer.bottom-1 - stickySib2Height // if sticky element hits the bottom (or hits sibling)
                && target1.top <= 0) { // and if the element's top is under the top of viewport (scroll sticky)
            // 1
            // position sticked to bottom
            stickyElSib1.classList.remove("sticky-fixed");
            stickyElSib1.classList.add("sticky-end");
            stickyElSib1.style.position = "absolute";
            stickyElSib1.style.top = "auto";
            stickyElSib1.style.left = null;
            stickyElSib1.style.bottom = stickySib2Height +"px";
            stickyElSib1.style.width = null;

            // 2
            stickyElContainer.style.justifyContent = "flex-end";

        } else {
            //1
            // position sticked to scroll
            stickyElSib1.classList.add("sticky-fixed");
            stickyElSib1.classList.remove("sticky-end");
            stickyElSib1.style.position = "fixed";
            stickyElSib1.style.top = 0 +"px";
            stickyElSib1.style.left = targetContainer.left +"px";
            stickyElSib1.style.bottom = null;
            stickyElSib1.style.width = targetContainer.width +"px";

            // 2
            stickyElContainer.style.justifyContent = "flex-end";
        }
    });
}
//#endregion

//#region FILTER PILLS
// generate HTML for filter pills with filter ID
function generatePrjPill({
    ID = undefined,
    type = "",
    typeClassDisable = false,
    state = undefined,
    stateCross = false, // will show a cross at the right of the text (this one will appear only if [state="true"])
    plural = false, // true|false
    customClass = "",
    customStaticLabel = "", // custom static label, will never contextually change, is used in priority if specified
    labelTranslateID, // custom label but can be translated
    customIcon = ``,
}) {
    if (!ID && ["filter", "context"].includes(type)) { // cancel if filter/context ID is invalid
        console.error(`(prj-pill) Pill [${type}] ID [${ID}] invalid.`);
        return "";
    }
    plural = (plural) ? "plural" : "format";

    const type_id = `${(type) ? type+"-" : ""}id`,
        //
        label = (customStaticLabel) ? customStaticLabel // use custom static label if specified
                    // get formatted name // use custom label if specified
                : (labelTranslateID) ? getTextLang({type : "translate-id", id : labelTranslateID})
                    : getTextLang({type : type_id, id : ID, langDB : type, langDBNesting : plural});

    labelTranslateID = (labelTranslateID) ? `translate-id="${labelTranslateID}"` : "";
    type = (typeClassDisable) ? "" : type;
    ID = (ID) ? `${type_id}="${ID}"` : "";
    state = (state) ? `state="${state}"` : "";
    stateCross = (!stateCross) ? false : `<div class="cross"><svg viewBox="0 0 24 24"><line x1="0" y1="0" x2="24" y2="24" /><line x1="24" y1="0" y2="24" /></svg></div>`;

    return `<div ${ID} class="prj-pill ${type} ${customClass}" ${state} plural="${plural}">
        ${(customIcon) ? customIcon : ``}
        <span ${labelTranslateID}>${label}</span>
        ${(stateCross) ? stateCross : ``}
    </div>`
}
//#endregion


//#region LANDING
cursorGlowInit({target : document.querySelector(".content-sections#landing .y-logo-pattern"), applyTo : document.querySelectorAll(".content-sections#landing .cursor-glow"), sizeREM : 88, onlyHover : true});
document.querySelector(".content-sections#landing .scroll-down-notice").addEventListener("click", scrollToFiltersSection);

//#endregion

/*
//#region RECENT PROJECTS SECTION
var RP = {
    projectsNb : 4,
    section : document.querySelector("#recent-projects"),
    slidesContainer : document.querySelector("#recent-projects #recent-projects-slides"),
    allSlides : {},
}

function recentProjectsCreate() {
    // get the most recent projects
    var recentProjects = [], getRecentPrjCount = 1;
    for (let i = 0; i < projectsSortedDate.length; i++) {
        const prj = projectsSortedDate[i];
        if (pData[prj[0]].excludeRecent != true) { // ignore projects with "excludeRecent" true
            recentProjects.push(prj);
            getRecentPrjCount++
        }
        if (getRecentPrjCount > RP.projectsNb) { break; }
    }

    var slides = ``; // recipient

    // generate
    recentProjects.forEach((recentProject) => {
        const projectID = recentProject[0], PROJECT = pData[projectID];

        var filters = ``;
        const projectFiltersList = ((PROJECT.filter) ? PROJECT.filter : pDataDefault.filter).split("|");
        F.filtersValidIDs.forEach((filter) => { // only valid filters and in order of filter list
            if (projectFiltersList.includes(filter)) {
                filters += generatePrjPill({ID : filter, type : "filter"});
            }
        })

        var thumbnail = ``;
        if (PROJECT.type == "vid") {
            const ext = (PROJECT.ext) ? PROJECT.ext : pDataDefault.ext;
            thumbnail = `
                <video loop muted poster="./assets/medias/projects/low/${projectID}_low.jpg">
                    <source src="./assets/medias/projects/high/${projectID}.${ext}" type="video/${ext}">
                    <img fetchpriority="high" src="./assets/medias/projects/low/${projectID}_low.jpg">
                </video>
            `;
        } else {
            thumbnail = `<img fetchpriority="high" src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}">`;
        }

        slides += `
            <div project-id="${projectID}" class="recent-slides cursor-glow-before" style="--project-color-accent: ${(PROJECT.colorAccent) ? PROJECT.colorAccent : pDataDefault.colorAccent}; --project-color-fill: ${(PROJECT.colorFill) ? PROJECT.colorFill : pDataDefault.colorFill}">
                <div class="in">
                    <div class="bg-slide"></div>
                    <div class="thumbnail">${thumbnail}</div>
                    <div class="data">
                        <span class="project-title">${getProjectTextLang(projectID)}</span>
                        <div class="filters">
                            ${filters}
                        </div>
                    </div>
                </div>
            </div>
        `;
    })

    // create
    RP.slidesContainer.innerHTML = slides;

    // store recent slides elements
    RP.allSlides = RP.slidesContainer.querySelectorAll(".recent-slides");

    // set filter buttons actions
    RP.slidesContainer.querySelectorAll(".prj-pill[filter-id]").forEach((filterButton) => {
        filterButton.addEventListener("click", (e) => { filtersAction({caller : e, isolate : true, customScrollToDuration : scrollToDurationElse}); });
    })

    // apply z-index in order of slides
    for (let i = 1; i <= RP.projectsNb; i++) { RP.allSlides[RP.projectsNb - i].style.zIndex = i; }

    // scroll to filters button click action
    RP.section.querySelector("#intro-rp .goto_filters-txt").addEventListener("click", scrollToFiltersSection);


    RP.slidesContainer.querySelectorAll("[project-id]").forEach((rpSlide) => {
        const rpSlideClickable = rpSlide.querySelector(".bg-slide");

        // project file open action
        rpSlideClickable.addEventListener("click", (cursorEv) => {
            projectFileCreate(getProjectID(rpSlide), rpSlide, cursorEv);
        });

        // video thumbnails
        if (pData[rpSlide.getAttribute("project-id")].type == "vid") {
            videoElPlayOnHover(rpSlide.querySelector(".thumbnail video"), rpSlideClickable);
        }
    });

    // cursor glow
    // RP.allSlides.forEach((slide) => { cursorGlowInit({target : slide, sizeREM : 150}) });
}

// shift slides until reach top of vp
function recentProjectsScrollIn() {
    const scrollY = scrollbarMain.scroll().position.y;
    if (scrollY < doc.clientHeight + 200) {
        // apply position
        RP.section.querySelector("#recent-projects-slides").style.transform =
            `translateY(max(${mapRange(scrollbarMain.scroll().position.y,
                                0, doc.clientHeight,
                                doc.clientHeight / 3, 0)
                        }px, 0px))`;
    }
}
//#endregion
*/

//#region GO TO FILTERS BUTTON
function scrollToFiltersSection() {
    //isScrollingTo = true;

    scrollbarMain.scroll(
        document.querySelector(".content-sections#filters"),
        scrollToDuration,
        "easeInOutQuart"
        //() => { isScrollingTo = false; }
        );
}
function scrollToProjectsListFilters({scrollToForce = false, scrollDuration = scrollToDurationCard, scrollToQuick = false, scrollToTitle = false}) {
    const filtersBarRect = F.filtersContainer.getBoundingClientRect(),
          projectsListRect = F.projectsListContainer.getBoundingClientRect();

    // will trigger only if filters bar is not on fully on screen
    if (filtersBarRect.top < 0 || filtersBarRect.bottom > doc.clientHeight || scrollToForce) {
        // scroll for filter bar buttons : need to scrollTo if projects list is far away, else skip
        if (scrollToForce == "main") {
            if (projectsListRect.top - filtersBarRect.bottom <= 30) {
                return;
            }
        }

        // buttons are off-screen
        F.filterBtnsOnScreen = false;

        //isScrollingTo = true;

        // scrollTo base position (filters bar's position changes with scroll so we offset the scrollTo with height)
        var scrollToPos = projectsListRect.top;

        // default scrollTo pos : top of filters bar
        scrollToPos -= filtersBarRect.height;
        // top of filters title
        if (scrollToTitle) { scrollToPos -= F.introContainer.querySelector(".title-filters").offsetHeight + 30; }
    }
    else { // skip if on screen
        F.filterBtnsOnScreen = true; // skip delay to generate projects list
        return;
    }

    scrollbarMain.scroll(
        { y : `+= ${scrollToPos}px` },
        scrollDuration,
        (scrollToQuick == true) ? "easeOutQuint" : "easeInOutQuart"
        //() => { isScrollingTo = false; }
    );
}
//#endregion

//#region FILTERS SECTION
var F = {
    filtersValidIDs : [], // array of filters's id
    selectedFilters : [], // array of selected filters's id
    allFilterBtns : {}, // node list of all filters buttons
    allOtherBtns : {}, // node list of all other filter buttons that are not filters (it makes sense trust me)
    allBtns : {},
    previousFilters : [], // used to check if filters changed or not
    previousDateOrder : "false", // used to check if date order changed or not

    section : document.querySelector(".content-sections#filters"),
    introContainer : null,

    filtersContainer : null,
    filtersContainerHeight : 0, // needed for positions calculations
    filterBtnsOnScreen : false, // check if filter buttons are on screen or not (to scroll-to or not)

    projectsListContainer : null,
    projectsDisplayedNbEl : null, // number of projects found
    countUpProjectsNb : null, // var for count-up animation

    projectsListContentElements : {}, // node list of #projects-list content
    projectsListColumnGroupCurrentIndex : 0, // column to show depending on viewport width
    projectsListColumnLongestInGroups : [], // array of length of each column group
    columnsNbMax : 3, // number of columns to display the projects list
    columnsNbMin : 1, // value excluded, there will be no columns under that number
    animateInLinesOfCards : 3, // number of lines of cards to animate in (decimal values work too)
}
// generate array of all valid filters
Prj.projectsDataSample.filtersValid.split("|").forEach((filter) => {
    if (filter) { F.filtersValidIDs.push(filter); } // avoid empty filters
});

// elements
F.introContainer = F.section.querySelector("#intro-filters");
F.filtersContainer = F.introContainer.querySelector(".filters-selector");
F.projectsListContainer = F.section.querySelector("#projects-list");


// get all currently selected filters
function filtersGetSelected() {
    var selectedFilters = [];
    F.allFilterBtns.forEach((filterButton) => {
        var state = filterButton.getAttribute("state");
        if (state === "true") {
            selectedFilters.push(getFilterID(filterButton));
        }
    });
    return selectedFilters;
}

function filtersClearProjectsList() {
    // animation out for all (hypothetically) projects list present
    F.projectsListContainer.querySelectorAll(".projects-list").forEach((pl) => {
        pl.classList.add("anim-clear");
        eventAtTransitionEnd(pl, () => { pl.remove(); }, {property : "transform", once : false});
    })
}

function filtersGenerateProjectsList() {
    // update all selected filters
    F.selectedFilters = filtersGetSelected();

    // if no filter selected, use all of them
    //F.selectedFilters = F.selectedFilters == [] ? F.allFilterIDs : F.selectedFilters; // no need actually, [] is always true

    // selected projects arrays
    var selectedProjects = [], selectedProjectsSorted = [];
    // loop through each existing project and select the ones with corresponding filters
    Object.entries(pData).forEach((projectData) => {
        // get project filters
        const pF = projectData[1].filter;

        // if (pF) { // disabled because projects without filters can be useful?
            var verif = [];
            // check for filters one by one
            F.selectedFilters.forEach(sFilter => {
                if (!pF.split("|").includes(sFilter)) { // filter missing
                    verif.push(false);
                    return; // skip
                } else { // filter present
                    verif.push(true);
                }
            });
            // if one filter is missing, skip
            if (!verif.includes(false)) { // select project if has all filters selected
    // added quirk : if no selected filter, will select all projects since [] is not false
                selectedProjects.push(projectData[0]);
            }
        // }
        // else { return; } // if no filter then skip
    });

    // remove duplicates (even though it's already quite reliable)
    selectedProjects = [...new Set(selectedProjects)];

    // sort by date using existing sorted projects list
    projectsSortedDate.forEach((project) => {
        if(selectedProjects.includes(project[0])) {
            selectedProjectsSorted.push(project[0]);
        }
    });
    const selectedProjectsNb = selectedProjectsSorted.length;

    // date order : false = descending | true = ascending
    const dateOrder = F.filtersContainer.querySelector(`.main .prj-pill.date`).getAttribute("state");
    if (dateOrder === "true") { selectedProjectsSorted.reverse(); }

    // if no filter selected, hide "clear filters" button
    if(F.selectedFilters.length > 0) {
        F.filtersContainer.querySelector(".secondary").classList.remove("hidden");
    } else {
        F.filtersContainer.querySelector(".secondary").classList.add("hidden");
    }

    // projects list
    var projectsListContent = ``;
    // create projects list / content container
    var projectsList = document.createElement("div");
    projectsList.setAttribute("filters", (F.selectedFilters.toString()).replace(/,/g, "_")); // specify each filters
    projectsList.classList.add("projects-list");

    // GENERATE CONTENT
    if (selectedProjectsNb > 0) { // at least one project found
        // generate columns
        var allColumns = [];
        // initialize columns storage
        for (let cIndex = 0; cIndex < F.columnsNbMax; cIndex++) {
            allColumns.push([]); // init column groups
            for (let colIndex = 0; colIndex < cIndex + 1; colIndex++) {
                allColumns[cIndex].push([``]); // init columns (in which project cards will be)
            }
        }

        // generate HTML for all columns patterns
        // starting with selected projects for perfomance reasons,
        // it's faster to loop through all projects then columns than all columns then projects
        for (let spIndex = 0; spIndex < selectedProjectsSorted.length; spIndex++) {
            const projectID = selectedProjectsSorted[spIndex], PROJECT = pData[projectID];

            // generating project card
            var filters = ``;
            const projectFiltersList = PROJECT.filter.split("|");
            F.filtersValidIDs.forEach((filter) => { // only valid filters and in order of filter list
                if (projectFiltersList.includes(filter)) {
                    filters += generatePrjPill({ID : filter, type : "filter", state : ((F.selectedFilters.includes(filter)) ? "true" : false)});
                }
            })
            // PROJECT.filter.split("|").forEach((filter) => { // filters in order of in data of project (not consistent)
                // if (F.allFilterIDs.includes(filter)) { // only if filter is valid
                    // filters += generatePrjPill({ID : filter, type : "filter", state : ((F.selectedFilters.includes(filter)) ? "true" : false)});
                // }
            // }) //${(spIndex < F.animateInLinesOfCards) ? `transition-delay:${spIndex / 10}s;` : `transition: none;`}

            var thumbnail = ``;
            if (PROJECT.type == "vid") {
                const ext = (PROJECT.ext) ? PROJECT.ext : pDataDefault.ext;
                thumbnail = `
                    <video loop muted poster="./assets/medias/projects/low/${projectID}_low.jpg">
                        <source src="./assets/medias/projects/high/${projectID}.${ext}" type="video/${ext}">
                        <img fetchpriority="high" src="./assets/medias/projects/low/${projectID}_low.jpg">
                    </video>
                `;
            } else {
                thumbnail = `<img src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}">`;
            }

            const projectCardHTML = `
                <div project-id="${projectID}" list-nb="${spIndex}" class="project-cards" style="transition: none; --project-color-accent: ${(PROJECT.colorAccent) ? PROJECT.colorAccent : pDataDefault.colorAccent}; --project-color-fill: ${(PROJECT.colorFill) ? PROJECT.colorFill : pDataDefault.colorFill}">
                    <div class="in">
                        <div class="thumbnail">${thumbnail}</div>
                        <div class="header">
                            <span class="project-title">${getProjectTextLang(projectID)}</span>
                            ${(["yt", "vid"].includes((PROJECT.type) ? PROJECT.type : pDataDefault.type)) // if video : add popup button to see the video without leaving the page
                            ? `<div class="video-quick-popup-button">
                                    <div class="width"></div>
                                    <div class="button" translate-bubble-id="plist-video-quick-popup-btn" tip="${getTextLang({type : "translate-bubble-id", id : "plist-video-quick-popup-btn"})}">
                                        <div class="bg"></div>
                                        <svg class="arrow" viewbox="0 0 24 24">
                                            <path d="M6.55,22.19l14.16-8.17c1.5-0.87,1.5-3.03,0-3.9L6.55,1.95C5.05,1.08,3.18,2.16,3.18,3.9v16.35C3.18,21.97,5.05,23.06,6.55,22.19z"/>
                                        </svg>
                                    </div>
                                </div>`
                            : ``}
                        </div>
                    </div>
                    <div class="bg-card cursor-glow-before"></div>
                    <div class="filters">
                        ${filters}
                    </div>
                </div>
            `;

            // generate each columns, while alternating projects in each
            for (let cIndex = F.columnsNbMin; cIndex < F.columnsNbMax; cIndex++) {
                // using euclidian division, we can get index of column for the project with its index
                // this is the column to put the current project in
                const column = spIndex % (cIndex + 1);

                // adding the project card's HTML in the corresponding column in the columns group
                allColumns[cIndex][column] += projectCardHTML;
            }

        }

        // which column group should be used right away
        projectListColumnsByRatio(F.columnsNbMax - F.columnsNbMin);
        // force the number of columns because when no columns exists it returns default value (0)

        // generate columns
        for (let cIndex = F.columnsNbMin; cIndex < F.columnsNbMax; cIndex++) {
            // generating column
            var columnContent = ``;
            for (let col = 0; col < allColumns[cIndex].length; col++) {
                columnContent += `
                    <div column="${col + 1}" style="z-index: ${F.columnsNbMax - col};">
                        ${allColumns[cIndex][col]}
                    </div>
                `
            }
            // generating column group
            projectsListContent += `
                <div ${(F.projectsListColumnGroupCurrentIndex + F.columnsNbMin == cIndex) ? `class="anim-pre"` : ``} style="grid-template-columns: repeat(${cIndex + 1}, 1fr);" column-group="${cIndex + 1}">
                    ${columnContent}
                </div>
            ` // "anim-pre" only to currently shown column-group
        }
    }
    else { // no projects found
        projectsListContent += `
            <div class="nothing-found ice-scroll anim-pre">
                <div class="content-container">
                    <div class="title" translate-id="filters-nothing-found-title">${getTextLang({type : "translate-id", id : "filters-nothing-found-title"})}</div>
                    <div class="txt" translate-id="filters-nothing-found-txt">${getTextLang({type : "translate-id", id : "filters-nothing-found-txt"})}</div>
                </div>
            </div>
        `
    }

    // clear the way for the new content (generally projects list)
    // must happen before creation because when animating out projects list, we put "position:absolute"
    // which fucks up the container's height and the scroll length
    filtersClearProjectsList();

    // CREATE CONTENT
    projectsList.innerHTML = projectsListContent; // content
    F.projectsListContainer.appendChild(projectsList);

    // store content
    F.projectsListContentElements = [...projectsList.children];
    //F.projectsListContentElements = projectsList.querySelectorAll(".nothing-found");
    //F.projectsListContentElements = projectsList.querySelectorAll("[column-group]");

    // update again for column groups visibility
    projectListColumnsByRatio();

    // since columns are offset by scroll, need to reduce size of container
    filtersColumnLongestUpdate();
    // image loads will change the track's length, need to adjust
    F.projectsListContainer.querySelectorAll("img").forEach((img) => {
        img.addEventListener("load", () => {
            filtersColumnLongestUpdate();
        });
    });

    // code used after creation
    if (selectedProjectsNb > 0) {
        // for each columns groups
        F.projectsListContentElements.forEach((columnGrp) => {
            const colGrpIndex = parseInt(columnGrp.getAttribute("column-group"));

            // for each column in columns group
            columnGrp.querySelectorAll("[column]").forEach((column) => {
                // set max-width to columns when there are a lot because they can overflow
                if (colGrpIndex >= 5) {
                    column.style.maxWidth = `calc((100vw - (var(--p) * 2)) / ${colGrpIndex})`;
                }
            });

            // animate in the first F.animateInLinesOfCards amount of lines of cards
            for (let i = 0; i < colGrpIndex * F.animateInLinesOfCards; i++) {
                const card = columnGrp.querySelector(`.project-cards[list-nb="${i}"]`);
                if (!card) { break; } // stop if no more cards
                card.style.transition = null; // cancel the "transition: none;" put by default when generating
                card.style.transitionDelay = i / 10 +"s";
            }

            columnGrp.querySelectorAll(".project-cards").forEach(card => {
                const pID = getProjectID(card),
                      vidPopBtn = card.querySelector(".video-quick-popup-button");

                projectFileInit(card, pID);
                cursorGlowInit({target : card.querySelector(".in"), applyTo : [card.querySelector(".cursor-glow-before")]});

                // video thumbnails
                if (pData[pID].type == "vid") {
                    videoElPlayOnHover(card.querySelector(".thumbnail video"), card.querySelector(".in"));
                }

                // video quick popup button
                if (vidPopBtn) {
                    bubbleTipInit({target : vidPopBtn.querySelector(".button"), delayAnimIn : 100});
                    quickPopupVideoInit(vidPopBtn, pID, card);
                }
            });
        });
    }

    // animation in set ups
    if (selectedProjectsNb > 0) {
    } else {
        var txtNoPrjFound = projectsList.querySelector(".nothing-found .txt");
        txtNoPrjFound.innerHTML = txtNoPrjFound.textContent.replace(/\S+/g, "<span class='words'>$&</span>");
        //txtNoPrjFound.querySelectorAll(".words").forEach(word => {
        //    word.innerHTML = word.textContent.replace(/\S/g, "<span class='letters'>$&</span>");
        //});

        for (let i = 0; i < txtNoPrjFound.querySelectorAll(".words").length; i++) {
            txtNoPrjFound.querySelector(`.words:nth-child(${i + 1})`).style.transitionDelay = (i / 17.5) + 0.5 +"s";
        }

        //anime({
        //    targets: txtNoPrjFound.querySelectorAll(".words"),
        //    translateY: [40, 0],
        //    opacity: [0, 1],
        //    easing: "easeOutExpo",
        //    duration: 1200,
        //    delay: (el, i) => 500 + 30 * i
        //});
    }

    // animation in trigger
    setTimeout(() => {
        F.projectsListContentElements.forEach((col) => {
            col.classList.remove("anim-pre");
        })
    }, 250);

    // TODO
    // put the last project card in odd columns (starting from 0) since they're the ones going up
    // but only if there are more than 3 lines of projects (arbitrary number, test with scroll speed later)
    // do this to one more project every 3 lines in more
    // -> calculate for every columns, if projectNm/columnNb > 3 : add one, > 6 : add 2, etc
    // to this per column, meaning if there are 4 columns, add one for each odd (2)

    /*/// before that column groups madness
    var projectsCards = ``;
    selectedProjectsSorted.forEach((projectID) => {
        const PROJECT = pData[projectID];
        // FILTERS
        var filters = ``;
        PROJECT.filter.split("|").forEach((filter) => { filters += generateFPill({filterID : filter, type : "filter"}); })
        // CARDS GENERATION
        projectsCards += `
            <div project-id="${projectID}" class="project-cards">
                <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.jpg"></div>
                <span class="project-title">${getProjectTextLang(projectID)}</span>
                <div class="filters">
                    ${filters}
                </div>
            </div>`
    })
    // CREATION
    F.projectsListContainer.innerHTML = projectsCards;
    ///*/

    // set filter buttons actions
    F.projectsListContainer.querySelectorAll(".project-cards .prj-pill[filter-id]").forEach((filterButton) => {
        filterButton.addEventListener("click", (e) => { filtersAction({caller : e, isolate : true, delay : scrollToDurationCard * (5/7), scrollToQuick : true}); });
    })

    // TODO do not re generate if filters give the same results (especially if no projects are found (selectedProjectsNb = 0)

    // display new number of projects found
    if (F.previousDateOrder == dateOrder || JSON.stringify(F.previousFilters) != JSON.stringify(F.selectedFilters)) { // do not update if just changing date order / update if selected projects changed
        if(selectedProjectsNb == 0) { // if not projects found
            F.projectsDisplayedNbEl.classList.remove("counting");
            F.projectsDisplayedNbEl.classList.add("none");
        } else {
            F.projectsDisplayedNbEl.classList.add("counting")
            F.projectsDisplayedNbEl.classList.remove("none");
        }
        // duration of counting depends of number of projects shown, the more the longer
        F.countUpProjectsNb.options.duration = 0.5 + mapRange(selectedProjectsNb, 0, projectsSortedDate.length, 0, 1.75);
        // start from 0 and go to new number
        F.countUpProjectsNb.reset();
        F.countUpProjectsNb.update(selectedProjectsNb);
        // remove counting styles at the end of counting
        F.countUpProjectsNb.start(() => { F.projectsDisplayedNbEl.classList.remove("counting"); });

        // plural or singular label
        const pFoundLabel = F.introContainer.querySelector(".secondary .filter-projects-number [anim-count]+span");
        if(selectedProjectsNb <= 1) { // if no more than 1 project found
            pFoundLabel.setAttribute("translate-id", "plist-projects-found-singular");
        } else {
            pFoundLabel.setAttribute("translate-id", "plist-projects-found");
        }
        pFoundLabel.innerText = getTextLang({type : "translate-id", id : pFoundLabel});

    }

    // reset "previous" vars
    F.previousFilters = F.selectedFilters;
    F.previousDateOrder = dateOrder;
}

function filtersAction({caller, isolate = false, delay = 0, scrollToForce, customScrollToDuration, scrollToQuick, scrollToTitle}) {
    // which filter called?
    caller = caller.target;
    const selectedFilter = F.filtersContainer.querySelector(`.prj-pill[filter-id="${getFilterID(caller)}"]`);

    // scroll to filters click action
    if (F.filtersContainer) {

    }
    caller.addEventListener("click", scrollToProjectsListFilters({scrollToForce : scrollToForce, scrollToQuick : scrollToQuick, scrollDuration : customScrollToDuration, scrollToTitle : scrollToTitle}));

    // if button is on screen, skip scrollTo animation delay
    delay = (F.filterBtnsOnScreen == true) ? 0 : delay;

    setTimeout(() => {
        if (isolate) { // reset every other filter (even date order)
            if (F.selectedFilters.length == 1 && F.selectedFilters[0] == getFilterID(caller)) {
                 // cancel re-creation of projects list if isolated filter is the same (will keep date order)
                return;
            }
            F.allBtns.forEach((btn) => { btn.setAttribute("state", false); });
            // enable selected filter
            selectedFilter.setAttribute("state", "true");
        }
        else { // invert selected filter's state
            selectedFilter.setAttribute("state", (selectedFilter.getAttribute("state") === "true") ? "false" : "true");
        }

        // generate projects list
        filtersGenerateProjectsList();
    }, delay);
}

function filtersUpdateDateBubbleTip(dateEl = F.filtersContainer.querySelectorAll(".main .prj-pill.date")) {
    if (dateEl.getAttribute("state") === "false") {
        dateEl.setAttribute("translate-bubble-id", "filters-date-false");
    } else {
        dateEl.setAttribute("translate-bubble-id", "filters-date-true");
    }
    dateEl.setAttribute("tip", getTextLang({type : "translate-bubble-id", id : dateEl}));
}

function filtersCreateFiltersList() {
    // generate filter pills
    var allButtonsHTML = ``;
    F.filtersValidIDs.forEach((filter) => {
        allButtonsHTML += generatePrjPill({ID : filter, type : "filter", stateCross : true, plural : true});
    })
    allButtonsHTML += generatePrjPill({ID : "date", type : "filter", typeClassDisable : true, customClass : "date", plural : false,
        customIcon : `<svg viewBox="0 0 24 24">
            <path d="M11,22.02l-8.42-6.2c-0.75-0.55-0.91-1.6-0.36-2.35l0,0c0.55-0.75,1.6-0.91,2.35-0.36l3.98,2.94c2.05,1.51,4.83,1.51,6.88,0l3.98-2.94c0.75-0.55,1.8-0.39,2.35,0.36l0,0c0.55,0.75,0.39,1.8-0.36,2.35L13,22.02C12.4,22.46,11.6,22.46,11,22.02z"/>
            <path d="M12,22.35c-0.93,0-1.68-0.75-1.68-1.68V3.33c0-0.93,0.75-1.68,1.68-1.68s1.68,0.75,1.68,1.68v17.33C13.68,21.59,12.93,22.35,12,22.35z"/>
        </svg>`});
    // create buttons
    F.filtersContainer.innerHTML = `
            <div class="main">
                ${allButtonsHTML}
            </div>
            <div class="secondary">
                <div class="left">
                    <div class="animate">
                        ${generatePrjPill({customClass : "clear-filters-button", labelTranslateID : "filters-clear-filters",
                            customIcon : `<svg viewBox="0 0 24 24">
                                <path d="M22.04,5.31L22.04,5.31c0-0.9-0.73-1.63-1.63-1.63H3.59c-0.9,0-1.63,0.73-1.63,1.63v0c0,0.9,0.73,1.63,1.63,1.63h16.82C21.31,6.94,22.04,6.21,22.04,5.31z"/>
                                <path d="M10.45,2.38h3.11c0.51,0,0.92-0.41,0.92-0.92v0c0-0.51-0.41-0.92-0.92-0.92h-3.11c-0.51,0-0.92,0.41-0.92,0.92v0C9.53,1.97,9.94,2.38,10.45,2.38z"/>
                                <path d="M16.85,8.24h-9.7c-1.12,0-2.03,0.91-2.03,2.03v8.93c0,2.37,1.92,4.3,4.3,4.3h6.17c2.37,0,3.3-1.92,3.3-4.3v-8.93C18.88,9.15,17.97,8.24,16.85,8.24z M10.69,17.12c0,0.51-0.41,0.92-0.92,0.92s-0.92-0.41-0.92-0.92v-5.03c0-0.51,0.41-0.92,0.92-0.92s0.92,0.41,0.92,0.92V17.12z M15.15,17.12c0,0.51-0.41,0.92-0.92,0.92h0c-0.51,0-0.92-0.41-0.92-0.92v-5.03c0-0.51,0.41-0.92,0.92-0.92h0c0.51,0,0.92,0.41,0.92,0.92V17.12z"/>
                            </svg>`})}
                    </div>
                </div>
                <div class="right">
                    <div class="filter-projects-number"><span anim-count>69</span><span translate-id="plist-projects-found"></span></div>
                </div>
            </div>
    `;

    // store filters
    F.allFilterBtns = F.filtersContainer.querySelectorAll(".main .prj-pill.filter");
    // store other buttons (date)
    F.allOtherBtns = F.filtersContainer.querySelectorAll(".main .prj-pill:not(.filter)");
    // store all buttons
    F.allBtns = F.filtersContainer.querySelectorAll(".main .prj-pill");

    // set filter buttons actions & states
    F.allBtns.forEach((filterButton) => {
        filterButton.setAttribute("state", false); // by default, every filter is false
        filterButton.addEventListener("click", (e) => { filtersAction({caller : e, scrollToForce : "main", scrollToTitle : true}); });
    })

    // bubble tips
    // date -> tell if "most recent" or "oldest"
    const fDateEl = F.filtersContainer.querySelector(".main .prj-pill.date");
    fDateEl.addEventListener("mouseenter", () => {
        filtersUpdateDateBubbleTip(fDateEl);
    });
    bubbleTipInit({target : fDateEl});

    // "clear filters" button
    F.filtersContainer.querySelector(".secondary .clear-filters-button").addEventListener("click", () => {
        // reset filters state
        F.allBtns.forEach((filterButton) => { filterButton.setAttribute("state", false); });
        // display all projects
        filtersGenerateProjectsList();
    })

    // set secondary line animations delay
    var addDelay = 0;
    F.filtersContainer.querySelectorAll(".secondary .animate").forEach((el) => {
        el.style.transitionDelay = addDelay +"s";
        addDelay += 0.25;
    })

    // set CountUp.js for projects found count
    F.projectsDisplayedNbEl = F.filtersContainer.querySelector(".secondary .filter-projects-number [anim-count]");
    F.countUpProjectsNb = new CountUp(F.projectsDisplayedNbEl, 0, {
        startVal: 1,
        decimalPlaces: 0,
        duration: 2,
        useGrouping: true,
        useEasing: true,
        separator: ",",
        easingFn : (t, b, c, d) => {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        },
        enableScrollSpy: false
    });

    // clear container
    F.projectsListContainer.innerHTML = ``;

    // display all projects by default
    filtersGenerateProjectsList();
}

function getFiltersContainerHeight() {
    F.filtersContainerHeight = F.introContainer.querySelector(".in > *:last-child").getBoundingClientRect().bottom
                             - F.introContainer.querySelector(".in > *:first-child").getBoundingClientRect().top;
}

function filtersScrollCalcs() {
    const projectsListOffset = F.projectsListContainer.getBoundingClientRect().top,
          docHeight = doc.clientHeight;
    // if (projectsListOffset < docHeight * 2.5) { // avoid unnecessary calculations // needed for [highlighted-words] (reusing for performance reasons)
        getFiltersContainerHeight();

        // TODO update only when necessary (when filtersContainerHeight changes)
        filtersColumnLongestUpdate();

        const filtersIntro = F.introContainer.querySelector(".in"),
              endAnim = docHeight / 4 + F.filtersContainerHeight / 2;

        filtersIntro.style.height = `calc(25% + ${F.filtersContainerHeight / 2}px)`;
        // nice slow filters scroll down (this is why height at 25%, we translate 25% too)
        filtersIntro.style.transform = `translateY(${
            constrain(mapRange(projectsListOffset, docHeight, endAnim,
                docHeight / 4, 0), 0, docHeight / 4)}px)`;

        // nice slow filters text size going smol
        //filtersIntro.style.fontSize =
        //    constrain(mapRange(projectsListOffset, docHeight, endAnim,
        //        2, 1.7), 1.7, 2) +"em";

        if (!isTouchDevice) {

            // columns scroll offset
            doc.style.setProperty("--ice-scroll-offset", float(projectsListOffset / iceScrollFactor) +"px");

            // resize projects list with columns scroll offset because it leaves empty space at the end
                // but it recalculates at every frames, it's not good
                // so I opted for calculating the final offset right away (see filtersColumnLongestUpdate)
            //if (F.projectsListContentElements.length > 0) {
            //    F.projectsListContentElements[F.projectsListColumnGroupCurrentIndex].style.height =
            //        F.projectsListColumnLongestInGroups[F.projectsListColumnGroupCurrentIndex] + float(projectsListOffset / 3 / 3)
            //        +"px";
            //}
        }
}

// columns are offset by scroll, need to reduce size of container to avoid empty space at the end
function filtersColumnLongestUpdate(iceScrolling = true) {
        if (!isTouchDevice) {
        //if (F.projectsListContentElements[F.projectsListColumnGroupCurrentIndex]) {
            // getting the longest column of each group
            //F.projectsListColumnLongestInGroups = []; // reset
            //if (F.projectsListContentElements.length > 0) {
            //    F.projectsListContentElements.forEach((columnGroup) => {
            //        // geting the longest column's index
            //        // get all column's height
            //        var columnsHeight = [];
            //        columnGroup.querySelectorAll("[column]").forEach((column) => { columnsHeight.push(column.offsetHeight); });
            //        // store longest column's height
            //        F.projectsListColumnLongestInGroups.push(Math.max(...columnsHeight));
            //    });
            //}

            // getting the track length of each group, each column is same length because "display: grid/flex"
            F.projectsListColumnLongestInGroups = []; // reset
            if (F.projectsListContentElements.length > 0) {
                F.projectsListContentElements.forEach((element) => {
                    if (element.querySelector("[column]")) {
                        iceScrolling = "column";
                        // we take any column and store its height
                        F.projectsListColumnLongestInGroups.push(element.querySelector("[column]").offsetHeight);
                    }
                    else { // not a column
                        iceScrolling = false;
                        F.projectsListColumnLongestInGroups.push(element.querySelector(".content-container").offsetHeight);
                    }
                });
            }

            // calculate the offset with track length and ice scrolling offset value
            const trackLength = F.projectsListColumnLongestInGroups[F.projectsListColumnGroupCurrentIndex],
                finalColumnsOffset = trackLength / iceScrollFactor - F.filtersContainerHeight / 2;

            // resize value dependant on ice scrolling
            var resize;
            //if (iceScrolling == "column") { // columns ice scroll
            //    resize = float(trackLength - finalColumnsOffset / 3) + 50;
            //} else
            if (iceScrolling) { // ice scroll
                resize = float(trackLength - finalColumnsOffset / iceScrollFactor) + 50;
            } else { // no ice scroll
                resize = trackLength;
            }
            F.projectsListContentElements[F.projectsListColumnGroupCurrentIndex].style.height = resize +"px";
            F.projectsListContainer.style.height = `calc(${resize}px + var(--plist-ptop) + var(--plist-pbottom)`; // to animate length changes
        //}
        }
} // resize event + load event on project cards img

function projectListColumnsByRatio(ColumnsNb = F.projectsListContentElements.length) {
    if (ColumnsNb > 1) {
        const docW = doc.clientWidth,
              forceFirstColumn = 727, // force display of first column to this width
              screenWMin = 0, screenWMax = 1920,
              columnsIncrements = (screenWMax - (screenWMin + forceFirstColumn)) / (ColumnsNb - ((forceFirstColumn != 0) ? 1 : 0));
        var incrementMin, incrementMax;

        for (let i = 0; i < ColumnsNb; i++) {
            incrementMin = (i == 0) ? 0                : incrementMax;
            incrementMax = (i == 0) ? forceFirstColumn : incrementMin + columnsIncrements;

            const columnEl = F.projectsListContentElements[i];

            if ((docW >= incrementMin && docW <= incrementMax)
                || (i == ColumnsNb - 1 && docW >= incrementMax))
            {
                    F.projectsListColumnGroupCurrentIndex = i;
                    if (columnEl) { columnEl.classList.remove("hidden"); }
            } else {
                if (columnEl) { columnEl.classList.add("hidden"); }
            }
        }
    } else {
        F.projectsListColumnGroupCurrentIndex = 0; // default
    }
    //console.lo/g(doc.clientWidth, "col Nb:",ColumnsNb, "col index:",F.projectsListColumnGroupCurrentIndex, ColumnsNb > 1);
}
//#endregion

//#region PROJECTS FILE
function projectFileInit(target, projectID) {
    target.addEventListener("click", (cursorEv) => {
        // only if ".in "clicked
        if (cursorEv.target !== target.querySelector(".in")) { return; }

        projectFileCreate(projectID, target, cursorEv);
    });
}
function projectFileCreate(projectID, card, cursorEv) {
    const PROJECT = pData[projectID];

    cleanURL(); hashURL(projectID);
    // TODO change page title with projectID (and translate title)

    // generate
    var projectFile = document.createElement("div");
    projectFile.classList.add("project-files");
    projectFile.classList.add("anim-pre");
    projectFile.classList.add("anim-pre-content");
    projectFile.setAttribute("project-id", projectID);

    // HTML recipients
    var headerMainContentHTML = ``, headerSecondaryContentHTML = ``,
        filtersHTML = ``, contextsHTML = ``;

    // project main content
    const aspectRatio = (PROJECT.aspectRatio) ? PROJECT.aspectRatio : pDataDefault.aspectRatio,
          imgAspectRatioForce = (PROJECT.aspectRatio) ? aspectRatio : false;

    if(PROJECT.type == "img") {
        // by default, put the thumbnail as a placeholder for the hd project image (they generally have the same aspect ratio so it's fine)
        const prjImgLowSrc = `./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}`;

        headerMainContentHTML = `
           <img class="project-main" src="${prjImgLowSrc}" style="background-image: url(${prjImgLowSrc}); ${
               (PROJECT.needBG) ? `background-color: ${(PROJECT.needBG === true) ? "var(--p-needbg-default)" : PROJECT.needBG};` : "" // background color if needed and specified
           }" ${(imgAspectRatioForce) ? `aspect-ratio="${imgAspectRatioForce}"` : ""}>
        `;
    }
    else if(PROJECT.type == "yt") {
        headerMainContentHTML = `
            <div class="project-main" aspect-ratio="${aspectRatio}">
                <div class="embed-player-loading"></div>
                <div class="embed-player-placeholder"></div>
                <iframe width="1920" height="1080" src="https://www.youtube.com/embed/${(PROJECT.url_id) ? PROJECT.url_id : pDataDefault.url_id}?rel=0&color=white&loop=1" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
    }
    else if(PROJECT.type == "embed") {
        headerMainContentHTML = `
            <div class="project-main" aspect-ratio="${aspectRatio}">
                <div class="embed-player-loading"></div>
                <div class="embed-player-placeholder"></div>
                <iframe src="${((PROJECT.embed) ? PROJECT.embed : pDataDefault.embed)}" width="1920px" height="1080px" frameborder="0" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe>
            </div>
        `;
    }
    else if (PROJECT.type == "vid") {
        const ext = (PROJECT.ext) ? PROJECT.ext : pDataDefault.ext;
        headerMainContentHTML = `
            <video class="project-main" aspect-ratio="${aspectRatio}" controls loop style="pointer-events: all;" poster="./assets/medias/projects/low/${projectID}_low.jpg">
                <source src="./assets/medias/projects/high/${projectID}.${ext}" type="video/${ext}">
                <img fetchpriority="high" src="./assets/medias/projects/low/${projectID}_low.jpg">
            </video>
        `;
    }

    // project secondary content
    if (PROJECT.additional) {
        // add every additionnal content one after the other
        Object.entries(PROJECT.additional).forEach((addPrj) => {
            const PRJADD = addPrj[1]; // data

            headerSecondaryContentHTML += `<div project-secondary-id="${addPrj[0]}">`; // open

            // add by type
            if (PRJADD.type == "img") {
                headerSecondaryContentHTML += `
                    <img class="project-secondary" fetchpriority="high" src="./assets/medias/projects/high/${projectID}/${addPrj[0]}.${(PRJADD.ext) ? PRJADD.ext : pDataDefault.ext}">
                `;
            }
            // add comment if exists
            if (PRJADD.comment) {
                headerSecondaryContentHTML += `
                    <div class="comment">${getTextLang({type : "project-id", id : projectID, langDB : "project", langDBNesting : ["additional", addPrj[0], "comment"], leaveEmpty : true})}</div>
                `;
            }

            headerSecondaryContentHTML += `</div>`; // close
        })
    }

    // filters
    const projectFiltersList = PROJECT.filter.split("|");
    F.filtersValidIDs.forEach((filter) => { // only valid filters and in order of filter list
        if (projectFiltersList.includes(filter)) {
            filtersHTML += generatePrjPill({ID : filter, type : "filter"});
        }
    })

    // contexts
    PROJECT.context.split("|").forEach((context) => { contextsHTML += generatePrjPill({ID : context, type : "context"}); })

    // head
    const headHTML = `
        <div class="head">
            <div class="title-container">
                <div class="project-title">${getProjectTextLang(projectID)}</div>
            </div>
            <div class="head-buttons">
                <div class="close-file-button">
                    <svg viewBox="0 0 24 24">
                        <line x1="0" y1="0" x2="24" y2="24" />
                        <line x1="24" y1="0" y2="24" />
                    </svg>
                </div>
                <div class="change-language-button">
                    <span translate-id="change-language-button">${getTextLang({type : "translate-id", id : "change-language-button"})}</span>
                    <svg viewbox="0 0 24 12"></svg>
                </div>
            </div>
        </div>
    `,
    //
    // description
    descriptionContentHTML = `
        ${getProjectTextLang(projectID, "desc", true)}
    `;

    // final html
    projectFile.innerHTML = `
        <div class="file">
            ${headHTML}
            <div class="separator-line"></div>
            <div class="project-main-container">
                ${headerMainContentHTML}
                <div class="data-container sticky-fssb sticky-fssb-not-mini">
                    <div class="top">
                        <div class="filters">${filtersHTML}</div>
                        <div class="contexts">${contextsHTML}</div>
                        <div class="date"><span>${(PROJECT.date) ? PROJECT.date : pDataDefault.date}</span></div>
                    </div>
                    <div class="bottom">
                        ${(!PROJECT.catchphrase) ? `` : `<div class="catchphrase">${getProjectTextLang(projectID, "catchphrase")}</div>`}
                    </div>
                </div>
            </div>
            <div class="project-secondary-container">
                <div class="secondary">${headerSecondaryContentHTML}</div>
            </div>
            <div class="description">
                <!--<div class="head-top">${headHTML}</div>-->
                ${(!descriptionContentHTML) ? "" : `<div class="desc-content">${descriptionContentHTML}</div>`}
            </div>
        </div>
    `
    // TODO if no catchphrase, remove padding of bottom

    // create
    document.querySelector("[project-files-container]").appendChild(projectFile);

    const pFileElMainC = projectFile.querySelector(".project-main-container");
    pFileElMainC.setAttribute("project-type", PROJECT.type);
    projectFile.style.setProperty("--project-color-accent", (PROJECT.colorAccent) ? PROJECT.colorAccent : pDataDefault.colorAccent);
    projectFile.style.setProperty("--project-color-fill", (PROJECT.colorFill) ? PROJECT.colorFill : pDataDefault.colorFill);

    // useless parts
    const pFileElMainDataBottom = pFileElMainC.querySelector(".bottom");
    if (pFileElMainDataBottom.children.length < 1) { pFileElMainDataBottom.classList.add("no-content"); }

    patternBgCreate(projectFile, {fileSrc : "./assets/medias/pattern-dot-small.png", size : 4, randomizePos : false});

    const stickyEl_FSSB_All = projectFile.querySelectorAll(".sticky-fssb");
    function checkSticky() {
        if (isTablet) {
            stickyEl_FSSB_All.forEach((stickyEl) => { stickyEl.classList.remove("sticky-fssb") })
        } else {
            stickyEl_FSSB_All.forEach((stickyEl) => { stickyEl.classList.add("sticky-fssb") })
            StickIt_FlexSiblingsSpaceBetween();
        }
    }
    checkSticky();
    window.addEventListener("resize", checkSticky);

    const languageButtons = projectFile.querySelectorAll(".change-language-button");
    languageButtons.forEach((langBtn) => {
        langBtn.addEventListener("click", () => { setTimeout(() => { changeLanguage(); }, 0); });
        boomAnimInit({target : langBtn, container : projectFile, specialCase : "languageButton", eventType : "click"});
    })

    // after "create" code
    if (PROJECT.type == "img") {
        const fileMainPrjImgEl = projectFile.querySelector("img.project-main"),
              prjImgHighSrc = `./assets/medias/projects/high/${projectID}.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}`;

        // replace the placeholder thumbnail when the hd project image is loaded
        // and get back dummy element to get values (which will be removed with project file at the end since it's its parent so no worries)
        var prjImgHighDummy = imgReplaceWithOnceLoaded(fileMainPrjImgEl, prjImgHighSrc, { dummy : prjImgHighDummy, dummyReturn : true, customParent : projectFile });

        // get size of low res project img first
        getSizeAndResizeToRatioPrjContent({elIMG : fileMainPrjImgEl, intensityMs : 20, durationMs : 12000, tellSizeTypeTo : pFileElMainC});

        // get size of high res project img after to make sure it corresponds to high res one
        getSizeAndResizeToRatioPrjContent({elIMG : fileMainPrjImgEl, dummyElIMG : prjImgHighDummy, tellSizeTypeTo : pFileElMainC});
    }
    if (PROJECT.type == "vid" && !PROJECT.aspectRatio) { // fallback if aspect ration is unknown
        var pVideo = projectFile.querySelector("video.project-main");
        pVideo.addEventListener( "loadedmetadata", () => {
            resizeToRatioPrjContent({elToResize : pVideo, sizes : [pVideo.videoWidth, pVideo.videoHeight]})
        }, false);
    }
    // do the same for additional content, but only if specified
    if (PROJECT.additional) {
        // styling if additional
        pFileElMainC.classList.add("has-secondary-content");

        // resizing
        Object.entries(PROJECT.additional).forEach((addPrj) => {
            const PRJADD = addPrj[1], // data
                  fileSecondPrjEl = projectFile.querySelector("[project-secondary-id='"+ addPrj[0] +"'] img.project-secondary");

            if (PRJADD.sizeFill == "width") { fileSecondPrjEl.style.width = "100%"; }
            else if (PRJADD.sizeFill == "height") { fileSecondPrjEl.style.height = "95vh"; }

            if (PRJADD.type == "img" && !["width", "height"].includes(PRJADD.sizeFill)) {
                getSizeAndResizeToRatioPrjContent({elIMG : fileSecondPrjEl});
                pFileElMainC.classList.add("has-secondary-content-same-ratio");
            }
        })
    }
    // the same as well for the description's content
    if (PROJECT.desc) {
        projectFileResizeDescImgs(projectFile); // in a function to be reused when translating
    }

    // scrollbar
    var scrollbarPrjFile = OverlayScrollbars(projectFile, {
        autoUpdate : o1[0],
        autoUpdateInterval : o1[1],
        overflowBehavior : {
            x : "hidden",
            y : "scroll"
        },
        scrollbars : {
            visibility : "auto",
            autoHide : "never", // "scroll" "move" "never"
            autoHideDelay : OScrHDelay
        },
        callbacks : {
            onScroll : scrollPrjFileEvents,
        }
    });
    function scrollPrjFileEvents() {
        projectFile.style.setProperty("--scroll-pos-y", scrollbarPrjFile.scroll().position.y +"px");

        //StickIt();
        StickIt_FlexSiblingsSpaceBetween();
    }

    // in
    setTimeout(() => {
        for (let i = 0; i < 8; i++) { // for loop to make sure it's applied correctly
            setTimeout(() => {
                StickIt_FlexSiblingsSpaceBetween();
            }, 400 * i);
        }

        scrollbarPrjFile.scroll(0, 0); // make sure to be at the top
        scrollbarSetShowState(scrollbarMain, "hide"); // remove main page scroll

        // animation in
        projectFile.classList.remove("anim-pre");
            // animation in content
            setTimeout(() => {
                projectFile.classList.remove("anim-pre-content");
            }, 400);
    }, 0);

    // out
    function projectFileRemove() { // no need to have this function out of main
        scrollbarSetShowState(scrollbarMain); // restore main page scroll
        scrollbarSetShowState(scrollbarPrjFile, "hide")
        cleanURL();
        window.removeEventListener("hashchange", projectFileRemove, { once:true });
        window.removeEventListener("resize", checkSticky);

        // animation out
        projectFile.classList.add("anim-clear-content");
        setTimeout(() => {
            projectFile.classList.add("anim-clear");
        }, 200);
        eventAtTransitionEnd(projectFile, () => {
            scrollbarPrjFile.destroy(); // remove project file's scroll instance
            projectFile.remove();
        }, {property : "opacity", once : false});
    }

    // filters actions
    pFileElMainC.querySelectorAll(".prj-pill[filter-id]").forEach((filterButton) => {
        filterButton.addEventListener("click", (e) => {
            projectFileRemove();
            filtersAction({caller : e, isolate : true, delay : 400});
        });
    })

    window.addEventListener("hashchange", projectFileRemove, { once:true }); // close on history back event
    projectFile.querySelector(".close-file-button").addEventListener("click", projectFileRemove);
}

// set size of project content img
function resizeToRatioPrjContent({elToCheck, elToResize, sizes, dummy, removeDummy = true}) {
    const prjHighSize = (sizes) ? sizes : (dummy) ? [dummy.naturalWidth, dummy.naturalHeight] : [elToCheck.naturalWidth, elToCheck.naturalHeight];
    if (dummy && removeDummy) { dummy.remove(); } // not needed anymore

    // check which side is longer to fill correctly
    var squarishAdd = prjHighSize[0] * 0.1,
        sizeType; // return size type of img after calculations
    //if (prjHighSize[0] > prjHighSize[1] - squarishAdd && prjHighSize[0] < prjHighSize[1] + squarishAdd) { // squarish aspect ratios
    if (prjHighSize[0] < prjHighSize[1] + squarishAdd && prjHighSize[0] > prjHighSize[1] - squarishAdd) { // squarish aspect ratios
        sizeType = "squarish";
        elToResize.style.height = "97.5vh";
    } else if (prjHighSize[1] > prjHighSize[0]) { // height >
        sizeType = "long";
        elToResize.style.height = "95vh";
    } else { // width >
        sizeType = "wide";
        elToResize.style.width = "var(--width-main)"; // 75%
    }

    return sizeType;
}
// loops for some time until it gets the size of img element, then it resizes
function getSizeAndResizeToRatioPrjContent({elIMG, elApply, dummyElIMG, removeDummy, intensityMs = 30, durationMs = 2000, tellSizeTypeTo}) {
    const elToCheck = (dummyElIMG) ? dummyElIMG : elIMG;
    var sizeType, loopLimit = (durationMs/intensityMs).toFixed(0), loopGetPrjHighRes = setInterval(function () { // loop until found
        if (elToCheck.naturalWidth) {
            clearInterval(loopGetPrjHighRes); // stop loop
            sizeType = resizeToRatioPrjContent({elToCheck : elToCheck, elToResize : (elApply) ? elApply : elToCheck, dummy : dummyElIMG, removeDummy : removeDummy}); // resize
            if (tellSizeTypeTo) { tellSizeTypeTo.setAttribute("project-size-type", sizeType); } // if additional styling is necessary, can be used for css
        }
        loopLimit--;
        if (loopLimit < 0) { // stop loop if not found after "durationMs" ms
            console.error(`(project file) <img src> not found "${elToCheck.src}".`);
            clearInterval(loopGetPrjHighRes);
        }
    }, intensityMs);

}
// for project files description's medias
function projectFileResizeDescImgs(projectFile) {
    const descEl = projectFile.querySelector(".description");

    // resizing
    descEl.querySelectorAll(".img_ratio > *:first-child img").forEach((descImg) => {
        getSizeAndResizeToRatioPrjContent({elIMG : descImg, elApply : descImg.parentElement.parentElement});
    })
    descEl.querySelectorAll(".img_ratio > img").forEach((descImg) => {
        getSizeAndResizeToRatioPrjContent({elIMG : descImg});
    })
    descEl.querySelectorAll(".desc-content > .desc-media img").forEach((descImg) => {
        getSizeAndResizeToRatioPrjContent({elIMG : descImg});
    })
    // descEl.querySelectorAll(".desc-content > .desc-media img").forEach((descImg) => {
        // getSizeAndResizeToRatioPrjContent({elIMG : descImg});
    // })

    descEl.querySelectorAll(".desc-content .desc-media[size-fill]").forEach((descImg) => {
        if (descImg.getAttribute("size-fill") == "width") { descImg.style.width = "100%";
        } else if (descImg.getAttribute("size-fill") == "height") { descImg.style.height = "100%";
        } else if (descImg.getAttribute("size-fill") == "vp-height") { descImg.style.height = "95vh";
        }
    })
}
//#endregion

function patternBgRandomizePos(patternBgEl) {
    patternBgEl.style.setProperty("--start-x", getRandomInt(-2000, 2000) +"px");
    patternBgEl.style.setProperty("--start-y", getRandomInt(-2000, 2000) +"px");
}

function patternBgCreate(container, {fileSrc = "./assets/medias/pattern-dot-average.png", size = 5, speedFactor = 0.1, randomizePos = false}) {
    // generate
    var patternBgEl = document.createElement("div");
    patternBgEl.classList.add("pattern-bg");
    // pattern
    patternBgEl.style.backgroundImage = `url(${fileSrc})`;
    patternBgEl.style.setProperty("--size", `${size}%`);
    // speed
    patternBgEl.style.setProperty("--speed-factor", speedFactor);
    // move
    patternBgEl.style.setProperty("--start-x", 0 +"px");
    patternBgEl.style.setProperty("--start-y", 0 +"px");
    if (randomizePos) { patternBgRandomizePos(patternBgEl); }

    // create
    container.appendChild(patternBgEl);
}

// open project file or quick video popup if corresponding to URL hash
function projectOpenFromURLHash() {
    const hashProject = decodeURI(window.location.hash.substring(1)).split("?"); // get hash string

    // if project exists
    if (Object.keys(pData).includes(hashProject[0])) {

        // open its vid, if compatible
        if (hashProject[1] == "vid") {
            if (["yt", "vid"].includes(pData[hashProject[0]].type)) {
                quickPopupVideoCreate(hashProject[0]);
                return;
            }
        }

        projectFileCreate(hashProject[0]);
    }
}


// UPDATES EVENTS
// function updateAll() {
// }

//function scrollContentSizeEvents() {
//    //filtersColumnLongestUpdate();
//}
function scrollUpdatesEvents() {
    //updateAll();
}
function scrollEvents() {
    // doc.style.setProperty("--scroll-pos-y", scrollbarMain.scroll().position.y +"px"); // using "--ice-scroll-offset" for performance reasons

    //updateAll();

    //scrollToForceStop();
    StickIt();

    // recentProjectsScrollIn();

    filtersScrollCalcs();
}
//function scrollStopEvents() {
//    isScrollingToPrevPos = [];
//}
window.addEventListener("resize", () => {
    //updateAll();

    StickIt();

    filtersScrollCalcs();
    projectListColumnsByRatio();
    filtersColumnLongestUpdate(); // must be after projectListColumnsByRatio
});


function init() {
    // page text in corresponding language
    translatePage();

    // RECENT PROJECTS
    // recentProjectsCreate();

    // FILTERS
    filtersCreateFiltersList();

    // PROJECT FILES
    projectOpenFromURLHash();
    window.addEventListener("hashchange", () => { console.log("t"); projectOpenFromURLHash(); }); // open with history forward

    // STICKY ELEMENTS
    for (let i = 0; i < 8; i++) { // for loop to make sure it's applied correctly
        setTimeout(() => { // delay for when opening page with hash of sections
            StickIt();
        }, 400 * i);
    }
}
document.addEventListener("DOMContentLoaded", init);
