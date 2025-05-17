from flask import Flask, render_template, jsonify, request
import numpy as np
import joblib
import pandas as pd

app = Flask(__name__)
model = joblib.load('catboost.joblib')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'server': 'running'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    print("Received data:", data)
    
    # Define feature names to match what was used during training
    feature_names = ['fico', 'loan_amnt', 'dti', 'revol_util', 'total_bc_limit', 
                     'revol_bal', 'total_acc', 'annual_inc', 'mths_since_recent_inq', 
                     'open_acc', 'term_encoded', 'verified_Not_Verified', 
                     'verified_Verified', 'title_Credit_card_refinancing']
    
    # Create features array
    features_dict = {
        'fico': int(data['fico']),
        'loan_amnt': float(data['loan_amnt']),
        'dti': float(data['dti']),
        'revol_util': float(data['revol_util']),
        'total_bc_limit': float(data['total_bc_limit']),
        'revol_bal': float(data['revol_bal']),
        'total_acc': float(data['total_acc']),
        'annual_inc': float(data['annual_inc']),
        'mths_since_recent_inq': float(data['mths_since_recent_inq']),
        'open_acc': float(data['open_acc']),
        'term_encoded': int(data['term_encoded']),
        'verified_Not_Verified': int(data['verified_Not_Verified']),
        'verified_Verified': int(data['verified_Verified']),
        'title_Credit_card_refinancing': int(data['title_Credit_card_refinancing'])
    }
    
    features_df = pd.DataFrame([features_dict])
    print("Features DataFrame:", features_df)
    
    predicted_rate = model.predict(features_df)[0]
    print("Raw predicted rate:", predicted_rate)
    
    predicted_rate = max(5.0, min(predicted_rate, 25.0))
    print("Adjusted predicted rate:", predicted_rate)
    
    principal = float(data['loan_amnt'])
    term_months = int(data['term'])
    monthly_rate = predicted_rate / 1200 
    
    monthly_payment = principal * (monthly_rate * (1 + monthly_rate)**term_months) / ((1 + monthly_rate)**term_months - 1)
    total_cost = monthly_payment * term_months
    print("Calculated monthly payment:", monthly_payment)
    print("Calculated total cost:", total_cost)

    response = {
        'interest_rate': round(predicted_rate, 2),
        'monthly_payment': round(monthly_payment, 2),
        'total_cost': round(total_cost, 2)
    }
    print("Sending response:", response)
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)