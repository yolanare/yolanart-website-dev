// - IMPORTS -
import "../node_modules/overlayscrollbars/css/OverlayScrollbars.css";
import "../node_modules/overlayscrollbars/js/OverlayScrollbars.js";
import { CountUp } from "countup.js";
//import anime from "animejs/lib/anime.es.js";

import * as Prj from "./assets/js/projects.js";
import "./index.html"
import "./main.scss"


//- VARIABLES -
var doc = document.documentElement,
    isMini, // boolean if viewport is small like a phone
    touchDevice = (navigator.maxTouchPoints || "ontouchstart" in document.documentElement), // boolean if touch device
    pageContentContainer = document.querySelector("main#content-container"), // main container of page
    language = (/^fr\b/.test(navigator.language)) ? "fr" : "en"; // language (default : en)

const scrollToDuration = 1250,
      scrollToDurationCard = 1000,
      scrollToDurationElse = 2000;

// chrome has "faster" scroll
const iceScrollFactor = (!window.chrome) ? 3 : 7;

// check the viewport size, set boolean "isMini" if vp goes small
function checkWinSize() { isMini = (window.innerWidth > 727); };
checkWinSize(); window.addEventListener("resize", checkWinSize);

// check if browser is chromium based
if (!!window.chrome) { document.querySelector("html").classList.add("isChr"); }


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
function mapRangePrecise(value, low1, high1, low2, high2) { // Processing's map function
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function constrain(value, low, high) { // Processing's constrain function
    return Math.min(Math.max(value, low), high);
}

// call function at end of css transition of element (no propagation, option to do it only once)
function addEvTrEnd(elem, func, {property = false, once = true, debug = false}) {
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

// get scroll speed
var checkScrollSpeed = (function(){ // (https://stackoverflow.com/a/22599173)
    var lastPos, newPos, timer, delta, direction, delay = 100;
    function clear() { lastPos = null; delta = 0; direction = true; }
    clear();
    return function(){
        newPos = scrollbarMain.scroll().position.y;
        if (lastPos != null ) { delta = newPos -  lastPos; }
        if (lastPos > newPos) { direction = false; } // true = down ; false = up
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
    if (elems) { elems.forEach((el) => { el.classList.add(c); }); }
}
function removeClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if (elems) { elems.forEach((el) => { el.classList.remove(c); }); }
}

// get "project-id" attribute from an element
function pID(i) { return thiis.getAttribute("project-id"); }
// get "filter-id" attribute from an element
function fID(i) { return i.getAttribute("filter-id"); }


// - Modules -
// OVERLAY SCROLLBARS
var scrollbarMain,
    o1 = [null, 33], OScrHDelay = 200; if (!isMini) { o1 = [true, 33]; OScrHDelay = 800; };
document.addEventListener("DOMContentLoaded", function() {
    scrollbarMain = OverlayScrollbars(document.querySelector("[scroll-main]"), {
        autoUpdate : o1[0],
        autoUpdateInterval : o1[1],
        overflowBehavior : {
            x : "hidden",
            y : "scroll"
        },
        scrollbars : {
            autoHide : "move", // "scroll" "move" "never"
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

// SHORTCUTS
// generate HTML for filter pills with filter ID
// TODO will need to do (learn to do) a class of smth later
function htmlFilterPill({
        filterID,
        type,
        state,
        plural,
        customStaticName}) {
    plural = plural ? "plural" : "format";
    return `<div filter-id="${filterID}" class="f-pill ${type}" ${(state) ? `state="${state}"` : ``}>
        ${(customStaticName) ? customStaticName : // use custom static name if specified
            pFilters[language][plural][filterID] // get formatted name
    }</div>`
}
function htmlFilterPillComplex([filterID, customIcon], type, plural, customStaticName) {
    plural = plural ? "plural" : "format";
    return `<div filter-id="${filterID}" class="f-pill ${type}">
        ${(customIcon) ? customIcon : ``}
        <span>${(customStaticName) ? customStaticName : // use custom static name if specified
            pFilters[language][plural][filterID] // get formatted name
        }</span>
    </div>`
}
function htmlFPill(pillID, label, customIcon = false) {
    return `<div class="f-pill ${pillID}">
        ${(customIcon) ? customIcon : ``}
        <span>${label}</span>
    </div>`
}

// STICK IT
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

// BUBBLE TIPS
function bubbleTipInit({target, delayAnimIn, force}) {
    target.addEventListener("mouseenter", () => { bubbleTipCreate({target : target}); });
}

function bubbleTipCreate({target, delayAnimIn = 500, force = false}) {
    delayAnimIn = Math.max(delayAnimIn, 50); // minimal value for delay

    const label = target.getAttribute("tip");
    // cancel if no tip to show
    if (!label) { console.error("no bubble tip specified"); return; }

    // not on touch devices
    if (!touchDevice && force) { return; }

    // generate
    var bubbleTipEl;
    bubbleTipEl = document.createElement("div");
    bubbleTipEl.classList.add("bubble-tip");
    bubbleTipEl.classList.add("anim-pre");
    bubbleTipEl.innerHTML = `<div class="point"></div><div class="content"><div class="bg"></div><span>${label}</span></div>`;

    // create
    document.querySelector(".bubble-tips-container").appendChild(bubbleTipEl);

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
            bubbleTipContentEl.style.transformOrigin = `calc(75% + ${borderOffset}px) 50%`;
        }
        if (bubbleCPosXWL < 0) { // off to the left
            bContentPosX = 0 - bubbleCPosXWL + borderOffset;
            bubbleTipContentEl.style.transformOrigin = `calc(25% - ${borderOffset}px) 50%`;
        }
        if (bubblePosY + (bubbleTipContentRect.height / 2) + 35 > doc.clientHeight) { // off to the bottom
            bubbleTipEl.classList.add("reverse");
        }

        // TODO : have a better animation for offscreen cases

        bubbleTipContentEl.style.left = bContentPosX +"px";
        bubbleTipContentEl.style.top = 0 +"px";
    }, delayAnimIn / 4);

    // animation in trigger
    setTimeout(() => {
        bubbleTipEl.classList.remove("anim-pre");
    }, delayAnimIn);

    // out
    target.addEventListener("mouseleave", () => { bubbleTipRemove(bubbleTipEl); })
    target.addEventListener("click", () => { bubbleTipRemove(bubbleTipEl); })
}

function bubbleTipRemove(bubbleTipEl) {
    bubbleTipEl.classList.add("anim-clear");
    addEvTrEnd(bubbleTipEl, () => { bubbleTipEl.remove(); }, {property : "opacity", once : false});
}


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
// will be a sorted list of tuples of all projects by date
const projectsSortedDate = projectsSortByDate();


// RECENT PROJECTS CREATION
var RP = {
    projectsNb : 4,
    //trackDivisor : 2,
    section : document.querySelector("#recent-projects"),
    allSlides : {},
    track : document.querySelector("#recent-projects"),
    trackLength : 0,
    trackSegments : [],
}

function recentProjectsTrackLength() {
    // TRACK LENGTH
    RP.trackLength = doc.clientHeight * RP.projectsNb; // if using trackDivisor: / rP.trackDivisor
    RP.track.style.height = RP.trackLength +"px"; // if using trackDivisor: - doc.clientHeight / rP.projectsNb
}
function recentProjectsTrackSegments() {
    // cut track in segments to get start and end position for slides to occur
    RP.trackSegments = []; // clear segments before updating

    const offset = RP.section.offsetTop; // offset with start position in the page
    var tSegmentAdd = 0; // point jumper

    // make segments with start and end point of each project
    for (let i = 0; i < RP.projectsNb; i++) {
        // set first point
        var add = [tSegmentAdd + offset]
        // next point calc, also start point for next loop
        tSegmentAdd += (RP.trackLength / RP.projectsNb); // if using trackDivisor: - doc.clientHeight / rP.projectsNb
        // set next point
        add.push(tSegmentAdd + offset);
        // store tuple of start/end points
        RP.trackSegments.push(add);
    }
}

function createRecentProjects() {
    // get the most recent projects
    const recentProjects = projectsSortedDate.slice(0, RP.projectsNb);

    var slides = ``, actions = ``;

    recentProjects.forEach((recentProject) => {
        const projectID = recentProject[0], PROJECT = pData[projectID];

        // FILTERS
        var filters = ``;
        ((PROJECT.filter) ? PROJECT.filter : pDataDefault.filter).split("|").forEach((filter) => {
            filters += htmlFilterPill({filterID : filter, type : "filter"});
        })

        // SLIDES GENERATION
        slides += `
            <div project-id="${projectID}" class="recent-slides" style="background-color: ${(PROJECT.color) ? PROJECT.color : pDataDefault.color}">
                <div class="in">
                    <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}"></div>
                    <span class="project-title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                    <div class="filters">
                        ${filters}
                    </div>
                </div>
            </div>
        `;

        // ACTIONS GENERATION
        actions += `
            <a project-id="${projectID}" class="actions" style="height: calc(100% / ${RP.projectsNb});" href="#${projectID}"></a>
        `;
    })

    // CREATION
    RP.section.querySelector("#recent-projects-slides").innerHTML = slides;
    RP.section.querySelector("#recent-projects-actions .in").innerHTML = actions;

    // store recent slides elements
    RP.allSlides = RP.track.querySelectorAll(".recent-slides");
    // set the scroll track length
    recentProjectsTrackLength();

    // set filter buttons actions
    RP.section.querySelectorAll("#recent-projects-slides .f-pill").forEach((filterButton) => {
        filterButton.addEventListener("click", (e) => {filtersAction({caller : e, isolate : "isolate", customScrollToDuration : scrollToDurationElse}); });
    })

    // apply z-index in order of slides
    for (let i = 1; i <= RP.projectsNb; i++) {
        RP.allSlides[RP.projectsNb - i].style.zIndex = i;
    }

    // scroll to filters button click action
    RP.section.querySelector("#intro-rp .goto_filters-txt").addEventListener("click", scrollToFiltersSection);
}

function recentProjectsSlides() {
    // get the current slide focused
    function findSegment(segments, scrollPos) {
        for (let i = 0; i < RP.projectsNb; i++) {
            const [start, end] = segments[i];
            if (scrollPos >= start && scrollPos <= end) {
                return i;
            }
        }
        if (scrollPos <= segments[0][0]) {
            return "before"
        } else if (scrollPos >= segments.at(-1)[1]) {
            return "after"
        }
    }
    var currentSlideNb = findSegment(RP.trackSegments, scrollbarMain.scroll().position.y);

    // get the previous and after slides
    var previousSlides = Array.from(RP.allSlides).slice(0,currentSlideNb),
        nextSlides = Array.from(RP.allSlides).slice(currentSlideNb+1);

    // outside states
    if (currentSlideNb == "before") {
        previousSlides = [];
        nextSlides = RP.allSlides;
    } else if (currentSlideNb == "after") {
        previousSlides = RP.allSlides;
        nextSlides = [];
    }

    // apply positions for previous and after slides
    previousSlides.forEach((pSlide) => {
        if (pSlide != RP.track.querySelector(".recent-slides:last-child")) { // not for last slide so it always stays at the back
            pSlide.style.top = "-100%";
        }
        pSlide.classList.remove("no-f");
    })
    nextSlides.forEach((nSlide) => {
        nSlide.style.top = 0; //(currentSlideNb != "before") ? 0 : "100%";

        // enable pointer events for next slide when elements are displayed
        // because can't scroll with mouse on top of fixed elements (thanks overlayscrollbars v1)
        // so I disabled pointer events and made "actions" elements under to allow scrolling
        if (nSlide != RP.allSlides[0]) { // not for the first slide because always ontop
            if (nSlide == RP.allSlides[currentSlideNb + 1]) { // for the next slide only
                if (nSlide.querySelector(".filters").getBoundingClientRect().bottom > RP.allSlides[currentSlideNb].getBoundingClientRect().bottom) {
                    // when filters start appearing
                    nSlide.classList.remove("no-f");
                } else {
                    nSlide.classList.add("no-f");
                }
            } else {
                nSlide.classList.add("no-f");
            }
        } else {
            nSlide.classList.remove("no-f");
        } // i hope i can fix this later because that's way too hacky
    })

    // slide animation for current slide
    if (typeof currentSlideNb == "number") { // || currentSlideNb == "before"
        // calculate position
        if (currentSlideNb != RP.projectsNb-1) { // not for last slide so it always stays at the back
            // keep proportionnality
            const move = mapRange(scrollbarMain.scroll().position.y,
                                  RP.trackSegments[currentSlideNb][0], RP.trackSegments[currentSlideNb][1],
                                  0, 100)
            // apply position
            RP.allSlides[currentSlideNb].style.top = -move +"%";
        }
    }
}

function recentProjectsScrollIn() { // shift slides until reach top of vp
    const move = constrain(mapRange(scrollbarMain.scroll().position.y,
                                    0, doc.clientHeight,
                                    doc.clientHeight / 3, 0),
                   0, doc.clientHeight / 3);
    // apply position
    RP.section.querySelector("#recent-projects-slides").style.transform = `translateY(${move}px)`;
    RP.section.querySelector("#recent-projects-actions").style.transform = `translateY(${move}px)`;
}


// GO TO FILTERS BUTTON
function scrollToFiltersSection() {
    //isScrollingTo = true;

    scrollbarMain.scroll(
        document.querySelector(".content-sections#filters"),
        scrollToDuration,
        "easeInOutQuart"
        //() => { isScrollingTo = false; }
        );
}
function scrollToProjectsListFilters(card = false, scrollDuration = scrollToDurationCard) {
    //isScrollingTo = true;

    // default scrollTo pos : top of projects list
    var scrollToPos = F.projectsListContainer.getBoundingClientRect().top;

    // default behavior : button off-screen so we do animations and tralala
    F.filterBtnIsOnScreen = false;

    // if project card, scroll only if main filter buttons not in view
    if (card == true) {
        // scroll to top of filter buttons
        scrollToPos -= F.filtersContainer.offsetHeight + 30;

        // take first button, check if off-screen
        const filtersPos = F.allFilterBtns[0].getBoundingClientRect().top;
        if (filtersPos > 0 && filtersPos < doc.clientHeight) {
            F.filterBtnIsOnScreen = true; // true to skip delay
            return; // skip if on-screen
        }
    } else {
        // default : scroll to top of filters intro
        getFiltersContainerHeight();
        scrollToPos -= F.filtersContainerHeight + 30;
    }

    scrollbarMain.scroll(
        `+= ${scrollToPos}px`,
        scrollDuration,
        (card == true) ? "easeOutQuint" : "easeInOutQuart"
        //() => { isScrollingTo = false; }
        );
}


// FILTERS SECTION
var F = {
    allFilterIDs : [], // array of filters's id
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
    filterBtnIsOnScreen : false, // check if filters buttons are on screen or not (to scroll-to or not)

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
Prj.projectsDataSample.TEMPLATE.filter.split("|").forEach((filter) => { F.allFilterIDs.push(filter); });

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
            selectedFilters.push(filterButton.getAttribute("filter-id"));
        }
    });
    return selectedFilters;
}

function filtersClearProjectsList() {
    // animation out for all (hypothetically) projects list present
    F.projectsListContainer.querySelectorAll(".projects-list").forEach((pl) => {
        pl.classList.add("anim-clear");
        addEvTrEnd(pl, () => { pl.remove(); }, {property : "transform", once : false});
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

        if (pF) {
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
        }
        else { return; } // if no filter then skip
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
    const dateOrder = F.filtersContainer.querySelector(`.main .f-pill[filter-id="date"]`).getAttribute("state");
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
            PROJECT.filter.split("|").forEach((filter) => {
                filters += htmlFilterPill({filterID : filter, type : "filter", state : (F.selectedFilters.includes(filter)) ? "true" : false});
            })//${(spIndex < F.animateInLinesOfCards) ? `transition-delay:${spIndex / 10}s;` : `transition: none;`}
            const projectCardHTML = `
                <div project-id="${projectID}" list-nb="${spIndex}" class="project-cards" style="transition: none;">
                    <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}"></div>
                    <div class="header">
                        <span class="project-title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                        ${(["yt", "vid"].includes((PROJECT.type) ? PROJECT.type : pDataDefault.type)) // if video : add popup button to see the video without leaving the page
                        ? `<div class="video-quick-popup-button" tip="Pop-up quick video player" translate_bubble_id="plist-video-quick-popup-btn">
                                <div class="bg"></div>
                                <svg class="arrow" viewbox="0 0 24 24">
                                    <path d="M6.55,22.19l14.16-8.17c1.5-0.87,1.5-3.03,0-3.9L6.55,1.95C5.05,1.08,3.18,2.16,3.18,3.9v16.35C3.18,21.97,5.05,23.06,6.55,22.19z"/>
                                </svg>
                            </div>`
                        : ``}
                    </div>
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
                    <div class="title" to_translate="filters_nothing_found_title">Oops!</div>
                    <div class="txt" to_translate="filters_nothing_found_txt">Seems like there's nothing corresponding to these filters.</div>
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
                if (!card) { return; } // stop if no more cards
                card.style.transition = null; // cancel the "transition: none;" put by default when generating
                card.style.transitionDelay = i / 10 +"s";
            }

            columnGrp.querySelectorAll(".project-cards").forEach(card => {
                // bubble tip for video quick popup button
                const vidPopBtn = card.querySelector(".video-quick-popup-button");
                if (vidPopBtn) { bubbleTipInit({target : vidPopBtn}); }
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
        PROJECT.filter.split("|").forEach((filter) => { filters += htmlFilterPill(filter, "filter"); })
        // CARDS GENERATION
        projectsCards += `
            <div project-id="${projectID}" class="project-cards">
                <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.jpg"></div>
                <span class="project-title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                <div class="filters">
                    ${filters}
                </div>
            </div>`
    })
    // CREATION
    F.projectsListContainer.innerHTML = projectsCards;
    ///*/

    // set filter buttons actions
    F.projectsListContainer.querySelectorAll(".project-cards .f-pill").forEach((filterButton) => {
        filterButton.addEventListener("click", (e) => { filtersAction({caller : e, isolate : "isolate", delay : scrollToDurationCard * (5/7), card : true}); });
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
    }

    // reset "previous" vars
    F.previousFilters = F.selectedFilters;
    F.previousDateOrder = dateOrder;
}

function filtersAction({caller, isolate = false, delay = 0, card = false, customScrollToDuration}) {
    // which filter called?
    caller = caller.target;
    const selectedFilter = F.filtersContainer.querySelector(`.f-pill[filter-id="${caller.getAttribute("filter-id")}"]`);

    // scroll to filters click action
    caller.addEventListener("click", scrollToProjectsListFilters(card, customScrollToDuration));

    // if button is on screen, skip scrollTo animation delay
    delay = (F.filterBtnIsOnScreen == true) ? 0 : delay;

    setTimeout(() => {
        if (isolate) { // reset every other filter (even date order)
            if (F.selectedFilters.length == 1 && F.selectedFilters[0] == caller.getAttribute("filter-id")) {
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

function filtersUpdateDateBubbleTip(dateEl = F.filtersContainer.querySelectorAll(".main .f-pill.date")) {
    if (dateEl.getAttribute("state") === "false") {
        dateEl.setAttribute("translate_bubble_id", "filters-date-false");
        dateEl.setAttribute("tip", "Most Recent");
    } else {
        dateEl.setAttribute("translate_bubble_id", "filters-date-true");
        dateEl.setAttribute("tip", "Oldest");
    }
}

function createFilters() {
    // generate filter pills
    var allButtonsHTML = ``;
    F.allFilterIDs.forEach((filter) => {
        allButtonsHTML += htmlFilterPill({filterID : filter, type : "filter", plural : "plural"});
    })
    allButtonsHTML += htmlFilterPillComplex(["date",
        `<svg viewBox="0 0 24 24">
            <path d="M11,22.02l-8.42-6.2c-0.75-0.55-0.91-1.6-0.36-2.35l0,0c0.55-0.75,1.6-0.91,2.35-0.36l3.98,2.94c2.05,1.51,4.83,1.51,6.88,0l3.98-2.94c0.75-0.55,1.8-0.39,2.35,0.36l0,0c0.55,0.75,0.39,1.8-0.36,2.35L13,22.02C12.4,22.46,11.6,22.46,11,22.02z"/>
            <path d="M12,22.35c-0.93,0-1.68-0.75-1.68-1.68V3.33c0-0.93,0.75-1.68,1.68-1.68s1.68,0.75,1.68,1.68v17.33C13.68,21.59,12.93,22.35,12,22.35z"/>
        </svg>`], "date", "");
    // create buttons
    F.filtersContainer.innerHTML = `
            <div class="main">
                ${allButtonsHTML}
            </div>
            <div class="secondary">
                <div class="left">
                    <div class="animate">
                        ${htmlFPill("clear-filters-button", "Clear filters",
                        `<svg viewBox="0 0 24 24">
                            <path d="M22.04,5.31L22.04,5.31c0-0.9-0.73-1.63-1.63-1.63H3.59c-0.9,0-1.63,0.73-1.63,1.63v0c0,0.9,0.73,1.63,1.63,1.63h16.82C21.31,6.94,22.04,6.21,22.04,5.31z"/>
                            <path d="M10.45,2.38h3.11c0.51,0,0.92-0.41,0.92-0.92v0c0-0.51-0.41-0.92-0.92-0.92h-3.11c-0.51,0-0.92,0.41-0.92,0.92v0C9.53,1.97,9.94,2.38,10.45,2.38z"/>
                            <path d="M16.85,8.24h-9.7c-1.12,0-2.03,0.91-2.03,2.03v8.93c0,2.37,1.92,4.3,4.3,4.3h6.17c2.37,0,3.3-1.92,3.3-4.3v-8.93C18.88,9.15,17.97,8.24,16.85,8.24z M10.69,17.12c0,0.51-0.41,0.92-0.92,0.92s-0.92-0.41-0.92-0.92v-5.03c0-0.51,0.41-0.92,0.92-0.92s0.92,0.41,0.92,0.92V17.12z M15.15,17.12c0,0.51-0.41,0.92-0.92,0.92h0c-0.51,0-0.92-0.41-0.92-0.92v-5.03c0-0.51,0.41-0.92,0.92-0.92h0c0.51,0,0.92,0.41,0.92,0.92V17.12z"/>
                        </svg>`)}
                    </div>
                </div>
                <div class="right">
                    <div class="filter-projects-number"><span anim-count>69</span><span> projects found</span></div>
                </div>
            </div>
    `;

    // store filters
    F.allFilterBtns = F.filtersContainer.querySelectorAll(".main .f-pill.filter");
    // store other buttons (date)
    F.allOtherBtns = F.filtersContainer.querySelectorAll(".main .f-pill:not(.filter)");
    // store all buttons
    F.allBtns = F.filtersContainer.querySelectorAll(".main .f-pill");

    // set filter buttons actions & states
    F.allBtns.forEach((filterButton) => {
        filterButton.setAttribute("state", false); // by default, every filter is false
        filterButton.addEventListener("click", (e) => { filtersAction({caller : e}); });
    })

    // bubble tips
    // date -> tell if "most recent" or "oldest"
    const fDateEl = F.filtersContainer.querySelector(".main .f-pill.date");
    fDateEl.addEventListener("mouseenter", () => {
        filtersUpdateDateBubbleTip(fDateEl);
        bubbleTipCreate({target : fDateEl});
    });

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
        startVal: 0,
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
    if (projectsListOffset < docHeight * 2.5) { // avoid unnecessary calculations
        getFiltersContainerHeight();

        // TODO update only when necessary (when filtersContainerHeight changes)
        filtersColumnLongestUpdate();

        const filtersIntro = F.introContainer.querySelector(".in"),
              endAnim = docHeight / 4 + F.filtersContainerHeight / 2;

        filtersIntro.style.height = `calc(25% + ${F.filtersContainerHeight / 2}px)`;
        // nice slow scroll down (this is why height at 25%, we translate 25% too)
        filtersIntro.style.transform = `translateY(${
            constrain(mapRange(projectsListOffset, docHeight, endAnim,
                docHeight / 4, 0), 0, docHeight / 4)}px)`;
        // nice slow text going smol
        //filtersIntro.style.fontSize =
        //    constrain(mapRange(projectsListOffset, docHeight, endAnim,
        //        2, 1.7), 1.7, 2) +"em";

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
function filtersColumnLongestUpdate() {
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

        var iceScrolling = true;

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
        F.projectsListContainer.style.height = `calc(${resize}px + var(--p-top) + var(--p-bottom)`; // to animate length changes
    //}
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


// UPDATES EVENTS
function updateAll() {
}

//function scrollContentSizeEvents() {
//    //filtersColumnLongestUpdate();
//}
function scrollUpdatesEvents() {
    updateAll();

    recentProjectsTrackLength();
    recentProjectsTrackSegments();
}
function scrollEvents() {
    updateAll();

    //scrollToForceStop();
    StickIt();

    recentProjectsSlides();
    recentProjectsScrollIn();

    filtersScrollCalcs();
}
//function scrollStopEvents() {
//    isScrollingToPrevPos = [];
//}
window.addEventListener("resize", () => {
    updateAll();

    StickIt();

    recentProjectsTrackLength();
    recentProjectsTrackSegments();

    filtersScrollCalcs();
    projectListColumnsByRatio();
    filtersColumnLongestUpdate(); // must be after projectListColumnsByRatio
});


function init() {
    // RECENT PROJECTS
    createRecentProjects();
    recentProjectsSlides();

    // FILTERS
    createFilters();

    // STICKY ELEMENTS
    for (let i = 0; i < 8; i++) { // for loop to make sure it's applied correctly
        setTimeout(() => { // delay for when opening page with hash of sections
            StickIt();
        }, 400 * i);
    }
}
document.addEventListener("DOMContentLoaded", init);



/*

to translate

get all elements with attribute [to_translate]
get all .f-pill, search in data base if filter-id exists
compare with data-base if [to_translate="id"] element exists
if yes, replace text
if no, leave as is

*/