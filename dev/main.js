// IMPORTS
//import 'overlayscrollbars/overlayscrollbars.css';
//import { OverlayScrollbars } from 'overlayscrollbars'; // current version doesn't support import (1.13.1)
import '../node_modules/overlayscrollbars/css/OverlayScrollbars.css';
import '../node_modules/overlayscrollbars/js/OverlayScrollbars.js';
//import Swup from 'swup';
//import SwupScrollPlugin from '@swup/scroll-plugin';
import Swup from '../node_modules/swup/dist/swup.js';
import SwupScrollPlugin from '../node_modules/@swup/scroll-plugin/dist/SwupScrollPlugin.js';

import * as Prj from './assets/js/projects.js';
import './index.html'
import './main.scss'


//- VARIABLES -
var doc = document.documentElement,
    ///pageMainURL,
    isMini, // boolean if viewport small or not
    touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement),
    container = document.getElementById('container'),
    language = 'en';
if (/^fr\b/.test(navigator.language)) { language = 'fr'; }

const deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

// PROJECTS
const pData = Prj.projectsData,
      mData = Prj.categoriesData,
      pDataDefault = Prj.projectsDataSample.default,
      mDataDefault = Prj.categoriesDataSample.default,
      pContexts = Prj.contexts,
      pFilters = Prj.filters;

// SWUP
const swup = new Swup({
    animateHistoryBrowsing: true,
    plugins: [new SwupScrollPlugin({
        doScrollingRightAway: true,
        scrollFriction: 0.8,
        scrollAcceleration: 0.6,
    })]
});

//- REUSABLE SCRIPTS -
// check if browser is chromium based
if(!!window.chrome) { document.querySelector("html").classList.add("isChr"); }

// check the viewport size, set boolean "isMini" if vp goes small
function checkWinSize() { isMini = (window.innerWidth > 727); };
checkWinSize(); window.addEventListener("resize", checkWinSize);

// get page filename // disabled because one page
function getPageID() {
    ///var pageURL = (window.location.href).replace(/\/[^/]*$/, '');
    ///pageMainURL = pageURL.replace("/projects", '');
    ///pathDir = pageURL.match(/([^\/]+$)/)[0];
    //if(window.location.pathname == '/' || window.location.pathname == '/index.html') { pathDir = 'home'; }
    ///if(pathDir != 'projects') { pathDir = 'home'; } // hardcoded solution, idc it works
    ///return pathDir;
    return "projects";
} var pathDir = getPageID();

// clean hash, and if specified clean after separator
function cleanURL(sep) {
    sep = sep || null;
    history.replaceState({}, "", (!sep) ? window.location.pathname : window.location.hash.split(sep)[0]);
}

// convert variable to float and round to 0.01
function float(str) { return parseFloat(str.toFixed(2)) }

function addClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach(function(el) { el.classList.add(c); }); }
}
function removeClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach(function(el) { el.classList.remove(c); }); }
}

// apply function at the end of a css transition of an element (no propagation, option to do it only once)
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


//- Scripts -
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
            autoHide : "move",
            autoHideDelay : OScrHDelay
        },
        callbacks : {
            onScroll : scrollAccordion
        }
    });
});

// create accordion menu buttons with the database, as well as the hidden projects cards
function createProjectsMenu() {
    var accItems = ``, accContent = ``;

    Object.entries(mData).forEach(categoryData => {
        const categoryID = categoryData[0], category = categoryData[1];

        // CATEGORIES
        // set up all category buttons
        accItems += `
            <section i-id="${categoryID}" class="acc-s acclist-item" level="1">
                <div class="acclist-in-c">
                    <div class="acclist-in">
                        <div class="acclist-btn lv1">
                            <div class="acclist-title">
                                ${(category.icon) ? category.icon : mDataDefault.icon}
                                <span class="acclist-t-span">${(category.title.en) ? category.title.en : mDataDefault.title.en}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `

        // CARDS
        var accCards = ``;
        Object.entries(Prj.projectsData).forEach(projectData => {
            const projectID = projectData[0], PROJECT = projectData[1],
                  pCategories = PROJECT.category.split("|");

            if(pCategories.includes(categoryID)) { // look in every project if category matches, for each category
                // set up all project cards
                accCards += `
                    <div id="${projectID}" class="al-card">
                        <div class="thumbnail-c">
                            <img class="thumb" ${
                                (PROJECT.needBG) ? "style=\"background-color: "+ ((PROJECT.needBG != true) ? PROJECT.needBG : "var(--y-b2)") +";\"" : "" // put a background color if needed
                            } src="./assets/medias/projects/low/${projectID}_low.${(PROJECT.ext) ? PROJECT.ext : pDataDefault.ext}"/>
                        </div>
                        <div class="p-title-c${(PROJECT.titleHide) ? " hide" : ""}">
                            <div class="p-title">
                                <span>${(!PROJECT.titleShort)
                                    ? ((PROJECT.title) ? PROJECT.title : pDataDefault.title)
                                    : PROJECT.titleShort
                                }</span>
                            </div>
                        </div>
                    </div>
                `
            }
        });
        // put all cards in container
        accContent += `
            <div i-id="${categoryID}" class="acccontent-c">
                <div class="acclist-content">
                    <div class="al-grid">
                    ${accCards}
                    </div>
                </div>
            </div>
        `
    });

    // create
    document.querySelector("[accordion-content]").innerHTML = accContent;
    document.querySelector("[accordion-scroll]").innerHTML = accItems;
}

