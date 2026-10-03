// ============================================================
// HYPER LOCAL AGRICULTURAL ADVISORY SYSTEM
// COMPLETE SCRIPT.JS
// Crop-specific suitability + State suitability + Diseases
// Weather + Location + Forecast + Advisory
// ============================================================

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEO_API = "https://nominatim.openstreetmap.org/reverse";

// ============================================================
// CROP DATABASE
// ============================================================

const CROPS = {

    wheat: {
        name: "Wheat",
        hindi: "गेहूं",
        category: "Cereal",
        season: "Rabi",
        temperature: [10, 25],
        duration: 120,
        water: "Moderate",
        soil: "Well-drained loam to clay loam",
        sunlight: "Full Sun",
        sowing: "October to December",
        harvest: "February to April",
        yield: "35–55 q/ha depending on variety and management",
        irrigation: "Critical stages include crown root initiation, flowering and grain filling.",
        nutrition: "Balanced NPK based on soil test; avoid excess nitrogen.",
        stages: [
            "Germination",
            "Crown Root Initiation",
            "Tillering",
            "Stem Elongation",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Check soil moisture before irrigation.",
            "Monitor weeds during early growth.",
            "Inspect leaves for rust symptoms.",
            "Avoid unnecessary late irrigation near maturity.",
            "Use locally recommended wheat varieties."
        ],
        states: [
            "Uttar Pradesh",
            "Punjab",
            "Haryana",
            "Madhya Pradesh",
            "Rajasthan",
            "Bihar",
            "Uttarakhand",
            "Maharashtra",
            "Gujarat",
            "West Bengal"
        ],
        diseases: [
            "Yellow/Stripe Rust",
            "Brown Rust",
            "Black/Stem Rust",
            "Loose Smut",
            "Karnal Bunt",
            "Powdery Mildew"
        ],
        diseaseSigns: [
            "Yellow or orange rust-like stripes on leaves",
            "Dark rust pustules",
            "Blackened grain/spike symptoms",
            "White powdery growth under humid conditions"
        ]
    },

    rice: {
        name: "Rice / Paddy",
        hindi: "धान",
        category: "Cereal",
        season: "Kharif",
        temperature: [20, 35],
        duration: 120,
        water: "High",
        soil: "Clay loam to loam with good water-holding capacity",
        sunlight: "Full Sun",
        sowing: "June to July for major Kharif systems",
        harvest: "October to November",
        yield: "30–60 q/ha depending on variety and management",
        irrigation: "Maintain appropriate soil moisture; water requirement depends on establishment method and soil.",
        nutrition: "Soil-test-based NPK and micronutrient management.",
        stages: [
            "Germination",
            "Seedling",
            "Tillering",
            "Panicle Initiation",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Maintain suitable soil moisture.",
            "Monitor weeds and standing-water conditions.",
            "Inspect leaves and panicles for disease symptoms.",
            "Monitor stem borer and other insect damage.",
            "Avoid unnecessary water stagnation where local recommendations advise alternate wetting and drying."
        ],
        states: [
            "West Bengal",
            "Uttar Pradesh",
            "Bihar",
            "Odisha",
            "Chhattisgarh",
            "Andhra Pradesh",
            "Telangana",
            "Tamil Nadu",
            "Punjab",
            "Haryana",
            "Assam",
            "Jharkhand",
            "Karnataka",
            "Kerala"
        ],
        diseases: [
            "Rice Blast",
            "Bacterial Leaf Blight",
            "Brown Spot",
            "Sheath Blight",
            "False Smut",
            "Bacterial Leaf Streak"
        ],
        diseaseSigns: [
            "Spindle/diamond-shaped lesions on leaves",
            "Water-soaked or yellowing leaf margins",
            "Brown circular leaf spots",
            "Lesions around leaf sheath",
            "Greenish-black smut balls on panicles"
        ]
    },

    maize: {
        name: "Maize",
        hindi: "मक्का",
        category: "Cereal",
        season: "Kharif",
        temperature: [18, 32],
        duration: 100,
        water: "Moderate",
        soil: "Well-drained fertile loam",
        sunlight: "Full Sun",
        sowing: "June to July for Kharif; region-dependent for other seasons",
        harvest: "September to October",
        yield: "40–80 q/ha depending on hybrid and management",
        irrigation: "Important around establishment, knee-high stage, tasseling and grain filling.",
        nutrition: "High nutrient demand; use soil-test-based nitrogen and balanced fertilizers.",
        stages: [
            "Germination",
            "Seedling",
            "Vegetative",
            "Tasseling",
            "Silking",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Maintain weed-free early growth.",
            "Monitor fall armyworm and stem damage.",
            "Avoid waterlogging.",
            "Monitor leaves for blight symptoms.",
            "Maintain moisture around flowering."
        ],
        states: [
            "Karnataka",
            "Madhya Pradesh",
            "Bihar",
            "Telangana",
            "Andhra Pradesh",
            "Rajasthan",
            "Uttar Pradesh",
            "Maharashtra",
            "Tamil Nadu",
            "West Bengal"
        ],
        diseases: [
            "Fall Armyworm",
            "Turcicum/Northern Leaf Blight",
            "Maydis/Southern Leaf Blight",
            "Banded Leaf and Sheath Blight",
            "Downy Mildew"
        ],
        diseaseSigns: [
            "Long grey-green leaf lesions",
            "Brown leaf lesions",
            "Band-like lesions around sheath",
            "Whitish growth under humid conditions"
        ]
    },

    barley: {
        name: "Barley",
        hindi: "जौ",
        category: "Cereal",
        season: "Rabi",
        temperature: [10, 25],
        duration: 110,
        water: "Low to Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "October to December",
        harvest: "March to April",
        yield: "25–45 q/ha",
        irrigation: "Limited irrigation is generally required depending on soil and rainfall.",
        nutrition: "Balanced nutrition based on soil test.",
        stages: [
            "Germination",
            "Tillering",
            "Stem Elongation",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor moisture.",
            "Control early weeds.",
            "Inspect leaves for rust.",
            "Avoid excess irrigation."
        ],
        states: [
            "Rajasthan",
            "Uttar Pradesh",
            "Haryana",
            "Punjab",
            "Madhya Pradesh",
            "Bihar"
        ],
        diseases: [
            "Stripe Rust",
            "Brown Rust",
            "Powdery Mildew",
            "Loose Smut"
        ],
        diseaseSigns: [
            "Yellow-orange pustules",
            "Brown rust spots",
            "White powdery growth",
            "Darkened infected seed heads"
        ]
    },

    sorghum: {
        name: "Sorghum / Jowar",
        hindi: "ज्वार",
        category: "Cereal",
        season: "Kharif",
        temperature: [25, 35],
        duration: 110,
        water: "Low to Moderate",
        soil: "Well-drained loam to black soil",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "September to October",
        yield: "20–40 q/ha",
        irrigation: "Drought tolerant but moisture is important around flowering.",
        nutrition: "Balanced fertilizer based on soil test.",
        stages: [
            "Germination",
            "Seedling",
            "Vegetative",
            "Booting",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor shoot fly during early stage.",
            "Check for stem borer damage.",
            "Avoid severe moisture stress at flowering.",
            "Inspect panicles for grain mold."
        ],
        states: [
            "Maharashtra",
            "Karnataka",
            "Telangana",
            "Andhra Pradesh",
            "Madhya Pradesh",
            "Rajasthan",
            "Tamil Nadu",
            "Uttar Pradesh"
        ],
        diseases: [
            "Sorghum Smut",
            "Grain Mold",
            "Anthracnose",
            "Downy Mildew",
            "Shoot Fly"
        ],
        diseaseSigns: [
            "Smut sori replacing grains",
            "Discolored/moldy grains",
            "Dark lesions on leaves and stems",
            "Seedling damage from shoot fly"
        ]
    },

    bajra: {
        name: "Pearl Millet / Bajra",
        hindi: "बाजरा",
        category: "Cereal",
        season: "Kharif",
        temperature: [25, 35],
        duration: 90,
        water: "Low",
        soil: "Sandy loam to light soils",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "September to October",
        yield: "15–30 q/ha",
        irrigation: "Generally drought tolerant; avoid waterlogging.",
        nutrition: "Balanced nutrients with special attention to nitrogen and micronutrients where deficient.",
        stages: [
            "Germination",
            "Tillering",
            "Vegetative",
            "Panicle Emergence",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Maintain weed-free early growth.",
            "Monitor downy mildew.",
            "Inspect panicles for ergot.",
            "Avoid prolonged waterlogging."
        ],
        states: [
            "Rajasthan",
            "Haryana",
            "Gujarat",
            "Uttar Pradesh",
            "Maharashtra",
            "Madhya Pradesh",
            "Karnataka"
        ],
        diseases: [
            "Downy Mildew",
            "Ergot",
            "Rust",
            "Blast"
        ],
        diseaseSigns: [
            "White downy growth on leaves",
            "Dark sticky droplets around flowering",
            "Rust-like pustules"
        ]
    },

    ragi: {
        name: "Finger Millet / Ragi",
        hindi: "रागी / मडुआ",
        category: "Millet",
        season: "Kharif",
        temperature: [20, 30],
        duration: 110,
        water: "Moderate",
        soil: "Red loam and well-drained soils",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "September to November",
        yield: "20–35 q/ha",
        irrigation: "Moderate irrigation depending on rainfall and soil.",
        nutrition: "Balanced nutrition with soil testing.",
        stages: [
            "Germination",
            "Seedling",
            "Tillering",
            "Ear Emergence",
            "Flowering",
            "Grain Filling",
            "Maturity"
        ],
        tasks: [
            "Control weeds early.",
            "Monitor blast symptoms.",
            "Maintain adequate moisture around flowering.",
            "Avoid waterlogging."
        ],
        states: [
            "Karnataka",
            "Tamil Nadu",
            "Andhra Pradesh",
            "Telangana",
            "Odisha",
            "Maharashtra",
            "Uttarakhand"
        ],
        diseases: [
            "Finger Millet Blast",
            "Leaf Spot",
            "Neck Blast"
        ],
        diseaseSigns: [
            "Spindle-shaped leaf lesions",
            "Dark lesions on neck and panicle",
            "Drying of infected panicles"
        ]
    },

    chickpea: {
        name: "Chickpea / Gram",
        hindi: "चना",
        category: "Pulse",
        season: "Rabi",
        temperature: [15, 30],
        duration: 110,
        water: "Low to Moderate",
        soil: "Well-drained loam to black soil",
        sunlight: "Full Sun",
        sowing: "October to November",
        harvest: "February to March",
        yield: "15–25 q/ha",
        irrigation: "Avoid excessive irrigation; critical moisture periods depend on soil and crop stage.",
        nutrition: "Rhizobium inoculation and soil-test-based phosphorus/nutrients.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Pod Formation",
            "Seed Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor wilt symptoms.",
            "Inspect plants for pod borer.",
            "Avoid excessive irrigation.",
            "Maintain weed control during early growth."
        ],
        states: [
            "Madhya Pradesh",
            "Maharashtra",
            "Rajasthan",
            "Karnataka",
            "Uttar Pradesh",
            "Andhra Pradesh",
            "Telangana",
            "Gujarat",
            "Bihar"
        ],
        diseases: [
            "Fusarium Wilt",
            "Ascochyta Blight",
            "Collar Rot",
            "Pod Borer"
        ],
        diseaseSigns: [
            "Sudden wilting",
            "Brown lesions on stems",
            "Leaf and pod damage",
            "Larvae inside pods"
        ]
    },

    pigeonpea: {
        name: "Pigeon Pea / Arhar",
        hindi: "अरहर / तुअर",
        category: "Pulse",
        season: "Kharif",
        temperature: [20, 35],
        duration: 180,
        water: "Moderate",
        soil: "Well-drained loam to black soil",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "December to January",
        yield: "15–25 q/ha",
        irrigation: "Generally rainfed; irrigation may be useful during prolonged dry periods.",
        nutrition: "Balanced nutrition with phosphorus and micronutrients based on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Pod Formation",
            "Seed Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor pod borer.",
            "Check for wilt.",
            "Avoid prolonged waterlogging.",
            "Maintain weed control."
        ],
        states: [
            "Maharashtra",
            "Karnataka",
            "Madhya Pradesh",
            "Telangana",
            "Andhra Pradesh",
            "Gujarat",
            "Uttar Pradesh",
            "Bihar"
        ],
        diseases: [
            "Fusarium Wilt",
            "Sterility Mosaic Disease",
            "Phytophthora Blight",
            "Pod Borer"
        ],
        diseaseSigns: [
            "Plant wilting",
            "Mosaic symptoms",
            "Stem and collar lesions",
            "Pod feeding damage"
        ]
    },

    moong: {
        name: "Green Gram / Moong",
        hindi: "मूंग",
        category: "Pulse",
        season: "Zaid/Kharif",
        temperature: [25, 35],
        duration: 65,
        water: "Low to Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "March to April or June to July depending on region",
        harvest: "May to June or September",
        yield: "8–15 q/ha",
        irrigation: "Avoid waterlogging; maintain moisture during flowering and pod formation.",
        nutrition: "Rhizobium inoculation and soil-test-based nutrition.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Pod Formation",
            "Maturity"
        ],
        tasks: [
            "Control weeds early.",
            "Monitor yellow mosaic symptoms.",
            "Check whitefly populations.",
            "Avoid waterlogging."
        ],
        states: [
            "Rajasthan",
            "Maharashtra",
            "Karnataka",
            "Andhra Pradesh",
            "Telangana",
            "Uttar Pradesh",
            "Madhya Pradesh",
            "Punjab",
            "Haryana"
        ],
        diseases: [
            "Yellow Mosaic Virus",
            "Powdery Mildew",
            "Cercospora Leaf Spot",
            "Whitefly"
        ],
        diseaseSigns: [
            "Yellow-green mosaic on leaves",
            "White powdery patches",
            "Circular leaf spots",
            "Small white insects under leaves"
        ]
    },

    urad: {
        name: "Black Gram / Urad",
        hindi: "उड़द",
        category: "Pulse",
        season: "Kharif/Zaid",
        temperature: [25, 35],
        duration: 70,
        water: "Low to Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "June to July or March to April",
        harvest: "September or May to June",
        yield: "8–15 q/ha",
        irrigation: "Avoid waterlogging.",
        nutrition: "Rhizobium inoculation and balanced nutrition.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Pod Formation",
            "Maturity"
        ],
        tasks: [
            "Monitor yellow mosaic virus.",
            "Control weeds.",
            "Monitor sucking pests.",
            "Avoid excessive irrigation."
        ],
        states: [
            "Uttar Pradesh",
            "Madhya Pradesh",
            "Maharashtra",
            "Rajasthan",
            "Andhra Pradesh",
            "Telangana",
            "Tamil Nadu",
            "Karnataka"
        ],
        diseases: [
            "Yellow Mosaic Virus",
            "Leaf Crinkle Virus",
            "Cercospora Leaf Spot",
            "Powdery Mildew"
        ],
        diseaseSigns: [
            "Yellow mosaic patterns",
            "Leaf curling/crinkling",
            "Brown leaf spots"
        ]
    },

    lentil: {
        name: "Lentil / Masoor",
        hindi: "मसूर",
        category: "Pulse",
        season: "Rabi",
        temperature: [15, 25],
        duration: 110,
        water: "Low",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "October to November",
        harvest: "February to March",
        yield: "10–18 q/ha",
        irrigation: "Usually limited irrigation; avoid excess moisture.",
        nutrition: "Phosphorus and micronutrients based on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Pod Formation",
            "Maturity"
        ],
        tasks: [
            "Monitor rust and wilt.",
            "Control weeds.",
            "Avoid excessive irrigation."
        ],
        states: [
            "Uttar Pradesh",
            "Madhya Pradesh",
            "Bihar",
            "Rajasthan",
            "West Bengal",
            "Jharkhand",
            "Chhattisgarh"
        ],
        diseases: [
            "Rust",
            "Wilt",
            "Ascochyta Blight",
            "Root Rot"
        ],
        diseaseSigns: [
            "Orange-brown pustules",
            "Sudden wilting",
            "Dark lesions on leaves/stems"
        ]
    },

    mustard: {
        name: "Mustard",
        hindi: "सरसों",
        category: "Oilseed",
        season: "Rabi",
        temperature: [10, 25],
        duration: 120,
        water: "Low to Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "October to November",
        harvest: "February to March",
        yield: "12–25 q/ha",
        irrigation: "Irrigation is important at critical stages such as branching, flowering and siliqua development.",
        nutrition: "Sulphur is important where soil is deficient; follow soil-test-based fertilizer recommendations.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Siliqua Formation",
            "Seed Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor aphids during flowering.",
            "Check for white rust and Alternaria symptoms.",
            "Maintain proper moisture.",
            "Avoid unnecessary late irrigation."
        ],
        states: [
            "Rajasthan",
            "Haryana",
            "Uttar Pradesh",
            "Madhya Pradesh",
            "Punjab",
            "Bihar",
            "West Bengal",
            "Gujarat"
        ],
        diseases: [
            "White Rust",
            "Alternaria Blight",
            "Downy Mildew",
            "Aphids"
        ],
        diseaseSigns: [
            "White pustules on lower leaf surfaces",
            "Dark concentric leaf spots",
            "Downy growth",
            "Clusters of aphids on tender parts"
        ]
    },

    groundnut: {
        name: "Groundnut",
        hindi: "मूंगफली",
        category: "Oilseed",
        season: "Kharif",
        temperature: [25, 35],
        duration: 120,
        water: "Moderate",
        soil: "Loose sandy loam",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "September to October",
        yield: "15–30 q/ha",
        irrigation: "Maintain moisture around flowering, pegging and pod development.",
        nutrition: "Calcium and sulphur may be important depending on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Flowering",
            "Pegging",
            "Pod Development",
            "Maturity"
        ],
        tasks: [
            "Monitor leaf spots.",
            "Maintain adequate moisture during pegging.",
            "Avoid prolonged waterlogging.",
            "Inspect roots and collar for rot."
        ],
        states: [
            "Gujarat",
            "Andhra Pradesh",
            "Tamil Nadu",
            "Karnataka",
            "Maharashtra",
            "Rajasthan",
            "Madhya Pradesh",
            "Uttar Pradesh"
        ],
        diseases: [
            "Early Leaf Spot",
            "Late Leaf Spot",
            "Rust",
            "Wilt",
            "Collar Rot"
        ],
        diseaseSigns: [
            "Circular dark leaf spots",
            "Premature leaf fall",
            "Rust pustules",
            "Wilting plants"
        ]
    },

    soybean: {
        name: "Soybean",
        hindi: "सोयाबीन",
        category: "Oilseed",
        season: "Kharif",
        temperature: [20, 30],
        duration: 100,
        water: "Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "June to July",
        harvest: "September to October",
        yield: "15–25 q/ha",
        irrigation: "Avoid waterlogging; maintain moisture around flowering and pod filling.",
        nutrition: "Use soil-test-based nutrients and suitable rhizobial inoculation.",
        stages: [
            "Germination",
            "Vegetative",
            "Flowering",
            "Pod Formation",
            "Seed Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor defoliating insects.",
            "Inspect leaves for blight.",
            "Avoid waterlogging.",
            "Monitor pod filling."
        ],
        states: [
            "Madhya Pradesh",
            "Maharashtra",
            "Rajasthan",
            "Karnataka",
            "Telangana",
            "Gujarat",
            "Chhattisgarh",
            "Uttar Pradesh"
        ],
        diseases: [
            "Rhizoctonia Blight",
            "Bacterial Pustule",
            "Yellow Mosaic Virus",
            "Charcoal Rot"
        ],
        diseaseSigns: [
            "Brown lesions near soil line",
            "Small yellowish leaf spots",
            "Mosaic symptoms",
            "Wilting under heat/drought stress"
        ]
    },

    sunflower: {
        name: "Sunflower",
        hindi: "सूरजमुखी",
        category: "Oilseed",
        season: "Rabi/Kharif/Zaid",
        temperature: [20, 30],
        duration: 100,
        water: "Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "Season varies by region",
        harvest: "Approximately 90–120 days after sowing",
        yield: "10–20 q/ha",
        irrigation: "Avoid water stress during flowering and seed filling.",
        nutrition: "Balanced nutrition based on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Bud Formation",
            "Flowering",
            "Seed Filling",
            "Maturity"
        ],
        tasks: [
            "Monitor head damage.",
            "Check for Alternaria symptoms.",
            "Maintain moisture during flowering.",
            "Control weeds early."
        ],
        states: [
            "Karnataka",
            "Telangana",
            "Andhra Pradesh",
            "Maharashtra",
            "Haryana",
            "Punjab",
            "Bihar"
        ],
        diseases: [
            "Alternaria Blight",
            "Downy Mildew",
            "Charcoal Rot",
            "Rust"
        ],
        diseaseSigns: [
            "Brown leaf spots",
            "Downy growth",
            "Stem darkening and wilting"
        ]
    },

    sesame: {
        name: "Sesame",
        hindi: "तिल",
        category: "Oilseed",
        season: "Kharif/Zaid",
        temperature: [25, 35],
        duration: 90,
        water: "Low",
        soil: "Well-drained light soil",
        sunlight: "Full Sun",
        sowing: "June to July or region-dependent Zaid sowing",
        harvest: "September to October",
        yield: "5–10 q/ha",
        irrigation: "Sensitive to waterlogging.",
        nutrition: "Balanced nutrition based on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Capsule Formation",
            "Maturity"
        ],
        tasks: [
            "Avoid waterlogging.",
            "Monitor leaf spot.",
            "Control weeds early.",
            "Inspect capsules before maturity."
        ],
        states: [
            "Uttar Pradesh",
            "Rajasthan",
            "Gujarat",
            "Madhya Pradesh",
            "West Bengal",
            "Tamil Nadu",
            "Andhra Pradesh"
        ],
        diseases: [
            "Phyllody",
            "Leaf Spot",
            "Alternaria Blight",
            "Root Rot"
        ],
        diseaseSigns: [
            "Abnormal leafy flower structures",
            "Brown leaf spots",
            "Root/collar damage"
        ]
    },

    cotton: {
        name: "Cotton",
        hindi: "कपास",
        category: "Fiber Crop",
        season: "Kharif",
        temperature: [21, 35],
        duration: 160,
        water: "Moderate to High",
        soil: "Deep well-drained black soil or suitable loam",
        sunlight: "Full Sun",
        sowing: "April to June depending on region",
        harvest: "October to January",
        yield: "15–30 q lint/ha depending on system",
        irrigation: "Important during flowering and boll development; avoid prolonged waterlogging.",
        nutrition: "Balanced NPK and micronutrients based on soil test.",
        stages: [
            "Germination",
            "Seedling",
            "Vegetative",
            "Squaring",
            "Flowering",
            "Boll Development",
            "Boll Opening"
        ],
        tasks: [
            "Monitor bollworm complex.",
            "Check sucking pests.",
            "Monitor leaf curl symptoms.",
            "Maintain suitable soil moisture.",
            "Avoid excessive nitrogen."
        ],
        states: [
            "Gujarat",
            "Maharashtra",
            "Telangana",
            "Andhra Pradesh",
            "Punjab",
            "Haryana",
            "Rajasthan",
            "Madhya Pradesh",
            "Karnataka",
            "Tamil Nadu"
        ],
        diseases: [
            "Cotton Leaf Curl Virus",
            "Bacterial Blight",
            "Fusarium Wilt",
            "Verticillium Wilt",
            "Bollworms"
        ],
        diseaseSigns: [
            "Leaf curling and vein thickening",
            "Angular leaf lesions",
            "Wilting",
            "Boll damage"
        ]
    },

    sugarcane: {
        name: "Sugarcane",
        hindi: "गन्ना",
        category: "Commercial Crop",
        season: "Annual/Perennial",
        temperature: [20, 35],
        duration: 300,
        water: "High",
        soil: "Deep fertile well-drained loam",
        sunlight: "Full Sun",
        sowing: "Region-dependent",
        harvest: "Approximately 10–14 months",
        yield: "Highly variable by variety and management",
        irrigation: "Regular moisture is required; irrigation scheduling depends strongly on soil and rainfall.",
        nutrition: "High nutrient requirement; soil-test-based balanced fertilization.",
        stages: [
            "Germination",
            "Tillering",
            "Grand Growth",
            "Maturity"
        ],
        tasks: [
            "Monitor early shoot damage.",
            "Check for red rot symptoms.",
            "Maintain adequate moisture.",
            "Keep field weed-free during establishment."
        ],
        states: [
            "Uttar Pradesh",
            "Maharashtra",
            "Karnataka",
            "Tamil Nadu",
            "Bihar",
            "Gujarat",
            "Haryana",
            "Punjab",
            "Andhra Pradesh",
            "Telangana"
        ],
        diseases: [
            "Red Rot",
            "Smut",
            "Wilt",
            "Pokkah Boeng",
            "Early Shoot Borer"
        ],
        diseaseSigns: [
            "Reddish internal tissue",
            "Black whip-like smut structure",
            "Leaf twisting and chlorosis",
            "Shoot damage"
        ]
    },

    potato: {
        name: "Potato",
        hindi: "आलू",
        category: "Vegetable/Tuber",
        season: "Rabi",
        temperature: [15, 25],
        duration: 90,
        water: "Moderate",
        soil: "Loose well-drained sandy loam",
        sunlight: "Full Sun",
        sowing: "October to November in major North Indian plains",
        harvest: "January to February",
        yield: "200–350 q/ha depending on variety and management",
        irrigation: "Maintain uniform moisture; avoid waterlogging.",
        nutrition: "Soil-test-based balanced fertilization.",
        stages: [
            "Sprouting",
            "Vegetative",
            "Tuber Initiation",
            "Tuber Bulking",
            "Maturity"
        ],
        tasks: [
            "Monitor late blight under cool humid conditions.",
            "Maintain uniform soil moisture.",
            "Avoid prolonged waterlogging.",
            "Inspect foliage regularly."
        ],
        states: [
            "Uttar Pradesh",
            "West Bengal",
            "Bihar",
            "Punjab",
            "Haryana",
            "Gujarat",
            "Madhya Pradesh",
            "Uttarakhand"
        ],
        diseases: [
            "Late Blight",
            "Early Blight",
            "Bacterial Wilt",
            "Potato Virus Diseases"
        ],
        diseaseSigns: [
            "Dark water-soaked leaf lesions",
            "Concentric brown leaf spots",
            "Sudden wilting",
            "Mosaic/curling symptoms"
        ]
    },

    tomato: {
        name: "Tomato",
        hindi: "टमाटर",
        category: "Vegetable",
        season: "Rabi/Kharif/Region Dependent",
        temperature: [18, 30],
        duration: 90,
        water: "Moderate",
        soil: "Well-drained fertile loam",
        sunlight: "Full Sun",
        sowing: "Season varies by region",
        harvest: "60–90 days after transplanting",
        yield: "300–800 q/ha depending on variety and production system",
        irrigation: "Regular moisture; avoid wet foliage and waterlogging.",
        nutrition: "Balanced nutrition, especially potassium during fruit development.",
        stages: [
            "Nursery",
            "Transplanting",
            "Vegetative",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Harvest"
        ],
        tasks: [
            "Monitor leaf curl and whiteflies.",
            "Inspect for early and late blight.",
            "Avoid waterlogging.",
            "Use staking/support where appropriate."
        ],
        states: [
            "Andhra Pradesh",
            "Madhya Pradesh",
            "Karnataka",
            "Odisha",
            "West Bengal",
            "Bihar",
            "Maharashtra",
            "Uttar Pradesh",
            "Gujarat",
            "Tamil Nadu"
        ],
        diseases: [
            "Early Blight",
            "Late Blight",
            "Bacterial Wilt",
            "Tomato Leaf Curl Virus",
            "Powdery Mildew"
        ],
        diseaseSigns: [
            "Concentric brown leaf spots",
            "Dark water-soaked lesions",
            "Sudden wilting",
            "Leaf curling and yellowing"
        ]
    },

    onion: {
        name: "Onion",
        hindi: "प्याज",
        category: "Vegetable",
        season: "Rabi/Kharif",
        temperature: [13, 25],
        duration: 120,
        water: "Moderate",
        soil: "Well-drained sandy loam",
        sunlight: "Full Sun",
        sowing: "Season varies by region",
        harvest: "Approximately 100–150 days",
        yield: "250–500 q/ha depending on crop and variety",
        irrigation: "Regular but light irrigation; stop near maturity as locally recommended.",
        nutrition: "Balanced NPK and micronutrients based on soil test.",
        stages: [
            "Nursery",
            "Transplanting",
            "Vegetative",
            "Bulb Formation",
            "Bulb Enlargement",
            "Maturity"
        ],
        tasks: [
            "Monitor thrips.",
            "Check for purple blotch.",
            "Avoid excessive moisture.",
            "Ensure good field drainage."
        ],
        states: [
            "Maharashtra",
            "Karnataka",
            "Madhya Pradesh",
            "Gujarat",
            "Rajasthan",
            "Bihar",
            "Uttar Pradesh",
            "Andhra Pradesh"
        ],
        diseases: [
            "Purple Blotch",
            "Downy Mildew",
            "Basal Rot",
            "Thrips"
        ],
        diseaseSigns: [
            "Purple/brown lesions",
            "Downy growth",
            "Bulb/root rot",
            "Silvery leaf damage"
        ]
    },

    chilli: {
        name: "Chilli",
        hindi: "मिर्च",
        category: "Spice/Vegetable",
        season: "Kharif/Rabi/Region Dependent",
        temperature: [18, 32],
        duration: 150,
        water: "Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "Season varies by region",
        harvest: "Approximately 4–6 months",
        yield: "Highly variable by variety and system",
        irrigation: "Avoid both drought stress and waterlogging.",
        nutrition: "Balanced nutrients based on soil test.",
        stages: [
            "Nursery",
            "Transplanting",
            "Vegetative",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Harvest"
        ],
        tasks: [
            "Monitor thrips and mites.",
            "Check for leaf curl virus.",
            "Avoid waterlogging.",
            "Inspect fruits for rot."
        ],
        states: [
            "Andhra Pradesh",
            "Telangana",
            "Karnataka",
            "Madhya Pradesh",
            "Maharashtra",
            "Tamil Nadu",
            "Odisha",
            "Rajasthan"
        ],
        diseases: [
            "Leaf Curl Virus",
            "Anthracnose/Fruit Rot",
            "Damping Off",
            "Powdery Mildew",
            "Thrips"
        ],
        diseaseSigns: [
            "Leaf curling",
            "Sunken dark fruit lesions",
            "Seedling collapse",
            "White powdery growth"
        ]
    },

    turmeric: {
        name: "Turmeric",
        hindi: "हल्दी",
        category: "Spice",
        season: "Kharif",
        temperature: [20, 35],
        duration: 240,
        water: "Moderate to High",
        soil: "Well-drained loam rich in organic matter",
        sunlight: "Partial to Full Sun",
        sowing: "April to June",
        harvest: "January to March",
        yield: "200–300 q/ha fresh rhizomes depending on variety",
        irrigation: "Regular moisture but good drainage is essential.",
        nutrition: "Organic matter and balanced nutrients based on soil test.",
        stages: [
            "Sprouting",
            "Vegetative",
            "Rhizome Development",
            "Maturity"
        ],
        tasks: [
            "Maintain drainage.",
            "Monitor rhizome rot.",
            "Mulching may help conserve moisture.",
            "Inspect leaves for leaf spot."
        ],
        states: [
            "Telangana",
            "Andhra Pradesh",
            "Tamil Nadu",
            "Maharashtra",
            "Odisha",
            "Karnataka",
            "West Bengal",
            "Kerala"
        ],
        diseases: [
            "Rhizome Rot",
            "Leaf Spot",
            "Leaf Blotch"
        ],
        diseaseSigns: [
            "Soft rotting rhizomes",
            "Brown leaf spots",
            "Leaf yellowing"
        ]
    },

    ginger: {
        name: "Ginger",
        hindi: "अदरक",
        category: "Spice",
        season: "Kharif",
        temperature: [20, 30],
        duration: 240,
        water: "High",
        soil: "Well-drained rich loam",
        sunlight: "Partial Shade to Sun",
        sowing: "April to June",
        harvest: "December to January",
        yield: "150–250 q/ha fresh rhizomes",
        irrigation: "Requires regular moisture and excellent drainage.",
        nutrition: "Organic matter and balanced nutrients.",
        stages: [
            "Sprouting",
            "Vegetative",
            "Rhizome Development",
            "Maturity"
        ],
        tasks: [
            "Prevent waterlogging.",
            "Monitor rhizome rot.",
            "Maintain mulch and soil moisture.",
            "Inspect leaves for spot diseases."
        ],
        states: [
            "Kerala",
            "Karnataka",
            "Meghalaya",
            "Sikkim",
            "Assam",
            "Arunachal Pradesh",
            "Odisha",
            "West Bengal"
        ],
        diseases: [
            "Soft Rot",
            "Bacterial Wilt",
            "Leaf Spot",
            "Rhizome Rot"
        ],
        diseaseSigns: [
            "Soft rotting rhizomes",
            "Sudden wilt",
            "Brown leaf spots"
        ]
    },

    coriander: {
        name: "Coriander",
        hindi: "धनिया",
        category: "Spice",
        season: "Rabi",
        temperature: [15, 25],
        duration: 100,
        water: "Low to Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "October to November",
        harvest: "January to March",
        yield: "Highly variable depending on leaf/seed production",
        irrigation: "Light irrigation as required; avoid waterlogging.",
        nutrition: "Balanced fertilizer based on soil test.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Seed Formation",
            "Maturity"
        ],
        tasks: [
            "Monitor powdery mildew.",
            "Maintain drainage.",
            "Control weeds.",
            "Avoid excessive irrigation."
        ],
        states: [
            "Rajasthan",
            "Madhya Pradesh",
            "Gujarat",
            "Uttar Pradesh",
            "Andhra Pradesh",
            "Telangana"
        ],
        diseases: [
            "Powdery Mildew",
            "Wilt",
            "Stem Gall",
            "Aphids"
        ],
        diseaseSigns: [
            "White powdery coating",
            "Wilting",
            "Abnormal stem swelling",
            "Aphid colonies"
        ]
    },

    cumin: {
        name: "Cumin",
        hindi: "जीरा",
        category: "Spice",
        season: "Rabi",
        temperature: [15, 25],
        duration: 110,
        water: "Low",
        soil: "Well-drained light soil",
        sunlight: "Full Sun",
        sowing: "October to November",
        harvest: "February to March",
        yield: "5–10 q/ha",
        irrigation: "Light irrigation; excess humidity and water can increase disease risk.",
        nutrition: "Balanced soil-test-based nutrition.",
        stages: [
            "Germination",
            "Vegetative",
            "Branching",
            "Flowering",
            "Seed Formation",
            "Maturity"
        ],
        tasks: [
            "Monitor wilt.",
            "Watch for blight under humid conditions.",
            "Avoid excess irrigation.",
            "Ensure field drainage."
        ],
        states: [
            "Gujarat",
            "Rajasthan",
            "Madhya Pradesh",
            "Uttar Pradesh"
        ],
        diseases: [
            "Fusarium Wilt",
            "Alternaria Blight",
            "Powdery Mildew"
        ],
        diseaseSigns: [
            "Sudden wilting",
            "Dark leaf spots",
            "White powdery coating"
        ]
    },

    mango: {
        name: "Mango",
        hindi: "आम",
        category: "Fruit",
        season: "Perennial",
        temperature: [20, 35],
        duration: 365,
        water: "Moderate",
        soil: "Deep well-drained loam",
        sunlight: "Full Sun",
        sowing: "Planting season is region and planting-material dependent",
        harvest: "Usually seasonal; variety and region dependent",
        yield: "Highly variable",
        irrigation: "Young trees need regular moisture; mature trees require stage-specific irrigation.",
        nutrition: "Soil-test-based orchard nutrition plus organic matter.",
        stages: [
            "Vegetative Growth",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Maturity"
        ],
        tasks: [
            "Monitor flowering and fruit set.",
            "Inspect for hopper and powdery mildew.",
            "Maintain orchard sanitation.",
            "Avoid excessive nitrogen around flowering."
        ],
        states: [
            "Uttar Pradesh",
            "Andhra Pradesh",
            "Telangana",
            "Maharashtra",
            "Gujarat",
            "Bihar",
            "West Bengal",
            "Karnataka",
            "Tamil Nadu",
            "Jharkhand"
        ],
        diseases: [
            "Powdery Mildew",
            "Anthracnose",
            "Dieback",
            "Mango Malformation",
            "Mango Hopper"
        ],
        diseaseSigns: [
            "White powdery growth on flowers",
            "Dark fruit/leaf lesions",
            "Drying branches",
            "Abnormal compact flowering"
        ]
    },

    banana: {
        name: "Banana",
        hindi: "केला",
        category: "Fruit",
        season: "Perennial",
        temperature: [20, 35],
        duration: 300,
        water: "High",
        soil: "Deep fertile well-drained soil",
        sunlight: "Full Sun",
        sowing: "Planting time depends on region and irrigation",
        harvest: "Approximately 10–14 months depending on cultivar",
        yield: "Highly variable",
        irrigation: "Regular moisture is required; drainage is essential.",
        nutrition: "High nutrient requirement; soil-test-based balanced nutrition.",
        stages: [
            "Establishment",
            "Vegetative Growth",
            "Flowering",
            "Bunch Development",
            "Maturity"
        ],
        tasks: [
            "Maintain regular moisture.",
            "Monitor Panama wilt and Sigatoka.",
            "Remove severely diseased material according to local recommendations.",
            "Maintain good drainage."
        ],
        states: [
            "Tamil Nadu",
            "Maharashtra",
            "Gujarat",
            "Andhra Pradesh",
            "Karnataka",
            "Kerala",
            "Bihar",
            "Uttar Pradesh",
            "West Bengal"
        ],
        diseases: [
            "Panama Wilt",
            "Sigatoka Leaf Spot",
            "Bunchy Top Virus",
            "Anthracnose"
        ],
        diseaseSigns: [
            "Yellowing and wilting",
            "Dark leaf streaks",
            "Stunted bunchy leaves",
            "Fruit lesions"
        ]
    },

    guava: {
        name: "Guava",
        hindi: "अमरूद",
        category: "Fruit",
        season: "Perennial",
        temperature: [20, 32],
        duration: 365,
        water: "Moderate",
        soil: "Well-drained loam",
        sunlight: "Full Sun",
        sowing: "Planting time depends on region",
        harvest: "Season varies by region and crop cycle",
        yield: "Highly variable",
        irrigation: "Regular irrigation during establishment and fruit development.",
        nutrition: "Balanced orchard nutrition based on soil test.",
        stages: [
            "Vegetative Growth",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Maturity"
        ],
        tasks: [
            "Monitor fruit fly.",
            "Inspect fruits for anthracnose.",
            "Maintain orchard sanitation.",
            "Remove diseased fruits."
        ],
        states: [
            "Uttar Pradesh",
            "Bihar",
            "Madhya Pradesh",
            "Rajasthan",
            "Maharashtra",
            "Andhra Pradesh",
            "Karnataka",
            "Gujarat"
        ],
        diseases: [
            "Anthracnose",
            "Wilt",
            "Fruit Fly",
            "Canker"
        ],
        diseaseSigns: [
            "Dark fruit lesions",
            "Wilting",
            "Fruit puncture and maggot damage",
            "Canker lesions"
        ]
    },

    watermelon: {
        name: "Watermelon",
        hindi: "तरबूज",
        category: "Fruit",
        season: "Zaid",
        temperature: [22, 35],
        duration: 90,
        water: "Moderate",
        soil: "Sandy loam",
        sunlight: "Full Sun",
        sowing: "January to March depending on region",
        harvest: "April to June",
        yield: "300–500 q/ha depending on variety",
        irrigation: "Regular moisture during fruit development; avoid excessive water.",
        nutrition: "Balanced nutrition based on soil test.",
        stages: [
            "Germination",
            "Vine Growth",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Maturity"
        ],
        tasks: [
            "Monitor powdery/downy mildew.",
            "Check for fruit flies.",
            "Avoid waterlogging.",
            "Maintain moisture during fruit growth."
        ],
        states: [
            "Uttar Pradesh",
            "Rajasthan",
            "Punjab",
            "Haryana",
            "Bihar",
            "Madhya Pradesh",
            "Maharashtra",
            "Karnataka",
            "Gujarat"
        ],
        diseases: [
            "Downy Mildew",
            "Powdery Mildew",
            "Fusarium Wilt",
            "Anthracnose",
            "Fruit Fly"
        ],
        diseaseSigns: [
            "Yellow leaf patches",
            "White powdery growth",
            "Wilting vines",
            "Fruit lesions"
        ]
    },

    apple: {
        name: "Apple",
        hindi: "सेब",
        category: "Fruit",
        season: "Perennial",
        temperature: [5, 24],
        duration: 365,
        water: "Moderate",
        soil: "Deep well-drained loam",
        sunlight: "Full Sun",
        sowing: "Planting depends on region and rootstock",
        harvest: "Usually summer/autumn depending on variety and region",
        yield: "Highly variable",
        irrigation: "Regular orchard moisture with good drainage.",
        nutrition: "Orchard soil-test-based nutrition.",
        stages: [
            "Dormancy",
            "Bud Break",
            "Flowering",
            "Fruit Set",
            "Fruit Development",
            "Maturity"
        ],
        tasks: [
            "Monitor scab symptoms.",
            "Monitor woolly aphid and other pests.",
            "Maintain orchard sanitation.",
            "Follow local chilling and variety requirements."
        ],
        states: [
            "Jammu and Kashmir",
            "Himachal Pradesh",
            "Uttarakhand",
            "Arunachal Pradesh"
        ],
        diseases: [
            "Apple Scab",
            "Powdery Mildew",
            "Fire Blight",
            "Canker"
        ],
        diseaseSigns: [
            "Olive-brown leaf lesions",
            "White powdery growth",
            "Blossom/branch blackening",
            "Canker lesions"
        ]
    },

    tea: {
        name: "Tea",
        hindi: "चाय",
        category: "Plantation Crop",
        season: "Perennial",
        temperature: [18, 30],
        duration: 365,
        water: "High",
        soil: "Acidic, well-drained soil rich in organic matter",
        sunlight: "Partial to Full Sun",
        sowing: "Planting is region and nursery dependent",
        harvest: "Regular plucking after establishment",
        yield: "Highly variable",
        irrigation: "Requires adequate moisture and suitable humidity.",
        nutrition: "Soil-test-based acidic-soil nutrient management.",
        stages: [
            "Establishment",
            "Vegetative Growth",
            "Flush Development",
            "Plucking"
        ],
        tasks: [
            "Monitor tea mosquito bug.",
            "Inspect leaves for blister blight.",
            "Maintain drainage.",
            "Maintain soil organic matter."
        ],
        states: [
            "Assam",
            "West Bengal",
            "Tamil Nadu",
            "Kerala",
            "Karnataka",
            "Himachal Pradesh",
            "Uttarakhand"
        ],
        diseases: [
            "Blister Blight",
            "Red Rust",
            "Root Rot",
            "Tea Mosquito Bug"
        ],
        diseaseSigns: [
            "Blister-like lesions on leaves",
            "Rust-colored leaf patches",
            "Root decline",
            "Leaf/young shoot damage"
        ]
    },

    coffee: {
        name: "Coffee",
        hindi: "कॉफी",
        category: "Plantation Crop",
        season: "Perennial",
        temperature: [18, 28],
        duration: 365,
        water: "Moderate to High",
        soil: "Deep well-drained acidic loam",
        sunlight: "Partial Shade",
        sowing: "Planting is region dependent",
        harvest: "Season varies by region and species",
        yield: "Highly variable",
        irrigation: "Adequate moisture with good drainage.",
        nutrition: "Soil-test-based orchard nutrition.",
        stages: [
            "Establishment",
            "Vegetative Growth",
            "Flowering",
            "Berry Development",
            "Maturity"
        ],
        tasks: [
            "Monitor coffee berry borer.",
            "Check for leaf rust.",
            "Maintain shade and soil moisture.",
            "Ensure drainage."
        ],
        states: [
            "Karnataka",
            "Kerala",
            "Tamil Nadu",
            "Andhra Pradesh",
            "Odisha"
        ],
        diseases: [
            "Coffee Leaf Rust",
            "Root Rot",
            "Berry Disease",
            "Coffee Berry Borer"
        ],
        diseaseSigns: [
            "Orange rust pustules",
            "Leaf yellowing and premature fall",
            "Berry damage",
            "Root decline"
        ]
    }
};


