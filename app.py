import streamlit as st
import requests
from streamlit_geolocation import streamlit_geolocation
from datetime import datetime


# =========================================================
# PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="Hyperlocal Agricultural Advisory",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)


# =========================================================
# SIMPLE STABLE LIGHT UI
# =========================================================

st.markdown("""
<style>

    /* =========================
       MAIN APP
       ========================= */

    .stApp {
        background-color: #f4f7f2 !important;
    }

    .main .block-container {
        max-width: 1450px;
        padding-top: 30px;
        padding-bottom: 50px;
    }

    header[data-testid="stHeader"] {
        background-color: #ffffff !important;
    }


    /* =========================
       SIDEBAR
       ========================= */

    section[data-testid="stSidebar"] {
        background-color: #ffffff !important;
        border-right: 1px solid #d9e2da;
    }

    section[data-testid="stSidebar"] * {
        color: #1f2937 !important;
    }


    /* =========================
       TEXT
       ========================= */

    p,
    label,
    .stMarkdown {
        color: #1f2937;
    }

    h1,
    h2,
    h3,
    h4 {
        color: #166534 !important;
    }


    /* =========================
       TITLE
       ========================= */

    .app-title {
        font-size: 40px;
        font-weight: 800;
        text-align: center;
        color: #166534;
        margin-bottom: 5px;
    }

    .app-subtitle {
        text-align: center;
        color: #64748b;
        font-size: 16px;
        margin-bottom: 30px;
    }


    /* =========================
       SECTION HEADING
       ========================= */

    .section-heading {
        color: #166534 !important;
        font-size: 25px;
        font-weight: 750;
        margin-top: 25px;
        margin-bottom: 12px;
    }


    /* =========================
       METRIC BOX
       ========================= */

    [data-testid="stMetric"] {
        background-color: #ffffff !important;
        border: 1px solid #dce5dc !important;
        border-radius: 14px !important;
        padding: 16px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
    }

    [data-testid="stMetricLabel"] {
        color: #64748b !important;
    }

    [data-testid="stMetricValue"] {
        color: #172033 !important;
    }


    /* =========================
       INPUTS
       ========================= */

    div[data-baseweb="select"] > div {
        background-color: #ffffff !important;
        border-color: #cbd5e1 !important;
    }

    div[data-baseweb="select"] span {
        color: #1f2937 !important;
    }

    input {
        background-color: #ffffff !important;
        color: #1f2937 !important;
    }


    /* =========================
       BUTTON
       ========================= */

    .stButton button {
        background-color: #166534 !important;
        color: white !important;
        border-radius: 9px !important;
        border: none !important;
    }


    /* =========================
       ALERTS
       ========================= */

    [data-testid="stAlert"] {
        border-radius: 12px !important;
    }


    /* =========================
       FORECAST CONTAINER
       ========================= */

    [data-testid="stVerticalBlockBorderWrapper"] {
        background-color: #ffffff !important;
        border: 1px solid #dce5dc !important;
        border-radius: 16px !important;
        padding: 8px !important;
    }


    /* =========================
       RADIO
       ========================= */

    [data-testid="stRadio"] label {
        color: #1f2937 !important;
    }


    /* =========================
       DIVIDER
       ========================= */

    hr {
        border-color: #dce5dc !important;
    }

</style>
""", unsafe_allow_html=True)


# =========================================================
# TITLE
# =========================================================

st.markdown(
    '<div class="app-title">'
    '🌾 Hyperlocal Agricultural Advisory'
    '</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="app-subtitle">'
    'Weather-based agricultural guidance for farmers'
    '</div>',
    unsafe_allow_html=True
)


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.header("🌱 Farm Settings")

    crop = st.selectbox(
        "Select Crop",
        [
            "Rice",
            "Wheat",
            "Potato",
            "Maize",
            "Tomato",
            "Sugarcane",
            "Cotton",
            "Mustard"
        ]
    )

    st.divider()

    st.subheader("📍 Location")

    location_type = st.radio(
        "Select location method",
        [
            "Current Location",
            "Manual Coordinates"
        ]
    )

    st.divider()

    st.caption(
        "🌦️ Weather data from Open-Meteo"
    )


# =========================================================
# LOCATION VARIABLES
# =========================================================

latitude = None
longitude = None
accuracy = None


# =========================================================
# REVERSE GEOCODING
# GET AREA / CITY / DISTRICT / STATE
# =========================================================

