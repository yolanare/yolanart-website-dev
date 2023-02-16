// PROJECTS DATABASE

// REUSABLE
function createMedia({
    type = "img", // CAN BE: "img|yt|embed" // TODO "vid|yt|embed"

    // true : relative to project folder (pass "filename.ext")
    // false : relative to website (from main root ("dev") ; to access medias : "./assets/medias/")
    // ignored if anything other than "img|vid"
    // urlLocalRelative = true, // I can't actually do that, or I don't know how so for the moment it's only absolute paths

// replacement, more annoying because we need to specify the project's id in [url]
    urlRelativeProjectsDir = true, // will start from "./assets/medias/projects/high/"
    // if "http|www" at begining of [url], will automatically switch to "false"
    // default true for convenience

    url, // pass file path if local, or url to internet page

    caption = "", // can be HTML code, using "projectsDataSample.descSamples" but don't put too much text

    settings = "", // special cases, string (class) so each can be separated by spaces " "
    attributes = "", // special cases, string (attribute='value'), each can be separated by spaces " "
    sizeFill = "",
    aspectRatio = "",
}) {
    var exportMedia = ``;


    urlRelativeProjectsDir = (url.match(/^(http|www\.)/)) ? false : urlRelativeProjectsDir;
    url = (urlRelativeProjectsDir) ? "./assets/medias/projects/high/" + url : url;
    sizeFill = (sizeFill) ? `size-fill="${sizeFill}"` : "";
    aspectRatio = (aspectRatio) ? `aspect-ratio="${aspectRatio}"` : "";

    if (type == "img") {
        exportMedia = `
            <img fetchpriority="high" src="${url}"/>
            ${(!caption) ? "" : `<media-caption><p>${caption}</p></media-caption>`}
        `
    }
    if (type == "embed") {
        exportMedia = `
            <div class="embed-player-loading"></div>
            <div class="embed-player-placeholder"></div>
            <iframe src="${url}" width="1920px" height="1080px" frameborder="0" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe>

        `
    }

    return `
        <div type="${type}" class="desc-media ${settings}" ${attributes} ${sizeFill} ${aspectRatio}>
            ${exportMedia}
        </div>
    `;
}

function createLink({url, label}) {
    return `
        <a class="desc-link prj-pill" href="${url}" target="_blank">
            <svg viewBox="0 0 32 32">
                <path d="M21.5,20.5v4h-14v-14h4c1.7,0,3-1.3,3-3l-10,0v20h20l0-10C22.8,17.5,21.5,18.8,21.5,20.5z"/>
                <path d="M14.5,17.5L14.5,17.5c-0.6-0.6-0.6-1.5,0-2.1l8.9-8.9l2.1,2.1l-8.9,8.9C16,18.1,15.1,18.1,14.5,17.5z M24.5,7.5h-7l0-3h10v10l-3,0V7.5z"/>
            </svg>
            <span class="label">${label}</span>
        </a>
    `;
}
function createDescPart({
    type = "", // select description part type
    settings = "", // special cases, used as classes so can be separated by spaces " "
    // "img_ratio" : will be resized depending on the img's aspect ratio
    // "width_main" : will be resized to var(--width_main) (wide size type)
    // "row"
    // "stack"
    // "center"

    // put inside array the same way of input a boolean telling if it is text or not
    text = [false, false, false, false, false, false, false, false],

    input = ["", ""] // input depends on type
}) {
    var elements = ``, // recipient
        detectSpecial = "";

    // put text blocks next to each other
    if (type == "row") {
        input.forEach((i) => { elements += `<div>${i}</div>`; })
    }
    // make a flex with space-between, will fit any heights
    else if (type == "topbottom") {
        elements = `
            <top text-part="${text[0]}">${input[0]}</top>
            <bottom text-part="${text[1]}">${input[1]}</bottom>
        `;

        if (input[1].match("<media-caption>")) {
            detectSpecial += " end-caption";
        }
    }
    // even : split in even partitions, if screen get's thinner they will be stacked in one column
    // stack : puts in a column
    else {
        for (let i = 0; i < input.length; i++) {
            elements += `<div text-part="${text[i]}">${input[i]}</div>`;
        }
    }

    // final export
    return `
        <${type} class="${settings} ${detectSpecial}">
            ${elements}
        </${type}>
    `
}