// ============================================================
// STATE
// ============================================================

let currentLocation = null;
let currentWeather = null;
let locationDetails = null;


// ============================================================
// DOM ELEMENTS
// ============================================================

const cropSelect = document.getElementById("cropSelect");
const locationInput = document.getElementById("locationInput");
const sowingDate = document.getElementById("sowingDate");

const locationBtn = document.getElementById("locationBtn");
const searchBtn = document.getElementById("searchBtn");
const advisoryBtn = document.getElementById("advisoryBtn");


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadCrops();

    if (sowingDate) {
        const today = new Date();

        const localDate =
            new Date(
                today.getTime() -
                today.getTimezoneOffset() * 60000
            )
                .toISOString()
                .split("T")[0];

        sowingDate.value = localDate;
    }

    console.log("Agricultural Advisory System loaded.");
    console.log("Crop database:", Object.keys(CROPS).length, "crops");

});


// ============================================================
// LOAD CROPS
// ============================================================

function loadCrops() {

    if (!cropSelect) return;

    cropSelect.innerHTML =
        `<option value="">Select a crop</option>`;

    Object.keys(CROPS).forEach(key => {

        const crop = CROPS[key];

        const option =
            document.createElement("option");

        option.value = key;

        option.textContent =
            `${crop.name} — ${crop.hindi}`;

        cropSelect.appendChild(option);

    });

}


