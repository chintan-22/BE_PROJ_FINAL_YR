# import pandas as pd
# import numpy as np
# import warnings
# import os
# import pickle
# from sklearn.utils import resample
# # Metrics
# from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# # Validation
# from sklearn.model_selection import train_test_split, cross_val_score, KFold
# # Preprocessing
# from sklearn.preprocessing import MinMaxScaler, StandardScaler, Normalizer, Binarizer
# # Models
# from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
# from sklearn.linear_model import LogisticRegression
# from sklearn.naive_bayes import GaussianNB
# from sklearn.svm import SVC
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.tree import DecisionTreeClassifier
# # Ensembles
# from sklearn.ensemble import RandomForestClassifier, BaggingClassifier, AdaBoostClassifier, GradientBoostingClassifier, ExtraTreesClassifier
# from sklearn.pipeline import Pipeline, make_pipeline  # Import make_pipeline and Pipeline
# # Regression Models for NPK prediction
# from sklearn.ensemble import RandomForestRegressor
# warnings.filterwarnings('ignore')

# def predict_crop(temperature, humidity, ph, rainfall):
#     """
#     Predict the most suitable crop based on the given environmental parameters.
    
#     Parameters:
#     temperature (float): Temperature in Celsius
#     humidity (float): Humidity percentage
#     ph (float): pH value of the soil
#     rainfall (float): Rainfall in mm
    
#     Returns:
#     str: Predicted crop name
#     """
#     # Load the datasets
#     df = pd.read_csv('SmartCrop-Dataset.csv')
    
#     # Features for NPK prediction
#     features_npk = ['temperature', 'humidity', 'ph', 'rainfall']
    
#     # Separate models for N, P, K
#     X_npk = df[features_npk]
#     y_N = df['N']
#     y_P = df['P']
#     y_K = df['K']
    
#     # Train test split for NPK models
#     XN_train, XN_test, yN_train, yN_test = train_test_split(X_npk, y_N, test_size=0.2, random_state=42)
#     XP_train, XP_test, yP_train, yP_test = train_test_split(X_npk, y_P, test_size=0.2, random_state=42)
#     XK_train, XK_test, yK_train, yK_test = train_test_split(X_npk, y_K, test_size=0.2, random_state=42)
    
#     # NPK models (RandomForestRegressor)
#     model_N = RandomForestRegressor().fit(XN_train, yN_train)
#     model_P = RandomForestRegressor().fit(XP_train, yP_train)
#     model_K = RandomForestRegressor().fit(XK_train, yK_train)

#     # Create a DataFrame from the input features for NPK prediction
#     input_data_npk = pd.DataFrame({
#         'temperature': [temperature],
#         'humidity': [humidity],
#         'ph': [ph],
#         'rainfall': [rainfall]
#     })

#     # Make NPK predictions
#     N = model_N.predict(input_data_npk)[0]
#     P = model_P.predict(input_data_npk)[0]
#     K = model_K.predict(input_data_npk)[0]
    
#     # Features for crop recommendation
#     features_crop = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
#     # Splitting data for crop recommendation
#     X_crop = df[features_crop]
#     y_crop = df['label']
#     X_crop_train, X_crop_test, y_crop_train, y_crop_test = train_test_split(X_crop, y_crop, test_size=0.2, random_state=42)

#     # Crop recommendation model (RandomForestClassifier)
#     crop_model = RandomForestClassifier()
#     crop_model.fit(X_crop_train, y_crop_train)

#     # Create a DataFrame from the input features for crop recommendation
#     input_data_crop = pd.DataFrame({
#         'N': [N],
#         'P': [P],
#         'K': [K],
#         'temperature': [temperature],
#         'humidity': [humidity],
#         'ph': [ph],
#         'rainfall': [rainfall]
#     }, index=[0])  # Ensure the input data has a row index

#     # Make crop prediction
#     predicted_crop = crop_model.predict(input_data_crop)[0]

#     return predicted_crop

# if __name__ == '__main__':
#     # Example usage
#     temperature = 28.0
#     humidity = 60.0
#     ph = 6.5
#     rainfall = 150.0

#     predicted_crop = predict_crop(temperature, humidity, ph, rainfall)
#     print(f"The recommended crop is: {predicted_crop}")

# # use this for ref

#2nd 
import pandas as pd
import numpy as np
import warnings
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
import json
import sys  # Import the sys module

warnings.filterwarnings('ignore')

def predict_crop(temperature, humidity, ph, rainfall, model_N, model_P, model_K, crop_model):
    """
    Predict the most suitable crop based on the given environmental parameters.
    
    Parameters:
    temperature (float): Temperature in Celsius
    humidity (float): Humidity percentage
    ph (float): pH value of the soil
    rainfall (float): Rainfall in mm
    
    Returns:
    str: Predicted crop name
    """
    # Create a DataFrame from the input features for NPK prediction
    input_data_npk = pd.DataFrame({
        'temperature': [temperature],
        'humidity': [humidity],
        'ph': [ph],
        'rainfall': [rainfall]
    }, index=[0])

    # Make NPK predictions
    N = model_N.predict(input_data_npk)[0]
    P = model_P.predict(input_data_npk)[0]
    K = model_K.predict(input_data_npk)[0]

    # Create a DataFrame from the input features for crop recommendation
    input_data_crop = pd.DataFrame({
        'N': [N],
        'P': [P],
        'K': [K],
        'temperature': [temperature],
        'humidity': [humidity],
        'ph': [ph],
        'rainfall': [rainfall]
    }, index=[0])
    # Make crop prediction
    predicted_crop = crop_model.predict(input_data_crop)[0]

    return json.dumps({ "prediction": predicted_crop })

