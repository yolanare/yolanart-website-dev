// - IMPORTS -
import "../node_modules/overlayscrollbars/css/OverlayScrollbars.css";
import "../node_modules/overlayscrollbars/js/OverlayScrollbars.js";

import * as Prj from "./assets/js/projects.js";
import "./index.html"
import "./main.scss"


//- VARIABLES -
var doc = document.documentElement,
    isMini, // boolean if viewport is small like a phone
    touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement), // boolean if touched device
    pageContentContainer = document.querySelector("main#content-container"), // main container of page
    language = (/^fr\b/.test(navigator.language)) ? "fr" : "en"; // language (default : en)

// check the viewport size, set boolean "isMini" if vp goes small
function checkWinSize() { isMini = (window.innerWidth > 727); };
checkWinSize(); window.addEventListener("resize", checkWinSize);

// check if browser is chromium based
if(!!window.chrome) { document.querySelector("html").classList.add("isChr"); }


// PROJECTS (const shortcuts)
const pData = Prj.projectsData,
      mData = Prj.categoriesData,
      pDataDefault = Prj.projectsDataSample.default,
      mDataDefault = Prj.categoriesDataSample.default,
      pContexts = Prj.contexts,
      pFilters = Prj.filters;


// - REUSABLE FUNCTIONS -
// convert to float and round to .01
function float(str) { return parseFloat(str.toFixed(2)) }

// convert to radian or to degrees
const deg2rad = Math.PI/180,
      rad2deg = 180/Math.PI;

// take a value, convert it from a range to another range, and rounded to .01
function mapRange(value, low1, high1, low2, high2) { // Processing's map function
    return float(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

// call function at end of css transition of element (no propagation, option to do it only once)
function addEvTrEnd(elem, func, property, once) {
    var isNotAlready = true,
        property = property ? property : false, // default: false
        once = once ? once : true; // once? / default: true

    if(!property) { // will check for all css properties
        elem.addEventListener("transitionend", () => { func(); }, { once : once });
    } else { // will check only for specified css property
        elem.addEventListener("transitionend", (ev) => { if(ev.propertyName == property) { func(); }}, { once : once });
    }

    trEndAlready.forEach(e => { isNotAlready &= (e == elem) ? false : true; }); // check if already checking for trEnd
    if(isNotAlready) {
        trEndAlready.push(elem);
        elem.childNodes.forEach((el) => { el.addEventListener("transitionend", (ev) => { ev.stopPropagation(); })});
    }
} var trEndAlready = [];

// get scroll speed
var checkScrollSpeed = (function(){ // (https://stackoverflow.com/a/22599173)
    var lastPos, newPos, timer, delta, direction, delay = 100;
    function clear() { lastPos = null; delta = 0; direction = true; }
    clear();
    return function(){
        newPos = scrollbarMain.scroll().position.y;
        if(lastPos != null ) { delta = newPos -  lastPos; }
        if(lastPos > newPos) { direction = false; } // true = down ; false = up
        lastPos = newPos;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);
        return [delta * 2.75, direction]; // [speed, up or down]
    };
})();

// clean url hash, and if specified, after separator
function cleanURL(sep) {
    sep = sep || null;
    history.replaceState({}, "", (!sep) ? window.location.pathname : window.location.hash.split(sep)[0]);
}

// add/remove class to query selected elements
function addClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach((el) => { el.classList.add(c); }); }
}
function removeClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach((el) => { el.classList.remove(c); }); }
}

// get "project-id" attribute from an element
function pID(i) { return i.getAttribute("project-id"); }


// - Modules -
// OVERLAY SCROLLBARS
var scrollbarMain,
    o1 = [null, 33], OScrHDelay = 200; if(!isMini) { o1 = [true, 33]; OScrHDelay = 800; };
document.addEventListener("DOMContentLoaded", function() {
    scrollbarMain = OverlayScrollbars(document.querySelector("[scroll-main]"), {
        autoUpdate : o1[0],
        autoUpdateInterval : o1[1],
        overflowBehavior : {
            x : "hidden",
            y : "scroll"
        },
        scrollbars : {
            autoHide : "move", // "never"
            autoHideDelay : OScrHDelay
        },
        callbacks : {
            onUpdated : scrollUpdateEvents,
            onScroll : scrollEvents
        }
    });
});

function scrollUpdateEvents() {
    recentProjectsUpdates();
}
function scrollEvents() {
    StickIt();
    recentProjectsSlides();
    recentProjectsScrollIn();
}