// ============================================================
// CURRENT LOCATION
// ============================================================

function getCurrentLocation() {

    console.log("Current Location button clicked");

    if (!navigator.geolocation) {

        showMessage(
            "❌ Your browser does not support location access.",
            "error"
        );

        return;
    }

    showMessage(
        "📍 Getting your current location...",
        "info"
    );

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            currentLocation = {
                latitude,
                longitude
            };

            setText(
                "coordinates",
                `Latitude: ${latitude.toFixed(6)} | Longitude: ${longitude.toFixed(6)}`
            );

            loadWeather(
                latitude,
                longitude
            );

            reverseGeocode(
                latitude,
                longitude
            );

        },

        error => {

            console.error(
                "Location error:",
                error
            );

            let message =
                "Unable to get your location.";

            if (error.code === 1) {

                message =
                    "❌ Location permission denied. Allow location access in Chrome.";

            } else if (error.code === 2) {

                message =
                    "❌ Location unavailable. Check Windows Location Services.";

            } else if (error.code === 3) {

                message =
                    "❌ Location request timed out. Try again.";

            }

            showMessage(
                message,
                "error"
            );

        },

        {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 300000
        }

    );

}


// ============================================================
// SEARCH LOCATION
// ============================================================

async function searchLocation() {

    if (!locationInput) return;

    const query =
        locationInput.value.trim();

    if (!query) {

        showMessage(
            "Please enter a village, city, district, state or PIN code.",
            "error"
        );

        return;
    }

    try {

        showMessage(
            "🔎 Searching location...",
            "info"
        );

        const url =
            `${GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json&countryCode=IN`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Geocoding request failed");
        }

        const data =
            await response.json();

        if (
            !data.results ||
            data.results.length === 0
        ) {

            showMessage(
                "❌ Location not found. Try a city, village, district or PIN code.",
                "error"
            );

            return;
        }

        const result =
            data.results[0];

        currentLocation = {
            latitude: result.latitude,
            longitude: result.longitude
        };

        setText(
            "coordinates",
            `Latitude: ${result.latitude.toFixed(6)} | Longitude: ${result.longitude.toFixed(6)}`
        );

        await loadWeather(
            result.latitude,
            result.longitude
        );

        await reverseGeocode(
            result.latitude,
            result.longitude
        );

        showMessage(
            "✅ Location loaded successfully.",
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "❌ Unable to search this location.",
            "error"
        );

    }

}