// shortcut to get "i-id" attribute from an elements
function iID(i) { return i.getAttribute("i-id"); }

// open category and generate real projects cards, will close other categories as well
function openAccItem(h) {
    var thisItem, lv1, lv1ID, hash = false;
    if(h.type) {
        thisItem = this.closest("[level]");
        var t2 = thisItem.querySelector(".acclist-item[level='2']"); // t2: when thisItem is lv1, selects lv2 too
        if(thisItem.closest("[level='1']").getAttribute("state") != "closing" || thisItem.getAttribute("level") == "1") {
            history.replaceState({}, "", (t2 && ["opening", "opened"].includes(t2.getAttribute("state"))) ? "#"+ iID(t2) : "#"+ iID(thisItem))
        }
    } else { thisItem = h; hash = true; }
    var itemLv = thisItem.getAttribute("level");
    if(itemLv == "2") { lv1 = thisItem.closest(".acclist-item[level='1']"), lv1ID = iID(lv1); }

    function finalState(i) { // dictates what happens when finishing the transition for opening or closing
            if(i.getAttribute("state") == "opening") {
                i.setAttribute("state", "opened");
            } else if(i.getAttribute("state") == "closing") {
                i.setAttribute("state", "closed");
                i.querySelector(".acclist-content").remove();
            }
    }

    // opening sequence start
    if(["closing", "closed"].includes(thisItem.getAttribute("state"))) {
        thisItem.setAttribute("state", "opening");
        if(!hash) { // will scroll to category/project automatically

            var thisItemPrev = thisItem.previousElementSibling, // previous menu button
                accAngle = window.innerWidth * Math.tan(6 * deg2rad), // offset for the skew
                tItemAnchor, sibCsH = 0, sibb = [];

            const prevSiblings = (elem) => { // get previous siblings of an element
                let sibs = []; while(elem = elem.previousElementSibling) { sibs.push(elem); }
                return sibs;
            };
            if(thisItemPrev) {
                tItemAnchor = thisItemPrev.querySelector(".acclist-btn").getBoundingClientRect().bottom; // if there's a button above the focused one, use its "bottom" position as anchor
                if(!thisItemPrev.querySelector(".acclist-content")) { // if there are multiple previous siblings, will offset their height for the final scroll-to
                    const sibs = prevSiblings(thisItem);
                    sibs.forEach(sib => {
                        var sibC = sib.querySelector(".acclist-content");
                        if(sibC) { sibCsH += sibC.offsetHeight; sibb.push(sib) }
                    });
                }
            } else { tItemAnchor = thisItem.querySelector(".acclist-btn").getBoundingClientRect().top; accAngle = 0; }

            // scroll to category
            scrollbarMain.scrollStop().scroll({ y : scrollbarMain.scroll().position.y + ((tItemAnchor - sibCsH) - accAngle) }, 700, "easeInOutCubic");
        }
        var accCHidden = document.querySelector("*[accordion-content][level='"+ itemLv +"'] [i-id='"+ iID(thisItem) +"'] > .acclist-content"), // get hidden/fake elements, will be copied later
            otherAccItems = document.querySelectorAll(".acclist-item:not([i-id='"+ iID(thisItem) +"'])");
        otherAccItems.forEach((itemOther) => { // close every other category if opened
            if(["opening", "opened"].includes(itemOther.getAttribute("state"))) {
                if(itemOther.getAttribute("level") == itemLv) {
                    itemOther.setAttribute("state", "closing");
                }
                if(itemLv == "2") { // same thing but for levels lower
                    thisItem.closest(".acclist-content").style.height = document.querySelector("*[accordion-content][level='1'] [i-id='"+ lv1ID +"'] > .acclist-content").offsetHeight.offsetHeight +"px";
                }
            }
        })

        var itemc = thisItem.querySelector(".acclist-content");
        if(itemc == null) {
            var accCReal = accCHidden.cloneNode(true); // copy hidden project cards
            accCReal.style.height = accCHidden.offsetHeight +"px"; // get the height for the cool transition
            if(itemLv == "2") { setTimeout(() => { thisItem.closest(".acclist-content").style.height = document.querySelector("*[accordion-content][level='1'] [i-id='"+ lv1ID +"'] > .acclist-content").offsetHeight.offsetHeight + accCHidden.offsetHeight +"px"; }, 100); }
            accCReal.classList.add("clos");
            addEvTrEnd(accCReal, () => { finalState(thisItem); }, "height"); // will finish transition when transitionend event of "height" triggered
            thisItem.querySelector(".acclist-in").appendChild(accCReal); // generate/paste project cards

            var accBtnLv2 = accCReal.querySelectorAll(".acclist-btn");
            if(accBtnLv2 != null) { accBtnLv2.forEach((ibtn2) => { ibtn2.addEventListener("click", openAccItem); }) }

            setTimeout(() => { thisItem.querySelectorAll(".al-card").forEach((card) => { card.addEventListener("click", (ev) => { openProjectCardPopup(ev, card, thisItem); })}); }, 1);
            setTimeout(() => { accCReal.classList.remove("clos"); }, 100); // start transition (with a bit of delay to be sure everything is computed correctly)
        }
        else {
            if(itemLv == "2") { thisItem.closest(".acclist-content").style.height = document.querySelector("*[accordion-content][level='1'] [i-id='"+ lv1ID +"'] > .acclist-content").offsetHeight.offsetHeight + accCHidden.offsetHeight +"px"; }
        }

    // closing sequence start
    } else if(["opening", "opened"].includes(thisItem.getAttribute("state"))) { // already opened
        thisItem.setAttribute("state", "closing");
        if(itemLv == "2") {
            thisItem.closest(".acclist-content").style.height = document.querySelector("*[accordion-content][level='1'] [i-id='"+ lv1ID +"'] > .acclist-content").offsetHeight.offsetHeight +"px";
            if(thisItem.closest('[level="1"]').getAttribute('state') != 'closing') { history.replaceState({}, '', '#'+ lv1ID); }
        } else {
            cleanURL();
        }
    }
}
function pHashOpenAccItem() { // will scroll automatically to category/project if present in url at load
    var urlHash = window.location.hash.substring(1); // get full hash (category and project)
    if(urlHash) { // if there's some kind of hash in there
        var urlHashAcc = urlHash.split('?')[0]; // category
        var urlHashP = urlHash.split('?')[1]; // project
        var i = document.querySelector('[accordion-scroll] .acclist-item[i-id="' + urlHashAcc +'"]'), // get corresponding category item
            k = 900;

        function open(item, p) {
            p = p || false;
            setTimeout(() => {
                openAccItem(item);
                k = 400;

                // OPEN PROJECT
                if(urlHashP && p) { // open project if exists
                    if(document.querySelector('[accordion-content] [i-id="' + urlHashAcc +'"] #'+ urlHashP)) {
                        setTimeout(() => {
                            openProjectCardPopup("", document.querySelector('[accordion-scroll] [i-id] .al-card#'+ urlHashP), i);
                        }, 900);
                    } else { cleanURL('?'); } // then what the f* did you put in the url
                }
            }, k);
        }
        function scrollToI(i, d) {
            var dd = 200; if(isMini) { dd = 400; }
            setTimeout(() => {
                if(isMini) { scrollbarMain.update(true); }
                scrollbarMain.scroll({y: i.querySelector('.acclist-btn').getBoundingClientRect().top}, 800, 'easeInOutCubic');
            }, dd + d);
        }

        // SCROLL TO CATEGORY ITEM
        if(urlHashAcc) { // category hash exists ?
            if(i) { // category button exists ? so it is level 1
                open(i, true);
                scrollToI(i, k);
            } else if(document.querySelector('[accordion-content][level="2"] [i-id="'+ urlHashAcc +'"]')) { // level 2 category button exists ?
                open(document.querySelector('.acclist-item[i-id="'+ iID(document.querySelector('[accordion-content][level="1"] [i-id="'+ urlHashAcc +'"]')
                        .parentNode.closest('[i-id]')) +'"]')); // open level 1
                setTimeout(() => {
                    i = document.querySelector('[accordion-scroll] [i-id="'+ urlHashAcc +'"]');
                    open(i, true);
                    scrollToI(i, 0);
                }, k);
            } else { cleanURL(); } // then what the f* did you put in the url
        }
    } else { cleanURL(); } // then what the f* did you put in the url
}