// STICK IT
function StickIt() {
    document.querySelectorAll(".sticky").forEach((stickyEl) => {
        const target = stickyEl.getBoundingClientRect(),
              targetContainer = stickyEl.parentElement.getBoundingClientRect();

        if(0 < targetContainer.top) { // if container goes out viewport at the top
            // position normal
            stickyEl.parentElement.classList.remove("fixed");
            stickyEl.style.position = null;
            stickyEl.style.top = null;
            stickyEl.style.bottom = null;
        } else if(target.bottom >= targetContainer.bottom && target.top <= 0) { // if sticky element hits the bottom
            // position sticked to bottom
            stickyEl.parentElement.classList.remove("fixed");
            stickyEl.style.position = "absolute";
            stickyEl.style.top = "auto";
            stickyEl.style.bottom = 0 +"px";
        } else{
            // position sticked to scroll
            stickyEl.parentElement.classList.add("fixed");
            stickyEl.style.position = "fixed";
            stickyEl.style.top = 0 +"px";
            stickyEl.style.bottom = null;
        }
    });
}

// SORT PROJECTS BY DATE
function projectsSortDate() {
    var projectsDate = [];

    // create list of tuples of all projects : [project_id, project_date]
    Object.entries(pData).forEach(projectData => {
        const PROJECT = projectData[1];
        if(!PROJECT.date || (["YYYY.MM", pDataDefault.date]).includes(PROJECT.date)) { return; } // skip if no date specified
        projectsDate.push([projectData[0], PROJECT.date])
    });

    // sort them
    projectsDate.sort((a, b) => {
        function getFinishingDate(date) {
            // separate year and month, get year
            var d = date.split("."),
                y, m;

            if(d.length > 1) {
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
            } else{ // there is only year : ["2000-2001"]
                y = d[0].split("-").at(-1); // get finishing year
            }

            return [y, m];
        }
        //console.log( // debug with every case
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
        if(yA[0] > yB[0]) { return -1;
        } else if(yA[0] < yB[0]) { return 1;
        // if years are the same, compare months
        } else{
            if(yA[1] > yB[1]) { return -1;
            } else if(yA[1] < yB[1]) { return 1;
            // if months are the same, return 0
            } else{ return 0; }
        }
    });

    return projectsDate;
}
const projectsSortedDate = projectsSortDate();


// RECENT PROJECTS CREATION
var rP = {
    projectsNb : 4,
    //trackDivisor : 2,
    allCards : {},
    trackEl : document.querySelector("#recent-projects"),
    trackLength : 0,
    trackSegments : [],
}

function createRecentProjects() {
    // get the most recent projects
    const recentProjects = projectsSortedDate.slice(0, rP.projectsNb);

    var slides = ``, actions = ``;

    recentProjects.forEach((recentProject) => {
        const projectID = recentProject[0], PROJECT = pData[projectID];

        // FILTERS
        var filters = ``;
        ((PROJECT.filter) ? PROJECT.filter : pDataDefault.filter).split("|").forEach((filter) => {
            const f = pFilters[language]["format"][filter];
            filters += `<div filter="${filter}" class="filter-pill">${f}</div>`
        })

        // SLIDES CREATION
        slides += `
            <div project-id="${projectID}" class="recent-cards" style="background-color: ${(PROJECT.color) ? PROJECT.color : pDataDefault.color}">
                <div class="in">
                    <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.jpg"></div>
                    <span class="title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                    <div class="filters">
                        ${filters}
                    </div>
                </div>
            </div>
        `;

        // ACTIONS CREATION
        actions += `
            <a project-id="${projectID}" class="actions" style="height: calc(100% / ${rP.projectsNb});" href="#${projectID}"></a>
        `;
    })

    // GENERATING
    rP.trackEl.querySelector("#recent-projects-slides").innerHTML = slides;
    rP.trackEl.querySelector("#recent-projects-actions .in").innerHTML = actions;

    // store recent cards elements
    rP.allCards = rP.trackEl.querySelectorAll(".recent-cards");
    // set the scroll track length
    rP.trackLength = doc.clientHeight * rP.projectsNb; // if using trackDivisor: / rP.trackDivisor
    rP.trackEl.style.height = rP.trackLength +"px"; // if using trackDivisor: - doc.clientHeight / rP.projectsNb

    // apply z-index in order of cards
    for(let i = 1; i <= rP.projectsNb; i++) {
        rP.allCards[rP.projectsNb - i].style.zIndex = i;
    }
}


