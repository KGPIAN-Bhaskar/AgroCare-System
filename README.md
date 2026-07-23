# 🌿 Plant Disease Detection using TensorFlow Lite & Streamlit

An AI-powered web application that detects plant diseases from leaf images using a Convolutional Neural Network (CNN) converted to TensorFlow Lite. The application provides disease prediction, confidence score, treatment recommendations, prevention tips, and recommended agricultural products with Amazon and Flipkart search links.

---

# 📌 Features

- 🌱 Detects **38 PlantVillage disease classes**
- 🤖 TensorFlow Lite model for fast inference
- 📷 Upload plant leaf images
- 🎯 Displays prediction confidence
- 📖 Disease description
- ⚠ Symptoms
- 💊 Treatment recommendations
- 🛡 Prevention tips
- 🧪 Recommended product
- 🛒 Amazon search button
- 🛍 Flipkart search button
- 🎨 Modern Streamlit UI
- ⚡ Lightweight and deployment-ready

---

# 🖼 Demo

## Home Page

Upload a leaf image and click **Predict Disease**.

The application displays:

- Predicted Disease
- Confidence Score
- Disease Status
- Disease Description
- Symptoms
- Treatment
- Prevention
- Recommended Product

---

# 📂 Project Structure

```
Plant-Disease-Detection/
│
├── streamlit_app.py          # Streamlit application
├── treatments.py             # Treatment database
├── labels.txt                # 38 class labels
├── plant_disease_model.tflite
├── requirements.txt
├── packages.txt
├── medeling.ipynb
├── .gitignore
├── sample_leaf
└── README.md
```

---

# 📊 Dataset

Dataset Used:

**PlantVillage Dataset**

- Total Images: **54,305**
- Classes: **38**
- Image Size: **224 × 224**

Dataset contains diseases of:

- Apple
- Blueberry
- Cherry
- Corn
- Grape
- Orange
- Peach
- Pepper
- Potato
- Raspberry
- Soybean
- Squash
- Strawberry
- Tomato

---

# 🧠 Deep Learning Model

Model Architecture

```
Input Image

↓

Resize (224×224)

↓

Normalization

↓

Conv2D (32)

↓

MaxPooling

↓

Conv2D (64)

↓

MaxPooling

↓

Conv2D (128)

↓

MaxPooling

↓

Flatten

↓

Dense (256)

↓

Dropout

↓

Dense (38)

↓

Softmax
```

After training, the TensorFlow model was converted into a **TensorFlow Lite (.tflite)** model for lightweight and efficient inference.

---

# ⚙ Technologies Used

- Python
- TensorFlow
- TensorFlow Lite
- NumPy
- Pillow
- Streamlit

---

# 🚀 Installation

Clone Repository

```bash
git clone https://github.com/yourusername/Plant-Disease-Detection.git

cd Plant-Disease-Detection
```

---

Install Dependencies

```bash
pip install -r requirements.txt
```

---

Run Application

```bash
streamlit run streamlit_app.py
```

---

# 📦 Requirements

```
streamlit
tensorflow
numpy
Pillow
opencv-python-headless
```

---

# 🌐 Deployment on Streamlit Community Cloud

## Step 1

Push the project to GitHub.

---

## Step 2

Open

https://share.streamlit.io/

---

## Step 3

Click

**New App**

---

## Step 4

Select

- Repository
- Branch
- Main File

```
streamlit_app.py
```

---

## Step 5

Click

**Deploy**

Your application will be live within a few minutes.

---

# 🎯 Prediction Workflow

```
Upload Image

↓

Image Preprocessing

↓

TensorFlow Lite Model

↓

Disease Prediction

↓

Confidence Score

↓

Treatment Recommendation

↓

Recommended Product

↓

Amazon / Flipkart Search
```

---

# 🌿 Supported Disease Classes

The model supports **38 PlantVillage classes**, including healthy leaves.

Examples:

- Apple Scab
- Black Rot
- Cedar Apple Rust
- Powdery Mildew
- Early Blight
- Late Blight
- Leaf Mold
- Bacterial Spot
- Mosaic Virus
- Healthy Leaves

---

# 💊 Treatment Recommendation

For every detected disease, the application provides:

- Disease Description
- Symptoms
- Treatment Steps
- Prevention Tips
- One Recommended Agricultural Product
- Amazon Search Link
- Flipkart Search Link

---

# 📈 Future Improvements

- 🔍 Top-3 disease predictions
- 🌍 Multi-language support
- 🎙 Voice assistant
- 📱 Mobile application
- 🌦 Weather-based disease alerts
- 📍 Location-specific recommendations
- 🤖 Gemini AI-powered farming assistant
- 📸 Camera-based live detection
- 🌱 Fertilizer recommendation
- 📊 Disease history dashboard

---

# 👨‍💻 Author

**Bhaskar Mandal**

M.Tech – Computer Science and Data Processing

Indian Institute of Technology Kharagpur

GitHub:
https://github.com/KGPIAN-Bhaskar

LinkedIn:
https://www.linkedin.com/in/bhaskar-mandal/

---

# ⭐ If you found this project useful

Please consider giving this repository a ⭐ on GitHub.