function openProjectCardPopup(ev, p, item) {
    p.classList.add("focus"); // focus project card
    cleanURL("?"); history.pushState({}, "", window.location.hash +"?"+ p.id);

    // close project popup on history back event (cool for mobile user and grandmas <3)
    setTimeout(() => {
        window.addEventListener("hashchange", closeProjectCardPopup, { once:true });
    }, 10);

    // create project popup container if not already ready
    if(!container.querySelector("#content-container ~ [project-popup]")) {
        var ppContainer = document.createElement("div");
        ppContainer.setAttribute("project-popup", "");
        container.querySelector("#content-container").parentElement.appendChild(ppContainer);
    }

    function setScrMain(pe, ah) { // change parameters for scrollbarMain
        var viewport = scrollbarMain.getElements("viewport"), ahD = OScrHDelay;
        if(pe) { viewport.classList.add("disabled"); ahD = 0; } else { viewport.classList.remove("disabled"); }
        scrollbarMain.getElements("scrollbarVertical.handle").style.pointerEvents = pe;
        scrollbarMain.options("scrollbars.autoHide", ah);
        scrollbarMain.options("scrollbars.autoHideDelay", ahD);
    }
    setScrMain("none", "scroll"); // hide for project popup, no need

    function closeProjectCardPopup() { // close project popup, bunch of magic happening here
        cleanURL("?");

        // remove event listeners
        window.removeEventListener("hashchange", closeProjectCardPopup, { once:true });
        swup.off("animationOutStart", closeProjectCardPopupAuto);

        // enable back scrollbarMain
        if(document.querySelectorAll("div[project-popup] > .project-popup").length <= 1) { setScrMain(null, "move"); }

        // remove focus from every project card to be clean
        var allFocused = document.querySelectorAll("div[accordion-scroll] .focus");
        if(allFocused) { allFocused.forEach((f) => { f.classList.remove("focus"); })}

        // effects tied to the project popup, ease of life
        ppBG.style.opacity = "0";
        projectPopup.style.pointerEvents= "none";
        projectPopup.classList.add("out");
        closeFake.classList.add("quit");
        hideCurClose();
        setTimeout(() => { closeFake.classList.add("hid"); }, 1);

        // final remove
        setTimeout(() => { projectPopup.scrollbarPP.destroy(); projectPopup.remove(); }, 1000);
    }

    function closeProjectCardPopupAuto() { // if needed to close project popup unexpectedly
        if(projectPopup) { closeProjectCardPopup();
            var descimg = ppDesc.querySelector(".pp-img.focus");
            if(descimg) { closeppdImgView(null, descimg, descimg.querySelector("img"), document.querySelector("div[project-popup]").querySelector(".ppd-imgview")); }
        }
    }

    // project popup
    var projectPopup = document.createElement("div");
    projectPopup.classList.add("project-popup");
    projectPopup.classList.add("pre");
    document.querySelector("div[project-popup]").appendChild(projectPopup);

    var proj, // project to show in main section
        pWebLink = ``, suInteract = ``,
    pSpan = p.querySelector(".p-title > span");
    const PROJECT = pData[p.id]; // get this project informations from data-base
          PROJECT.desc = (!PROJECT.desc) ? {} : PROJECT.desc; // fix "TypeError PROJECT.desc undefined" when check if "desc.[lang]" exists

    // FORMAT
    const urlID = ( (PROJECT.url_id) ? (
                      (PROJECT.url_id != Prj.projectsDataSample.TEMPLATE.url_id) ? PROJECT.url_id : pDataDefault.url_id
                  ) : pDataDefault.url_id ),
          embedURL = ((PROJECT.embed) ? PROJECT.embed : pDataDefault.embed),
          embedFormat = ((PROJECT.format) ? PROJECT.format : pDataDefault.format);

    var formatU, formatSU;
    if(embedFormat == "1:1" || embedFormat == "fill") {
        formatU = "80.1vh";
    }
    else {
        formatSU = (embedFormat == "16:9") ? "56.25" : embedFormat;
        formatU = formatSU + "%";
        formatSU = "calc((var(--pp-popup-c-size) * 1vw * var(--pp-sgrid) / 100 - var(--pp-sgrid-gap)) * "+ formatSU +" / 100);"
    }

    // TYPE
    if(PROJECT.type == "img") {
        const imgMiniSRC = p.querySelector(".thumb").getAttribute("src");

        proj = `
            <div style="width:100%;height:100%;"><img class="pp-img" src="${imgMiniSRC}" style="${
                (PROJECT.needBG) ? "background-color: "+ ((PROJECT.needBG != true) ? PROJECT.needBG : "var(--y-b2)") +"; " : "" // put a background color if needed
            }background-image: url(${imgMiniSRC});"></img></div>
        `;
    }

    else {
        var iframe;

        if(PROJECT.type == "yt") {
            iframe = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/${urlID}?rel=0&color=white&loop=1" frameborder="0" allowfullscreen></iframe>`
        }

        if(PROJECT.type == "embed") {
            iframe = `<iframe src="${urlID}" width="1920px" height="1080px" frameborder="0"></iframe>`
            pWebLink = Prj.projectTemplate('link', embedURL, ((language == "fr") ? "ACCÉDER AU SITE" : "ACCESS WEBSITE"));
        }

        proj = `
            <div id="player-c">
                <div id="player" style="padding-bottom: ${formatU};">
                    ${iframe}
                </div>
            </div>
        `;
    }

    if(PROJECT.type == 'g_pdf') {
        proj = `
            <div id="pdf-reader">
                <iframe class="pp-pdf" src="https://drive.google.com/file/d/${urlID}/preview" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        `;
    }

    // CONTEXT formatting
    var pContextsEl = ``, pFiltersEl = ``;
    if(PROJECT.context) {
        PROJECT.context.split("|").forEach(context => {
            var c = pContexts.en.format[context];
            if(!c) { c = context.toUpperCase(); } // if does not correspond to any existing, take current value
            pContextsEl += `<span class="context">${c}</span>`;
        });
    }

    // FILTER formatting
    if(PROJECT.filter) {
        PROJECT.filter.split("|").forEach(filter => {
            var f = pFilters.en.format[filter];
            if(!f) { f = filter.toUpperCase(); } // if does not correspond to any existing, take current value
            pFiltersEl += `<span class="filter-${filter}">${f}</span>`;
        });
    }

    if(((PROJECT.interact) ? PROJECT.interact : pDataDefault.interact) == 'off') {
        const suInSVG = `<svg viewBox="0 0 32 32"><polygon points="13.4,7.2 16,4.6 27.5,16 16.1,27.4 13.4,24.8 20.5,17.7 4.5,17.7 4.5,14.3 20.5,14.3"/></svg>`;
        suInteract = suInSVG + `<div><span>MAXIMIZE</span><span>CLOSE</span></div>` + suInSVG;
    }
    projectPopup.innerHTML = `
        <div class="pp-bg" style="opacity:0;"></div>
        <div class="pp-popup-c" pp-interact=${((PROJECT.interact) ? PROJECT.interact : pDataDefault.interact)}>
            <div class="pp-sectiongrid">
                <section class="pp-project">
                    <div class="pp-proj">
                        ${proj}
                    </div>
                    <div class="pp-scaleup" style="height: ${formatSU}">${suInteract}</div>
                </section>
                <section class="pp-desc" scroll>
                    <div class="pp-title-c">
                        <div class="pp-title">
                            <span id="big">${
                                ((PROJECT).title ? (PROJECT).title : pDataDefault.title) // get title from project card
                            }</span>
                            <div class="pp-t-pills">
                                <div class="tags-space">
                                    <div id="contexts">${pContextsEl}</div>
                                    <div id="date"><span>${((PROJECT.date) ? PROJECT.date : pDataDefault.date)}</span></div>
                                </div>
                                <div class="tags-line">
                                    <div id="filters">${pFiltersEl}</div>
                                </div>
                            </div>
                        </div>
                        <div class="pp-title-under">
                            <span class="pp-subtitle">${((PROJECT.subtitle) ? PROJECT.subtitle : pDataDefault.subtitle)}</span>
                            <div class="pp-langswitcher-c">
                                <div class="pp-langswitcher">
                                    <span l="fr">FR</span><span l="en">EN</span>
                                    <div class="pp-ls-bg"></div>
                                </div>
                            </div>
                        </div>
                        `+ pWebLink +`
                    </div>
                    <div class="pp-desctxt"></div>
                </section>
            </div>
            <div class="pp-fakeclose">
                <svg viewBox="0 0 32 32">
                    <line x1="26.3" y1="26.3" x2="5.7" y2="5.7"/>
                    <line x1="5.7" y1="26.3" x2="26.3" y2="5.7"/>
                </svg>
            </div>
        </div>
        <div class="pp-curclose">
            <svg viewBox="0 0 32 32">
                <line x1="26.3" y1="26.3" x2="5.7" y2="5.7"/>
                <line x1="5.7" y1="26.3" x2="26.3" y2="5.7"/>
            </svg>
        </div>
    `;

    var ppBG = projectPopup.querySelector('.pp-bg'),
        closeFake = projectPopup.querySelector('.pp-fakeclose'),
        closeCur = projectPopup.querySelector('.pp-curclose'),
        ppProj = projectPopup.querySelector('.pp-project'),
        pplBtn = projectPopup.querySelectorAll('.pp-langswitcher > span'),
        ppDesc = projectPopup.querySelector('.pp-desc'),
        ppDesctxt = ppDesc.querySelector('.pp-desctxt');


    function closeppdImgView(ev, descimg, descimgImg, imgView) {
        imgView.classList.add('out');
        descimg.classList.remove('focus');
        descimgImg.addEventListener('transitionend', () => { imgView.remove(); });
        if(ev != null) { moveCurClose(ev); }
    }
    function ppDImgViewCreate() {
        var ppDImg = ppDesc.querySelectorAll('.pp-img');
        if(ppDImg) {
            ppDImg.forEach(descimg => {
                descimg.addEventListener('click', function() {
                    descimg.classList.add('focus');

                    var imgView = document.createElement('div'),
                        descimgImg = descimg.querySelector('img');
                    imgView.classList.add('ppd-imgview');
                    imgView.classList.add('pre');
                    document.querySelector('div[project-popup]').appendChild(imgView);
                    imgView.innerHTML = `
                        <div class="ppdiv-bg"></div>
                        <div class="ppdiv-img-c"><img src="`+ descimgImg.getAttribute('src') +`"/></div>
                    `;
                    setTimeout(() => { imgView.classList.remove('pre'); }, 10);

                    imgView.addEventListener('click', function(ev) { closeppdImgView(ev, descimg, descimgImg, imgView); })
                })
            });
        }
    }
    function ppDesctxtAnimateSpawn(ppDesctxtin) {
        var ch = 0.1;
        ppDesc.querySelectorAll('.pp-desctxt-in:last-child > *').forEach((txt) => {
            ch += 0.15;
            if(txt.hasAttribute('class')) { txt.style.transitionDelay = ch +'s, ' + ch +'s, ' + '0s';
            } else { txt.style.transitionDelay = ch +'s'; }
        })
        setTimeout(() => { if(ppDesctxtin) { ppDesctxtin.classList.remove('pre'); } }, 20);
    }
    function ppDesctxtAnimateOut(descInAll) {
        if(descInAll) {
            descInAll.forEach(descIn => {
                //projectPopup.querySelector('.os-viewport').scrollTo({top: 0, behavior: 'smooth'});
                projectPopup.scrollbarPP.scroll({y : 0}, 500, 'easeOutQuint');
                descIn.addEventListener('transitionend', () => { descIn.remove(); });
                descIn.childNodes.forEach((el) => { el.addEventListener('transitionend', (ev) => { ev.stopPropagation(); })});
                descIn.classList.add('out');
            });
        }
    }
    function ppDesctxtPrint() {
        ppDesctxtAnimateOut(ppDesc.querySelectorAll('.pp-desctxt > .pp-desctxt-in'));

        var ppDesctxtin = document.createElement('div');
        ppDesctxtin.classList.add('pp-desctxt-in'); ppDesctxtin.classList.add('pre');
        ppDesctxt.appendChild(ppDesctxtin);

        setTimeout(() => {
            if(language == 'fr') {
                ppDesctxtin.innerHTML = ((PROJECT.desc.fr) ? PROJECT.desc.fr : '<p class="no">Pas de description disponible.</p>');
            } else {
                ppDesctxtin.innerHTML = ((PROJECT.desc.en) ? PROJECT.desc.en : '<p class="no">No description available.</p>');
            }
            ppDImgViewCreate();
            ppDesctxtAnimateSpawn(ppDesctxtin);
        }, 1);
    }
    ppDesctxtPrint();

    // lang switching
    pplBtn.forEach(lbtn => { if(lbtn.getAttribute('l') == language) { lbtn.classList.add('focus'); } });
    projectPopup.querySelector('.pp-langswitcher-c').addEventListener('click', function() {
        pplBtn.forEach(l => { l.classList.toggle('focus'); });
        setTimeout(() => {
            language = projectPopup.querySelector('.pp-langswitcher > span.focus').getAttribute('l');
            ppDesctxtPrint();
        }, 1);
    })

    // scrollbar settings
    const ppOScr = ((isMini) ? { autoHide : 'move', autoHideDelay : OScrHDelay } : { autoHide : 'leave', autoHideDelay : 0 });
    projectPopup.scrollbarPP = OverlayScrollbars(ppDesc, {
        autoUpdate : o1[0],
        overflowBehavior : {
            x : 'hidden',
            y : 'scroll'
        },
        scrollbars : ppOScr,
        callbacks : {
            onScroll : scrollStartEnd
        }
    });

    function scrollStartEnd() { // change border radius left top/bottom with scroll
        const scroll = projectPopup.scrollbarPP.scroll(),
              pp = document.querySelector(".pp-popup-c"),
              clamp = 120;

        pp.style.borderBottomRightRadius = null;
        pp.style.borderTopRightRadius = null;

        if(scroll.handleLengthRatio.y < 1) { // check if needs scrollbar
            if(scroll.position.y < clamp) { // top
                pp.style.borderTopRightRadius = "0em";
            } else if(scroll.position.y > scroll.trackLength.y - clamp) { // bottom
                pp.style.borderBottomRightRadius = "0em";
            }
        }

    }
    setTimeout(() => {
        scrollStartEnd();
    }, 500);

    // Load higher resolution picture
    if(PROJECT.type == 'img') {
        // (https://stackoverflow.com/a/54123157)
        function loadHighResImage(elem, highResUrl) {
            let image = new Image();
            image.addEventListener('load', function() {
                elem.src = highResUrl;
                setTimeout(() => { elem.style.backgroundImage = null; }, 500);
            });
            image.src = highResUrl;
        };
        loadHighResImage(ppProj.querySelector('.pp-img'), './assets/medias/projects/high/'+ p.id +'_high.'+ ((PROJECT.ext) ? PROJECT.ext : pDataDefault.ext));
    }

    // Cursor Close on BG hover
    function moveCurClose(event) {
        var cursorX = event.clientX,
            cursorY = event.clientY;
        closeCur.style.top = cursorY + 'px';
        closeCur.style.left = cursorX + 'px';
    }
    function showCurClose() {
        closeFake.classList.add('hid');
        closeCur.classList.add('hover');
    }
    function hideCurClose() {
        closeFake.classList.remove('hid');
        closeCur.classList.remove('hover');
    }
    if(touchDevice == false || isMini == false) {
        ppBG.style.cursor = 'none';

        moveCurClose(ev);
        ppBG.addEventListener('mousemove', moveCurClose);
        ppBG.addEventListener('mouseover', showCurClose);
        ppBG.addEventListener('mouseout', hideCurClose);

        ppProj.querySelector('.pp-scaleup').addEventListener('click', moveCurClose);

        projectPopup.addEventListener('mousemove', moveCurClose);
        setTimeout(function() { projectPopup.removeEventListener('mousemove', moveCurClose); }, 800);
    }
    // CLOSE
    setTimeout(() => {
        ppBG.addEventListener('click', () => { closeProjectCardPopup(); });
    }, 350); // security in case of multi-clicks

    // ANIMATIONS
        setTimeout(() => {
            ppBG.style.opacity = null;
            ppDesctxtAnimateSpawn(null);
            projectPopup.classList.remove('pre');
        }, 33);

    // PROJECT SCALE UP
    function projScaleUp() { projectPopup.classList.toggle('pscaleup'); }
    ppProj.querySelector('.pp-scaleup').addEventListener('click', projScaleUp)

    swup.on('animationOutStart', closeProjectCardPopupAuto);
}