// ============================================================
// REVERSE GEOCODING
// ============================================================

async function reverseGeocode(
    latitude,
    longitude
) {

    try {

        const url =
            `${REVERSE_GEO_API}?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`;

        const response =
            await fetch(url, {
                headers: {
                    "Accept": "application/json"
                }
            });

        if (!response.ok) {
            throw new Error(
                "Reverse geocoding failed"
            );
        }

        const data =
            await response.json();

        const address =
            data.address || {};

        locationDetails = {
            house: address.house || "",
            road: address.road || "",
            village: address.village || "",
            town: address.town || "",
            city: address.city || "",
            district: address.state_district || address.district || "",
            state: address.state || "",
            country: address.country || "",
            postcode: address.postcode || ""
        };

        updateLocationDisplay();

    } catch (error) {

        console.error(
            "Reverse geocoding error:",
            error
        );

        if (!locationDetails) {

            locationDetails = {
                state: "",
                country: "",
                postcode: ""
            };

        }

        updateLocationDisplay();

    }

}


// ============================================================
// LOCATION DISPLAY
// ============================================================

function updateLocationDisplay() {

    if (!locationDetails) return;

    const parts = [];

    if (locationDetails.village)
        parts.push(locationDetails.village);

    if (locationDetails.town)
        parts.push(locationDetails.town);

    if (locationDetails.city)
        parts.push(locationDetails.city);

    if (locationDetails.district)
        parts.push(locationDetails.district);

    if (locationDetails.state)
        parts.push(locationDetails.state);

    if (locationDetails.country)
        parts.push(locationDetails.country);

    const uniqueParts =
        [...new Set(parts.filter(Boolean))];

    const fullName =
        uniqueParts.join(", ");

    setText(
        "locationName",
        fullName || "Location detected"
    );

    const pin =
        locationDetails.postcode ||
        "PIN unavailable";

    if (currentLocation) {

        setText(
            "coordinates",
            `PIN: ${pin} | Latitude: ${currentLocation.latitude.toFixed(6)} | Longitude: ${currentLocation.longitude.toFixed(6)}`
        );

    }

}