@st.cache_data(ttl=3600)
def get_place_name(lat, lon):

    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "zoom": 18,
        "addressdetails": 1
    }

    headers = {
        "User-Agent": "Hyperlocal-Agricultural-Advisory/1.0"
    }

    try:

        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        address = data.get(
            "address",
            {}
        )

        area = (
            address.get("village")
            or address.get("suburb")
            or address.get("neighbourhood")
            or address.get("quarter")
            or address.get("town")
            or address.get("hamlet")
            or "Not available"
        )

        city = (
            address.get("city")
            or address.get("town")
            or address.get("municipality")
            or address.get("village")
            or "Not available"
        )

        district = (
            address.get("county")
            or address.get("state_district")
            or "Not available"
        )

        state = address.get(
            "state",
            "Not available"
        )

        country = address.get(
            "country",
            "Not available"
        )

        postcode = address.get(
            "postcode",
            "Not available"
        )

        return {
            "area": area,
            "city": city,
            "district": district,
            "state": state,
            "country": country,
            "postcode": postcode
        }

    except Exception:

        return {
            "area": "Not available",
            "city": "Not available",
            "district": "Not available",
            "state": "Not available",
            "country": "Not available",
            "postcode": "Not available"
        }


# =========================================================
# CURRENT LOCATION
# =========================================================

if location_type == "Current Location":

    st.markdown(
        '<div class="section-heading">'
        '📍 Current Location'
        '</div>',
        unsafe_allow_html=True
    )

    st.info(
        "Click the location button and allow "
        "location permission in your browser."
    )

    location = streamlit_geolocation()

    if isinstance(location, dict):

        latitude = location.get(
            "latitude"
        )

        longitude = location.get(
            "longitude"
        )

        accuracy = location.get(
            "accuracy"
        )

    if latitude is not None and longitude is not None:

        st.success(
            "✅ Current location detected"
        )

        # -----------------------------------------
        # LOCATION NAME
        # -----------------------------------------

        with st.spinner(
            "📍 Finding your area and place..."
        ):

            place = get_place_name(
                float(latitude),
                float(longitude)
            )


        # -----------------------------------------
        # COORDINATES
        # -----------------------------------------

        st.subheader(
            "📍 Coordinates"
        )

        c1, c2, c3 = st.columns(3)

        with c1:

            st.metric(
                "Latitude",
                f"{latitude:.6f}"
            )

        with c2:

            st.metric(
                "Longitude",
                f"{longitude:.6f}"
            )

        with c3:

            if accuracy is not None:

                st.metric(
                    "Accuracy",
                    f"{accuracy:.0f} m"
                )

            else:

                st.metric(
                    "Accuracy",
                    "N/A"
                )


        # -----------------------------------------
        # PLACE INFORMATION
        # -----------------------------------------

        st.subheader(
            "🏡 Farm Area & Place"
        )

        p1, p2 = st.columns(2)

        with p1:

            st.info(
                f"📍 **Area / Locality**\n\n"
                f"{place['area']}"
            )

            st.info(
                f"🏙️ **City / Town**\n\n"
                f"{place['city']}"
            )

            st.info(
                f"🏘️ **District**\n\n"
                f"{place['district']}"
            )

        with p2:

            st.info(
                f"🗺️ **State**\n\n"
                f"{place['state']}"
            )

            st.info(
                f"🌍 **Country**\n\n"
                f"{place['country']}"
            )

            st.info(
                f"📮 **PIN Code**\n\n"
                f"{place['postcode']}"
            )

    else:

        st.warning(
            "Waiting for location. "
            "Allow browser location permission."
        )

        st.stop()


# =========================================================
# MANUAL LOCATION
# =========================================================