function resizeAccC() {
    document.querySelectorAll('section.acclist-item[state^=open]').forEach((a) => {
        var accc = a.querySelector('.acclist-content');
        accc.style.transitionDuration = '0s';
        accc.style.height = document.querySelector('*[accordion-content] [i-id="'+ iID(a) +'"] > .acclist-content').offsetHeight +'px';
        if(a.getAttribute('level') == '2') {
            accc.parentNode.closest('.acclist-content').style.height = document.querySelector('*[accordion-content][level="1"] [i-id="'+ iID(a.closest('.acclist-item[level="1"]')) +'"] > .acclist-content').offsetHeight + document.querySelector('*[accordion-content] [i-id="'+ iID(a) +'"] > .acclist-content').offsetHeight +'px';
        }
        setTimeout(() => { accc.style.transitionDuration = null; }, 1);
    })
}
function ppSUHeight() {
    if(window.innerWidth <= 1200) { doc.style.setProperty('--pp-popup-c-h-su', Math.round(window.innerHeight * 0.8525) + 'px'); }
}

var checkScrollSpeed = (function(){ // (https://stackoverflow.com/a/22599173)
    var lastPos, newPos, timer, delta, direction, delay = 100;
    function clear() { lastPos = null; delta = 0; direction = true; }
    clear();
    return function(){
        newPos = scrollbarMain.scroll().position.y;
        if(lastPos != null ) { delta = newPos -  lastPos; }
        if(lastPos > newPos) { direction = false; }
        lastPos = newPos;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);
        return [delta * 2.75, direction];
    };
})();