// ============================================================
// WEATHER
// ============================================================

async function loadWeather(
    latitude,
    longitude
) {

    try {

        const params = new URLSearchParams({

            latitude,
            longitude,

            current: [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m"
            ].join(","),

            daily: [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "wind_speed_10m_max",
                "sunrise",
                "sunset"
            ].join(","),

            timezone: "auto",

            forecast_days: 7

        });

        const response =
            await fetch(
                `${WEATHER_API}?${params.toString()}`
            );

        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const data =
            await response.json();

        currentWeather = data;

        renderCurrentWeather(data);

        renderForecast(data);

        renderWeatherAlerts(data);

        const now =
            new Date();

        setText(
            "lastUpdated",
            `Last updated: ${now.toLocaleString()}`
        );

    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showMessage(
            "❌ Weather data could not be loaded.",
            "error"
        );

    }

}


// ============================================================
// WEATHER CODE
// ============================================================

function weatherInfo(code) {

    const map = {

        0: ["☀️", "Clear sky"],

        1: ["🌤️", "Mainly clear"],
        2: ["⛅", "Partly cloudy"],
        3: ["☁️", "Overcast"],

        45: ["🌫️", "Fog"],
        48: ["🌫️", "Rime fog"],

        51: ["🌦️", "Light drizzle"],
        53: ["🌦️", "Moderate drizzle"],
        55: ["🌧️", "Dense drizzle"],

        61: ["🌦️", "Light rain"],
        63: ["🌧️", "Moderate rain"],
        65: ["🌧️", "Heavy rain"],

        71: ["🌨️", "Light snow"],
        73: ["🌨️", "Moderate snow"],
        75: ["❄️", "Heavy snow"],

        80: ["🌦️", "Rain showers"],
        81: ["🌧️", "Moderate rain showers"],
        82: ["⛈️", "Violent rain showers"],

        95: ["⛈️", "Thunderstorm"],
        96: ["⛈️", "Thunderstorm with hail"],
        99: ["⛈️", "Severe thunderstorm"]

    };

    return (
        map[code] ||
        ["🌦️", "Unknown weather"]
    );

}


