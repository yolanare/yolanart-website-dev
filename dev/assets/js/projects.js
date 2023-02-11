// PROJECTS DATABASE

// Reusable Content
function projectTemplate(type, url, title) {
    var el;
    if(type == "img") {
        el = `<div class="pp-img"><div><div><img loading="eager" src="`+ url +`"/></div></div>
                <div class="pp-img-desc">`+ title +`</div></div>`
    } else if(type == "link") {
        el = `<div class="pp-btn-c"><a class="pp-btn" href="`+ url +`" target="_blank"><span>`+ title +`
                <svg viewBox="0 0 32 32"><path d="M21.5,20.5v4h-14v-14h4c1.7,0,3-1.3,3-3l-10,0v20h20l0-10C22.8,17.5,21.5,18.8,21.5,20.5z"/><path d="M14.5,17.5L14.5,17.5c-0.6-0.6-0.6-1.5,0-2.1l8.9-8.9l2.1,2.1l-8.9,8.9C16,18.1,15.1,18.1,14.5,17.5z M24.5,7.5h-7l0-3h10v10l-3,0V7.5z"/>
                </svg></span></a></div>`
    }
    return el;
}
var srcPH = "./assets/medias/projects/high/";


const projectsDataSample = {
    default : {
        hidden: false,
        type : "img", interact : "zoom",
                ext : "jpg",
                needBG : false,
            url_id : "D2_r4q2imnQ",
            embed : "https://yolan.art/",
            aspectRatio : "16:9",
        additional : false, // defaults are the same as main project
        title : "",
        date : "----.--",
        colorFill : "#000000",
        colorAccent : "var(--y-r1)",
        context: "",
        filter: "",
        catchphrase : "",
        desc : {
            fr : "",
            en : ""
        }
    },
    "TEMPLATE" : {
        hidden: false|true,
        type : "img|yt|g_pdf|embed", interact : "zoom|off",
                ext : "jpg|png",
                needBG : false|true|"000000"|"var(--y-b1)",
            url_id : "URL_ID",
            embed : "FULL_URL",
            aspectRatio : "16:9|1:1",
        additional : {
            "ID" : {
                type : "img|yt|g_pdf|embed",
                        ext : "jpg|png",
                    url_id : "URL_ID",
                    embed : "FULL_URL",
                    aspectRatio : "16:9|1:1",
                comment : {
                    fr : `FRENCH_COMMENT`,
                    en : `ENGLISH_COMMENT`
                }
            },
        },
        title : "TITLE",
        title : {
            fr : "TITLE_FR",
            en : "TITLE_EN"
        },
        date : "YYYY.MM",
        colorFill : "COLOR_FILL",
        colorAccent : "COLOR_ACCENT",
        context: "personal|fun|order|school|sc|ppm|retrosaturn|pti",
        filter: "experiment|photo|illustration|3D|motion|type|poster|print|logo|vector|layout|ad",
        catchphrase : "QUICK_CATCHPHRASE",
        catchphrase : {
            fr : `FRENCH_CATCHPHRASE`,
            en : `ENGLISH_CATCHPHRASE`
        },
        desc : {
            fr : `
                FRENCH_DESCRIPTION
            `,
            en : `
                ENGLISH_DESCRIPTION
            `
        }
    },
    Comments : {
        hidden: false|true, // hidden projects will not be processed
        type : "img|yt|g_pdf|embed",
                ext : "jpg|png", // IF TYPE: "img" : if anything other than "jpg" file | DEFAULT: "jpg"
                needBG : false|true|"000000"|"var(--y-b1)", // useful for monochrome logos | you can specify the color of choice, CAN BE CSS variable | "true" is default dark | DEFAULT: false
            url_id : "URL_ID", // FOR TYPE: "yt|g_pdf"
            embed : "FULL_URL",
            aspectRatio : "16:9|1:1",
        additional : {
            "ID" : { // will search in folder with project's id
                type : "img|yt|g_pdf|embed",
                        ext : "jpg|png", // IF TYPE: "img"
                    url_id : "URL_ID", // FOR TYPE: "yt|g_pdf"
                    embed : "FULL_URL",
                    aspectRatio : "16:9|1:1", // IF TYPE: "vid|embed"
                comment : { // CAN BE: empty
                    fr : `FRENCH_COMMENT`,
                    en : `ENGLISH_COMMENT`
                }
            },
        },
        interact : "zoom|off", // DEFAULT: "zoom", better have "off" for others that are embed
        // CAN BE: a NodeList or array,
        title : "TITLE", // static title
        title : { // will fallback to other languages if current language not specified
            fr : "TITLE_FR",
            en : "TITLE_EN"
        },
        date : "YYYY.MM", // CAN BE: "2000-2001" | "2000-2001.00" | "2000.00-2001" | "2000.01-2001.00" | "2000.00" | "2000.00-01"
        colorFill : "COLOR_FILL", // CAN BE any CSS color : var(--var) | #ffffff | rgb(0, 0, 0) | hsl(0, 0%, 0%) | hwb(0 0% 0%)
        colorAccent : "COLOR_ACCENT", // same thing
        context: "personal|fun|order|school|retrosaturn|pti|sc", // CAN BE: "fun" | "fun|school"]
        filter: "experiment|photo|illustration|3D|motion|type|poster|print|logo|vector|layout|ad", // CAN BE: "experiment" | "experiment|motion"]
        catchphrase : "QUICK_CATCHPHRASE", // CAN BE: empty
        catchphrase : {
            fr : `FRENCH_CATCHPHRASE`,
            en : `ENGLISH_CATCHPHRASE`
        },
        desc : { // CAN BE: empty
            fr : `
                FRENCH_DESCRIPTION
            `,
            en : `
                ENGLISH_DESCRIPTION
            `
        }
    },
    descSamples : `
        <h2>BigTitle</h2>

        <h3>LilTitle</h3>

        <p>Text</p>

        <p>Paragraph
        <br>Paragraph
        <br>Paragraph</p>

        projectTemplate("img", "SRC", "TITLE")

        projectTemplate("link", "URL", "TITLE")
    `
}