else:

    st.markdown(
        '<div class="section-heading">'
        '📝 Farm Coordinates'
        '</div>',
        unsafe_allow_html=True
    )

    c1, c2 = st.columns(2)

    with c1:

        latitude = st.number_input(
            "Latitude",
            min_value=-90.0,
            max_value=90.0,
            value=26.8467,
            step=0.0001,
            format="%.6f"
        )

    with c2:

        longitude = st.number_input(
            "Longitude",
            min_value=-180.0,
            max_value=180.0,
            value=80.9462,
            step=0.0001,
            format="%.6f"
        )

    st.success(
        f"📍 Coordinates: "
        f"{latitude:.6f}, {longitude:.6f}"
    )


    # -----------------------------------------
    # FIND PLACE NAME
    # -----------------------------------------

    with st.spinner(
        "📍 Finding area and place..."
    ):

        place = get_place_name(
            float(latitude),
            float(longitude)
        )


    st.subheader(
        "🏡 Farm Area & Place"
    )

    p1, p2 = st.columns(2)

    with p1:

        st.info(
            f"📍 **Area / Locality**\n\n"
            f"{place['area']}"
        )

        st.info(
            f"🏙️ **City / Town**\n\n"
            f"{place['city']}"
        )

        st.info(
            f"🏘️ **District**\n\n"
            f"{place['district']}"
        )

    with p2:

        st.info(
            f"🗺️ **State**\n\n"
            f"{place['state']}"
        )

        st.info(
            f"🌍 **Country**\n\n"
            f"{place['country']}"
        )

        st.info(
            f"📮 **PIN Code**\n\n"
            f"{place['postcode']}"
        )


# =========================================================
# WEATHER FUNCTION
# =========================================================

@st.cache_data(ttl=600)
def get_weather(lat, lon):

    url = (
        "https://api.open-meteo.com/v1/forecast"
    )

    params = {

        "latitude": lat,

        "longitude": lon,

        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "precipitation,"
            "rain,"
            "weather_code,"
            "wind_speed_10m"
        ),

        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "precipitation_probability_max,"
            "wind_speed_10m_max"
        ),

        "forecast_days": 7,

        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    return response.json()


# =========================================================
# WEATHER DESCRIPTION
# =========================================================

def get_weather_description(code):

    codes = {

        0: ("☀️", "Clear sky"),

        1: ("🌤️", "Mainly clear"),

        2: ("⛅", "Partly cloudy"),

        3: ("☁️", "Overcast"),

        45: ("🌫️", "Fog"),

        48: ("🌫️", "Rime fog"),

        51: ("🌦️", "Light drizzle"),

        53: ("🌦️", "Moderate drizzle"),

        55: ("🌧️", "Dense drizzle"),

        56: ("🌧️", "Light freezing drizzle"),

        57: ("🌧️", "Dense freezing drizzle"),

        61: ("🌦️", "Slight rain"),

        63: ("🌧️", "Moderate rain"),

        65: ("🌧️", "Heavy rain"),

        66: ("🌧️", "Light freezing rain"),

        67: ("🌧️", "Heavy freezing rain"),

        71: ("🌨️", "Slight snow"),

        73: ("🌨️", "Moderate snow"),

        75: ("❄️", "Heavy snow"),

        77: ("🌨️", "Snow grains"),

        80: ("🌦️", "Slight rain showers"),

        81: ("🌧️", "Moderate rain showers"),

        82: ("⛈️", "Violent rain showers"),

        85: ("🌨️", "Slight snow showers"),

        86: ("🌨️", "Heavy snow showers"),

        95: ("⛈️", "Thunderstorm"),

        96: ("⛈️", "Thunderstorm with hail"),

        99: (
            "⛈️",
            "Thunderstorm with heavy hail"
        )
    }

    return codes.get(
        int(code),
        ("🌤️", "Unknown weather")
    )


# =========================================================
# LOAD WEATHER
# =========================================================

try:

    with st.spinner(
        "🌦️ Loading weather data..."
    ):

        weather = get_weather(
            float(latitude),
            float(longitude)
        )

except Exception:

    st.error(
        "❌ Unable to get weather data."
    )

    st.info(
        "Please check your internet connection "
        "and try again."
    )

    st.stop()


# =========================================================
# CURRENT WEATHER DATA
# =========================================================

current = weather["current"]


temperature = current.get(
    "temperature_2m",
    0
)


humidity = current.get(
    "relative_humidity_2m",
    0
)


feels_like = current.get(
    "apparent_temperature",
    0
)


rain = current.get(
    "rain",
    0
)


precipitation = current.get(
    "precipitation",
    0
)


wind = current.get(
    "wind_speed_10m",
    0
)


weather_code = current.get(
    "weather_code",
    0
)


icon, weather_text = (
    get_weather_description(
        weather_code
    )
)


# =========================================================
# CURRENT WEATHER
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '🌦️ Current Weather'
    '</div>',
    unsafe_allow_html=True
)


c1, c2, c3, c4 = st.columns(4)