if __name__ == '__main__':
    # Load your dataset
    df = pd.read_csv('SmartCrop-Dataset.csv')

    # Features for NPK prediction
    features_npk = ['temperature', 'humidity', 'ph', 'rainfall']
    # Separate models for N, P, K
    X_npk = df[features_npk]
    y_N = df['N']
    y_P = df['P']
    y_K = df['K']

    # Train test split for NPK models
    XN_train, XN_test, yN_train, yN_test = train_test_split(X_npk, y_N, test_size=0.2, random_state=42)
    XP_train, XP_test, yP_train, yP_test = train_test_split(X_npk, y_P, test_size=0.2, random_state=42)
    XK_train, XK_test, yK_train, yK_test = train_test_split(X_npk, y_K, test_size=0.2, random_state=42)

    # NPK models (RandomForestRegressor)
    model_N = RandomForestRegressor().fit(XN_train, yN_train)
    model_P = RandomForestRegressor().fit(XP_train, yP_train)
    model_K = RandomForestRegressor().fit(XK_train, yK_train)

    # Features for crop recommendation
    features_crop = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    # Splitting data for crop recommendation
    X_crop = df[features_crop]
    y_crop = df['label']
    X_crop_train, X_crop_test, y_crop_train, y_crop_test = train_test_split(X_crop, y_crop, test_size=0.2, random_state=42)

    # Crop recommendation model (RandomForestClassifier)
    crop_model = RandomForestClassifier()
    crop_model.fit(X_crop_train, y_crop_train)

    # Example usage
    # Fetch temperature, humidity, ph, and rainfall values from command line arguments
    
    if len(sys.argv) != 5:
        print("Usage: python model.py <temperature> <humidity> <ph> <rainfall>")
        sys.exit(1)
    try:
        temperature = float(sys.argv[1])
        humidity = float(sys.argv[2])
        ph = float(sys.argv[3])
        rainfall = float(sys.argv[4])
    except ValueError:
        print("Error: Temperature, humidity, ph, and rainfall must be numbers.")
        sys.exit(1)

    # Call the predict_crop function with fetched data and trained models
    predicted_crop = predict_crop(temperature, humidity, ph, rainfall, model_N, model_P, model_K, crop_model)
    print(predicted_crop)


# import pickle
# import numpy as np
# import firebase_admin
# from firebase_admin import credentials, db

# # Step 0: Load your trained models
# with open("model_N.pkl", "rb") as f:
#     model_N = pickle.load(f)
# with open("model_P.pkl", "rb") as f:
#     model_P = pickle.load(f)
# with open("model_K.pkl", "rb") as f:
#     model_K = pickle.load(f)
# with open("model.pkl", "rb") as f:
#     crop_model = pickle.load(f)  # Pipeline with scaler + classifier

# # Step 1: Initialize Firebase Admin SDK only if not already initialized
# if not firebase_admin._apps:
#     cred = credentials.Certificate("precisionfarming-216d3-firebase-adminsdk-fbsvc-b8067d305e.json")
#     firebase_admin.initialize_app(cred, {
#         'databaseURL': 'https://precisionfarming-216d3-default-rtdb.firebaseio.com/'
#     })

# # Step 2: Fetch the latest sensor data entry from Firebase
# ref = db.reference('sensor_data')
# latest_entry_query = ref.order_by_key().limit_to_last(1)
# latest_entry = latest_entry_query.get()

# if latest_entry:
#     latest_key = list(latest_entry.keys())[0]
#     sensor_data = latest_entry[latest_key]

#     # Safely get sensor values with defaults if missing
#     temperature = float(sensor_data.get('temperature', 0))
#     humidity = float(sensor_data.get('humidity', 0))
#     ph = float(sensor_data.get('ph', 0))
#     rainfall = float(sensor_data.get('rainfall', 0))

#     print(f"\nFetched latest from Firebase ({latest_key}):")
#     print(f"  Temperature: {temperature} °C")
#     print(f"  Humidity: {humidity} %")
#     print(f"  pH: {ph}")
#     print(f"  Rainfall: {rainfall} mm")

#     sensor_input = [[temperature, humidity, ph, rainfall]]

#     # Step 3: Predict N, P, K using trained models
#     pred_N = model_N.predict(sensor_input)[0]
#     pred_P = model_P.predict(sensor_input)[0]
#     pred_K = model_K.predict(sensor_input)[0]

#     print(f"\nPredicted Nutrients:")
#     print(f"  Nitrogen (N): {pred_N:.2f}")
#     print(f"  Phosphorus (P): {pred_P:.2f}")
#     print(f"  Potassium (K): {pred_K:.2f}")

#     # Step 4: Combine predicted N, P, K with original sensor input for crop recommendation
#     full_input = [[pred_N, pred_P, pred_K, temperature, humidity, ph, rainfall]]

#     # Step 5: Predict the crop
#     recommended_crop = crop_model.predict(full_input)[0]
#     print(f"\n🌱 Recommended Crop: {recommended_crop}")

# else:
#     print("No sensor data found in Firebase.")



