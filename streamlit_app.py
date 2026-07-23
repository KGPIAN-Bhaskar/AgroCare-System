import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image
from treatments import treatments

# ---------------------------------------
# Page Configuration
# ---------------------------------------

st.set_page_config(
    page_title="Plant Disease Detection",
    page_icon="🌿",
    layout="centered"
)
# ===========================
# Custom CSS
# ===========================

st.markdown("""
<style>

/* Main App Background */
.stApp{
    background: linear-gradient(135deg,#2e7d32,#66bb6a,#a5d6a7);
}

/* Hide Streamlit Header */
header{
    visibility:hidden;
}
/* Predict Button */
.stButton>button{

    width:100%;

    background:#1b5e20;

    color:white;

    border:none;

    border-radius:12px;

    font-size:18px;

    font-weight:bold;

    padding:12px;

    transition:0.3s;
}

.stButton>button:hover{

    background:#2e7d32;

    transform:scale(1.03);

    cursor:pointer;
}
/* Prediction Card */

.prediction-card{

    background:white;

    border-radius:18px;

    padding:25px;

    margin-top:20px;

    margin-bottom:20px;

    box-shadow:0px 8px 20px rgba(0,0,0,.25);

    border-left:8px solid #1b5e20;
}

.prediction-title{

    text-align:center;

    font-size:30px;

    font-weight:bold;

    color:#1b5e20;

    margin-bottom:20px;
}

.label{

    font-size:18px;

    color:#666;

    font-weight:bold;
}

.value{

    font-size:24px;

    font-weight:bold;

    color:#2e7d32;

    margin-bottom:20px;
}

/* Success Box */

.success-box{

    background:white;

    border-left:8px solid #2e7d32;

    border-radius:15px;

    padding:18px;

    margin-top:20px;

    margin-bottom:20px;

    text-align:center;

    font-size:22px;

    font-weight:bold;

    color:#1b5e20;

    box-shadow:0 6px 18px rgba(0,0,0,.25);
}
/* Title Box */
.title-box{
    background:white;
    border-radius:18px;
    padding:20px;
    text-align:center;
    box-shadow:0px 8px 25px rgba(0,0,0,0.25);
    margin-bottom:12px;
}

/* Main Title */
.title{
    font-size:42px;
    font-weight:800;
    color:#1b5e20;
}

/* Subtitle */
.subtitle{
    text-align:center;
    font-size:18px;
    color:#444;
    margin-bottom:30px;
}

</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="title-box">
<div class="title">
🌿 Plant Disease Detection
</div>
</div>

<div class="subtitle">
Upload a leaf image to detect plant disease
</div>
""", unsafe_allow_html=True)

# ---------------------------------------
# Load Labels
# ---------------------------------------

with open("labels.txt", "r") as f:
    class_names = [line.strip() for line in f]

# ---------------------------------------
# Load TensorFlow Lite Model
# ---------------------------------------

@st.cache_resource
def load_model():

    interpreter = tf.lite.Interpreter(
        model_path="model\model.tflite"
    )

    interpreter.allocate_tensors()

    return interpreter


interpreter = load_model()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# ---------------------------------------
# Image Preprocessing
# ---------------------------------------

def preprocess_image(image):

    image = image.resize((128, 128))

    image = np.array(image)

    image = image.astype(np.float32)

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    return image

# ---------------------------------------
# Prediction Function
# ---------------------------------------

def predict(image):

    input_data = preprocess_image(image)

    interpreter.set_tensor(
        input_details[0]["index"],
        input_data
    )

    interpreter.invoke()

    prediction = interpreter.get_tensor(
        output_details[0]["index"]
    )

    predicted_index = np.argmax(prediction)

    confidence = float(np.max(prediction))

    return class_names[predicted_index], confidence

# ---------------------------------------
# Upload Image
# ---------------------------------------

st.markdown("<h3 style='text-align:center;color:white;'>📤 Upload Leaf Image</h3>", unsafe_allow_html=True)

uploaded_file = st.file_uploader(
    "",
    type=["jpg","jpeg","png"]
)

# ---------------------------------------
# Upload Image
# ---------------------------------------


if uploaded_file is not None:

    image = Image.open(uploaded_file).convert("RGB")

    # Image Card
    st.markdown("""
    <div style="
        background:white;
        padding:20px;
        border-radius:20px;
        box-shadow:0 8px 25px rgba(0,0,0,.25);
    ">
    """, unsafe_allow_html=True)

    st.image(
        image,
        use_container_width=True
    )

    st.markdown("</div>", unsafe_allow_html=True)

    # Center Predict Button
    col1, col2, col3 = st.columns([2, 1, 2])

    with col2:
        predict_btn = st.button(
            "🔍 Predict",
            use_container_width=True
        )

    # Prediction
    if predict_btn:

        disease, confidence = predict(image)
        info = treatments[disease]
        description = info["description"]
        symptoms = info["symptoms"]
        actions = info["actions"]
        prevention = info["prevention"]
        products = info["products"]
        # Confidence Color

        if confidence >= 0.90:
            confidence_color = "#2e7d32"   # Green

        elif confidence >= 0.70:
            confidence_color = "#ff9800"   # Orange
        else:
            confidence_color = "#d32f2f"   # Red    
        display_name = disease.replace("___", " : ").replace("_", " ")

        st.markdown("""
          <div class="success-box">
          ✅ Prediction Completed Successfully
          </div>
          """, unsafe_allow_html=True)

        st.markdown(f"""
       <div class="prediction-card">

        <div class="prediction-title">
        🌿 Prediction Result
        </div>

       <div class="label">
       Disease
       </div>

       <div class="value">
       {display_name}
       </div>

       <hr> 

      <div class="label">
       Confidence
       </div>

      <div class="value">
     {confidence*100:.2f}%
      </div>

     </div>
      """, unsafe_allow_html=True)
        st.progress(confidence)
        st.subheader("📖 Description")
        st.write(description)

        st.subheader("⚠ Symptoms")
        for s in symptoms:
         st.write(f"• {s}")

        st.subheader("✅ Treatment")
        for a in actions:
         st.write(f"• {a}")
        for product in products:
          st.write(f"### {product['name']}")

          col1, col2 = st.columns(2)

          with col1:
           st.link_button("🛒 Amazon", product["amazon"])

          with col2:
           st.link_button("🛍️ Flipkart", product["flipkart"])

        