var isScrolling, accScroll = document.querySelector('div[accordion-scroll]');
function scrollAccordion() {
    if(pathDir == 'projects') {
        var speed = checkScrollSpeed(), space = 0,
            items = [Object.values(accScroll.querySelectorAll('.acc-s[level="1"]')), Object.values(accScroll.querySelectorAll('.acc-s:not([level="1"])'))];

        items.forEach((item) => {
            if(speed[1]) { item.reverse(); }
            var k = 0;
            item.forEach((i) => {
                k+=1;
                if(pathDir != 'about') { space += -speed[0] / 2; } else { space += -speed[0] * 1.25 ; }
                var spaceMax = Math.min(Math.max(space, -350), 350);
                if(i.getAttribute('level') != "1") { spaceMax /= 4; }
                if(['opening', 'opened'].includes(i.getAttribute('state'))) { spaceMax /= 2;
                    if(i.getAttribute('level') != "1") { spaceMax /= 2; } }
                i.style.transitionTimingFunction = null;
                i.style.transform = 'translate3d(0px, '+ spaceMax +'px, 0px)';
                i.setAttribute('order', k)
            })
        })
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() { items.forEach((item) => { item.forEach((i) => {
            i.style.transitionTimingFunction = 'cubic-bezier(0.2, 0.7, 0, 1)';
            i.style.transform = null;
        }) }) }, 75);
    }
}