// ============================================================
// CURRENT WEATHER UI
// ============================================================

function renderCurrentWeather(data) {

    const current =
        data.current;

    const info =
        weatherInfo(
            current.weather_code
        );

    setText(
        "weatherIcon",
        info[0]
    );

    setText(
        "currentTemp",
        `${Math.round(current.temperature_2m)}°C`
    );

    setText(
        "weatherDescription",
        info[1]
    );

    setText(
        "humidity",
        `${Math.round(current.relative_humidity_2m)}%`
    );

    setText(
        "rainfall",
        `${Number(current.precipitation || 0).toFixed(1)} mm`
    );

    setText(
        "wind",
        `${Math.round(current.wind_speed_10m)} km/h`
    );

    setText(
        "feelsLike",
        `${Math.round(current.apparent_temperature)}°C`
    );

}


// ============================================================
// 7-DAY FORECAST
// ============================================================

function renderForecast(data) {

    const container =
        document.getElementById(
            "forecastContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    const daily =
        data.daily;

    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const info =
            weatherInfo(
                daily.weather_code[i]
            );

        const date =
            new Date(
                daily.time[i] + "T12:00:00"
            );

        const day =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                }
            );

        const card =
            document.createElement("div");

        card.className =
            "forecast-card";

        card.innerHTML = `

            <div class="forecast-day">
                ${day}
            </div>

            <div class="forecast-icon">
                ${info[0]}
            </div>

            <div class="forecast-desc">
                ${info[1]}
            </div>

            <div class="forecast-temp">
                <strong>
                    ${Math.round(daily.temperature_2m_max[i])}°C
                </strong>
                /
                ${Math.round(daily.temperature_2m_min[i])}°C
            </div>

            <div>
                🌧️
                ${Math.round(
                    daily.precipitation_probability_max[i] || 0
                )}%
            </div>

            <div>
                💧
                ${Number(
                    daily.precipitation_sum[i] || 0
                ).toFixed(1)} mm
            </div>

        `;

        container.appendChild(card);

    }

}


// ============================================================
// WEATHER ALERTS
// ============================================================

function renderWeatherAlerts(data) {

    const container =
        document.getElementById(
            "weatherAlerts"
        );

    if (!container) return;

    container.innerHTML = "";

    const alerts = [];

    const current =
        data.current;

    const daily =
        data.daily;

    const temp =
        current.temperature_2m;

    const maxRain =
        Math.max(
            ...daily.precipitation_probability_max
                .map(Number)
        );

    const maxWind =
        Math.max(
            ...daily.wind_speed_10m_max
                .map(Number)
        );

    if (temp >= 38) {

        alerts.push(
            "🔥 High temperature. Monitor crop heat stress and soil moisture."
        );

    }

    if (temp <= 5) {

        alerts.push(
            "🥶 Low temperature. Sensitive crops may require protection."
        );

    }

    if (maxRain >= 70) {

        alerts.push(
            "🌧️ High rainfall probability in the forecast period."
        );

    }

    if (maxWind >= 35) {

        alerts.push(
            "💨 Strong wind is possible. Check vulnerable crops and structures."
        );

    }

    if (alerts.length === 0) {

        alerts.push(
            "✅ No major automatic weather alert detected."
        );

    }

    alerts.forEach(alert => {

        const div =
            document.createElement("div");

        div.className =
            "weather-alert";

        div.textContent =
            alert;

        container.appendChild(div);

    });

}


// ============================================================
// GENERATE ADVISORY
// ============================================================