with c1:

    st.metric(
        "🌡️ Temperature",
        f"{temperature:.1f} °C"
    )


with c2:

    st.metric(
        "💧 Humidity",
        f"{humidity:.0f} %"
    )


with c3:

    st.metric(
        "💨 Wind",
        f"{wind:.1f} km/h"
    )


with c4:

    st.metric(
        "🌧️ Rain",
        f"{rain:.1f} mm"
    )


st.success(
    f"{icon} {weather_text}   |   "
    f"Feels like {feels_like:.1f} °C"
)


# =========================================================
# CROP REQUIREMENTS
# =========================================================

crop_requirements = {

    "Rice": {
        "temp_min": 20,
        "temp_max": 35,
        "humidity_min": 60
    },

    "Wheat": {
        "temp_min": 10,
        "temp_max": 25,
        "humidity_min": 35
    },

    "Potato": {
        "temp_min": 15,
        "temp_max": 25,
        "humidity_min": 40
    },

    "Maize": {
        "temp_min": 18,
        "temp_max": 32,
        "humidity_min": 40
    },

    "Tomato": {
        "temp_min": 18,
        "temp_max": 30,
        "humidity_min": 40
    },

    "Sugarcane": {
        "temp_min": 20,
        "temp_max": 35,
        "humidity_min": 50
    },

    "Cotton": {
        "temp_min": 21,
        "temp_max": 35,
        "humidity_min": 40
    },

    "Mustard": {
        "temp_min": 10,
        "temp_max": 25,
        "humidity_min": 35
    }
}


# =========================================================
# CROP SCORE FUNCTION
# =========================================================

def calculate_crop_score(
    crop_name,
    temperature,
    humidity,
    rain_amount
):

    requirement = crop_requirements[
        crop_name
    ]

    score = 0

    reasons = []


    # -----------------------------------------
    # TEMPERATURE
    # -----------------------------------------

    if (
        requirement["temp_min"]
        <= temperature
        <= requirement["temp_max"]
    ):

        score += 50

        reasons.append(
            "🌡️ Temperature is suitable."
        )

    else:

        reasons.append(
            "🌡️ Temperature is outside "
            "the preferred range."
        )


    # -----------------------------------------
    # HUMIDITY
    # -----------------------------------------

    if humidity >= requirement["humidity_min"]:

        score += 20

        reasons.append(
            "💧 Humidity is acceptable."
        )

    else:

        score += 10

        reasons.append(
            "💧 Humidity is relatively low."
        )


    # -----------------------------------------
    # RAINFALL
    # -----------------------------------------

    if rain_amount > 0:

        score += 20

        reasons.append(
            "🌧️ Rainfall is currently present."
        )

    else:

        score += 10

        reasons.append(
            "☀️ No significant current rainfall."
        )


    # -----------------------------------------
    # EXTRA TEMPERATURE CHECK
    # -----------------------------------------

    if (
        requirement["temp_min"]
        <= temperature
        <= requirement["temp_max"]
        and
        humidity >= requirement["humidity_min"]
    ):

        score += 10


    return min(score, 100), reasons


# =========================================================
# CROP SUITABILITY
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '🌱 Crop Suitability & Recommendation'
    '</div>',
    unsafe_allow_html=True
)


selected_score, selected_reasons = (
    calculate_crop_score(
        crop,
        temperature,
        humidity,
        precipitation
    )
)


c1, c2 = st.columns(2)


# =========================================================
# SELECTED CROP
# =========================================================

with c1:

    st.subheader(
        f"🌱 Selected Crop: {crop}"
    )


    if selected_score >= 80:

        st.success(
            f"✅ {crop} is currently suitable "
            "for the available weather conditions."
        )

    elif selected_score >= 55:

        st.warning(
            f"⚠️ {crop} is moderately suitable. "
            "Monitor weather and soil conditions."
        )

    else:

        st.error(
            f"❌ {crop} is currently not very "
            "suitable under these weather conditions."
        )


    st.metric(
        "Weather Suitability",
        f"{selected_score}%"
    )


    st.write(
        "**Why?**"
    )


    for reason in selected_reasons:

        st.write(
            reason
        )


# =========================================================
# BEST CROP CALCULATION
# =========================================================

crop_scores = {}


for crop_name in crop_requirements:

    score, reasons = calculate_crop_score(
        crop_name,
        temperature,
        humidity,
        precipitation
    )

    crop_scores[crop_name] = score