// RECENT PROJECTS SECTION
function recentProjectsUpdates() {
    // TRACK SEGMENTS
    // cut track in segments to get start and end position for slides to occur
    rP.trackSegments = []; // clear segments before updating

    const offset = rP.trackEl.offsetTop; // offset with start position in the page
    var tSegmentAdd = 0; // point jumper

    // make segments with start and end point of each project
    for(let i = 0; i < rP.projectsNb; i++) {
        // set first point
        var add = [tSegmentAdd + offset]
        // next point calc, also start point for next loop
        tSegmentAdd += (rP.trackLength / rP.projectsNb); // if using trackDivisor: - doc.clientHeight / rP.projectsNb
        // set next point
        add.push(tSegmentAdd + offset);
        // store tuple of start/end points
        rP.trackSegments.push(add);
    }
}

function recentProjectsSlides() {
    // get the current card focused
    function findSegment(segments, scrollPos) {
        for(let i = 0; i < rP.projectsNb; i++) {
            const [start, end] = segments[i];
            if(start <= scrollPos && scrollPos <= end) {
                return i;
            }
        }
        if(scrollPos <= segments[0][0]) {
            return "before"
        } else if(scrollPos >= segments.at(-1)[1]) {
            return "after"
        }
    }
    var currentCardNb = findSegment(rP.trackSegments, scrollbarMain.scroll().position.y);

    // get the previous and after cards
    var previousCards = Array.from(rP.allCards).slice(0,currentCardNb),
        nextCards = Array.from(rP.allCards).slice(currentCardNb+1);

    // outside states
    if(currentCardNb == "before") {
        previousCards = [];
        nextCards = rP.allCards;
    } else if(currentCardNb == "after") {
        previousCards = rP.allCards;
        nextCards = [];
    }

    // apply positions for previous and after cards
    previousCards.forEach((pCard) => {
        if(pCard != rP.trackEl.querySelector(".recent-cards:last-child")) { // not for last card so it always stays at the back
            pCard.style.top = "-100%";
        }
    })
    nextCards.forEach((nCard) => {
        nCard.style.top = 0; //(currentCardNb != "before") ? 0 : "100%";

        // enable pointer events for next card when elements are displayed
        // because can't scroll with mouse on top of fixed elements (thanks overlayscrollbars v1)
        // so I disabled pointer events and made "actions" elements under to allow scrolling
        if(nCard != rP.allCards[0]) { // not for the first card because always ontop
            if(nCard == rP.allCards[currentCardNb + 1]) { // for the next card only
                if(nCard.querySelector(".filters").getBoundingClientRect().bottom > rP.allCards[currentCardNb].getBoundingClientRect().bottom) {
                    // when filters start appearing
                    nCard.classList.remove("no-f");
                } else {
                    nCard.classList.add("no-f");
                }
            } else {
                nCard.classList.add("no-f");
            }
        } else {
            nCard.classList.remove("no-f");
        } // i hope i can fix this later because that's way too hacky
    })

    // slide animation for current card
    if(typeof currentCardNb == "number") { // || currentCardNb == "before"
        // calculate position
        if(currentCardNb != rP.projectsNb-1) { // not for last card so it always stays at the back
            // keep proportionnality
            const move = mapRange(scrollbarMain.scroll().position.y,
                                  rP.trackSegments[currentCardNb][0], rP.trackSegments[currentCardNb][1],
                                  0, 100)
            // apply position
            rP.allCards[currentCardNb].style.top = -move +"%";
        }
    }
}

function recentProjectsScrollIn() { // shift cards reaches top of vp
    const move = Math.min(Math.max(
                        mapRange(scrollbarMain.scroll().position.y,
                            0, doc.clientHeight,
                            doc.clientHeight / 3, 0)
                        , 0), doc.clientHeight / 3)
    // apply position
    rP.trackEl.querySelector("#recent-projects-slides").style.transform = `translateY(${move}px)`;
    rP.trackEl.querySelector("#recent-projects-actions").style.transform = `translateY(${move}px)`;
}

// GO TO FILTERS BUTTON
function gotoFilters() {
    scrollbarMain.scroll(document.querySelector(".content-sections#filter"), 1000, "easeInOutQuart");
}
document.querySelector(".content-sections#recent-projects #intro .goto_filters-txt").addEventListener("click", gotoFilters)


// FILTERS SECTION




function init() {
    // RECENT PROJECTS
    createRecentProjects();
    recentProjectsSlides();

    // STICKY ELEMENTS
    StickIt();
    window.addEventListener("resize", StickIt)
    // + scroll event
}
document.addEventListener("DOMContentLoaded", init);



/*

to translate

get all elements with attribute [to_translate]
compare with data-base if [to_translate="id"] element exists
if yes, replace text
if no, leave as is

*/