function generateAdvisory() {

    if (!cropSelect) return;

    const cropKey =
        cropSelect.value;

    if (!cropKey) {

        showMessage(
            "Please select a crop first.",
            "error"
        );

        return;
    }

    const crop =
        CROPS[cropKey];

    const section =
        document.getElementById(
            "advisorySection"
        );

    if (section) {

        section.style.display =
            "block";

    }

    renderCropInformation(crop);

    calculateHarvest(crop);

    if (currentWeather) {

        calculateSuitability(crop);

    } else {

        showNoWeatherSuitability(crop);

    }

    renderTasks(crop);

    renderExtraCropDetails(crop);

    renderDiseaseInformation(crop);

    showMessage(
        "✅ Crop advisory generated.",
        "success"
    );

    if (section) {

        setTimeout(() => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }

}


// ============================================================
// CROP INFORMATION
// ============================================================

function renderCropInformation(crop) {

    setText(
        "cropCategory",
        crop.category
    );

    setText(
        "cropName",
        crop.name
    );

    setText(
        "cropHindi",
        crop.hindi
    );

    setText(
        "cropSeason",
        crop.season
    );

    setText(
        "cropSoil",
        crop.soil
    );

    setText(
        "cropTemp",
        `${crop.temperature[0]}°C – ${crop.temperature[1]}°C`
    );

    setText(
        "cropWater",
        crop.water
    );

    setText(
        "cropSunlight",
        crop.sunlight
    );

    setText(
        "cropSowing",
        crop.sowing
    );

    setText(
        "cropDuration",
        `${crop.duration} days approx.`
    );

    setText(
        "cropHarvest",
        crop.harvest
    );

    const stages =
        document.getElementById(
            "growthStages"
        );

    if (stages) {

        stages.innerHTML = "";

        crop.stages.forEach(
            (stage, index) => {

                const div =
                    document.createElement("div");

                div.className =
                    "growth-stage";

                div.innerHTML = `
                    <span>${index + 1}</span>
                    <strong>${stage}</strong>
                `;

                stages.appendChild(div);

            }
        );

    }

}


// ============================================================
// HARVEST CALCULATION
// ============================================================

function calculateHarvest(crop) {

    if (
        !sowingDate ||
        !sowingDate.value
    ) {

        setText(
            "harvestDate",
            "Select sowing date"
        );

        setText(
            "daysRemaining",
            "--"
        );

        return;

    }

    const start =
        new Date(
            `${sowingDate.value}T12:00:00`
        );

    if (isNaN(start.getTime())) return;

    const harvest =
        new Date(start);

    harvest.setDate(
        harvest.getDate() +
        crop.duration
    );

    const today =
        new Date();

    today.setHours(
        12,
        0,
        0,
        0
    );

    const difference =
        Math.ceil(
            (
                harvest.getTime() -
                today.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );

    setText(
        "harvestDate",
        harvest.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
    );

    if (difference > 0) {

        setText(
            "daysRemaining",
            `${difference} days remaining`
        );

    } else {

        setText(
            "daysRemaining",
            "Estimated harvest date reached"
        );

    }

    calculateGrowthStage(
        crop,
        start
    );

}


// ============================================================
// GROWTH STAGE
// ============================================================

function calculateGrowthStage(
    crop,
    start
) {

    const today =
        new Date();

    const elapsed =
        Math.floor(
            (
                today.getTime() -
                start.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );

    let stageIndex = 0;

    if (elapsed > 0) {

        stageIndex =
            Math.floor(
                (
                    elapsed /
                    crop.duration
                ) *
                crop.stages.length
            );

    }

    stageIndex =
        Math.max(
            0,
            Math.min(
                crop.stages.length - 1,
                stageIndex
            )
        );

    setText(
        "currentStage",
        crop.stages[stageIndex]
    );

}


// ============================================================
// IMPROVED CROP SUITABILITY
// ============================================================

function calculateSuitability(crop) {

    if (!currentWeather) return;

    const current =
        currentWeather.current;

    const daily =
        currentWeather.daily;

    const currentTemp =
        Number(
            current.temperature_2m
        );

    const rainProbability =
        Math.max(
            ...daily.precipitation_probability_max
                .map(Number)
        );

    const currentMonth =
        new Date().getMonth() + 1;

    const state =
        locationDetails &&
        locationDetails.state
            ? locationDetails.state
            : "";

    // --------------------------------------------------------
    // 1. TEMPERATURE SCORE - 35
    // --------------------------------------------------------

    const minTemp =
        crop.temperature[0];

    const maxTemp =
        crop.temperature[1];

    let temperatureScore = 0;

    if (
        currentTemp >= minTemp &&
        currentTemp <= maxTemp
    ) {

        temperatureScore = 35;

    } else {

        const distance =
            currentTemp < minTemp
                ? minTemp - currentTemp
                : currentTemp - maxTemp;

        if (distance <= 2) {

            temperatureScore = 28;

        } else if (distance <= 5) {

            temperatureScore = 20;

        } else if (distance <= 8) {

            temperatureScore = 10;

        } else {

            temperatureScore = 0;

        }

    }


    // --------------------------------------------------------
    // 2. RAINFALL / MOISTURE SCORE - 20
    // --------------------------------------------------------

    let rainScore = 10;

    const water =
        crop.water.toLowerCase();

    if (water.includes("high")) {

        if (rainProbability >= 50) {

            rainScore = 20;

        } else if (rainProbability >= 25) {

            rainScore = 14;

        } else {

            rainScore = 7;

        }

    } else if (
        water.includes("low")
    ) {

        if (rainProbability <= 40) {

            rainScore = 20;

        } else if (rainProbability <= 65) {

            rainScore = 13;

        } else {

            rainScore = 5;

        }

    } else {

        if (
            rainProbability >= 20 &&
            rainProbability <= 65
        ) {

            rainScore = 20;

        } else if (
            rainProbability < 20
        ) {

            rainScore = 12;

        } else {

            rainScore = 8;

        }

    }


    // --------------------------------------------------------
    // 3. SEASON / MONTH SCORE - 25
    // --------------------------------------------------------

    const seasonFit =
        getSeasonFit(
            crop,
            currentMonth
        );

    let monthScore = 0;

    if (seasonFit === "excellent") {

        monthScore = 25;

    } else if (
        seasonFit === "acceptable"
    ) {

        monthScore = 16;

    } else if (
        seasonFit === "perennial"
    ) {

        monthScore = 18;

    } else {

        monthScore = 4;

    }


    // --------------------------------------------------------
    // 4. LOCATION / STATE SCORE - 20
    // --------------------------------------------------------

    const stateResult =
        getStateSuitability(
            crop,
            state
        );

    let locationScore =
        stateResult.score;


    // --------------------------------------------------------
    // RAW SCORE
    // --------------------------------------------------------

    let safety =
        temperatureScore +
        rainScore +
        monthScore +
        locationScore;

    safety =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    safety
                )
            )
        );


    // --------------------------------------------------------
    // IMPORTANT CROP-SPECIFIC PENALTIES
    // --------------------------------------------------------

    // If crop is clearly outside its major season,
    // prevent an unrealistically high score.
    if (
        seasonFit === "poor" &&
        crop.season !== "Perennial"
    ) {

        safety =
            Math.min(
                safety,
                49
            );

    }


    // If temperature is strongly outside crop range,
    // score should not remain artificially high.
    if (
        currentTemp <
        minTemp - 8 ||
        currentTemp >
        maxTemp + 8
    ) {

        safety =
            Math.min(
                safety,
                35
            );

    }


    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    let status = "";
    let risk = "";
    let recommendation = "";

    if (safety >= 80) {

        status =
            "Highly Suitable";

        risk =
            "Low";

        recommendation =
            "Current weather, season and regional conditions are comparatively favorable.";

    } else if (safety >= 65) {

        status =
            "Suitable";

        risk =
            "Low to Moderate";

        recommendation =
            "The crop can be considered, but monitor weather and crop-specific risks.";

    } else if (safety >= 50) {

        status =
            "Can Grow With Risk";

        risk =
            "Moderate";

        recommendation =
            "Some important conditions are not ideal. Check irrigation, temperature, season and local recommendations.";

    } else {

        status =
            "Not Preferred";

        risk =
            "High";

        recommendation =
            "Current conditions are not a good match for this crop. Consider the recommended season or another suitable crop.";

    }


    // --------------------------------------------------------
    // EXISTING UI
    // --------------------------------------------------------

    setText(
        "suitabilityScore",
        `${safety}%`
    );

    const suitabilityBar =
        document.getElementById(
            "suitabilityBar"
        );

    if (suitabilityBar) {

        suitabilityBar.style.width =
            `${safety}%`;

    }

    setText(
        "suitabilityStatus",
        status
    );


    let suitabilityMessage = "";

    if (safety >= 80) {

        suitabilityMessage =
            `✅ ${crop.name} is currently showing favorable conditions for this location. Temperature, expected rainfall, season and regional suitability are comparatively aligned.`;

    } else if (safety >= 65) {

        suitabilityMessage =
            `🟢 ${crop.name} is reasonably suitable, but continue monitoring temperature, rainfall, soil moisture and crop-specific disease/pest risks.`;

    } else if (safety >= 50) {

        suitabilityMessage =
            `⚠️ ${crop.name} can be grown with some risk. The main limiting factors should be checked before planting or expanding the crop.`;

    } else {

        suitabilityMessage =
            `❌ ${crop.name} is not currently preferred under the detected conditions. Recommended sowing period: ${crop.sowing}.`;

    }

    setText(
        "suitabilityMessage",
        suitabilityMessage
    );


    // --------------------------------------------------------
    // EXTRA RISK CARD
    // --------------------------------------------------------

    renderRiskSafetyCard(
        crop,
        safety,
        seasonFit,
        stateResult,
        risk,
        currentTemp,
        rainProbability,
        recommendation
    );

}


// ============================================================
// SEASON FIT
// ============================================================

function getSeasonFit(
    crop,
    month
) {

    if (
        crop.season === "Perennial"
    ) {

        return "perennial";

    }

    let months = [];

    if (
        crop.season.includes("Rabi")
    ) {

        months =
            months.concat(
                [10, 11, 12, 1, 2, 3]
            );

    }

    if (
        crop.season.includes("Kharif")
    ) {

        months =
            months.concat(
                [6, 7, 8, 9]
            );

    }

    if (
        crop.season.includes("Zaid")
    ) {

        months =
            months.concat(
                [3, 4, 5, 6]
            );

    }

    months =
        [...new Set(months)];

    if (
        months.includes(month)
    ) {

        return "excellent";

    }

    // Near transition months
    const transitionMonths = {

        1: [12, 2],
        2: [1, 3],
        3: [2, 4],
        4: [3, 5],
        5: [4, 6],
        6: [5, 7],
        7: [6, 8],
        8: [7, 9],
        9: [8, 10],
        10: [9, 11],
        11: [10, 12],
        12: [11, 1]

    };

    if (
        transitionMonths[month]
            .some(m => months.includes(m))
    ) {

        return "acceptable";

    }

    return "poor";

}


// ============================================================
// STATE SUITABILITY
// ============================================================

function getStateSuitability(
    crop,
    state
) {

    if (!state) {

        return {
            score: 10,
            status: "State not detected",
            suitable: [],
            message:
                "Allow location access or search a location to get state-specific suitability."
        };

    }

    const normalized =
        normalizeState(state);

    const matchedState =
        crop.states.find(
            s =>
                normalizeState(s) ===
                normalized
        );

    if (matchedState) {

        return {

            score: 20,

            status:
                "Regionally Suitable",

            suitable:
                crop.states,

            message:
                `${crop.name} has documented/commonly cultivated regions that include ${state}. Variety and local agro-climatic conditions still matter.`

        };

    }

    return {

        score: 2,

        status:
            "Regionally Less Suitable",

        suitable:
            crop.states,

        message:
            `${crop.name} is not listed in this app's main regional suitability list for ${state}. Consider regions shown below and check local KVK/SAU recommendations before cultivation.`

    };

}


// ============================================================
// NORMALIZE STATE
// ============================================================

