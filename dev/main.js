// IMPORTS
//import 'overlayscrollbars/overlayscrollbars.css';
//import { OverlayScrollbars } from 'overlayscrollbars'; // current version doesn't support import (1.13.1)
import '../node_modules/overlayscrollbars/css/OverlayScrollbars.css';
import '../node_modules/overlayscrollbars/js/OverlayScrollbars.js';
//import Swup from 'swup';
//import SwupScrollPlugin from '@swup/scroll-plugin';
import Swup from '../node_modules/swup/dist/swup.js';
import SwupScrollPlugin from '../node_modules/@swup/scroll-plugin/dist/SwupScrollPlugin.js';

import './index.html'
import './main.scss'


//- Variables -
var doc = document.documentElement,
    pageMainURL,
    isMini = undefined,
    touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement),
    container = document.getElementById('container'),
    language = 'en';
if (/^fr\b/.test(navigator.language)) { language = 'fr'; }

const swup = new Swup({
    animateHistoryBrowsing: true,
    plugins: [new SwupScrollPlugin({
        doScrollingRightAway: true,
        scrollFriction: 0.8,
        scrollAcceleration: 0.6,
    })]
});

//- Scripts -
function checkWinSize() { if(window.innerWidth > 727) { isMini = false; } else { isMini = true; }};
checkWinSize(); window.addEventListener('resize', checkWinSize);

function getPageID() {
    var pageURL = (window.location.href).replace(/\/[^/]*$/, '');
    pageMainURL = pageURL.replace("/projects", '');
    //pathDir = pageURL.match(/([^\/]+$)/)[0];
    //if(window.location.pathname == '/' || window.location.pathname == '/index.html') { pathDir = 'home'; }
    //if(pathDir != 'projects') { pathDir = 'home'; } // hardcoded solution, idc it works
    pathDir = "projects"
    return pathDir;
} var pathDir = getPageID();

function cleanURL(s) {
    s = s || null;
    if(!s) { history.replaceState({}, '', window.location.pathname);
    } else { history.replaceState({}, '', window.location.hash.split(s)[0]);
    }
}

var o1 = [null, 33], OScrHDelay = 200; if(!isMini) { o1 = [true, 33]; OScrHDelay = 800; };

var scrollbarMain;
document.addEventListener('DOMContentLoaded', function() {
    scrollbarMain = OverlayScrollbars(document.querySelector('[scroll-main]'), {
        autoUpdate : o1[0],
        autoUpdateInterval : o1[1],
        overflowBehavior : {
            x : 'hidden',
            y : 'scroll'
        },
        scrollbars : {
            autoHide : 'move',
            autoHideDelay : OScrHDelay
        },
        callbacks : {
            onScroll : scrollAccordion
        }
    });
});

if(!!window.chrome) { document.querySelector('html').classList.add('isChr'); }


// PROJECTS DESCRIPTIONS
function ppDescSamples(type, url, title) {
    var el;
    if(type == 'img') {
        el = `<div class="pp-img"><div><div><img loading="eager" src="`+ url +`"/></div></div>
                <div class="pp-img-desc">`+ title +`</div></div>`
    } else if(type == 'link') {
        el = `<div class="pp-btn-c"><a class="pp-btn" href="`+ url +`" target="_blank"><span>`+ title +`
                <svg viewBox="0 0 32 32"><path d="M21.5,20.5v4h-14v-14h4c1.7,0,3-1.3,3-3l-10,0v20h20l0-10C22.8,17.5,21.5,18.8,21.5,20.5z"/><path d="M14.5,17.5L14.5,17.5c-0.6-0.6-0.6-1.5,0-2.1l8.9-8.9l2.1,2.1l-8.9,8.9C16,18.1,15.1,18.1,14.5,17.5z M24.5,7.5h-7l0-3h10v10l-3,0V7.5z"/>
                </svg></span></a></div>`
    }
    return el;
}
var srcP = './assets/medias/projects/';