// DATA
const projectsDataSample = {
    default : {
        hidden: false,
        excludeRecent : false,
        type : "img", interact : "zoom",
                ext : "jpg",
                needBG : false,
            url_id : "D2_r4q2imnQ",
            embed : "https://yolan.art/",
            aspectRatio : "16:9",
        additional : false, // defaults are the same as main project
        title : "",
        date : "----.--",
        colorFill : "var(--y-g1)",
        colorAccent : "var(--y-g1)",
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
        excludeRecent : false|true,
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
                    sizeFill : "width|height",
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
        filter: "comm|compo|layout|motion|photo|3D|illustration|vector|type|branding|experiment|print|poster|ad|logo",
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
        excludeRecent : false|true, // will not be displayed in "recent" section
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
        context: "", // CAN BE: "fun" | "fun|school"]
        filter: "", // CAN BE: "experiment" | "experiment|motion"]
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
    filtersValid : "comm|compo|motion|photo|3D|illustration|vector|type|branding|experiment", // filters that will be used, in order, unused: |layout|poster|print|logo|ad
    descSamples : `
        <h2>BigTitle</h2>

        <h3>LilTitle</h3>

        <p>Text</p>

        <p>Paragraph
        <br>Paragraph
        <br>Paragraph</p>
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
        filter: "experiment|illustration|3D|compo",
        catchphrase : {
            fr : `De quel endroit pourrait-elle bien venir?`,
            en : `From what kind of place is it coming from?`
        },
        desc : {
            fr : `
                <h2>imagination</h2>
                <p>Notre ignorance du fin fond de l’espace m’a donné envie d’imaginer une météorite venant d’une autre civilisation. Elle file à toute vitesse vers le spectateur depuis un endroit inconnu.</p>
                <h2>contexte</h2>
                <p>C’est l'un de mes premiers projets graphiques et aussi l'un de mes favoris.</p>
                <h2>diffusion</h2>
                <p>J'ai eu la surprise de découvrir qu'un auteur du nom de Pierre-Jérôme Delage avait réutilisé ma météorite pour illustrer son article "À qui appartiennent les météorites ?" !</p>
                ${createLink({url : "https://droitetsf.hypotheses.org/78", label : "Accéder à l'article"})}
            `,
            en : `
                <h2>imagination</h2>
                <p>Our lack of knowledge of the far reaches of space made me want to imagine a meteorite coming from another civilization. It is rushing towards the viewer from an unknown place.</p>
                <h2>context</h2>
                <p>This is one of my first graphic project and also one of my favourites.</p>
                <h2>display</h2>
                <p>I was surprised to find out that an author named Pierre-Jérôme Delage had illustrated his article "Who do meteorites belong to?" (title translated) with my meteorite !</p>
                ${createLink({url : "https://droitetsf.hypotheses.org/78", label : "Access article"})}
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
        filter: "3D|motion|compo",
        catchphrase : {
            fr : `Le temps s'ennuie.`,
            en : `Time gets bored.`
        },
        desc : {
            fr : `
                ${createDescPart({type : "row", settings : "", input : [
                    `<h2>sujet</h2>`,
                    `<p>Le sujet était de représenter la ville sans évoquer ses plus gros clichés.</p>
                    `,`<p>J’ai choisi de représenter son manque de personnalité en mettant en avant sa hauteur et sa répétitivité depuis le point de vue d’un piéton à travers le temps.</p>`
                ]})}
                ${createDescPart({type : "stack", settings : "", input : [
                    `<h2>création</h2>`,
                    createDescPart({type : "even", settings : "row", input : [
                        `<p>Je l'ai créé en 3D sur Cinema 4D. Je voulais donner du volume et de la profondeur à ma ville.
                        <br>J’ai placé des cubes et une caméra dans un carrefour.</p>`,
                        `<p>J’ai modifié beaucoup de paramètres pour donner une impression vertigineuse : le point de fuite est déplacé dans le croisement des bâtiments et le champ de vision est étiré.</p>`
                    ]})
                ]})}
                ${createDescPart({type : "row", settings : "width_fill", input : [
                    createMedia({url : "white_city/02 pts de vues 3D.jpg", caption : "Vues de la scène en 3D sur 4 points de vue.", settings : "stack"}),
                    createMedia({url : "white_city/01 camera 3D.jpg", caption : "Paramètres de la caméra.", settings : "stack", sizeFill : "height"})
                ]})}
                <p>J’ai ensuite simulé le déroulement du cycle jour/nuit et j’ai fait le rendu des images en vidéo.</p>
                <h2>post-production</h2>
                <p>Sur VEGAS Pro, j’ai ajouté de nombreux effets pour polir le timelapse : de la brume, du grain, et surtout des effets lumineux pour le soleil. Le lever et le coucher sont plus colorés. J’ai simulé l’éblouissement en ajustant le contraste et le vignettage.</p>
                ${createMedia({url : "white_city/04 montage en gros.jpg", caption : "Montage des effets vidéos.", sizeFill : "width"})}
            `,
            en : `
                ${createDescPart({type : "row", settings : "", input : [
                    `<h2>topic</h2>`,
                    `<p>The aim was to represent the city without bringing up its biggest clichés.</p>
                    `,`<p>I chose to depict its lack of character by emphasizing its height and repetitiveness from the point of view of a pedestrian across time.</p>`
                ]})}
                ${createDescPart({type : "stack", settings : "", input : [
                    `<h2>creation</h2>`,
                    createDescPart({type : "even", settings : "row", input : [
                        `<p>I created it entirely in 3D using Cinema 4D. I wanted to give volume and depth to my city.
                        <br>I placed cubes and a camera in an intersection.</p>`,
                        `<p>I adjusted a lot of the camera's settings to give it a dizzying effect: the vanishing point is shifted in the crossing of the buildings in the sky and the field of view is stretched.</p>`
                    ]})
                ]})}
                ${createDescPart({type : "row", settings : "width_fill", input : [
                    createMedia({url : "white_city/02 pts de vues 3D.jpg", caption : "Scene overview on 4 points of view.", settings : "stack"}),
                    createMedia({url : "white_city/01 camera 3D.jpg", caption : "Camera settings.", settings : "stack", sizeFill : "height"})
                ]})}
                <p>I then added a day/night cycle and rendered the frames in a video.</p>
                <h2>post-production</h2>
                <p>On VEGAS Pro, I added many effects to refine the timelapse: haze, grain, and especially light effects for the sun. The sunrise and sunset are more colorful. I tried to fake the sun glare by adjusting the contrast and other effects.</p>
                ${createMedia({url : "white_city/04 montage en gros.jpg", caption : "Video effects.", sizeFill : "width"})}
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
        filter: "illustration|compo",
        catchphrase : {
            fr : `Mais où est-elle ?`,
            en : `But where is it?`
        },
        desc : {
            fr : `
                ${createDescPart({type : "row", settings : "center", input : [`<h2>sujet</h2>`, `<p>Le sujet consistait à incruster une peinture sur un support mural afin de créer un lien spécifique entre eux.</p>`]})}
                ${createDescPart({type : "even", settings : "", input : [
                    createMedia({url : "foresaken_dove/05 colombe Banksy.jpg"}),
                    createDescPart({type : "topbottom", text : [true, true], input : [`
                            <h2>inspiration</h2>
                            <p>L'œuvre “The Armoured Dove” de Banksy, un célèbre street-artiste britannique, m’a inspiré dans la réalisation de ce projet.</p>
                            <p>Sa colombe a été peinte en 2005 sur un mur séparant Israël et la Palestine. Pour lui ce mur est une tentative absurde pour mettre fin au conflit. La colombe étant un symbole de pureté et de paix, Banksy l'a totalement exposée à la violence. Un pointeur vise son cœur.</p>
                        `, `<media-caption>"The Armoured Dove", Banksy (2005).</media-caption>`
                    ]})
                ]})}
                ${createDescPart({type : "even", settings : "row", input : [`
                            <h2>l'abandonée</h2>
                            <p>Dans mon projet, j’ai choisi de faire de même en l’abandonnant dans un lieu sale et délaissé.
                            <br>Je n’avais pas de lieu de ce genre donc j’ai peint la colombe à l’aquarelle sur une feuille, et je l’ai incrustée numériquement sur un mur.</p>
                            `,`<p>Puis j’ai incrusté une cage posée devant elle. Elle est coincée dans cet endroit. Paniquée, le bec ouvert et les ailes écartées. Les couleurs sont très ternes et sombres afin de donner une impression de détresse.</p>
                        `
                ]})}
                ${createMedia({url : "foresaken_dove/01 colombe originale.jpg", caption : "Colombe peinte à l'aquarelle."})}
            `,
            en : `
                ${createDescPart({type : "row", settings : "center", input : [`<h2>topic</h2>`, `<p>The aim was to create a specific link between a painting and a wall support.</p>`]})}
                ${createDescPart({type : "even", settings : "width_fill", input : [
                    createMedia({url : "foresaken_dove/05 colombe Banksy.jpg"}),
                    createDescPart({type : "topbottom", text : [true, true], input : [`
                            <h2>inspiration</h2>
                            <p>The work "The Armoured Dove" by Banksy, a famous British street-artist, inspired me to make this project.</p>
                            <p>His dove was painted in 2005 on a wall separating Israel and Palestine. For him, this wall is an absurd attempt to end the conflict. The dove being a symbol of purity and peace, Banksy has totally exposed it to violence. A pointer is aiming at its heart.</p>
                        `, `<media-caption>"The Armoured Dove", Banksy (2005).</media-caption>`
                    ]})
                ]})}
                ${createDescPart({type : "even", settings : "width_fill row", input : [`
                            <h2>the forsaken one</h2>
                            <p>In my project, I chose to do likewise by abandoning it in a dirty and neglected place.
                            <br>I didn't know where to find such a place so I painted the dove on paper and digitally overlaid it on a wall.</p>
                            `,`<p>Then I put a cage in front of it. It is trapped in this place. Panicked, the beak open and the wings spread. The colours are very dull and dark to give an impression of despair.</p>
                        `
                ]})}
                ${createMedia({url : "foresaken_dove/01 colombe originale.jpg", caption : "Painted dove with watercolours.", attributes : `size-fill="width"`})}
            `
        }
    },
    "y_in_dark" : {
        type : "img", interact : "zoom",
        // additional : {
            // "y_in_dark_og" : {
                // type : "img",
                // comment : {
                    // fr : `Photo originale.`,
                    // en : `Original photo.`
                // },
            // },
        // },
        title : "Y in dark",
        date : "2018.09",
        colorFill : "#000000",
        colorAccent : "#7a7a7a",
        context: "personal",
        filter: "compo|type|experiment|photo",
        catchphrase : {
            fr : `Perdu dans les ténèbres, sa lumière brillante de l'intérieur.`,
            en : `Lost in the dark, the light shrieking from within.`
        },
        desc : {
            fr : `
                <h2>jouer avec une seule source de lumière</h2>
                <p>L’unique source de lumière permet un grand contraste avec la noirceur plate de l’arrière-plan et le relief des éléments de la scène.</p>
                <p>J’ai disposé un Y en carton sur un support et avec le flash de mon smartphone j'ai fait apparaître le plus de détails possibles.</p>
                ${createMedia({url : "y_in_dark/y_in_dark_og.jpg", caption : "Photo originale."})}
            `,
            en : `
                <h2>playing with one light source</h2>
                <p>The single light source provides a strong contrast between the flat blackness of the background and the sharpness of the scene elements.</p>
                <p>I placed a Y-shaped cardboard statue on a surface and with the flash of my smartphone I tried to bring up as much details as possible.</p>
                ${createMedia({url : "y_in_dark/y_in_dark_og.jpg", caption : "Original photo."})}
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
        filter: "vector|type|branding|experiment|logo",
        desc : {
            fr : `
                <h2>context</h2>
                <p>"RETROSATURN" est la boîte de production de mon ami aspirant réalisateur.</p>
                <h2>conception</h2>
                <p>Nous avons conçu ce logo ensemble dans l'objectif d'obtenir quelque chose d'orienté années 80.</p>
                <p>Il y a énormément de détails, comme l’irrégularité des couleurs et intensités des néons, la texture et la dynamique du mot "SATURN", le grain...</p>
            `,
            en : `
                <h2>context</h2>
                <p>"RETROSATURN" is the company of my aspiring filmmaker friend.</p>
                <h2>conception</h2>
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
        filter: "vector|branding|experiment|logo",
    },
    "caloucath_logo_c_3d" : {
        hidden : true,
        type : "img", interact : "zoom",
                ext : "png",
        additional : {
            "caloucath_c_banner" : {
                type : "img",
                sizeFill : "width"
            },
        },
        title : "Caloucath \"C\"",
        colorAccent : "#5d5c5d",
        date : "2017.07",
        context: "order",
        filter: "3D|branding|logo",
    },
    "caloucath_typo_merry" : {
        hidden : true,
        type : "img", interact : "zoom",
        title : "Caloucath typo banner",
        date : "2017.05",
        context: "order",
        filter: "3D|type|branding|experiment",
    },
    "ppm" : {
        type : "img", interact : "zoom",
                ext : "png",
        additional : {
            "ppm_banner" : {
                type : "img",
                sizeFill : "width"
            },
        },
        title : "Pamplemousse",
        colorFill : "#fddb81",
        colorAccent : "#ff3875",
        date : "2018.10",
        context: "order|ppm",
        filter: "vector|type|branding|logo",
    },
    "rezartilo" : {
        type : "img", interact : "zoom",
        title : "Rezartilo",
        colorFill : "#002fa6",
        colorAccent : "#01a0f8",
        date : "2017.01",
        context: "order",
        filter: "3D|type|branding|logo",
    },
    "jethro" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : "Jethro",
        date : "2018.12",
        context: "order",
        filter: "vector|type|branding|logo",
    },
    "wzr" : {
        type : "img", interact : "zoom",
                ext : "png",
                aspectRatio : "1:1",
        title : "WzR",
        colorAccent : "#fc8600",
        date : "2017.09",
        context: "order",
        filter: "vector|type|branding|logo"
    },
    "abstract_shooting_stars" : {
        hidden: true,
        type : "img", interact : "zoom",
        title : "Abstract shooting stars",
        colorAccent : "#949494",
        date : "2020.01",
        context: "personal",
        filter: "compo|illustration|vector|experiment",
        desc : {
            fr : `
                <h2>expérimentation</h2>
                <p>Création d'une sensation de mouvement avec du contraste et des formes vectorielles en utilisant Adobe Illustrator.</p>
                <h2>abstrait</h2>
                <p>Les formes se croisent et s’empilent, elles alternent l’utilisation du noir et du blanc. Il n’y a aucune autre teinte.</p>
            `,
            en : `
                <h2>experimentation</h2>
                <p>Creating an impression of movement with contrast and vectors using Adobe Illustrator.</p>
                <h2>abstract</h2>
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
        filter: "comm|compo|illustration|type|experiment|poster",
        catchphrase : "Disrupting the stars when they sleep.",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>"STARGAZING" est un projet de film avec la boîte de production de mon ami aspirant réalisateur. C’était initialement une affiche pour une campagne de financement participatif.</p>
                <p>Cependant, on a préféré se focaliser sur nos études et d'autres projets, donc il n'a pas encore abouti.</p>
                <h2>composition</h2>
                <p>La scène a été composée numériquement sur Photoshop : le ciel, la voiture, le personnage, le brouillard, la lumière et l’herbe sont tous sur des calques différents.</p>
                <p>La lumière du véhicule éblouit et crée un halo autour du personnage, le mettant en valeur.</p>
            `,
            en : `
                <h2>context</h2>
                <p>"STARGAZING" is a movie idea with my aspiring filmmaker friend. It was originally a poster for a crowdfunding campaign.</p>
                <p>However, we preferred to focus on our studies and other projects, so it hasn't yet happened.</p>
                <h2>composition</h2>
                <p>The scenery was digitally composed in Photoshop: the sky, the car, the character, the fog, the light and the grass are all on different layers.</p>
                <p>The lights of the vehicle dazzle and create a halo around the character, highlighting him.</p>
            `
        }
    },
    "cyber_district1_mc" : {
        type : "img", interact : "zoom",
        title : {
            fr : "Cyber-district (plan large)",
            en : "Cyber-district (wide shot)",
        },
        colorAccent : "#b98b2d",
        date : "2019.08",
        context: "order|ppm",
        filter: "compo|illustration|3D",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>un quartier lumineux</h2>
                <p>Les couleurs vives des faisceaux lumineux et des panneaux d'affichages se mélangent et se diffusent dans le ciel sombre.</p>
                ${createLink({url : "https://twitter.com/PamplemousseBT/status/1167110044867072000", label : "A été partagé sur Twitter"})}
            `,
            en : `
                <h2>context</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>a luminous district</h2>
                <p>The vibrant colours of the light beams and billboards blend and spread into the dark sky.</p>
                ${createLink({url : "https://twitter.com/PamplemousseBT/status/1167110044867072000", label : "Has been shared on Twitter"})}
            `,
        }
    },
    "cyber_district2_mc" : {
        type : "img", interact : "zoom",
        title : {
            fr : "Cyber-district (plan rapproché)",
            en : "Cyber-district (close-up shot)",
        },
        colorAccent : "#b98b2d",
        date : "2019.08",
        context: "order|ppm",
        filter: "compo|illustration|3D",
        desc : {
            fr : `
                <h2>context</h2>
                <p>La structure est une construction faite sur Minecraft par la Pamplemousse (équipe de joueurs).
                <br>J'ai réalisé la présentation avec un ami.</p>
                <h2>densité</h2>
                <p>Ce plan rapproché a pour but de mettre en valeur le grand nombre de détails de cette structure.</p>
                ${createLink({url : "https://twitter.com/PamplemousseBT/status/1167110044867072000", label : "A été partagé sur Twitter"})}
            `,
            en : `
                <h2>context</h2>
                <p>This structure is a Minecraft build made by the Pamplemousse (building team on the game).
                <br>I and a friend did the presentation.</p>
                <h2>density</h2>
                <p>This close-up shot's aim is to highlight the great number of details of this structure.</p>
                ${createLink({url : "https://twitter.com/PamplemousseBT/status/1167110044867072000", label : "Has been shared on Twitter"})}
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
        filter: "motion|compo|3D",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>La structure est une construction faite sur Minecraft par un ami du nom de Browlin.
                <br>J'ai réalisé la présentation.</p>
                <h2>ambiance</h2>
                <p>L’ambiance d’usine plutôt orange rouille est contrastée par l’énergie bleue qui s’échappe des réacteurs.</p>
                ${createLink({url : "https://twitter.com/Browlin__/status/1356267490083557376", label : "A été partagé sur Twitter"})}
            `,
            en : `
                <h2>context</h2>
                <p>This structure is a Minecraft build made by a friend named Browlin.
                <br>I only did the presentation.</p>
                <h2>ambiance</h2>
                <p>The rather rusty orange factory atmosphere is contrasted by the blue energy escaping from the reactors.</p>
                ${createLink({url : "https://twitter.com/Browlin__/status/1356267490083557376", label : "Has been shared on Twitter"})}
            `,
        }
    },
    "pub_les_connectés" : {
        type : "yt", interact : "off",
            url_id : "66QpHMgmXLM",
            aspectRatio : "16:9",
        title : {
            fr : "Spot pub : Interventions \"Les Connectés\"",
            en : "Advert: \"Les Connectés\" interventions"
        },
        date : "2021.02-04",
        colorFill : "#fe670e",
        colorAccent : "#fe670e",
        context: "sc",
        filter: "comm|motion|compo|ad|layout",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>Après avoir obtenu mon baccalauréat scientifique, je me suis porté volontaire dans une mission de Service Civique que l'association Unis-Cité proposait : "Les Connectés".</p>
                <p>Elle consistait à parcourir tout le département du Cantal afin d'aller à la rencontre des personnes ayant besoin d'aide pour devenir autonomes avec les outils informatiques (clavier, souris, applications...).</p>
                <p>
                <br>Nous avons réalisé des vidéos pour chaque lieu public dans lesquels on intervenait afin qu'ils les diffusent sur leurs réseaux sociaux.</p>
                <h2>personnalisation</h2>
                <p>Les vidéos ont été personnalisées en fonction de nos interventions dans chaque lieu : en atelier individuel ou collectif, avec ou sans inscription.</p>
                <h2>montage</h2>
                <p>C'est la première fois que je bossais sur un projet de ce genre en tant que "directeur" improvisé et monteur.</p>
                <p>La voix-off que vous entendez dans cette vidéo est la mienne.</p>
            `,
            en : `
                <h2>context</h2>
                <p>After obtaining my scientific "baccalauréat" (High School diploma equivalent to A Levels), I volunteered in "Les Connectés" (~ "The Connected"), a Service Civique mission of the association Unis-Cité.</p>
                <p>It consisted in going across the Cantal department in France to meet people who needed help learning how to use computer tools (keyboard, mouse, applications...).</p>
                <p>
                <br>We made videos for each places in which we were intervening so that they could broadcast them on their social networks.</p>
                <h2>personnalization</h2>
                <p>The videos were customised to fit our interventions in each place: as individual or group sessions, with or without registration.</p>
                <h2>editing</h2>
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
        filter: "comm|motion|branding|experiment",
        catchphrase : "Synthwave into the darkest place of the grid!",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>Cette animation a été réalisée pour essayer le logo de la future boîte de production d'un ami.</p>
                <h2>ambiance</h2>
                <p>Le but était de réaliser une introduction, style Synthwave/années 80s avec le quadrillage typique, les néons, les étoiles, les glitchs...</p>
                <p>J'ai ajouté des effets sonores pour amplifier l'ambiance.</p>
                <p>
                <br>Cependant, le rendu final est un peu trop sombre et pesant.</p>
            `,
            en : `
                <h2>context</h2>
                <p>This animation was made to experiment with the logo of my friend's future film production company.</p>
                <h2>ambiance</h2>
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
        filter: "comm|motion|vector|type|branding|experiment",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>Un ami m'avait demandé lors de la réalisation d'une vidéo promotionnelle pour JordanneFM d'animer leur logo. Par la suite, JordanneFM l'a utilisé pour ses émissions.</p>
            `,
            en : `
                <h2>context</h2>
                <p>While a friend was making a promotional video for JordanneFM, he asked me to animate their logo. Afterwards, JordanneFM used it for some of their videos.</p>
            `,
        }
    },
    "yolan_intro_exp" : {
        type : "yt", interact : "off",
            url_id : "UkL4zVUw27Y",
            aspectRatio : "16:9",
        title : {
            fr : "Yolan' introduction expérimentale",
            en : "Yolan' experimental introduction"
        },
        colorFill : "#c0c1c5",
        date : "2017.09",
        context: "personal",
        filter: "comm|motion|vector|branding|experiment",
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
        filter: "comm|motion|3D|vector|branding",
    },
    "quad_page_portfolio" : {
        type : "embed", interact : "off",
            embed : "https://yolan.art/portfolio-exp-quad/public/",
        title : "Quad-page portfolio",
        colorFill : "#4b4b4b",
        colorAccent : "#4b4b4b",
        date : "2020.10-2021.01",
        context: "personal|order",
        filter: "comm|motion|compo|vector|branding|experiment|layout",
        desc : {
            fr : `
                <h2>contexte</h2>
                <p>Ce site Internet fait partie des tout premiers que j’ai créés.</p>
            `,
            en : `
                <h2>context</h2>
                <p>This website is one of the very first I have created.</p>
            `,
        }
    },
    "affiche_apc_conf_hpi_wv" : {
        type : "img", interact : "zoom",
        title : {
            fr : "Affiche : Formation \"WISC-V & Haut Potentiel Intellectuel\"",
            en : "Poster: Course \"WISC-V & High Intellectual Potential\""
        },
        colorFill : "#ca382b",
        colorAccent : "#ca382b",
        date : "2019.08",
        context: "order",
        filter: "comm|compo|vector|poster|print|layout|ad",
    },
    "affiche_apc_conf_hpi" : {
        hidden : true,
        type : "img", interact : "zoom",
        title : "",
        title : {
            fr : "Affiche : Conférence \"Haut Potentiel Intellectuel\"",
            en : "Poster: Conference \"High Intellectual Potential\""
        },
        colorFill : "#3aa3d0",
        colorAccent : "#e178b0",
        date : "2019.11",
        context: "order",
        filter: "comm|compo|vector|poster|print|layout|ad",
    },

    "photo_alley_dead_end" : {
        type : "img", interact : "zoom",
        additional : {
            "photo_alley_dead_end_original" : {
                type : "img",
                comment : {
                    fr : `Photo originale.`,
                    en : `Original photo.`,
                }
            },
        },
        title : "Alley dead end",
        date : "2021.12",
        colorFill : "#0b1c14",
        colorAccent : "#804427",
        context: "school",
        filter: "compo|photo",
    },
    "photo_between" : {
        type : "img", interact : "zoom",
        additional : {
            "photo_between_original" : {
                type : "img",
                comment : {
                    fr : `Photo originale.`,
                    en : `Original photo.`,
                }
            },
        },
        title : "Between",
        date : "2021.12",
        colorFill : "#08142a",
        colorAccent : "#753142",
        context: "school",
        filter: "compo|photo",
    },
    "photo_daylight" : {
        type : "img", interact : "zoom",
        additional : {
            "photo_daylight_original" : {
                type : "img",
                comment : {
                    fr : `Photo originale.`,
                    en : `Original photo.`,
                }
            },
        },
        title : "Day light",
        date : "2021.12",
        colorFill : "#7f6749",
        colorAccent : "#caa976",
        context: "school",
        filter: "compo|photo",
    },
    "photo_merry_christmas" : {
        type : "img", interact : "zoom",
        additional : {
            "photo_merry_christmas_original" : {
                type : "img",
                comment : {
                    fr : `Photo originale.`,
                    en : `Original photo.`,
                },
            },
        },
        title : "Merry Christmas",
        date : "2021.12",
        colorFill : "#1f1f1f",
        colorAccent : "#505050",
        context: "school",
        filter: "compo|photo",
    },
    "liquid_blue_ticket" : {
        type : "img", interact : "zoom",
                ext : "png",
        title : {
            fr : "\"Liquid blue\" pass 3 jours festival",
            en : "Liquid blue festival 3 day pass"
        },
        date : "2022.01",
        colorFill : "#0f1d20",
        colorAccent : "#0f7577",
        context: "school",
        filter: "comm|compo|vector|experiment|print|layout",
    },
    "storyboard_schniark" : {
        type : "img", interact : "zoom",
        additional : {
            "p1" : { type : "img", sizeFill : "width" },
            "p2" : { type : "img", sizeFill : "width" },
            "p3" : { type : "img", sizeFill : "width" },
            "p4" : { type : "img", sizeFill : "width" },
            "p5" : { type : "img", sizeFill : "width" },
            "p6" : { type : "img", sizeFill : "width" },
            "p7" : { type : "img", sizeFill : "width" },
        },
        title : {
            fr : "Storyboard: \"Le Tournemire\", l'apparition du Schniark (adaptation)",
            en : "Storyboard: \"Le Tournemire\", the Schniark's introduction (adaptation)"
        },
        date : "2022.03-04",
        colorFill : "#2d2d2d",
        colorAccent : "#cd2603",
        context: "school",
        filter: "compo|illustration|layout",
    },
    "dum_grimnir" : {
        type : "img", interact : "zoom",
        title : {
            fr : "Chara-design : Dum Grimnir",
            en : "Chara-design: Dum Grimnir"
        },
        date : "2022.04",
        colorFill : "#5a5c71",
        colorAccent : "#5a5c71",
        context: "school",
        filter: "illustration",
    },
    "charte_graphique_logo_lodge_tourtereaux" : {
        type : "img", interact : "zoom",
        additional : {
            "p2" :  { type : "img", sizeFill : "width" },
            "p3" :  { type : "img", sizeFill : "width" },
            "p4" :  { type : "img", sizeFill : "width" },
            "p5" :  { type : "img", sizeFill : "width" },
            "p6" :  { type : "img", sizeFill : "width" },
            "p7" :  { type : "img", sizeFill : "width" },
            "p8" :  { type : "img", sizeFill : "width" },
            "p9" :  { type : "img", sizeFill : "width" },
            "p10" : { type : "img", sizeFill : "width" },
            "p11" : { type : "img", sizeFill : "width" },
            "p12" : { type : "img", sizeFill : "width" },
            "p13" : { type : "img", sizeFill : "width" },
            "p14" : { type : "img", sizeFill : "width" },
            "p15" : { type : "img", sizeFill : "width" },
            "p16" : { type : "img", sizeFill : "width" },
            "p17" : { type : "img", sizeFill : "width" },
            "p18" : { type : "img", sizeFill : "width" },
            "p19" : { type : "img", sizeFill : "width" },
            "p20" : { type : "img", sizeFill : "width" },
            "p21" : { type : "img", sizeFill : "width" },
            "p22" : { type : "img", sizeFill : "width" },
            "p23" : { type : "img", sizeFill : "width" },
        },
        title : {
            fr : "Charte graphique : Logo lodge \"La Cabane des Tourtereaux\"",
            en : "Logo guidelines: Lodge \"La Cabane des Tourtereaux\""
        },
        date : "2022.06",
        colorFill : "#297c4e",
        colorAccent : "#4bb47c",
        context: "school",
        filter: "comm|compo|vector|type|branding|print|layout|logo",
    },
    "aquila_gradients" : {
        excludeRecent : true,
        type : "img", interact : "zoom",
                ext : "png",
        title : "Aquila gradients",
        date : "2022.06",
        colorFill : "#3d117f",
        colorAccent : "#ff4800",
        context: "personal",
        filter: "vector|experiment|logo",
    },
    "affiche_conference_dev_psycho_affectif" : {
        excludeRecent : true,
        type : "img", interact : "zoom",
        title : {
            fr : "Affiche : Conférence \"Être parent ou éducateur aujourd'hui, mission impossible ?\"",
            en : "Poster: Conference \"Psycho-affective development of the child to the adolescent\""
        },
        date : "2022.07",
        colorFill : "#4c539c",
        colorAccent : "#f9b122",
        context: "order",
        filter: "comm|compo|vector|poster|print|layout|ad",
    },
    "affiche_formation_dev_psycho_affectif" : {
        excludeRecent : true,
        type : "img", interact : "zoom",
        title : {
            fr : "Affiche : Formation \"Le développement psycho-affectif de l'enfant à l'adolescent\"",
            en : "Poster: Course \"Psycho-affective development of the child to the adolescent\""
        },
        date : "2022.07",
        colorFill : "#4c539c",
        colorAccent : "#ec607e",
        context: "order",
        filter: "comm|compo|vector|poster|print|layout|ad",
    },
    "csg_anim" : {
        type : "yt", interact : "off",
            url_id : "1j49bNaBpHQ",
            aspectRatio : "16:9",
        title : {
            fr : "Spot pub : \"Chacun ses Goûts\", Yogurt Glacés",
            en : "Advert: \"Chacun ses Goûts\", Yogurt Glacés"
        },
        colorFill : "#de3435",
        colorAccent : "#c9414f",
        date : "2022.09-11",
        context: "school",
        filter: "comm|layout|motion|3D|vector|branding|compo|ad",
        desc : {
            fr : `
                ${createMedia({type : "embed", url : "https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFSzKsnkzo&#x2F;view?embed", aspectRatio : "16:9"})}
                ${createMedia({type : "embed", url : "https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFM6E6ShME&#x2F;view?embed", aspectRatio : "a4-v"})}
            `,
            en : `
                ${createMedia({type : "embed", url : "https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFSzKsnkzo&#x2F;view?embed", aspectRatio : "16:9"})}
                ${createMedia({type : "embed", url : "https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFM6E6ShME&#x2F;view?embed", aspectRatio : "a4-v"})}
            `,
        }
    },
    "childhood_memory" : {
        type : "yt", interact : "off",
            url_id : "-4kCltTkLKs",
            aspectRatio : "16:9",
        title : {
            fr : "Souvenir d'enfance",
            en : "Childhood memory"
        },
        colorFill : "#1f65a0",
        colorAccent : "#ae8f23",
        date : "2022.11",
        context: "school",
        filter: "motion|3D|compo",
    },
    "joyeux_noël_anim" : {
        type : "yt", interact : "off",
            url_id : "lf2G5yJlG74",
            aspectRatio : "16:9",
        title : {
            fr : "Joyeux Noël animation",
            en : "Merry Christmas animation"
        },
        colorFill : "#006716",
        colorAccent : "#ffab00",
        date : "2022.12",
        context: "school",
        filter: "comm|motion|3D|compo",
        desc : {
            fr : `
                ${createMedia({url : "joyeux_noël_anim/plan1.png", caption : "Prototype du plan 1."})}
                ${createMedia({url : "joyeux_noël_anim/plan2.png", caption : "Prototype du plan 2."})}
                ${createMedia({url : "joyeux_noël_anim/plan3.png", caption : "Prototype du plan 3."})}
            `,
            en : `
                ${createMedia({url : "joyeux_noël_anim/plan1.png", caption : "Shot 1 prototype."})}
                ${createMedia({url : "joyeux_noël_anim/plan2.png", caption : "Shot 2 prototype."})}
                ${createMedia({url : "joyeux_noël_anim/plan3.png", caption : "Shot 3 prototype."})}
            `,
        }
    },
    "ice_crime" : {
        excludeRecent : true,
        type : "yt", interact : "off",
            url_id : "cnMB0I4ClqU",
            aspectRatio : "3:4",
        title : "Ice Crime",
        colorFill : "#0e0603",
        colorAccent : "#d2a678",
        date : "2022.12",
        context: "school",
        filter: "3D|illustration|experiment|compo",
        desc : {
            fr : `
                ${createDescPart({type : "row", settings : "width_fill gallery", input : [
                    createMedia({url : "ice_crime/blender_in.jpg", caption : "Scène réalisée avec Blender.", settings : "stack"}),
                    createMedia({url : "ice_crime/depth.jpg", caption : "Découpage de chaque personnage en fonction de sa profondeur.", settings : "stack", sizeFill : "height"}),
                    createMedia({url : "ice_crime/ice_crime.jpg", caption : "Rendu final, dessin numérique.", settings : "stack", sizeFill : "height"})
                ]})}
                ${createDescPart({type : "even", settings : "", input : [
                    createMedia({url : "ice_crime/blender_out.jpg"}),
                    createDescPart({type : "topbottom", text : [true, true], input : [`
                        <p>Dans le processus de réalisation de ce projet, j'ai d'abord créé la scène en 3D pour ensuite redessiner par-dessus.</p>
                        <p>Cela m'a permis de garder les bonnes proportions pour chaque personnage, ainsi que de cadrer avec la scène comme je l'imaginais.</p>
                    `, `<media-caption>Scène vue d'un autre point de vue.</media-caption>`
                    ]})
                ]})}
            `,
            en : `
                ${createDescPart({type : "row", settings : "width_fill gallery", input : [
                    createMedia({url : "ice_crime/blender_in.jpg", caption : "Scene made with Blender.", settings : "stack"}),
                    createMedia({url : "ice_crime/depth.jpg", caption : "Each character cut out by depth.", settings : "stack", sizeFill : "height"}),
                    createMedia({url : "ice_crime/ice_crime.jpg", caption : "Final result, digital drawing.", settings : "stack", sizeFill : "height"})
                ]})}
                ${createDescPart({type : "even", settings : "", input : [
                    createMedia({url : "ice_crime/blender_out.jpg"}),
                    createDescPart({type : "topbottom", text : [true, true], input : [`
                        <p>In the process of making this project, I first created the scene in 3D to then draw over it.</p>
                        <p>This allowed me to keep the right proportions for each character, as well as to frame the scene as I imagined it.</p>
                        `, `<media-caption>Scene from a different point of view.</media-caption>`
                    ]})
                ]})}
            `,
        }
    },
    "charte_graphique_logo_cycl_of_course" : {
        type : "img", interact : "zoom",
            ext : "png",
        additional : {
            // "p1" :  { type : "img", ext : "png", sizeFill : "width" },
            "p2" :  { type : "img", ext : "png", sizeFill : "width" },
            "p2" :  { type : "img", ext : "png", sizeFill : "width" },
            "p3" :  { type : "img", ext : "png", sizeFill : "width" },
            "p4" :  { type : "img", ext : "png", sizeFill : "width" },
            "p5" :  { type : "img", ext : "png", sizeFill : "width" },
            "p6" :  { type : "img", ext : "png", sizeFill : "width" },
            "p7" :  { type : "img", ext : "png", sizeFill : "width" },
            "p8" :  { type : "img", sizeFill : "width" },
            "p9" :  { type : "img", ext : "png", sizeFill : "width" },
        },
        title : {
            fr : "Charte graphique : Logo \"Cycl'of Course\"",
            en : "Logo guidelines: \"Cycl'of Course\""
        },
        date : "2023.01",
        colorFill : "#006050",
        colorAccent : "#dfa300",
        context: "school",
        filter: "comm|compo|layout|vector|type|branding|print|logo",
    },
    "saw_sawing_animation" : {
        type : "vid", interact : "off",
            ext : "mp4",
            aspectRatio : "4:3",
        title : "\"Saw, Sawing\" animation",
        colorFill : "#87261f",
        colorAccent : "#e43d35",
        date : "2023.02",
        context: "school",
        filter: "motion|3D|illustration",
        /*desc : {
            fr : `
                ${createDescPart({type : "even", settings : "width_fill", input : [
                    createMedia({url : "saw_sawing_animation/saw original.jpg"}),
                    createDescPart({type : "topbottom", text : [true, true], input : [`
                        `, `<media-caption>"Saw, Sawing", Claes Oldenburg, (1996), Tokyo International Exhibition Center, Big Sight, Tokyo.</media-caption>`
                    ]})
                ]})}
                ${createDescPart({type : "row", settings : "width_fill gallery", input : [
                    createMedia({url : "saw_sawing_animation/original det.jpg", caption : "Détourage à partir d'une photo de côté.", settings : "stack", sizeFill : "height"}),
                    createMedia({url : "saw_sawing_animation/3D profil.jpg", caption : "Modèle 3D réalisé sur Blender.", settings : "stack"}),
                ]})}
                ${createDescPart({type : "row", settings : "width_fill gallery", input : [
                    createMedia({url : "saw_sawing_animation/image d'origine (crop).jpg", caption : `Image d'origine prise par <a href="https://twitter.com/wongthanong/status/1132931314284261377" target="_blank">@wongthanong sur Twitter</a>.`, settings : "stack"}),
                    createMedia({url : "saw_sawing_animation/fond sans scie (upscaled).jpg", caption : "Scie retirée de l'image d'origine (agrandie).", settings : "stack", sizeFill : "height"}),
                ]})}
                ${createDescPart({type : "row", settings : "width_fill gallery", input : [
                    createMedia({url : "saw_sawing_animation/3D 1.jpg", settings : "stack"}),
                    createMedia({url : "saw_sawing_animation/3D 2.jpg", settings : "stack", sizeFill : "height"}),
                    createMedia({url : "saw_sawing_animation/3D 3.jpg", settings : "stack", sizeFill : "height"})
                ]})}
            `,
            en : `
            `,
        }*/
    },
    "dépliant_bic" : {
        type : "img", interact : "zoom",
            ext : "png",
        additional : {
            "mockup1" :  { type : "img", ext : "png", sizeFill : "width" },
            "mockup2" :  { type : "img", ext : "png", sizeFill : "width" },
            // "dépliant_bic1" :  { type : "img", ext : "png", sizeFill : "width" },
            // "dépliant_bic2" :  { type : "img", ext : "png", sizeFill : "width" },
        },
        title : {
            fr : "Dépliant : \"Le Stylo 4 Couleurs\"",
            en : "Brochure: \"Four-Color Pen\""
        },
        date : "2022.11",
        colorFill : "#29abe2",
        colorAccent : "#fdbb27",
        context: "school",
        filter: "comm|compo|layout|vector|branding|print|ad",
    },

// new -----------------------------------------------------------------------
/*
    "TEMPLATE" : {
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
        date : "YYYY.MM",
        colorFill : "COLOR_FILL",
        colorAccent : "COLOR_ACCENT",
        context: "personal|fun|order|school|sc|ppm|retrosaturn|pti",
        filter: "motion|3D|vector|type|branding|ad|layout|print|photo|illustration|experiment",
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



    "TEMPLATE" : {
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
        date : "YYYY.MM",
        colorFill : "COLOR_FILL",
        colorAccent : "COLOR_ACCENT",
        context: "personal|fun|order|school|sc|ppm|retrosaturn|pti",
        filter: "motion|3D|vector|type|branding|ad|layout|print|photo|illustration|experiment",
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
    "TEMPLATE" : {
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
        date : "YYYY.MM",
        colorFill : "COLOR_FILL",
        colorAccent : "COLOR_ACCENT",
        context: "personal|fun|order|school|sc|ppm|retrosaturn|pti",
        filter: "motion|3D|vector|type|branding|ad|layout|print|photo|illustration|experiment",
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
    "TEMPLATE" : {
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
        date : "YYYY.MM",
        colorFill : "COLOR_FILL",
        colorAccent : "COLOR_ACCENT",
        context: "personal|fun|order|school|sc|ppm|retrosaturn|pti",
        filter: "motion|3D|vector|type|branding|ad|layout|print|photo|illustration|experiment",
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






/*
    "water_take-off" : {
        type : "img", interact : "zoom",
        title : "Water take-off",
        date : "2021.10",
        colorFill : "#463426",
        colorAccent : "#442e28",
        context: "school",
        filter: "illustration|experiment",
    },
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

    createMedia, createLink
};