sorted_crops = sorted(
    crop_scores.items(),
    key=lambda x: x[1],
    reverse=True
)


best_crop = sorted_crops[0][0]

best_score = sorted_crops[0][1]


# =========================================================
# RECOMMENDED CROP
# =========================================================

with c2:

    st.subheader(
        "🏆 Recommended Crop"
    )

    st.success(
        f"🌱 **{best_crop}** currently has "
        "the highest weather suitability "
        "among the available crops."
    )

    st.metric(
        "Recommendation Score",
        f"{best_score}%"
    )

    st.write(
        "Recommendation is based on "
        "current temperature, humidity "
        "and rainfall."
    )


# =========================================================
# OTHER SUITABLE CROPS
# =========================================================

st.write(
    "### 🌾 Other Suitable Options"
)


shown = 0


for crop_name, score in sorted_crops:

    if crop_name == best_crop:
        continue

    if score >= 70:

        st.write(
            f"• **{crop_name}** — "
            f"{score}% suitable"
        )

        shown += 1

    elif score >= 50:

        st.write(
            f"• **{crop_name}** — "
            f"{score}% moderately suitable"
        )

        shown += 1

    if shown >= 3:
        break


# =========================================================
# AGRICULTURAL ADVISORY
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '🌾 Agricultural Advisory'
    '</div>',
    unsafe_allow_html=True
)


c1, c2, c3 = st.columns(3)


# =========================================================
# TEMPERATURE ADVICE
# =========================================================

with c1:

    st.subheader(
        "🌡️ Temperature"
    )

    if temperature >= 38:

        st.warning(
            "🔥 High temperature detected. "
            "Monitor the crop for heat stress."
        )

    elif temperature <= 10:

        st.warning(
            "❄️ Low temperature detected. "
            "Monitor the crop for cold stress."
        )

    else:

        st.success(
            "Temperature is currently in "
            "a moderate range."
        )


# =========================================================
# RAIN ADVICE
# =========================================================

with c2:

    st.subheader(
        "🌧️ Rainfall"
    )

    if precipitation > 10:

        st.warning(
            "Significant rainfall detected. "
            "Avoid unnecessary irrigation "
            "and check field drainage."
        )

    elif precipitation > 0:

        st.info(
            "Rainfall is occurring. "
            "Consider it before irrigation."
        )

    else:

        st.info(
            "☀️ No significant current rainfall."
        )


# =========================================================
# HUMIDITY ADVICE
# =========================================================

with c3:

    st.subheader(
        "💧 Humidity"
    )

    if humidity >= 85:

        st.warning(
            "High humidity. Monitor the crop "
            "for fungal disease conditions."
        )

    elif humidity <= 35:

        st.warning(
            "Low humidity. Monitor soil moisture."
        )

    else:

        st.success(
            "Humidity is currently moderate."
        )


# =========================================================
# CROP ADVICE
# =========================================================

st.markdown(
    f'<div class="section-heading">'
    f'🌱 {crop} Crop Advice'
    f'</div>',
    unsafe_allow_html=True
)


crop_advice = {

    "Rice": [
        "Maintain suitable field moisture.",
        "Check drainage after heavy rainfall.",
        "Monitor for fungal diseases during humid weather."
    ],

    "Wheat": [
        "Check soil moisture before irrigation.",
        "Avoid excessive irrigation.",
        "Monitor the crop during humid conditions."
    ],

    "Potato": [
        "Avoid prolonged waterlogging.",
        "Maintain suitable root-zone moisture.",
        "Monitor for disease during humid weather."
    ],

    "Maize": [
        "Maintain adequate soil moisture.",
        "Avoid waterlogging.",
        "Monitor the crop during hot weather."
    ],

    "Tomato": [
        "Avoid excessive irrigation.",
        "Monitor for fungal disease.",
        "Maintain balanced soil moisture."
    ],

    "Sugarcane": [
        "Maintain adequate soil moisture.",
        "Ensure proper drainage after rainfall.",
        "Monitor the crop during hot weather."
    ],

    "Cotton": [
        "Avoid excessive irrigation.",
        "Monitor soil moisture during dry periods.",
        "Inspect the crop after humid weather."
    ],

    "Mustard": [
        "Avoid unnecessary irrigation.",
        "Monitor soil moisture.",
        "Monitor the crop during cold conditions."
    ]
}


