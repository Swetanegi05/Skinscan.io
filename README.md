
# 🩺 SkinScan.io

**Precision AI for Early Dermatological Screening**

## 📖 Overview

**SkinScan.io** is a high-performance diagnostic support tool built for the **BACSA Hacks 1-Day Challenge** at the University of Toronto. It addresses the "Open Challenge: Disease Detection" by transforming mobile imagery into actionable clinical data.

By combining a specialized **Convolutional Neural Network (CNN)** for lesion classification with an **Agentic AI reasoning layer**, SkinScan.io identifies potential risks and provides structured justifications for its findings, bridging the gap between raw data and patient understanding.

---

## ✨ Key Features

* **Neural Lesion Detection**: Real-time analysis of skin anomalies using a CNN trained on 2,000+ clinical images.
* **Unified Risk Index (URI)**: A custom mathematical model that weights prediction probability against model confidence to provide a transparent risk level.
* **Longitudinal "Mole Tracking"**: A secure history dashboard that allows users to monitor the evolution of specific spots over time—crucial for identifying malignant growth.
* **Agentic Clinical Reasoning**: An LLM-powered engine that translates technical metadata (asymmetry, border irregularity) into human-readable reports.

---

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python (FastAPI), Supabase (PostgreSQL) |
| **Computer Vision** | Roboflow Inference API, CNN (YOLOv8 architecture) |
| **Reasoning Engine** | Gemini 2.0 Flash |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 🧬 The Science: Modeling Uncertainty

A core requirement for this challenge was to **model uncertainty** and **justify assumptions**. SkinScan.io does this through our proprietary Risk Index formula:

$$URI = P(\text{condition} \mid \text{visuals}) \times C(\text{detection confidence})$$

Where:

* $P$ is the softmax probability from the final layer of the CNN.
* $C$ is the bounding-box confidence score reflecting image quality and lighting.

If the $URI$ falls below a defined threshold, the system triggers a **"Low Confidence"** state, advising the user to retake the photo under better lighting rather than providing a high-variance guess.

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js v18+
* Python 3.9+
* Roboflow API Key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skinscan-io.git
cd skinscan-io

```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Create a .env file with your ROBOFLOW_API_KEY and SUPABASE_URL
python main.py

```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

---

## 🚧 Challenges & Lessons Learned

* **Clinical Responsibility**: We learned that a "High Confidence" prediction on a "Low Quality" image is a failure state. We architected a validation layer to ensure data integrity.
* **Data Normalization**: Handling variations in skin tones and lighting was the biggest hurdle. We implemented pre-processing steps to normalize contrast before inference.
* **Asynchronous Pipelines**: Orchestrating vision APIs and reasoning LLMs concurrently required robust state management to keep the UI snappy.

---

## 🔮 Future Roadmap

1. **On-Device Inference**: Porting the model to TensorFlow Lite for 100% offline, private scanning.
2. **Fitzpatrick Skin Type Integration**: Enhancing the model to better account for diverse skin melanin levels.
3. **Telehealth Integration**: One-click sharing of "Mole Tracking" history with board-certified dermatologists.

---