function normalizeState(state) {

    return String(state)
        .toLowerCase()
        .replace(
            /\b(state|pradesh)\b/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// ============================================================
// NO WEATHER
// ============================================================

function showNoWeatherSuitability(crop) {

    setText(
        "suitabilityScore",
        "--"
    );

    setText(
        "suitabilityStatus",
        "Weather Required"
    );

    setText(
        "suitabilityMessage",
        "Weather data is required to calculate current crop suitability."
    );

    const bar =
        document.getElementById(
            "suitabilityBar"
        );

    if (bar) {

        bar.style.width =
            "0%";

    }

    renderRiskSafetyCard(
        crop,
        null,
        "Unknown",
        {
            status: "Weather Required",
            score: 0,
            suitable: crop.states,
            message:
                "Load a location and weather data first."
        },
        "Unknown",
        null,
        null,
        "Load weather data for a location-specific recommendation."
    );

}


// ============================================================
// RISK / SAFETY CARD
// ============================================================

function renderRiskSafetyCard(
    crop,
    safety,
    seasonFit,
    stateResult,
    risk,
    currentTemp,
    rainProbability,
    recommendation
) {

    let container =
        document.getElementById(
            "cropRiskSafety"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "cropRiskSafety";

        const advisorySection =
            document.getElementById(
                "advisorySection"
            );

        if (advisorySection) {

            advisorySection.appendChild(
                container
            );

        }

    }

    if (!container) return;

    const scoreText =
        safety === null
            ? "--"
            : `${safety}%`;

    const temperatureText =
        currentTemp === null
            ? "--"
            : `${currentTemp.toFixed(1)}°C`;

    const rainText =
        rainProbability === null
            ? "--"
            : `${Math.round(rainProbability)}%`;

    let stateHTML =
        "";

    if (
        stateResult &&
        stateResult.suitable &&
        stateResult.suitable.length
    ) {

        stateHTML = `
            <div class="regional-state-list">
                ${stateResult.suitable
                    .map(
                        state =>
                            `<span>${state}</span>`
                    )
                    .join("")}
            </div>
        `;

    }

    container.innerHTML = `

        <div class="risk-header">
            <h3>🌱 ${crop.name} — Crop Suitability Analysis</h3>
            <p>
                Location + weather + season + crop-specific conditions
            </p>
        </div>

        <div class="risk-grid">

            <div class="risk-item">
                <strong>Suitability</strong>
                <span>${scoreText}</span>
            </div>

            <div class="risk-item">
                <strong>Risk Level</strong>
                <span>${risk}</span>
            </div>

            <div class="risk-item">
                <strong>Current Temperature</strong>
                <span>${temperatureText}</span>
            </div>

            <div class="risk-item">
                <strong>Rain Probability</strong>
                <span>${rainText}</span>
            </div>

            <div class="risk-item">
                <strong>Season Status</strong>
                <span>${seasonFit}</span>
            </div>

            <div class="risk-item">
                <strong>State Status</strong>
                <span>
                    ${stateResult ? stateResult.status : "--"}
                </span>
            </div>

        </div>

        <div class="regional-analysis">

            <h4>📍 Regional Suitability</h4>

            <p>
                ${
                    stateResult
                        ? stateResult.message
                        : "Regional information unavailable."
                }
            </p>

            <h5>Regions/states commonly associated with this crop:</h5>

            ${stateHTML}

        </div>

        <div class="recommendation-box">

            <h4>💡 Recommendation</h4>

            <p>
                ${recommendation}
            </p>

        </div>

        <div class="risk-note">

            ⚠️ This score is an indicative software estimate.
            It is not a guaranteed probability of crop success.
            Variety, soil, irrigation, pests, diseases and local
            agro-climatic conditions can significantly change results.

        </div>

    `;

    addRiskSafetyStyles();

}


// ============================================================
// EXTRA CROP DETAILS
// ============================================================

function renderExtraCropDetails(crop) {

    let container =
        document.getElementById(
            "extraCropDetails"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "extraCropDetails";

        const advisorySection =
            document.getElementById(
                "advisorySection"
            );

        if (advisorySection) {

            advisorySection.appendChild(
                container
            );

        }

    }

    if (!container) return;

    container.innerHTML = `

        <div class="extra-title">
            <h3>🌾 Detailed Crop Information</h3>
        </div>

        <div class="extra-grid">

            <div class="extra-card">
                <strong>Crop Type</strong>
                <span>${crop.category}</span>
            </div>

            <div class="extra-card">
                <strong>Season</strong>
                <span>${crop.season}</span>
            </div>

            <div class="extra-card">
                <strong>Temperature</strong>
                <span>
                    ${crop.temperature[0]}°C – ${crop.temperature[1]}°C
                </span>
            </div>

            <div class="extra-card">
                <strong>Water Requirement</strong>
                <span>${crop.water}</span>
            </div>

            <div class="extra-card">
                <strong>Soil</strong>
                <span>${crop.soil}</span>
            </div>

            <div class="extra-card">
                <strong>Sunlight</strong>
                <span>${crop.sunlight}</span>
            </div>

            <div class="extra-card">
                <strong>Sowing Period</strong>
                <span>${crop.sowing}</span>
            </div>

            <div class="extra-card">
                <strong>Approx. Duration</strong>
                <span>${crop.duration} days</span>
            </div>

            <div class="extra-card">
                <strong>Harvest</strong>
                <span>${crop.harvest}</span>
            </div>

            <div class="extra-card">
                <strong>Irrigation</strong>
                <span>${crop.irrigation}</span>
            </div>

            <div class="extra-card">
                <strong>Nutrition</strong>
                <span>${crop.nutrition}</span>
            </div>

            <div class="extra-card">
                <strong>Expected Yield</strong>
                <span>${crop.yield}</span>
            </div>

        </div>

    `;

    addExtraCropStyles();

}


// ============================================================
// DISEASE INFORMATION
// ============================================================

function renderDiseaseInformation(crop) {

    let container =
        document.getElementById(
            "cropDiseaseInformation"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "cropDiseaseInformation";

        const advisorySection =
            document.getElementById(
                "advisorySection"
            );

        if (advisorySection) {

            advisorySection.appendChild(
                container
            );

        }

    }

    if (!container) return;

    const diseases =
        crop.diseases || [];

    const signs =
        crop.diseaseSigns || [];

    container.innerHTML = `

        <div class="disease-header">

            <h3>
                🦠 Possible Diseases & Pest Risks
            </h3>

            <p>
                Common risks associated with ${crop.name}.
                Actual disease pressure depends on weather,
                crop stage, variety and local conditions.
            </p>

        </div>

        <div class="disease-grid">

            ${diseases
                .map(
                    (disease, index) => `

                        <div class="disease-card">

                            <div class="disease-number">
                                ${index + 1}
                            </div>

                            <div>

                                <h4>
                                    ${disease}
                                </h4>

                                <p>
                                    ${
                                        signs[index]
                                            ||
                                            "Monitor the crop regularly for unusual symptoms."
                                    }
                                </p>

                            </div>

                        </div>

                    `
                )
                .join("")}

        </div>

        <div class="disease-warning">

            ⚠️ Disease names are for early monitoring.
            Do not apply pesticides only from this list.
            Confirm the disease and follow local KVK/SAU/ICAR
            recommendations for treatment.

        </div>

    `;

    addDiseaseStyles();

}


// ============================================================
// CROP TASKS
// ============================================================

function renderTasks(crop) {

    const container =
        document.getElementById(
            "cropTasks"
        );

    if (!container) return;

    container.innerHTML = "";

    crop.tasks.forEach(
        (task, index) => {

            const div =
                document.createElement("div");

            div.className =
                "crop-task";

            div.innerHTML = `

                <span>
                    ${index + 1}
                </span>

                <p>
                    ${task}
                </p>

            `;

            container.appendChild(div);

        }
    );

}


// ============================================================
// EXTRA CSS
// ============================================================

function addExtraCropStyles() {

    if (
        document.getElementById(
            "extraCropStyles"
        )
    ) return;

    const style =
        document.createElement("style");

    style.id =
        "extraCropStyles";

    style.textContent = `

        #extraCropDetails {
            margin-top: 25px;
        }

        .extra-title h3 {
            margin-bottom: 15px;
        }

        .extra-grid {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(220px, 1fr));
            gap: 15px;
        }

        .extra-card {
            padding: 18px;
            border-radius: 15px;
            background:
                rgba(255,255,255,.08);
            border:
                1px solid rgba(255,255,255,.12);
        }

        .extra-card strong {
            display: block;
            margin-bottom: 8px;
        }

        .extra-card span {
            display: block;
            line-height: 1.5;
        }

    `;

    document.head.appendChild(style);

}


// ============================================================
// RISK CSS
// ============================================================

function addRiskSafetyStyles() {

    if (
        document.getElementById(
            "riskSafetyStyles"
        )
    ) return;

    const style =
        document.createElement("style");

    style.id =
        "riskSafetyStyles";

    style.textContent = `

        #cropRiskSafety {
            margin-top: 25px;
            padding: 22px;
            border-radius: 18px;
            background:
                rgba(255,255,255,.06);
            border:
                1px solid rgba(255,255,255,.12);
        }

        .risk-header h3 {
            margin-bottom: 5px;
        }

        .risk-header p {
            opacity: .8;
        }

        .risk-grid {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(170px, 1fr));
            gap: 12px;
            margin-top: 18px;
        }

        .risk-item {
            padding: 15px;
            border-radius: 14px;
            background:
                rgba(255,255,255,.08);
        }

        .risk-item strong {
            display: block;
            margin-bottom: 7px;
        }

        .risk-item span {
            font-weight: 700;
        }

        .regional-analysis {
            margin-top: 20px;
        }

        .regional-state-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .regional-state-list span {
            padding: 7px 11px;
            border-radius: 20px;
            background:
                rgba(34,197,94,.12);
            border:
                1px solid rgba(34,197,94,.25);
            font-size: .9rem;
        }

        .recommendation-box {
            margin-top: 20px;
            padding: 16px;
            border-radius: 14px;
            background:
                rgba(34,197,94,.08);
        }

        .risk-note {
            margin-top: 18px;
            font-size: .85rem;
            opacity: .75;
            line-height: 1.5;
        }

    `;

    document.head.appendChild(style);

}


// ============================================================
// DISEASE CSS
// ============================================================

function addDiseaseStyles() {

    if (
        document.getElementById(
            "diseaseStyles"
        )
    ) return;

    const style =
        document.createElement("style");

    style.id =
        "diseaseStyles";

    style.textContent = `

        #cropDiseaseInformation {
            margin-top: 25px;
            padding: 22px;
            border-radius: 18px;
            background:
                rgba(255,255,255,.06);
            border:
                1px solid rgba(255,255,255,.12);
        }

        .disease-header h3 {
            margin-bottom: 6px;
        }

        .disease-header p {
            opacity: .8;
            line-height: 1.5;
        }

        .disease-grid {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(260px, 1fr));
            gap: 14px;
            margin-top: 18px;
        }

        .disease-card {
            display: flex;
            gap: 12px;
            padding: 16px;
            border-radius: 15px;
            background:
                rgba(255,255,255,.07);
        }

        .disease-number {
            min-width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background:
                rgba(239,68,68,.15);
            font-weight: 700;
        }

        .disease-card h4 {
            margin: 0 0 6px;
        }

        .disease-card p {
            margin: 0;
            opacity: .78;
            line-height: 1.45;
        }

        .disease-warning {
            margin-top: 18px;
            padding: 14px;
            border-radius: 12px;
            background:
                rgba(245,158,11,.1);
            line-height: 1.5;
        }

    `;

    document.head.appendChild(style);

}


// ============================================================
// HELPERS
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(
    message,
    type = "info"
) {

    const box =
        document.getElementById(
            "messageBox"
        );

    if (!box) return;

    box.textContent =
        message;

    box.className =
        `message-box ${type}`;

    box.style.display =
        "block";

    setTimeout(() => {

        box.style.display =
            "none";

    }, 7000);

}


// ============================================================
// EVENTS
// ============================================================

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        getCurrentLocation
    );

}

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchLocation
    );

}

if (advisoryBtn) {

    advisoryBtn.addEventListener(
        "click",
        generateAdvisory
    );

}

if (locationInput) {

    locationInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchLocation();

            }

        }
    );

}

if (sowingDate) {

    sowingDate.addEventListener(
        "change",
        () => {

            if (
                cropSelect &&
                cropSelect.value
            ) {

                calculateHarvest(
                    CROPS[cropSelect.value]
                );

            }

        }
    );

}


// ============================================================
// GLOBAL EXPORTS
// ============================================================

window.getCurrentLocation =
    getCurrentLocation;

window.searchLocation =
    searchLocation;

window.generateAdvisory =
    generateAdvisory;

window.CROPS =
    CROPS;

window.calculateSuitability =
    calculateSuitability;