for advice in crop_advice[crop]:

    st.write(
        f"🌿 {advice}"
    )


# =========================================================
# IRRIGATION
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '💧 Irrigation Recommendation'
    '</div>',
    unsafe_allow_html=True
)


if rain > 5:

    st.info(
        "💧 Irrigation priority: LOW. "
        "Recent rainfall is significant."
    )

elif temperature >= 35:

    st.warning(
        "💧 Irrigation priority: CHECK SOIL. "
        "High temperature may increase "
        "water demand."
    )

elif humidity >= 80:

    st.info(
        "💧 Irrigation priority: MONITOR SOIL. "
        "Humidity is relatively high."
    )

else:

    st.success(
        "💧 Irrigation priority: CHECK SOIL "
        "MOISTURE before irrigation."
    )


# =========================================================
# TODAY'S FARM ACTIONS
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '📋 Today\'s Farm Actions'
    '</div>',
    unsafe_allow_html=True
)


actions = []


if rain > 5:

    actions.append(
        "🌧️ Check drainage and avoid "
        "unnecessary irrigation."
    )

else:

    actions.append(
        "💧 Check soil moisture before irrigation."
    )


if humidity >= 85:

    actions.append(
        "🔍 Inspect crops for fungal "
        "disease symptoms."
    )


if temperature >= 35:

    actions.append(
        "🌡️ Monitor the crop for heat stress."
    )


actions.append(
    f"🌱 Continue monitoring the {crop} crop."
)


for action in actions:

    st.write(
        f"• {action}"
    )


# =========================================================
# 7 DAY FORECAST
# =========================================================

st.markdown(
    '<div class="section-heading">'
    '📅 7-Day Weather Forecast'
    '</div>',
    unsafe_allow_html=True
)


daily = weather["daily"]


dates = daily["time"]


max_temperatures = (
    daily["temperature_2m_max"]
)


min_temperatures = (
    daily["temperature_2m_min"]
)


rain_amounts = (
    daily["precipitation_sum"]
)


rain_probabilities = (
    daily["precipitation_probability_max"]
)


daily_codes = (
    daily["weather_code"]
)


wind_maximums = (
    daily["wind_speed_10m_max"]
)


# =========================================================
# FORECAST CARDS
# =========================================================

for start in range(
    0,
    len(dates),
    3
):

    cols = st.columns(3)


    for position in range(3):

        i = start + position


        if i >= len(dates):

            break


        with cols[position]:

            date = datetime.strptime(
                dates[i],
                "%Y-%m-%d"
            )


            if i == 0:

                day_name = "Today"

            elif i == 1:

                day_name = "Tomorrow"

            else:

                day_name = date.strftime(
                    "%A"
                )


            forecast_icon, forecast_text = (
                get_weather_description(
                    daily_codes[i]
                )
            )


            # ---------------------------------
            # NATIVE STREAMLIT CARD
            # ---------------------------------

            with st.container(
                border=True
            ):

                st.subheader(
                    f"{forecast_icon} {day_name}"
                )

                st.caption(
                    date.strftime(
                        "%d %B %Y"
                    )
                )

                st.write(
                    f"**{forecast_text}**"
                )

                st.markdown(
                    f"### 🌡️ "
                    f"{max_temperatures[i]:.1f}°C / "
                    f"{min_temperatures[i]:.1f}°C"
                )

                st.write(
                    f"🌧️ Rain: "
                    f"{rain_amounts[i]:.1f} mm"
                )

                st.write(
                    f"💧 Rain chance: "
                    f"{rain_probabilities[i]:.0f}%"
                )

                st.write(
                    f"💨 Max wind: "
                    f"{wind_maximums[i]:.1f} km/h"
                )


# =========================================================
# DATA SOURCE
# =========================================================

st.markdown(
    '<div class="section-heading">'
    'ℹ️ Data Source'
    '</div>',
    unsafe_allow_html=True
)


st.info(
    "🌦️ Weather information is obtained "
    "from the Open-Meteo weather API using "
    "the selected coordinates."
)


st.caption(
    "📍 Area and place names are obtained "
    "through reverse geocoding. "
    "Forecast values are model-based and can "
    "differ from measurements at an individual farm."
)


# =========================================================
# FOOTER
# =========================================================

st.divider()


st.caption(
    "🌾 Hyperlocal Agricultural Advisory System "
    "| 📍 Location + 🌦️ Weather + 🌱 Crop Advisory"
)