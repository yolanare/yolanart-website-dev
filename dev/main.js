// - IMPORTS -
import "../node_modules/overlayscrollbars/css/OverlayScrollbars.css";
import "../node_modules/overlayscrollbars/js/OverlayScrollbars.js";
import { CountUp } from 'countup.js';

import * as Prj from "./assets/js/projects.js";
import "./index.html"
import "./main.scss"


//- VARIABLES -
var doc = document.documentElement,
    isMini, // boolean if viewport is small like a phone
    touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement), // boolean if touched device
    pageContentContainer = document.querySelector("main#content-container"), // main container of page
    language = (/^fr\b/.test(navigator.language)) ? "fr" : "en"; // language (default : en)

const scrollToDuration = 1000;

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

// call function at end of css transition of element (no propagation, option to do it only once)
function addEvTrEnd(elem, func, property = false, once = true) {
    var isNotAlready = true;

    if (!property) { // will check for all css properties
        elem.addEventListener("transitionend", () => { func(); }, { once : once });
    } else { // will check only for specified css property
        elem.addEventListener("transitionend", (ev) => { if (ev.propertyName == property) { func(); }}, { once : once });
    }

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
            onUpdated : scrollUpdateEvents,
            onScroll : scrollEvents
        }
    });
});


// SHORTCUTS
// generate HTML for filter pills with filter ID
// TODO will need to do (learn to do) a class of smth later
function htmlFilterPill(filterID, type, plural, customStaticName) {
    plural = plural ? "plural" : "format";
    return `<div filter-id="${filterID}" class="f-pill ${type}">
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
            stickyEl.parentElement.classList.remove("fixed");
            stickyEl.style.position = null;
            stickyEl.style.top = null;
            stickyEl.style.bottom = null;
        } else if (target.bottom >= targetContainer.bottom-1 // if sticky element hits the bottom
                && target.top <= 0) { // and if the element's top is under the top of viewport (scroll sticky)
            // position sticked to bottom
            stickyEl.parentElement.classList.remove("fixed");
            stickyEl.style.position = "absolute";
            stickyEl.style.top = "auto";
            stickyEl.style.bottom = 0 +"px";
        } else {
            // position sticked to scroll
            stickyEl.parentElement.classList.add("fixed");
            stickyEl.style.position = "fixed";
            stickyEl.style.top = 0 +"px";
            stickyEl.style.bottom = null;
        }
    });
}

// SORT PROJECTS BY DATE
function projectsSortByDate() {
    var projectsDate = [], projectsDateInvalid = [];

    // create list of tuples of all projects : [project_id, project_date]
    Object.entries(pData).forEach((projectData) => {
        const PROJECT = projectData[1];

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
            filters += htmlFilterPill(filter, "filter");
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
        filterButton.addEventListener("click", gotoFiltersProjectList);
        filterButton.addEventListener("click", (e) => {setTimeout(() => { filtersAction(e, "isolate"); }, scrollToDuration*(2/3))});
    })

    // apply z-index in order of slides
    for (let i = 1; i <= RP.projectsNb; i++) {
        RP.allSlides[RP.projectsNb - i].style.zIndex = i;
    }
}

function recentProjectsSlides() {
    // get the current slide focused
    function findSegment(segments, scrollPos) {
        for (let i = 0; i < RP.projectsNb; i++) {
            const [start, end] = segments[i];
            if (start <= scrollPos && scrollPos <= end) {
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
    const move = Math.min(Math.max(
                        mapRange(scrollbarMain.scroll().position.y,
                            0, doc.clientHeight,
                            doc.clientHeight / 3, 0)
                        , 0), doc.clientHeight / 3)
    // apply position
    RP.section.querySelector("#recent-projects-slides").style.transform = `translateY(${move}px)`;
    RP.section.querySelector("#recent-projects-actions").style.transform = `translateY(${move}px)`;
}


// GO TO FILTERS BUTTON
function gotoFilters() {
    scrollbarMain.scroll(document.querySelector(".content-sections#filters"), scrollToDuration, "easeInOutQuart");
}
function gotoFiltersProjectList() {
    scrollbarMain.scroll(document.querySelector(".content-sections#filters #projects-list"), scrollToDuration, "easeInOutQuart");
}
RP.section.querySelector("#intro-rp .goto_filters-txt").addEventListener("click", gotoFilters)


// FILTERS SECTION
var F = {
    allFilterIDs : [],
    section : document.querySelector(".content-sections#filters"),
    filtersContainer : null,
    projectsListContainer : null,
    projectsDisplayedNbEl : null,
    allFilterBtns : {},
    allOtherBtns : {},
    allBtns : {},
}
F.filtersContainer = F.section.querySelector("#intro-filters .filters-selector");
F.projectsListContainer = F.section.querySelector("#projects-list");

let countUpProjectsNb;

// generate array of all valid filters
Prj.projectsDataSample.TEMPLATE.filter.split("|").forEach((filter) => { F.allFilterIDs.push(filter); })

function filtersGenerateProjectsList() {
    // get all filters selected
    var selectedFilters = [];
    F.allFilterBtns.forEach((filterButton) => {
        var state = filterButton.getAttribute("state");
        if (state === "true") {
            selectedFilters.push(filterButton.getAttribute("filter-id"));
        }
    });

    // if no filter selected, use all of them
    //selectedFilters = selectedFilters == [] ? F.allFilterIDs : selectedFilters; // no need actually, [] is always true

    // selected projects arrays
    var selectedProjects = [], selectedProjectsSorted = [];
    // loop through each existing project and select the ones with corresponding filters
    Object.entries(pData).forEach((projectData) => {
        // get project filters
        const pF = projectData[1].filter;

        if (pF) {
            var verif = [];
            // check for filters one by one
            selectedFilters.forEach(sFilter => {
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
    if(selectedFilters.length > 0) {
        F.filtersContainer.querySelector(".secondary").classList.remove("hidden");
    } else {
        F.filtersContainer.querySelector(".secondary").classList.add("hidden");
    }

    // generate columns
    const numberOfColumnsMax = 3;
    var allColumns = [];
    // initialize columns storage
    for (let cIndex = 0; cIndex < numberOfColumnsMax; cIndex++) {
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
            filters += htmlFilterPill(filter, "filter");
        })
        const projectCardHTML = `
            <div project-id="${projectID}" class="project-cards">
                <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}"></div>
                <div class="header">
                    <span class="project-title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                    ${(["yt", "vid"].includes((PROJECT.type) ? PROJECT.type : pDataDefault.type)) // if video : add popup button to see the video without leaving the page
                    ? `<div class="video-quick-popup-button">
                            <svg viewBox="0 0 24 24">
                                <path class="st1" d="M-24.17,21.28h-4.43c-3.67,0-6.65-2.98-6.65-6.65v0c0-3.67,2.98-6.65,6.65-6.65h4.43c3.67,0,6.65,2.98,6.65,6.65v0C-17.52,18.3-20.5,21.28-24.17,21.28z"/>
                                <path class="st2" d="M-18.94,16.05h-4.43c-3.67,0-6.65-2.98-6.65-6.65v0c0-3.67,2.98-6.65,6.65-6.65h4.43c3.67,0,6.65,2.98,6.65,6.65v0C-12.3,13.07-15.27,16.05-18.94,16.05z"/>
                                <path d="M-22.55,12.87l4.96-2.86c0.47-0.27,0.47-0.95,0-1.23l-4.96-2.86c-0.47-0.27-1.06,0.07-1.06,0.61v5.73C-23.61,12.8-23.02,13.14-22.55,12.87z"/>
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
        for (let cIndex = 0; cIndex < numberOfColumnsMax; cIndex++) {
            // using euclidian division, we can get index of column for the project with its index
            // this is the column to put the current project in
            const column = spIndex % (cIndex + 1);

            // adding the project card's HTML in the corresponding column in the columns group
            allColumns[cIndex][column] += projectCardHTML;
        }

    }

    // generate columns
    var columnsHTML = ``;
    for (let cIndex = 0; cIndex < numberOfColumnsMax; cIndex++) {
        // generating column
        var columnHTML = ``;
        for (let col = 0; col < allColumns[cIndex].length; col++) {
            columnHTML += `
                <div column="${col + 1}">
                    ${allColumns[cIndex][col]}
                </div>
            `
        }
        // generating column group
        columnsHTML += `
            <div column-group="${cIndex + 1}">
                ${columnHTML}
            </div>
        `
    }

    // CREATION
    F.projectsListContainer.innerHTML = columnsHTML;



    // put the last project card in odd columns (starting from 0) since they're the ones going up
    // but only if there are more than 3 lines of projects (arbitrary number, test with scroll speed later)
    // do this to one more project every 3 lines in more
    // -> calculate for every columns, if projectNm/columnNb > 3 : add one, > 6 : add 2, etc
    // to this per column, meaning if there are 4 columns, add one for each odd (2)

    // when resizing window, play with display property
    // only do animations for currently displayed column
    // if resizing at the same time:
    // -> keep the old animated elements even if not displayed anymore
    // -> don't play with display anymore until animations finished

    /*///before that columns madness
    var projectsCards = ``;
    selectedProjectsSorted.forEach((projectID) => {
        const PROJECT = pData[projectID];

        // FILTERS
        var filters = ``;
        PROJECT.filter.split("|").forEach((filter) => {
            filters += htmlFilterPill(filter, "filter");
        })

        // CARDS GENERATION
        projectsCards += `
            <div project-id="${projectID}" class="project-cards">
                <div class="thumbnail"><img src="./assets/medias/projects/low/${projectID}_low.jpg"></div>
                <span class="project-title">${(PROJECT.title) ? PROJECT.title : pDataDefault.title}</span>
                <div class="filters">
                    ${filters}
                </div>
            </div>
        `
    })
    // CREATION
    F.projectsListContainer.innerHTML = projectsCards;
    ///*/

    // set filter buttons actions
    F.projectsListContainer.querySelectorAll(".project-cards .f-pill").forEach((filterButton) => {
        filterButton.addEventListener("click", gotoFiltersProjectList);
        filterButton.addEventListener("click", (e) => {setTimeout(() => { filtersAction(e, "isolate"); }, scrollToDuration*(4/5))});
    })

    // display new number of projects found
    if(selectedProjectsSorted.length == 0) { // if not projects found
        F.projectsDisplayedNbEl.classList.remove("counting");
        F.projectsDisplayedNbEl.classList.add("none");
    } else {
        F.projectsDisplayedNbEl.classList.add("counting")
        F.projectsDisplayedNbEl.classList.remove("none");
    }
    // duration of counting depends of number of projects shown, the more the longer
    countUpProjectsNb.options.duration = 0.5 + mapRange(selectedProjectsNb, 0, projectsSortedDate.length, 0, 1.75);
    // start from 0 and go to new number
    countUpProjectsNb.reset();
    countUpProjectsNb.update(selectedProjectsSorted.length);
    // remove counting styles at the end of counting
    countUpProjectsNb.start(() => { F.projectsDisplayedNbEl.classList.remove("counting"); });

}

function filtersAction(caller, isolate = false) {
    // which filter called?
    caller = caller.target;
    const selectedFilter = F.filtersContainer.querySelector(`.f-pill[filter-id="${caller.getAttribute("filter-id")}"]`);

    if (isolate) { // filter buttons on project cards/slides
        // reset every other filter (even date order)
        F.allBtns.forEach((btn) => { btn.setAttribute("state", false); });
        // enable selected filter
        selectedFilter.setAttribute("state", "true");
    }
    else { // normal filter buttons
        // invert selected filter's state
        selectedFilter.setAttribute("state", (selectedFilter.getAttribute("state") === "true") ? "false" : "true");
    }

    // generate projects
    filtersGenerateProjectsList();
}
/*
<svg viewBox="0 0 24 24">
    <path d="M11,22.02l-8.42-6.2c-0.75-0.55-0.91-1.6-0.36-2.35l0,0c0.55-0.75,1.6-0.91,2.35-0.36l3.98,2.94c2.05,1.51,4.83,1.51,6.88,0l3.98-2.94c0.75-0.55,1.8-0.39,2.35,0.36l0,0c0.55,0.75,0.39,1.8-0.36,2.35L13,22.02C12.4,22.46,11.6,22.46,11,22.02z"/>
    <path d="M12,22.35c-0.93,0-1.68-0.75-1.68-1.68V3.33c0-0.93,0.75-1.68,1.68-1.68s1.68,0.75,1.68,1.68v17.33C13.68,21.59,12.93,22.35,12,22.35z"/>
</svg>
*/
function createFilters() {
    // generate filter pills
    var allButtonsHTML = ``;
    F.allFilterIDs.forEach((filter) => {
        allButtonsHTML += htmlFilterPill(filter, "filter", "plural");
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
        filterButton.addEventListener("click", filtersAction);
    })

    // clear filters button
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
    countUpProjectsNb = new CountUp(F.projectsDisplayedNbEl, 0, {
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

    // display all projects by default
    filtersGenerateProjectsList();
}

function projectListColumnsByRatio() {
    console.log("resize");
}

function projectListColumnsOddScrollOffset() {
    var move = F.projectsListContainer.getBoundingClientRect().top;
    if (move < doc.clientHeight * 1.2) {
        doc.style.setProperty('--col-scroll-offset', (float(move / 3)) +"px")
    }
}

// UPDATES EVENTS
function scrollUpdateEvents() {
    StickIt();
    recentProjectsTrackLength();
    recentProjectsTrackSegments();
}
function scrollEvents() {
    StickIt();
    recentProjectsSlides();
    recentProjectsScrollIn();
    projectListColumnsOddScrollOffset();
}
window.addEventListener("resize", () => {
    StickIt();
    recentProjectsTrackLength();
    recentProjectsTrackSegments();
    projectListColumnsByRatio();
});


function init() {
    // RECENT PROJECTS
    createRecentProjects();
    recentProjectsSlides();

    // FILTERS
    createFilters();

    // STICKY ELEMENTS
    for (let i = 0; i < 8; i++) { // for loop to make sure it's applied
        setTimeout(() => { // delay for when opening page with hash of sections
            StickIt();
        }, 400 * i);
    }
}
document.addEventListener("DOMContentLoaded", init);



/*

to translate

get all elements with attribute [to_translate]
compare with data-base if [to_translate="id"] element exists
if yes, replace text
if no, leave as is

*/