// Database
var projectsData = {
    "futuristic_meteorite" : {
        type : "img", interact : "zoom",
        title : "Futuristic meteorite",
        date : "2017.06",
        colorFill : "#082768",
        colorAccent : "#549ec8",
        context: "personal",
        filter: "experiment|illustration|3D",
        catchphrase : {
            fr : `De quel endroit pourrait-elle bien venir?`,
            en : `From what kind of place is it coming from?`
        },
        desc : {
            fr : `
                <h2>IMAGINATION</h2>
                <p>Notre ignorance du fin fond de l’espace m’a donné envie d’imaginer une météorite venant d’une autre civilisation. Elle file à toute vitesse vers le spectateur depuis un endroit inconnu.</p>
                <h2>CONTEXTE</h2>
                <p>C’est l'un de mes premiers projets graphiques et aussi l'un de mes favoris.</p>
                <h2>DIFFUSION</h2>
                <p>J'ai eu la surprise de découvrir qu'un auteur du nom de Pierre-Jérôme Delage avait réutilisé ma météorite pour illustrer son article "À qui appartiennent les météorites ?" !</p>
                `+ projectTemplate("link", "https://droitetsf.hypotheses.org/78", "ACCÉDER À L'ARTICLE") +`
            `,
            en : `
                <h2>IMAGINATION</h2>
                <p>Our lack of knowledge of the far reaches of space made me want to imagine a meteorite coming from another civilization. It is rushing towards the viewer from an unknown place.</p>
                <h2>CONTEXT</h2>
                <p>This is one of my first graphic project and also one of my favourites.</p>
                <h2>DISPLAY</h2>
                <p>I was surprised to find out that an author named Pierre-Jérôme Delage had illustrated his article "Who do meteorites belong to?" (title translated) with my meteorite !</p>
                `+ projectTemplate("link", "https://droitetsf.hypotheses.org/78", "ACCESS ARTICLE") +`
            `,
        }
    },
    "white_city" : {
        type : "yt", interact : "off",
            url_id : "Cg0DBZRAbqU",
            aspectRatio : "1:1",
        title : "White city",
        date : "2019.03-06",
        colorFill : "#3e4148",
        colorAccent : "#7e8482",
        context: "school",
        filter: "3D|motion",
        catchphrase : {
            fr : `Le temps passe... Mais tous les jours sont pareils.`,
            en : `Time goes on... but everyday is the same.`
        },
        desc : {
            fr : `
                <h2>SUJET</h2>
                <p>Le sujet était de représenter la ville sans évoquer ses plus gros clichés.</p>
                <p>J’ai choisi de représenter son manque de personnalité en mettant en avant sa hauteur et sa répétitivité depuis le point de vue d’un piéton à travers le temps.</p>
                <h2>CRÉATION</h2>
                <p>En m’aidant du logiciel Cinema 4D, je l’ai entièrement créée en 3D.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/02 pts de vues 3D.jpg", "Vues de la scène en 3D sur 4 axes différents") +`

                <p>Puis j’ai placé la caméra dans un carrefour.
                <br>J’ai modifié beaucoup de paramètres pour donner une impression vertigineuse : le point de fuite est déplacé dans le croisement des bâtiments et le champ de vision est étiré.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/01 camera 3D.jpg", "Paramètres de la caméra") +`

                <p>J’ai simulé le déroulement du cycle jour/nuit et j’ai fait le rendu des images en vidéo.</p>
                <h2>POST-PRODUCTION</h2>
                <p>Sur VEGAS Pro, j’ai ajouté de nombreux effets pour polir le timelapse : de la brume, du grain, et surtout des effets lumineux pour le soleil. Le lever et le coucher sont plus colorés. J’ai simulé l’éblouissement en ajustant le contraste et le vignettage.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/04 montage en gros.jpg", "Montage des effets vidéos") +`
            `,
            en : `
                <h2>TOPIC</h2>
                <p>The aim was to represent the city without bringing up its biggest clichés.</p>
                <p>I chose to depict its lack of character by emphasizing its height and repetitiveness from the point of view of a pedestrian across time.</p>
                <h2>CREATION</h2>
                <p>I created it entirely in 3D using Cinema 4D.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/02 pts de vues 3D.jpg", "Scene overview on 4 different axes") +`

                <p>Then I placed the camera in an intersection.
                <br>I adjusted a lot of the camera settings to give it a dizzying effect: the vanishing point is shifted in the crossing of the buildings in the sky and the field of view is stretched.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/01 camera 3D.jpg", "Camera settings") +`

                <p>I added a day/night cycle and rendered the frames in a video.</p>
                <h2>POST-PRODUCTION</h2>
                <p>On VEGAS Pro, I added many effects to refine the timelapse: haze, grain, and especially light effects for the sun. The sunrise and sunset are more colorful. I tried to fake the sun glare by adjusting the contrast and other effects.</p>
                `+ projectTemplate("img", srcPH + "sch_1_wc/04 montage en gros.jpg", "Video effects") +`
            `,
        }
    },
    "foresaken_dove" : {
        type : "img", interact : "zoom",
        title : "Foresaken dove",
        date : "2019.10",
        colorFill : "#000000",
        colorAccent : "#3d3d3d",
        context: "school",
        filter: "illustration",
        catchphrase : {
            fr : `Mais où est-elle ?`,
            en : `But where is it?`
        },
        desc : {
            fr : `
                <h2>SUJET</h2>
                <p>Le sujet consiste en l'incrustation d'une peinture sur un support mural afin de créer entre eux un lien spécifique.</p>
                <h2>INSPIRATION</h2>
                <p>L'œuvre “The Armoured Dove” de Banksy, un célèbre street-artiste britannique, m’a inspiré dans la réalisation de ce projet.</p>
                `+ projectTemplate("img", srcPH + "sch_t_pm/05 colombe Banksy.jpg", "\"The Armoured Dove\", Banksy (2005)") +`
                <p>Sa colombe a été peinte en 2005 sur un mur séparant Israël et la Palestine. Pour lui ce mur est une tentative absurde pour mettre fin au conflit. La colombe étant un symbole de pureté et de paix, Banksy l'a totalement exposée à la violence. Un pointeur vise son cœur.</p>
                <h2>L’ABANDONNÉE</h2>
                <p>Dans mon projet, j’ai choisi de faire de même en l’abandonnant dans un lieu sale et délaissé.
                <br>Je n’avais pas de lieu de ce genre donc j’ai peint la colombe à l’aquarelle sur une feuille, et je l’ai incrustée numériquement sur un mur.</p>
                `+ projectTemplate("img", srcPH + "sch_t_pm/01 colombe originale.jpg", "Colombe peinte à l'aquarelle") +`
                <p>Puis j’ai incrusté une cage posée devant elle. Elle est coincée dans cet endroit. Paniquée, le bec ouvert et les ailes écartées. Les couleurs sont très ternes et sombres afin de donner une impression de détresse.</p>
            `,
            en : `
                <h2>TOPIC</h2>
                <p>The aim is to create a specific link between a painting and a wall support.</p>
                <h2>INSPIRATION</h2>
                <p>The work "The Armoured Dove" by Banksy, a famous British street-artist, inspired me to make this project.</p>
                `+ projectTemplate("img", srcPH + "sch_t_pm/05 colombe Banksy.jpg", "\"The Armoured Dove\", Banksy (2005)") +`
                <p>His dove was painted in 2005 on a wall separating Israel and Palestine. For him, this wall is an absurd attempt to end the conflict. The dove being a symbol of purity and peace, Banksy has totally exposed it to violence. A pointer is aiming at its heart.</p>
                <h2>THE FORSAKEN ONE</h2>
                <p>In my project, I chose to do likewise by abandoning it in a dirty and neglected place.
                <br>I didn't know where to find such a place so I painted the dove on paper and digitally overlaid it on a wall.</p>
                `+ projectTemplate("img", srcPH + "sch_t_pm/01 colombe originale.jpg", "Painted dove with watercolours") +`
                <p>Then I put a cage in front of it. It is trapped in this place. Panicked, the beak open and the wings spread. The colours are very dull and dark to give an impression of despair.</p>
            `
        }
    },
    "y_in_dark" : {
        type : "img", interact : "zoom",
        title : "Y in dark",
        date : "2018.09",
        colorFill : "#000000",
        colorAccent : "#7a7a7a",
        context: "personal",
        filter: "experiment|photo",
        catchphrase : {
            fr : `Perdu dans les ténèbres, sa lumière brillante de l'intérieur.`,
            en : `Lost in the dark, the light shrieking from within.`
        },
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
            `
        }
    },
    "retrosaturn" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : "Retrosaturn",
        date : "2018.06",
        colorAccent : "#ac0f3c",
        context: "retrosaturn",
        filter: "experiment|type|logo|vector",
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>"RETROSATURN" est la boîte de production de mon ami aspirant réalisateur.</p>
                <h2>CONCEPTION</h2>
                <p>Nous avons conçu ce logo ensemble dans l'objectif d'obtenir quelque chose d'orienté années 80.</p>
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
    "retrosaturn_sticker" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : "Retrosaturn sticker",
        date : "2019.01",
        context: "retrosaturn",
        filter: "experiment|logo|vector"
    },
    "caloucath_logo_c_3d" : {
        type : "img", interact : "zoom",
                ext : "png",
        additional : {
            "caloucath_c_banner" : {
                type : "img",
            },
        },
        title : "Caloucath \"C\"",
        colorAccent : "#5d5c5d",
        date : "2017.07",
        context: "order",
        filter: "type|logo|vector"
    },
    "caloucath_typo_merry" : {
        hidden : true,
        type : "img", interact : "zoom",
        title : "Caloucath typo banner",
        date : "2017.05",
        context: "order",
        filter: "3D|type|poster"
    },
    "ppm" : {
        type : "img", interact : "zoom",
                ext : "png",
        additional : {
            "ppm_banner" : {
                type : "img",
            },
        },
        title : "Pamplemousse",
        colorFill : "#fddb81",
        colorAccent : "#ff3875",
        date : "2018.10",
        context: "order|ppm",
        filter: "logo|vector"
    },
    "rezartilo" : {
        type : "img", interact : "zoom",
        title : "Rezartilo",
        colorFill : "#002fa6",
        colorAccent : "#01a0f8",
        date : "2017.01",
        context: "order",
        filter: "3D|type|poster"
    },
    "jethro" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : "Jethro",
        date : "2018.12",
        context: "order",
        filter: "type|logo|vector"
    },
    "wzr" : {
        type : "img", interact : "zoom",
                ext : "png",
                aspectRatio : "1:1",
        title : "WzR",
        colorAccent : "#fc8600",
        date : "2017.09",
        context: "order",
        filter: "type|logo|vector"
    },
    "abstract_shooting_stars" : {
        hidden: true,
        type : "img", interact : "zoom",
        title : "Abstract shooting stars",
        colorAccent : "#949494",
        date : "2020.01",
        context: "personal",
        filter: "experiment|illustration|vector",
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
            `
        }
    },
    "stargazing_poster1" : {
        type : "img", interact : "zoom",
        additional : {
            "Stargazing_poster1_empty" : {
                type : "img",
                comment : {
                    fr : `
                        Version sans titre.
                    `,
                    en : `
                        No title version.
                    `
                }
            },
        },
        title : "Stargazing poster",
        colorAccent : "#0e2160",
        date : "2018.10",
        context: "retrosaturn",
        filter: "experiment|illustration",
        catchphrase : "Disrupting the stars when they sleep.",
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
            `
        }
    },
    "cyber_district1_mc" : {
        type : "img", interact : "zoom",
        title : "Cyber-district",
        colorAccent : "#b98b2d",
        date : "2019.08",
        context: "order|ppm",
        filter: "illustration|3D",
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>UN QUARTIER LUMINEUX</h2>
                <p>Les couleurs vives des faisceaux lumineux et des panneaux d'affichages se mélangent et se diffusent dans le ciel sombre.</p>
                <h2>DIFFUSION</h2>
                `+ projectTemplate("link", "https://twitter.com/PamplemousseBT/status/1167110044867072000", "PARTAGÉ SUR TWITTER") +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>A LUMINOUS DISTRICT</h2>
                <p>The vibrant colours of the light beams and billboards blend and spread into the dark sky.</p>
                <h2>DISPLAY</h2>
                `+ projectTemplate("link", "https://twitter.com/PamplemousseBT/status/1167110044867072000", "SHARED ON TWITTER") +`
            `,
        }
    },
    "cyber_district2_mc" : {
        type : "img", interact : "zoom",
        title : "Cyber-district (large)",
        colorAccent : "#b98b2d",
        date : "2019.08",
        context: "order|ppm",
        filter: "illustration|3D",
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>DENSITÉ</h2>
                <p>Ce plan large a pour but de mettre en valeur le grand nombre de détails de cette structure.</p>
                <h2>DIFFUSION</h2>
                `+ projectTemplate("link", "https://twitter.com/PamplemousseBT/status/1167110044867072000", "PARTAGÉ SUR TWITTER") +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>DENSITY</h2>
                <p>This wide shot's aim is to highlight the great number of details of this structure.</p>
                <h2>DISPLAY</h2>
                `+ projectTemplate("link", "https://twitter.com/PamplemousseBT/status/1167110044867072000", "SHARED ON TWITTER") +`
            `,
        }
    },
    "factory_92" : {
        type : "yt", interact : "off",
            url_id : "jN7L44_-igk",
            aspectRatio : "1:1",
        title : "Factory-92",
        colorFill : "#170b0d",
        colorAccent : "#4e2b2c",
        date : "2021.01",
        context: "order|ppm",
        filter: "3D|motion",
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>La structure est une construction faite sur Minecraft par un ami du nom de Browlin.
                <br>J'ai réalisé la présentation.</p>
                <h2>AMBIANCE</h2>
                <p>L’ambiance d’usine plutôt orange rouille est contrastée par l’énergie bleue qui s’échappe des réacteurs.</p>
                <h2>DIFFUSION</h2>
                `+ projectTemplate("link", "https://twitter.com/Browlin__/status/1356267490083557376", "PARTAGÉ SUR TWITTER") +`
            `,
            en : `
                <h2>CONTEXT</h2>
                <p>This structure is a Minecraft build made by a friend named Browlin.
                <br>I only did the presentation.</p>
                <h2>AMBIANCE</h2>
                <p>The rather rusty orange factory atmosphere is contrasted by the blue energy escaping from the reactors.</p>
                <h2>DISPLAY</h2>
                `+ projectTemplate("link", "https://twitter.com/Browlin__/status/1356267490083557376", "SHARED ON TWITTER") +`
            `,
        }
    },
    "pub_les_connectés" : {
        type : "yt", interact : "off",
            url_id : "66QpHMgmXLM",
            aspectRatio : "16:9",
        title : {
            fr : "Spot pub : interventions \"Les Connectés\"",
            en : "Advert: \"Les Connectés\" interventions"
        },
        date : "2021.02-04",
        colorFill : "#fe670e",
        colorAccent : "#fe670e",
        context: "sc",
        filter: "motion|ad",
        desc : {
            fr : `
                <h2>CONTEXTE</h2>
                <p>Après avoir obtenu mon baccalauréat scientifique, je me suis porté volontaire dans une mission de Service Civique que l'association Unis-Cité proposait : "Les Connectés".</p>
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
                <p>After obtaining my scientific "baccalauréat" (High School diploma equivalent to A Levels), I volunteered in "Les Connectés" (~ "The Connected"), a Service Civique mission of the association Unis-Cité.</p>
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
    "retrosaturn_intro_beta" : {
        type : "yt", interact : "off",
            url_id : "XOnAthClcEI",
            aspectRatio : "16:9",
        title : "Retrosaturn β",
        colorFill : "#390002",
        colorAccent : "#770113",
        date : "2018.09",
        context: "personal|retrosaturn",
        filter: "experiment|motion",
        catchphrase : "Synthwave into the darkest place of the grid!",
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
    "jordannefm_anim" : {
        hidden : true,
        type : "yt", interact : "off",
            url_id : "Gyho58zddwg",
            aspectRatio : "16:9",
        title : "JordanneFM animation",
        colorFill : "#2655a3",
        colorAccent : "#cb0101",
        date : "2017.12",
        context: "order",
        filter: "motion",
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
    "yolan_intro_old" : {
        type : "yt", interact : "off",
            url_id : "UkL4zVUw27Y",
            aspectRatio : "16:9",
        title : {
            fr : "Yolan' ancienne introduction",
            en : "Yolan' old introduction"
        },
        colorFill : "#c0c1c5",
        date : "2017.09",
        context: "personal",
        filter: "experiment|motion"
    },
    "yolan_clément_intro" : {
        hidden: true,
        type : "yt", interact : "off",
            url_id : "PR0fVAGbHIQ",
            aspectRatio : "16:9",
        title : "Yolan' & Clément introduction",
        colorFill : "#d0d0d0",
        date : "2017.01",
        context: "personal",
        filter: "3D|motion"
    },
    "quad_page_portfolio" : {
        type : "embed", interact : "off",
            embed : "https://yolan.art/portfolio-exp-quad/public/",
        title : "Quad-page portfolio",
        colorFill : "#4b4b4b",
        colorAccent : "#4b4b4b",
        date : "2020.10-2021.01",
        context: "personal|order",
        filter: "experiment|motion|vector|layout|ad",
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
    "affiche_apc_conf_hpi_wv" : {
        type : "img", interact : "zoom",
        title : "Formation WISC-V & Haut Potentiel Intellectuel",
        colorFill : "#ca382b",
        colorAccent : "#ca382b",
        date : "2019.08",
        context: "order",
        filter: "poster|print|vector|layout|ad"
    },
    "affiche_apc_conf_hpi" : {
        hidden : true,
        type : "img", interact : "zoom",
        title : "Conférence Haut Potentiel Intellectuel",
        colorFill : "#3aa3d0",
        colorAccent : "#e178b0",
        date : "2019.11",
        context: "order",
        filter: "poster|print|vector|layout|ad"
    },


// new -----------------------------------------------------------------------
/*
    "broch_alien" : {
        type : "g_pdf", interact : "off",
            url_id : "URL_ID",
        title : "BROCHURE ALIEN",
        date : "YYYY.MM",
        context: "school",
        filter: "experiment|print|layout|ad",
        desc : {
            fr : ``,
            en : `
                school project context, not official
            `
        }
    },
    "chara_nain_de_jardin" : {
        type : "img", interact : "zoom",
        title : "NAIN DE JARDIN - Dum Grimnir",
        date : "YYYY.MM",
        context: "school",
        filter: "experiment|illustration",
        desc : {
            fr : ``,
            en : `
                signification nom mythologie naine
                premier chara design/dessin propre
            `
        }
    },
    "charte_lodge_tourtereaux" : {
        type : "g_pdf", interact : "off",
            url_id : "URL_ID",
        title : "CHARTE GRAPHIQUE LOGO LODGE TOURTEREAUX",
        date : "YYYY.MM",
        context: "school",
        filter: "experiment|type|print|logo|vector|layout",
        desc : {
            fr : ``,
            en : `
                school project context, not official
            `
        }
    },
    "abstract_heart" : {
        type : "yt", interact : "off",
            url_id : "URL_ID",
        title : "ABSTRACT 3D HEART",
        date : "YYYY.MM",
        context: "school",
        filter: "experiment|3D",
        desc : {
            fr : ``,
            en : `
                normal one turnaround
                + incrustation
            `
        }
    },
    "abstract_heart_vid" : {
        type : "yt", interact : "off",
            url_id : "URL_ID",
        title : "ABSTRACT 3D HEART MAKING OFF",
        date : "YYYY.MM",
        context: "school",
        filter: "3D|motion|ad",
        desc : {
            fr : ``,
            en : `
                devoir : compiler les étapes du projet en quelques minutes
            `
        }
    },
    "csg_ad" : {
        type : "yt", interact : "off",
            url_id : "URL_ID",
        title : "CHACUN SES GOÛTS - PUBLICITÉ YOGURT GLACÉ",
        date : "YYYY.MM",
        context: "school",
        filter: "3D|motion|ad",
        desc : {
            fr : ``,
            en : `
                school project context, not official
                + analyse
                reporter en gros l'oral de présentation
            `
        }
    },
    "jean_lechad" : {
        type : "img", interact : "zoom",
        title : "Jean Lechad",
        date : "YYYY.MM",
        context: "personal|fun|school",
        filter: "experiment|poster|print",
        desc : {
            fr : ``,
            en : `
                parodie
                pour devoir scolaire
            `
        }
    },
    "logo_pti_eye" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : "PSYCHOID: THE INDUSTRIAX LOGO \"EYE\"",
        date : "YYYY.MM",
        context: "pti",
        filter: "experiment|type|logo|vector",
        desc : {
            fr : ``,
            en : `
                aspect losange
                retouche un peu du sigle
            `
        }
    },
    "lonely_daft" : {
        type : "img|yt|g_pdf|embed", interact : "zoom|off",
                ext : "png",
                needBG : false|"000000"|"var(--y-b1)",
            url_id : "URL_ID",
            embed : "FULL_URL",
            aspectRatio : "16:9|1:1",
        title : "LONELY DAFT",
        date : "YYYY.MM",
        context: "personal|retrosaturn",
        filter: "experiment|photo",
        desc : {
            fr : ``,
            en : ``
        }
    },
    "gumitea_can" : {
        type : "img", interact : "zoom",
        title : "GUMITEA CAN",
        date : "YYYY.MM",
        context: "retrosaturn",
        filter: "illustration|3D|type|print|logo|vector|layout|ad",
        desc : {
            fr : ``,
            en : `
                parodie Tropico
            `
        }
    },
    "concrete_gnome" : {
        type : "img", interact : "zoom",
        title : "REINFORCED CONCRETE GNOME",
        date : "YYYY.MM",
        context: "retrosaturn",
        filter: "illustration|poster|print|vector|layout|ad",
        desc : {
            fr : ``,
            en : `
                no joke its important for the story
            `
        }
    },
    "y_logo_evolution" : {
        type : "img", interact : "zoom",
        title : "Y LOGO EVOLUTION",
        date : "YYYY.MM",
        context: "personal",
        filter: "experiment|logo|vector",
        desc : {
            fr : ``,
            en : ``
        }
    },
    "zelda_badge" : {
        type : "yt", interact : "off",
            url_id : "URL_ID",
            aspectRatio : "16:9",
        title : "LINK TROUVE UN BADGE D'ACCÈS",
        date : "YYYY.MM",
        context: "personal|fun",
        filter: "experiment|3D|motion",
        desc : {
            fr : ``,
            en : `
                expliquer en deux lignes le contexte
                faire le making off
            `
        }
    }
*/
};


export {
    projectsData,
    projectsDataSample,

    projectTemplate
};