//- RUN ON LANDING -
function init() {
    var nav = document.querySelector('nav');
    accScroll = document.querySelector('div[accordion-scroll]');

    getPageID(); doc.setAttribute('page', pathDir); doc.setAttribute('page2', pathDir);

    if (nav.hasChildNodes() == false) { // NAVIGATION
        nav.style.zIndex = '0';
        nav.innerHTML = `
            <div id="ymenu-c">
                <div class="header pre-spawn">
                    <span>yolan’<br>portfolio</span>
                </div>
                <svg id="y" viewBox="0 0 25 25">
                    <rect id="tracker" style="opacity:0; pointer-events:none;" stroke-width="0" x="3.8" y="0.2" width="17.4" height="24.6"></rect>
                    <g link="home">
                        <g id="float">
                            <g>
                                <polygon points="6.3,3.3 14,9.2 9.4,10.3"/>
                                <path d="M8.8,6.5l2.9,2.2L10,9.1L8.8,6.5 M3.8,0.2l5,11.3l7.4-1.8L3.8,0.2L3.8,0.2z"/>
                            </g>
                        </g>
                        <g id="main" class="pre-spawn">
                            <g>
                                <polygon points="9.9,11.8 18.8,3.8 12,21.4"/>
                                <path d="M16.3,7.4L15,10.8l-1,2.7l-1.7,4.4L11,12.2L16.3,7.4 M21.2,0.2L21.2,0.2L21.2,0.2z M21.2,0.2L8.8,11.5l2.9,13.4l4.1-10.7 l1-2.7L21.2,0.2L21.2,0.2z"/>
                            </g>
                        </g>
                    </g>
                </svg>
                <div id="ym-txt-c" class="pre-spawn">
                    <div id="ym-txt-c2">
                        <a id="a" class="ym-txt" link="about"><span>About</span></a>
                        <a id="p" class="ym-txt" link="projects"><span>Projects</span></a>
                    </div>
                </div>
            </div>
            <div id="ynav-boom-container"></div>
        `;

        // header pin
        const navYgH = document.querySelector("svg#y g[link='home']"),
              navYTracker = document.querySelector("svg#y #tracker"),
              navHeader = document.querySelector("#ymenu-c .header");
        function headerPin() {
            const svgyPos = navYTracker.getBoundingClientRect();
            navHeader.style.top = svgyPos.top + scrollbarMain.scroll().position.y +"px";
            navHeader.style.left = svgyPos.right +"px";
        }
        function headerPinUpdateLoop() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    headerPin();
                }, 30 * i);
            }
        }
        navYgH.addEventListener('mouseover', () => {
            navHeader.classList.add('hover');
        });
        navYgH.addEventListener('mouseout', () => {
            navHeader.classList.remove('hover');
        });
        window.addEventListener('resize', headerPinUpdateLoop);

        //- SPAWN ANIMATION
        function removePreSpawn(path) {
            document.querySelectorAll(path).forEach((e) => { e.classList.remove('pre-spawn'); })
        }

        document.querySelectorAll(".transition-y").forEach((e) => { e.classList.add("pre-spawn"); })

        setTimeout(() => {
            removePreSpawn('nav');
            setTimeout(() => { removePreSpawn('svg#y g#main'); }, 50);
            setTimeout(() => {
                nav.style.zIndex = null;
                removePreSpawn('#ym-txt-c');
            }, 225);
        }, 300);
        setTimeout(() => {
            removePreSpawn('.transition-y.pre-spawn');
            headerPin();
            setTimeout(() => {
                removePreSpawn('.header');
            }, 400);
        }, 550);

        function yNavBoomHold(ev, el) {
            const containerW2 = doc.clientWidth / 2, containerH2 = doc.clientHeight / 2, // get container center (viewport for now)
                  originX = ev.clientX, originY = ev.clientY, // get origin
                  // get farthest corner from origin
                  cornerX = Math.abs(originX - ((originX > containerW2) ? 0 : doc.clientWidth)),
                  cornerY = Math.abs(originY - ((originY > containerH2) ? 0 : doc.clientHeight)),
                  // use Pythagoras to get circle parameters
                  circleDiameter = float(Math.sqrt(cornerX**2 + cornerY**2) + 5) * 2, // get diameter + add 5px to be sure it fills the whole container
                  circleRotate = float(Math.atan(cornerX/cornerY)*180/Math.PI) * -1; // get angle to match middle of the circle div edge
                  //console.table({containerW2,containerH2, originX,originY, cornerX,cornerY, circleDiameter,circleRotate}) // debug values

            const cTr = ['1s cubic-bezier(0.375, 0.7, 0, 1)', 1300];

            var boom = document.createElement('div'),
                boomCircle = document.createElement('div');
            boom.classList.add('ynav-boom'); boomCircle.classList.add('circle');
            boom.style.setProperty('--boom-rotate', circleRotate +'deg');
            boom.style.setProperty('--boom-x', originX +'px');
            boom.style.setProperty('--boom-y', originY +'px');
            document.querySelector('nav #ynav-boom-container').appendChild(boom); boom.appendChild(boomCircle);

            function boomRemove() {
                boomCircle.style.opacity = '0';
                setTimeout(function() {
                    boom.remove();
                }, cTr[1]);
            }

            setTimeout(function() {
                boomCircle.style.transition = 'width '+ cTr[0] +', height '+ cTr[0] +', background-color 0.65s 0.125s cubic-bezier(0.5, 0.7, 0, 1), opacity '+ cTr[1] +'ms ease-in-out';
                boomCircle.style.setProperty('--boom-size', circleDiameter +'px');
                boomCircle.style.backgroundColor = 'var(--y-w1)';
                if(el != null) {
                    el.addEventListener('mouseup', () => { boomRemove(); });
                    el.addEventListener('mouseleave', () => { boomRemove(); });
                } else { boomRemove(); }
            }, 10);
        }

        ///nav.querySelectorAll('*[link]').forEach((l) => { l.addEventListener('mousedown', function(ev) { yNavBoom(ev, false, l)})}); // old
        nav.querySelectorAll('g[link="home"]').forEach((l) => {
            l.addEventListener('mousedown', function(ev) { yNavBoomHold(ev, l)});
        });
        ///swup.on('popState', function() { yNavBoom(null, true, null); });
    }

    //var navSvgY = nav.querySelector('svg#y');
    if(pathDir != 'home') {
        ///nav.setAttribute('style', 'height: 290px; height: calc(clamp(150px, 3vw, 430px) * 1);') // var(--content-top) / hard coded bc of compatibility
        //navSvgY.setAttribute('style', 'max-width: 150px; max-width: calc(clamp(9999px, 100vw, 9999px) * 1); height: 115%;');
    } else {
        nav.setAttribute('style', '');
        //navSvgY.setAttribute('style', '');
    }

    if(pathDir == 'projects') {
        createProjectsMenu();

        // open acc items
        document.querySelectorAll('.acclist-item').forEach((item) => {
            item.setAttribute('state', 'closed');
            item.querySelector('.acclist-btn').addEventListener('click', openAccItem);
        })
        pHashOpenAccItem();

        ppSUHeight();
    }
    window.addEventListener('resize', () => {
        resizeAccC();
        ppSUHeight();
    });
}
init();
swup.on('contentReplaced', init);

swup.on('animationOutStart', function() {
    //document.querySelector('.os-viewport').scrollTo({top: 0, behavior: 'smooth'});
    scrollbarMain.scroll({y : 0}, 600, 'easeOutQuint');
});