var projectsDesc = {
// --- SAMPLES
    desc_sample : {
        desc : {
            test : `
                <h2>BigTitle</h2>

                <h3>LilTitle</h3>

                <p>Text</p>

                <p>Paragraph
                <br>Paragraph
                <br>Paragraph</p>

                ppDescSamples('img', 'src', 'Image')

                ppDescSamples('link', 'somewhereontheweb', 'Link')
            `,
        }
    },

// ARTWORKS
    'sch_t_iv' : {
        type : 'img', suType : 'img',
        year : '2020', month : '01', tag: 'perso',
        subtitle : ``,
        desc : {
            fr : `
                <h2>EXPÉRIMENTATION</h2>
                <p>Création d'une sensation de mouvement avec du contraste et des formes vectorielles en utilisant Adobe Illustrator.</p>
                <h2>INTERPRÉTATION</h2>
                <p>Les formes se croisent et s’empilent, elles alternent l’utilisation du noir et du blanc. Il n’y a aucune autre teinte.</p>
            `,
            en : `
                <h2>EXPERIMENTATION</h2>
                <p>Creating an impression of movement with contrast and vectors using Adobe Illustrator.</p>
                <h2>INTERPRETATION</h2>
                <p>The shapes overlap and stack, alternating the use of black and white. There are no other shades.</p>
            `,
        }
    },
    'sch_t_pm' : {
        type : 'img', suType : 'img',
        year : '2019', month : '10', tag: 'sch',
        subtitle : `What are we going to do with the dove?`,
        desc : {
            fr : `
                <h2>SUJET</h2>
                <p>Le sujet consiste en l'incrustation d'une peinture sur un support mural afin de créer entre eux un lien spécifique.</p>
                <h2>INSPIRATION</h2>
                <p>L'œuvre “The Armoured Dove” de Banksy, un célèbre street-artiste britannique, m’a inspiré dans la réalisation de ce projet.</p>
                `+ ppDescSamples('img', srcP + 'artworks/sch_t_pm/05 colombe Banksy.jpg', '"The Armoured Dove", Banksy (2005)') +`
                <p>Sa colombe a été peinte en 2005 sur un mur séparant Israël et la Palestine. Pour lui ce mur est une tentative absurde pour mettre fin au conflit. La colombe étant un symbole de pureté et de paix, Banksy l'a totalement exposée à la violence. Un pointeur vise son cœur.</p>
                <h2>L’ABANDONNÉE</h2>
                <p>Dans mon projet, j’ai choisi de faire de même en l’abandonnant dans un lieu sale et délaissé.
                <br>Je n’avais pas de lieu de ce genre donc j’ai peint la colombe à l’aquarelle sur une feuille, et je l’ai incrustée numériquement sur un mur.</p>
                `+ ppDescSamples('img', srcP + 'artworks/sch_t_pm/01 colombe originale.jpg', 'Colombe peinte à l\'aquarelle') +`
                <p>Puis j’ai incrusté une cage posée devant elle. Elle est coincée dans cet endroit. Paniquée, le bec ouvert et les ailes écartées. Les couleurs sont très ternes et sombres afin de donner une impression de détresse.</p>
            `,
            en : `
                <h2>TOPIC</h2>
                <p>The aim is to create a specific link between a painting and a wall support.</p>
                <h2>INSPIRATION</h2>
                <p>The work "The Armoured Dove" by Banksy, a famous British street-artist, inspired me to make this project.</p>
                `+ ppDescSamples('img', srcP + 'artworks/sch_t_pm/05 colombe Banksy.jpg', '"The Armoured Dove", Banksy (2005)') +`
                <p>His dove was painted in 2005 on a wall separating Israel and Palestine. For him, this wall is an absurd attempt to end the conflict. The dove being a symbol of purity and peace, Banksy has totally exposed it to violence. A pointer is aiming at its heart.</p>
                <h2>THE FORSAKEN ONE</h2>
                <p>In my project, I chose to do likewise by abandoning it in a dirty and neglected place.
                <br>I didn't know where to find such a place so I painted the dove on paper and digitally overlaid it on a wall.</p>
                `+ ppDescSamples('img', srcP + 'artworks/sch_t_pm/01 colombe originale.jpg', 'Painted dove with watercolours') +`
                <p>Then I put a cage in front of it. It is trapped in this place. Panicked, the beak open and the wings spread. The colours are very dull and dark to give an impression of despair.</p>
            `,
        }
    },
    'stargazing_a' : {
        type : 'img', suType : 'img',
        year : '2018', month : '10', tag: 'rs',
        subtitle : `Disrupting the stars when they sleep.`,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>"STARGAZING" est un projet de film avec la boîte de production de mon ami aspirant réalisateur. C’était initialement une affiche pour une campagne de financement participatif.</p>
                <p>Cependant, on a préféré se focaliser sur nos études et d'autres projets, donc il n'a pas encore abouti.</p>
                <h2>COMPOSITION</h2>
                <p>La scène a été composée numériquement sur Photoshop : le ciel, la voiture, le personnage, le brouillard, la lumière et l’herbe sont tous sur des calques différents.</p>
                <p>La lumière du véhicule éblouit et crée un halo autour du personnage, le mettant en valeur.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>"STARGAZING" is a movie idea with my aspiring filmmaker friend. It was originally a poster for a crowdfunding campaign.</p>
                <p>However, we preferred to focus on our studies and other projects, so it hasn't yet happened.</p>
                <h2>COMPOSITION</h2>
                <p>The scenery was digitally composed in Photoshop: the sky, the car, the character, the fog, the light and the grass are all on different layers.</p>
                <p>The lights of the vehicle dazzle and create a halo around the character, highlighting him.</p>
            `,
        }
    },
    'y_in_b' : {
        type : 'img', suType : 'img',
        year : '2018', month : '09', tag: 'perso',
        subtitle : `Right in front of the only light`,
        desc : {
            fr : `
                <h2>JEU DE LUMIÈRE</h2>
                <p>L’unique source de lumière permet un grand contraste avec la noirceur plate de l’arrière-plan et le relief des éléments de la scène.</p>
                <p>J’ai disposé un Y en carton sur un support et avec le flash de mon smartphone j'ai fait apparaître le plus de détails possibles.</p>
            `,
            en : `
                <h2>LIGHT PLAY</h2>
                <p>The single light source provides a strong contrast between the flat blackness of the background and the sharpness of the scene elements.</p>
                <p>I placed a Y-shaped cardboard statue on a surface and with the flash of my smartphone I tried to bring up as much details as possible.</p>
            `,
        }
    },
    'fut_met' : {
        type : 'img', suType : 'img',
        year : '2017', month : '06', tag: 'perso',
        subtitle : `From what kind of place is it coming from?`,
        desc : {
            fr : `
                <h2>IMAGINATION</h2>
                <p>Notre ignorance du fin fond de l’espace m’a donné envie d’imaginer une météorite venant d’une autre civilisation. Elle file à toute vitesse vers le spectateur depuis un endroit inconnu.</p>
                <h2>CONTEXTE</h2>
                <p>C’est l'un de mes premiers projets graphiques et aussi l'un de mes favoris.</p>
                <h2>DIFFUSION</h2>
                <p>J'ai eu la surprise de découvrir qu'un auteur du nom de Pierre-Jérôme Delage avait réutilisé ma météorite pour illustrer son article "À qui appartiennent les météorites ?" !</p>
                `+ ppDescSamples('link', 'https://droitetsf.hypotheses.org/78', 'ACCÉDER À L\'ARTICLE') +`
            `,
            en : `
                <h2>IMAGINATION</h2>
                <p>Our lack of knowledge of the far reaches of space made me want to imagine a meteorite coming from another civilization. It is rushing towards the viewer from an unknown place.</p>
                <h2>CONTEXT</h2>
                <p>This is one of my first graphic project and also one of my favourites.</p>
                <h2>DISPLAY</h2>
                <p>I was surprised to find out that an author named Pierre-Jérôme Delage had illustrated his article "Who do meteorites belong to?" (title translated) with my meteorite !</p>
                `+ ppDescSamples('link', 'https://droitetsf.hypotheses.org/78', 'ACCESS ARTICLE') +`
            `,
        }
    },
    'destr_casque' : {
        type : 'img', suType : 'img',
        year : '2016', month : '12', tag: 'fun',
        subtitle : `Breaking it even more. Why wouldn't I?`,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Pour honorer le bon temps passé avec un casque audio de la marque Logitech qui était tombé en panne et que j'affectionnais tout particulièrement, j’ai décidé de me filmer le détruisant à coup de marteau.</p>
                <p>J’ai publié cette vidéo sur YouTube dont j’ai fait la miniature ci-contre.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>To commemorate the good times spent with a Logitech headset that had broken down and that I was particularly fond of, I decided to film myself destroying it with a hammer.</p>
                <p>I posted this video on YouTube and made the thumbnail shown here.</p>
            `,
        }
    },

// 3D RENDERS
    'mc_factory92' : {
        type : 'vid', suType : 'interact',
        year : '2021', month : '01', tag: 'c',
        url : 'jN7L44_-igk', format : '1:1',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par un ami du nom de Browlin.
                <br>J'ai réalisé la présentation.</p>
                <h2>AMBIANCE</h2>
                <p>L’ambiance d’usine plutôt orange rouille est contrastée par l’énergie bleue qui s’échappe des réacteurs.</p>
                <h2>DIFFUSION</h2>
                `+ ppDescSamples('link', 'https://twitter.com/Browlin__/status/1356267490083557376', 'PARTAGÉ SUR TWITTER') +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by a friend named Browlin.
                <br>I only did the presentation.</p>
                <h2>AMBIANCE</h2>
                <p>The rather rusty orange factory atmosphere is contrasted by the blue energy escaping from the reactors.</p>
                <h2>DISPLAY</h2>
                `+ ppDescSamples('link', 'https://twitter.com/Browlin__/status/1356267490083557376', 'SHARED ON TWITTER') +`
            `,
        }
    },
    'mc_cyber_district1' : {
        type : 'img', suType : 'img',
        year : '2019', month : '08', tag: 'ppm',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>UN QUARTIER LUMINEUX</h2>
                <p>Les couleurs vives des faisceaux lumineux et des panneaux d'affichages se mélangent et se diffusent dans le ciel sombre.</p>
                <h2>DIFFUSION</h2>
                `+ ppDescSamples('link', 'https://twitter.com/PamplemousseBT/status/1167110044867072000', 'PARTAGÉ SUR TWITTER') +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>A LUMINOUS DISTRICT</h2>
                <p>The vibrant colours of the light beams and billboards blend and spread into the dark sky.</p>
                <h2>DISPLAY</h2>
                `+ ppDescSamples('link', 'https://twitter.com/PamplemousseBT/status/1167110044867072000', 'SHARED ON TWITTER') +`
            `,
        }
    },
    'mc_cyber_district2' : {
        type : 'img', suType : 'img',
        year : '2019', month : '08', tag: 'ppm',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>DENSITÉ</h2>
                <p>Ce plan large a pour but de mettre en valeur le grand nombre de détails de cette structure.</p>
                <h2>DIFFUSION</h2>
                `+ ppDescSamples('link', 'https://twitter.com/PamplemousseBT/status/1167110044867072000', 'PARTAGÉ SUR TWITTER') +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>DENSITY</h2>
                <p>This wide shot's aim is to highlight the great number of details of this structure.</p>
                <h2>DISPLAY</h2>
                `+ ppDescSamples('link', 'https://twitter.com/PamplemousseBT/status/1167110044867072000', 'SHARED ON TWITTER') +`
            `,
        }
    },
    'sch_1_wc' : {
        type : 'vid', suType : 'interact',
        year : '2019', month : '03-06', tag: 'sch',
        url : 'Cg0DBZRAbqU', format : '1:1',
        subtitle : `As the days passes, everything's staying the same...`,
        desc : {
            fr : `
                <h2>SUJET</h2>
                <p>Le sujet était de représenter la ville sans évoquer ses plus gros clichés.</p>
                <p>J’ai choisi de représenter son manque de personnalité en mettant en avant sa hauteur et sa répétitivité depuis le point de vue d’un piéton à travers le temps.</p>
                <h2>CRÉATION</h2>
                <p>En m’aidant du logiciel Cinema 4D, je l’ai entièrement créée en 3D.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/02 pts de vues 3D.jpg', 'Vues de la scène en 3D sur 4 axes différents') +`

                <p>Puis j’ai placé la caméra dans un carrefour.
                <br>J’ai modifié beaucoup de paramètres pour donner une impression vertigineuse : le point de fuite est déplacé dans le croisement des bâtiments et le champ de vision est étiré.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/01 camera 3D.jpg', 'Paramètres de la caméra') +`

                <p>J’ai simulé le déroulement du cycle jour/nuit et j’ai fait le rendu des images en vidéo.</p>
                <h2>POST-PRODUCTION</h2>
                <p>Sur VEGAS Pro, j’ai ajouté de nombreux effets pour polir le timelapse : de la brume, du grain, et surtout des effets lumineux pour le soleil. Le lever et le coucher sont plus colorés. J’ai simulé l’éblouissement en ajustant le contraste et le vignettage.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/04 montage en gros.jpg', 'Montage des effets vidéos') +`
            `,
            en : `
                <h2>TOPIC</h2>
                <p>The aim was to represent the city without bringing up its biggest clichés.</p>
                <p>I chose to depict its lack of character by emphasizing its height and repetitiveness from the point of view of a pedestrian across time.</p>
                <h2>CREATION</h2>
                <p>I created it entirely in 3D using Cinema 4D.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/02 pts de vues 3D.jpg', 'Scene overview on 4 different axes') +`

                <p>Then I placed the camera in an intersection.
                <br>I adjusted a lot of the camera settings to give it a dizzying effect: the vanishing point is shifted in the crossing of the buildings in the sky and the field of view is stretched.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/01 camera 3D.jpg', 'Camera settings') +`

                <p>I added a day/night cycle and rendered the frames in a video.</p>
                <h2>POST-PRODUCTION</h2>
                <p>On VEGAS Pro, I added many effects to refine the timelapse: haze, grain, and especially light effects for the sun. The sunrise and sunset are more colorful. I tried to fake the sun glare by adjusting the contrast and other effects.</p>
                `+ ppDescSamples('img', srcP + 'renders/sch_1_wc/04 montage en gros.jpg', 'Video effects') +`
            `,
        }
    },

// MOTION DESIGN
    'pub_sc_lc' : {
        type : 'vid', suType : 'interact',
        year : '2021', month : '02-04', tag: 'sc',
        url : '66QpHMgmXLM', format : '16:9',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Après avoir obtenu mon baccalauréat, je me suis porté volontaire dans une mission de Service Civique que l'association Unis-Cité proposait : "Les Connectés".</p>
                <p>Elle consistait à parcourir tout le département du Cantal afin d'aller à la rencontre des personnes ayant besoin d'aide pour devenir autonomes avec les outils informatiques (clavier, souris, applications...).</p>
                <p>
                <br>Nous avons réalisé des vidéos pour chaque lieu public dans lesquels on intervenait afin qu'ils les diffusent sur leurs réseaux sociaux.</p>
                <h2>PERSONNALISATION</h2>
                <p>Les vidéos ont été personnalisées en fonction de nos interventions dans chaque lieu : en atelier individuel ou collectif, avec ou sans inscription.</p>
                <h2>MONTAGE</h2>
                <p>C'est la première fois que je bossais sur un projet de ce genre en tant que "directeur" improvisé et monteur.</p>
                <p>La voix-off que vous entendez dans cette vidéo est la mienne.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>After obtaining my baccalauréat, I volunteered in "Les Connectés" (~ "The Connected"), a Service Civique mission of the association Unis-Cité.</p>
                <p>It consisted in going across the Cantal department in France to meet people who needed help learning how to use computer tools (keyboard, mouse, applications...).</p>
                <p>
                <br>We made videos for each places in which we were intervening so that they could broadcast them on their social networks.</p>
                <h2>PERSONALIZATION</h2>
                <p>The videos were customised to fit our interventions in each place: as individual or group sessions, with or without registration.</p>
                <h2>EDITING</h2>
                <p>It was my first time working on a project of this kind as an improvised "director" and editor.</p>
                <p>The voice-over you hear in this video is my voice.</p>
            `,
        }
    },
    'i_rs_b' : {
        type : 'vid', suType : 'interact',
        year : '2018', month : '09', tag: 'rs',
        url : 'XOnAthClcEI', format : '16:9',
        subtitle : `Synthwave into the darkest place of space!`,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Cette animation a été réalisée pour essayer le logo de la future boîte de production d'un ami.</p>
                <h2>AMBIANCE</h2>
                <p>Le but était de réaliser une introduction, style Synthwave/années 80s avec le quadrillage typique, les néons, les étoiles, les glitchs...</p>
                <p>J'ai ajouté des effets sonores pour amplifier l'ambiance.</p>
                <p>
                <br>Cependant, le rendu final est un peu trop sombre et pesant.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This animation was made to experiment with the logo of my friend's future film production company.</p>
                <h2>AMBIANCE</h2>
                <p>The goal was to take inspiration from the Synthwave/80s style with the typical grid, neons, stars, glitches...</p>
                <p>I also added some sound effects to intensify the atmosphere.</p>
                <p>
                <br>But the final result is a little too dark and heavy.</p>
            `,
        }
    },
    'i_jfm' : {
        type : 'vid', suType : 'interact',
        year : '2017', month : '12', tag: 'c',
        url : 'Gyho58zddwg', format : '16:9',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Un ami m'avait demandé lors de la réalisation d'une vidéo promotionnelle pour JordanneFM d'animer leur logo. Par la suite, JordanneFM l'a utilisé pour ses émissions.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>While a friend was making a promotional video for JordanneFM, he asked me to animate their logo. Afterwards, JordanneFM used it for some of their videos.</p>
            `,
        }
    },
    'i_y2' : {
        type : 'vid', suType : 'interact',
        year : '2017', month : '09', tag: 'perso',
        url : 'UkL4zVUw27Y', format : '16:9',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'i_inex' : {
        type : 'vid', suType : 'interact',
        year : '2017', month : '03', tag: 'c',
        url : '46MrLGy5Xb8', format : '16:9',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'i_yc' : {
        type : 'vid', suType : 'interact',
        year : '2017', month : '01', tag: 'perso',
        url : 'PR0fVAGbHIQ', format : '16:9',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },

// BRANDINGS
// -- YT
    'b_l1_rs' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2018', month : '06', tag: 'rs',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>"RETROSATURN" est la boîte de production de mon ami aspirant réalisateur.</p>
                <h2>CONCEPTION</h2>
                <p>Nous avons conçu ce logo ensemble afin d'obtenir quelque chose d'orienté années 80s.</p>
                <p>Il y a énormément de détails, comme l’irrégularité des couleurs et intensités des néons, la texture et la dynamique du mot "SATURN", le grain...</p>
            `,
            en : `
                <h2>CONTEXTE</h2>
                <p>"RETROSATURN" is the company of my aspiring filmmaker friend.</p>
                <h2>CONCEPTION</h2>
                <p>We designed this logo together to get a 80s feel to it.</p>
                <p>There are a lot of details, like the irregular color and intensity of the neon lights, the texture and dynamism of the word "SATURN", the grain...</p>
            `,
        }
    },
    'b_l2_rs' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2019', month : '01', tag: 'rs',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_rs' : {
        type : 'img', suType : 'img',
        year : '2018', month : '09', tag: 'rs',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_l1_caloucath' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2017', month : '07', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_caloucath' : {
        type : 'img', suType : 'img',
        year : '2017', month : '05', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b2_caloucath' : {
        type : 'img', suType : 'img',
        year : '2017', month : '09', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_l1_ppm' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2018', month : '10', tag: 'ppm',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_ppm' : {
        type : 'img', suType : 'img',
        year : '2019', month : '04', tag: 'ppm',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_mattmovie' : {
        type : 'img', suType : 'img',
        year : '2016', month : '11', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b2_mattmovie' : {
        type : 'img', suType : 'img',
        year : '2017', month : '02', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },

// -- STANDALONES
    'b_l1_jethro' : {
        type : 'img', suType : 'img', imgExt : 'png', white : true,
        year : '2018', month : '12', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_l1_wzr' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2017', month : '09', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_l1_nensho' : {
        type : 'img', suType : 'img', imgExt : 'png',
        year : '2017', month : '05', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_rezartilo' : {
        type : 'img', suType : 'img',
        year : '2017', month : '01', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'b_b1_killex' : {
        type : 'img', suType : 'img',
        year : '2016', month : '03', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },

// POSTERS
    'pdf_apc_hpi' : {
        type : 'pdf', suType : 'interact',
        url : '1J0SOaGtPElDcgNwxXx55vr_E_ah3cZDc',
        year : '2019', month : '11', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },
    'pdf_apc_wvhp' : {
        type : 'pdf', suType : 'interact',
        url : '1bCm600IXEowAT_jnyQLQcYP05QcAATYr',
        year : '2019', month : '08', tag: 'c',
        subtitle : ``,
        desc : {
            fr : ``,
            en : ``,
        }
    },

// WEBSITES
    'w_vh' : {
        type : 'web', suType : 'interact',
        url : 'https://valentinhebert.com', format : 'fill',
        year : '2020.10-2021', month : '01', tag: 'c',
        subtitle : ``,
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Ce site Internet fait partie des tout premiers que j’ai créés.</p>
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This website is one of the very first I have created.</p>
            `,
        }
    },
};


function addClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach(function(el) { el.classList.add(c); }); }
}
function removeClassAll(path, c) {
    var elems = document.querySelectorAll(path);
    if(elems) { elems.forEach(function(el) { el.classList.remove(c); }); }
}

function iID(i) { return i.getAttribute('i-id'); }

function openAccItem(h) {
    var thisItem, lv1, lv1ID, hash = false;
    if(h.type) {
        thisItem = this.closest('[level]');
        var t2 = thisItem.querySelector('.acclist-item[level="2"]'); // t2: when thisItem is lv1, selects lv2 too
        if(thisItem.closest('[level="1"]').getAttribute('state') != 'closing' || thisItem.getAttribute('level') == "1") {
            if(t2 && ['opening', 'opened'].includes(t2.getAttribute('state'))) { history.replaceState({}, '', '#'+ iID(t2));
            } else { history.replaceState({}, '', '#'+ iID(thisItem)); }
        }
    } else { thisItem = h; hash = true; }
    var itemLv = thisItem.getAttribute('level');
    if(itemLv == '2') { lv1 = thisItem.closest('.acclist-item[level="1"]'), lv1ID = iID(lv1); }

    function finalState(i) {
            if(i.getAttribute('state') == 'opening') {
                i.setAttribute('state', 'opened');
            } else if(i.getAttribute('state') == 'closing') {
                i.setAttribute('state', 'closed');
                i.querySelector('.acclist-content').remove();
            }
    }

    if(['closing', 'closed'].includes(thisItem.getAttribute('state'))) {
        thisItem.setAttribute('state', 'opening');
        if(!hash) { // ACC ITEM AUTO SCROLL-TO

            var thisItemPrev = thisItem.previousElementSibling,
                accAngle = window.innerWidth * Math.tan(6 * Math.PI / 180),
                tItemAnchor, sibCsH = 0, sibb = [];
            const prevSiblings = (elem) => { // (https://attacomsian.com/blog)
                let sibs = [];
                while(elem = elem.previousElementSibling) { sibs.push(elem); }
                return sibs;
            };

            if(thisItemPrev) {
                tItemAnchor = thisItemPrev.querySelector('.acclist-btn').getBoundingClientRect().bottom;

                if(!thisItemPrev.querySelector('.acclist-content')) {
                    const sibs = prevSiblings(thisItem);
                    sibs.forEach(sib => {
                        var sibC = sib.querySelector('.acclist-content');
                        if(sibC) { sibCsH += sibC.offsetHeight; sibb.push(sib) }
                    });
                }
            } else { tItemAnchor = thisItem.querySelector('.acclist-btn').getBoundingClientRect().top; accAngle = 0; }

            scrollbarMain.scrollStop().scroll({ y : scrollbarMain.scroll().position.y + ((tItemAnchor - sibCsH) - accAngle) }, 700, 'easeInOutCubic');
        }
        var accCHidden = document.querySelector('*[accordion-content][level="'+ itemLv +'"] [i-id="'+ iID(thisItem) +'"] > .acclist-content'),
            otherAccItems = document.querySelectorAll('.acclist-item:not([i-id="'+ iID(thisItem) +'"])');
        otherAccItems.forEach((itemOther) => {
            if(['opening', 'opened'].includes(itemOther.getAttribute('state'))) {
                if(itemOther.getAttribute('level') == itemLv) {
                    itemOther.setAttribute('state', 'closing');
                }
                if(itemLv == '2') {
                    thisItem.closest('.acclist-content').style.height = document.querySelector('*[accordion-content][level="1"] [i-id="'+ lv1ID +'"] > .acclist-content').offsetHeight +'px';
                }
            }
        })

        var itemc = thisItem.querySelector('.acclist-content');
        if(itemc == null) {
            var accCReal = accCHidden.cloneNode(true);
            accCReal.style.height = accCHidden.offsetHeight +'px';
            if(itemLv == '2') { setTimeout(() => { thisItem.closest('.acclist-content').style.height = document.querySelector('*[accordion-content][level="1"] [i-id="'+ lv1ID +'"] > .acclist-content').offsetHeight + accCHidden.offsetHeight +'px'; }, 100); }
            accCReal.classList.add('clos');
            accCReal.addEventListener('transitionend', (ev) => { if(ev.propertyName == 'height') { finalState(thisItem); }});
            accCReal.childNodes.forEach((el) => { el.addEventListener('transitionend', (ev) => { ev.stopPropagation(); })});
            thisItem.querySelector('.acclist-in').appendChild(accCReal);

            var accBtnLv2 = accCReal.querySelectorAll('.acclist-btn');
            if(accBtnLv2 != null) { accBtnLv2.forEach((ibtn2) => { ibtn2.addEventListener('click', openAccItem); }) }

            setTimeout(() => { thisItem.querySelectorAll('.al-card').forEach((card) => { card.addEventListener('click', (ev) => { openProjectCardPopup(ev, card, thisItem); })}); }, 1);
            setTimeout(() => { accCReal.classList.remove('clos'); }, 100);
        }
        else {
            if(itemLv == '2') { thisItem.closest('.acclist-content').style.height = document.querySelector('*[accordion-content][level="1"] [i-id="'+ lv1ID +'"] > .acclist-content').offsetHeight + accCHidden.offsetHeight +'px'; }
        }
    } else if(['opening', 'opened'].includes(thisItem.getAttribute('state'))) { // already opened
        thisItem.setAttribute('state', 'closing');
        if(itemLv == '2') {
            thisItem.closest('.acclist-content').style.height = document.querySelector('*[accordion-content][level="1"] [i-id="'+ lv1ID +'"] > .acclist-content').offsetHeight +'px';
            if(thisItem.closest('[level="1"]').getAttribute('state') != 'closing') { history.replaceState({}, '', '#'+ lv1ID); }
        } else {
            cleanURL();
        }
    }
}
function pHashOpenAccItem() {
    var urlHash = window.location.hash.substring(1);
    if(urlHash) {
        var urlHashAcc = urlHash.split('?')[0];
        var urlHashP = urlHash.split('?')[1];
        var i = document.querySelector('[accordion-scroll] .acclist-item[i-id="' + urlHashAcc +'"]'),
            k = 900;
        function open(item, p) {
            p = p || false;
            setTimeout(() => {
                openAccItem(item);
                k = 400;

                // OPEN PROJECT
                if(urlHashP && p) {
                    if(document.querySelector('[accordion-content] [i-id="' + urlHashAcc +'"] #'+ urlHashP)) {
                        setTimeout(() => {
                            openProjectCardPopup("", document.querySelector('[accordion-scroll] [i-id] .al-card#'+ urlHashP), i);
                        }, 900);
                    } else {
                        cleanURL('?');
                    }
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

        // SCROLL TO ACC ITEM
        if(urlHashAcc) {
            if(document.querySelector('[accordion-scroll] [i-id="'+ urlHashAcc +'"]') || document.querySelector('[accordion-content][level="2"] [i-id="'+ urlHashAcc +'"]')) {
                if(!i) { // lv2
                    open(document.querySelector('.acclist-item[i-id="'+ iID(document.querySelector('[accordion-content][level="1"] [i-id="'+ urlHashAcc +'"]').parentNode.closest('[i-id]')) +'"]')); // opens lv1
                    setTimeout(() => {
                        i = document.querySelector('[accordion-scroll] [i-id="'+ urlHashAcc +'"]');
                        open(i, true);
                        scrollToI(i, 0);
                    }, k);
                } else { // normal
                    open(i, true);
                    scrollToI(i, k);
                }
            } else { cleanURL(); }
        }
    } else { cleanURL(); }
}

function openProjectCardPopup(ev, p, item) {
    p.classList.add('focus');
    cleanURL('?'); history.replaceState({}, '', window.location.hash +'?'+ p.id);

    if(!container.querySelector("#content-container ~ [project-popup]")) {
        // creates project popup container if not already ready
        var ppContainer = document.createElement('div');
        ppContainer.setAttribute('project-popup', '');
        container.querySelector('#content-container').parentElement.appendChild(ppContainer);
    }

    function setScrMain(pe, ah) {
        var viewport = scrollbarMain.getElements('viewport'), ahD = OScrHDelay;
        if(pe) { viewport.classList.add('disabled'); ahD = 0; } else { viewport.classList.remove('disabled'); }
        scrollbarMain.getElements('scrollbarVertical.handle').style.pointerEvents = pe;
        scrollbarMain.options('scrollbars.autoHide', ah);
        scrollbarMain.options('scrollbars.autoHideDelay', ahD);
    }
    setScrMain('none', 'scroll');

    function closeProjectCardPopup() {
        cleanURL('?');
        swup.off('animationOutStart', closeProjectCardPopupAuto);
        if(document.querySelectorAll('div[project-popup] > .project-popup').length <= 1) { setScrMain(null, 'move'); }
        var allFocused = document.querySelectorAll('div[accordion-scroll] .focus');
        if(allFocused) { allFocused.forEach((f) => { f.classList.remove('focus'); })}
        ppBG.style.opacity = '0';
        projectPopup.style.pointerEvents= 'none';
        projectPopup.classList.add('out');
        closeFake.classList.add('quit');
        hideCurClose();
        setTimeout(() => { closeFake.classList.add('hid'); }, 1);
        setTimeout(() => { projectPopup.scrollbarPP.destroy(); projectPopup.remove(); }, 1000);
    }
    function closeProjectCardPopupAuto() {
        if(projectPopup) { closeProjectCardPopup();
            var descimg = ppDesc.querySelector('.pp-img.focus');
            if(descimg) { closeppdImgView(null, descimg, descimg.querySelector('img'), document.querySelector('div[project-popup]').querySelector('.ppd-imgview')); }
        }
    }

    var projectPopup = document.createElement('div');
    projectPopup.classList.add('project-popup');
    projectPopup.classList.add('pre');
    document.querySelector('div[project-popup]').appendChild(projectPopup);

    var proj, pTag, pTitle, formatSU, pWebLink = ``, suInteract = ``,
    pSpan = p.querySelector('.p-title > span');

    if(projectsDesc[p.id].type == 'img') {
        var imgMiniSRC = p.querySelector('.thumb').getAttribute('src'),
            w = '';
        if(projectsDesc[p.id].white == true) { w = ' white'; }
        proj = `
            <div style="width:100%;height:100%;"><img class="pp-img`+ w +`" src="`+ imgMiniSRC +`" style="background-image: url(`+ imgMiniSRC +`);"></img></div>
        `;
    } else if(['vid', 'web'].includes(projectsDesc[p.id].type)) {
        var format = projectsDesc[p.id].format, formatU, iframe;

        if(format == '1:1' || format == 'fill') { formatU = '80.1vh'; }
        else {
            if(format == '16:9') { formatSU = '56.25';
            } else { formatSU = format; }
            formatU = formatSU + '%';
            formatSU = 'calc((var(--pp-popup-c-size) * 1vw * var(--pp-sgrid) / 100 - var(--pp-sgrid-gap)) * '+ formatSU +' / 100);'
        }

        if(projectsDesc[p.id].type == 'vid') {
            iframe = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/`+ projectsDesc[p.id].url +`?rel=0&color=white&loop=1&playlist=`+ projectsDesc[p.id].url +`" frameborder="0" allowfullscreen></iframe>`
        } else if(projectsDesc[p.id].type == 'web') {
            iframe = `<iframe src="`+ projectsDesc[p.id].url +`" width="1920px" height="1080px" frameborder="0"></iframe>`
            //var accessLang; if(language == 'fr') { accessLang = 'ACCÉDER AU SITE'; } else { accessLang = 'ACCESS WEBSITE'; }
            pWebLink = ppDescSamples('link', projectsDesc[p.id].url, 'WEBSITE');
        }
        proj = `
            <div id="player-c">
                <div id="player" style="padding-bottom: `+ formatU +`;">
                `+ iframe +`
                </div>
            </div>
        `;
    } else if(projectsDesc[p.id].type == 'pdf') {
        proj = `
            <div id="pdf-reader">
                <iframe class="pp-pdf" src="https://drive.google.com/file/d/`+ projectsDesc[p.id].url +`/preview" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        `;
    }
    if(projectsDesc[p.id].tag == 'perso') { pTag = 'Personnal Project';
    } else if(projectsDesc[p.id].tag == 'fun') { pTag = 'Fun';
    } else if(projectsDesc[p.id].tag == 'rs') { pTag = 'RetroSaturn';
    } else if(projectsDesc[p.id].tag == 'sch') { pTag = 'School Project';
    } else if(projectsDesc[p.id].tag == 'sc') { pTag = 'Service Civique';
    } else if(projectsDesc[p.id].tag == 'c') { pTag = 'Commission';
    } else if(projectsDesc[p.id].tag == 'ppm') { pTag = 'PPM Commission';
    }
    if(projectsDesc[p.id].suType == 'interact') {
        var suInSVG = `<svg viewBox="0 0 32 32"><polygon points="13.4,7.2 16,4.6 27.5,16 16.1,27.4 13.4,24.8 20.5,17.7 4.5,17.7 4.5,14.3 20.5,14.3"/></svg>`;
        suInteract = suInSVG + `<div><span>MAXIMIZE</span><span>CLOSE</span></div>` + suInSVG;
    }
    if(pSpan.hasAttribute('long-title')) { pTitle = pSpan.getAttribute('long-title');
    } else { pTitle = pSpan.innerText; }
    projectPopup.innerHTML = `
        <div class="pp-bg" style="opacity:0;"></div>
        <div class="pp-popup-c" pp-suType=`+ projectsDesc[p.id].suType +`>
            <div class="pp-sectiongrid">
                <section class="pp-project">
                    <div class="pp-proj">`
                        + proj +`
                    </div>
                    <div class="pp-scaleup" style="height: `+ formatSU +`">`+ suInteract +`</div>
                </section>
                <section class="pp-desc" scroll>
                    <div class="pp-title-c">
                        <div class="pp-title">
                            <span id="big">`+ pTitle +`</span>
                            <div class="pp-t-pills">
                                <span id="date">`+ projectsDesc[p.id].year +`.`+ projectsDesc[p.id].month +`</span>
                                <span id="tag">`+ pTag +`</span>
                            </div>
                        </div>
                        <div class="pp-subt">
                            <span class="pp-subtitle">`+ projectsDesc[p.id].subtitle +`</span>
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
        ppDesctxt = ppDesc.querySelector('.pp-desctxt'),
        ppOScr;


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
        ppDesctxtin.classList.add('pp-desctxt-in');
        ppDesctxtin.classList.add('pre');
        ppDesctxt.appendChild(ppDesctxtin);
        setTimeout(() => {
            var d;
            if(language == 'fr') {
                d = projectsDesc[p.id].desc.fr;
                if(!d || d == '') { ppDesctxtin.innerHTML = '<p class="no">Pas de description disponible.</p>'; } else { ppDesctxtin.innerHTML = d; }
            } else {
                d = projectsDesc[p.id].desc.en;
                if(!d || d == '') { ppDesctxtin.innerHTML = '<p class="no">No description available.</p>'; } else { ppDesctxtin.innerHTML = d; }
            }
            ppDImgViewCreate();
            ppDesctxtAnimateSpawn(ppDesctxtin);
        }, 1);
    } ppDesctxtPrint();

    pplBtn.forEach(lbtn => { if(lbtn.getAttribute('l') == language) { lbtn.classList.add('focus'); } });
    projectPopup.querySelector('.pp-langswitcher-c').addEventListener('click', function() {
        pplBtn.forEach(l => { l.classList.toggle('focus'); });
        setTimeout(() => {
            language = projectPopup.querySelector('.pp-langswitcher > span.focus').getAttribute('l');
            ppDesctxtPrint();
        }, 1);
    })

    if(isMini) { ppOScr =  { autoHide : 'move', autoHideDelay : OScrHDelay }
    } else { ppOScr =  { autoHide : 'leave', autoHideDelay : 0 } }
    projectPopup.scrollbarPP = OverlayScrollbars(ppDesc, {
        autoUpdate : o1[0],
        overflowBehavior : {
            x : 'hidden',
            y : 'scroll'
        },
        scrollbars : ppOScr
    });

    if(projectsDesc[p.id].type == 'img') {
        // Load Higher Res Picture (https://stackoverflow.com/a/54123157)
        function loadHighResImage(elem, highResUrl) {
            let image = new Image();
            image.addEventListener('load', function() {
                elem.src = highResUrl;
                setTimeout(() => { elem.style.backgroundImage = null; }, 500);
            });
            image.src = highResUrl;
        };
        loadHighResImage(ppProj.querySelector('.pp-img'), './assets/medias/projects/'+ iID(item) +'/'+ p.id +'.'+ (projectsDesc[p.id].imgExt || 'jpg'));
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
            <div id="ynav-boom"></div>
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

        function yNavBoom(ev, histbr, l) { // old
            if(histbr == true) { ev = getPageID(); }
            if(l == null) { l = nav.querySelector('*[link='+ ev +']'); }
            var lLinkID = l.getAttribute('link'), lLink;

            function boom(h) {
                var pageW = doc.clientWidth,
                    pageH = doc.clientHeight;

                if(histbr == false) { // normal
                    var curX = ev.clientX,
                        curY = ev.clientY,
                        bcX = (curX / 100),
                        bcY = (curY / 100),
                        bcRW = pageW - curX,
                        bcRH = pageH - (pageH - curY);
                    if(curX > (pageW / 2)) { bcRW = pageW - (pageW - curX); }
                    if(curY < (pageH / 2)) { bcRH = pageH - curY; }
                } else { // history browsing
                    var bcEl = l,
                        bcElRect = bcEl.getBoundingClientRect(),
                        bcElX = bcElRect.left + (bcElRect.width / 2),
                        bcElY = bcElRect.top + (bcElRect.height / 2),
                        bcX = (Math.round(bcElX) / 100),
                        bcY = (Math.round(bcElY) / 100),
                        bcRW = pageW - (bcElX),
                        bcRH = pageH - (pageH - bcElY);
                    if(bcElX > (pageW / 2)) { bcRW = pageW - (pageW - bcElX); }
                    if(bcElY < (pageH / 2)) { bcRH = pageH - (bcElY); }
                }

                var boom = document.createElement('div');
                boom.classList.add('ynav-boom');
                boom.innerHTML = `
                    <svg id="boom" viewBox="0 0 `+ (pageW / 100) +` `+ (pageH / 100) +`">
                        <circle cx="`+ bcX +`" cy="`+ bcY +`" r="0"></circle>
                    </svg>
                `;
                var boomC = boom.querySelector('circle'),
                    cTr;

                if(h == '-c') {
                    var ynavbc = document.querySelector('#ynav-boom-c');
                    if(!ynavbc) { ynavbc = document.createElement('div'); ynavbc.id = 'ynav-boom-c';
                        document.querySelector('#content-container').parentNode.appendChild(ynavbc); }
                    ynavbc.appendChild(boom); cTr = ['1.2s cubic-bezier(0.3, 0.7, 0, 1)', 1500];
                } else {
                    document.querySelector('#ynav-boom').appendChild(boom); cTr = ['1s cubic-bezier(0.4, 0.7, 0, 1)', 1300];
                }

                setTimeout(function() {
                    boomC.style.transition = 'r '+ cTr[0] +', opacity '+ cTr[1] +'ms ease-in-out';
                    const nlCR = (Math.round(((bcRW)**2 + (bcRH)**2)**(1/2)) / 100) + 0.1;
                    boomC.setAttribute('r', nlCR);
                    boomC.style.opacity = '0';
                    setTimeout(function() {
                        boom.remove();
                    }, cTr[1]);
                }, 10);
            }

            if(doc.getAttribute('page') != lLinkID) {
                ///doc.setAttribute('page', lLinkID); // set page class
                ///if(lLinkID == 'home') { lLink = ''; } else { lLink = lLinkID + '/'; } // if "home" go to "", else "page/"
                ///if(histbr == false) { swup.loadPage({ url: pageMainURL + '/' + lLink }); } // go to ^
                boom('0');
            } else {
                boom('0');
            }
        }

        function yNavBoomHold(ev, l) {
            const pageW = doc.clientWidth, pageH = doc.clientHeight,
                  curX = ev.clientX, curY = ev.clientY,
                  bcX = (curX / 100), bcY = (curY / 100),
                  bcRW = (curX > (pageW / 2)) ? pageW - (pageW - curX) : pageW - curX,
                  bcRH = (curY < (pageH / 2)) ? pageH - curY : pageH - (pageH - curY);

            var boom = document.createElement('div');
            boom.classList.add('ynav-boom');
            boom.innerHTML = `
                <svg id="boom" viewBox="0 0 `+ (pageW / 100) +` `+ (pageH / 100) +`">
                    <circle cx="`+ bcX +`" cy="`+ bcY +`" r="0"></circle>
                </svg>
            `;
            var boomC = boom.querySelector('circle'),
                cTr = ['1s cubic-bezier(0.375, 0.7, 0, 1)', 1300];

            document.querySelector('#ynav-boom').appendChild(boom);

            function boomRemove() {
                boomC.style.opacity = '0';
                setTimeout(function() {
                    boom.remove();
                }, cTr[1]);
            }

            setTimeout(function() {
                boomC.style.transition = 'r '+ cTr[0] +', opacity '+ cTr[1] +'ms ease-in-out';
                const nlCR = (Math.round(((bcRW)**2 + (bcRH)**2)**(1/2)) / 100) + 0.1;
                boomC.setAttribute('r', nlCR);
                if(l != null) {
                    l.addEventListener('mouseup', () => { boomRemove(); });
                    l.addEventListener('mouseleave', () => { boomRemove(); });
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