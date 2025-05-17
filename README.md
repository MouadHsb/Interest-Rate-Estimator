# Interest Rate Estimator

A machine learning application that estimates loan interest rates based on various financial and personal factors. The system uses a CatBoost regression model and provides a user-friendly web interface.

## Project Structure

### Modeling
- `DataProcessing.ipynb`: Jupyter notebook for data preparation and preprocessing
- `ModelTraining.ipynb`: Model development, training, and evaluation
- `catboost.joblib`: Saved trained model
- `catboost_info/`: Model training logs

### Deployment
- `app.py`: Flask web application serving the model
- `Dockerfile`: Container configuration for deploying the application
- `requirements.txt`: Python dependencies
- `templates/`: HTML templates for the web interface
- `static/`: CSS, JavaScript, and other static assets

## Features

- Predicts interest rates based on multiple factors including:
  - FICO score
  - Loan amount
  - Debt-to-income ratio (DTI)
  - Revolving utilization
  - Total credit limit
  - Income
  - Term length
  - Verification status

- Calculates:
  - Estimated interest rate
  - Monthly payment
  - Total cost of the loan

## Setup and Installation

```bash
# Clone the repository
git clone [your-repository-url]
cd IntRateEstimator

# Install dependencies for the web application
pip install -r Deployement/requirements.txt
```

## Usage

### Model Training
To work with the Jupyter notebooks in the Modeling directory:

1. Install Jupyter and required libraries:
```bash
pip install jupyter pandas numpy scikit-learn matplotlib seaborn catboost
```

2. Start Jupyter notebook:
```bash
cd Modeling
jupyter notebook
```

3. Open and run the notebooks in this order:
   - First `DataProcessing.ipynb` for data preparation
   - Then `ModelTraining.ipynb` for model development

### Running the Web Application
```bash
cd Deployement
python app.py
```
Then open http://localhost:5000 in your browser.

### Docker Deployment
```bash
cd Deployement
docker build -t interest-rate-predictor .
docker run -p 5000:5000 interest-rate-predictor
```

## Cloud Deployment
The application is configured for deployment on Render:

1. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Choose the "Docker" environment
   - Set the build directory to "Deployement"

2. Configure environment variables if needed:
   - No environment variables are required for basic functionality

3. Deploy the service:
   - Render automatically builds and deploys your Docker container
   - The service will be accessible at the URL provided by Render

## Technologies Used
- Python (Flask, NumPy, Pandas, scikit-learn)
- CatBoost (Machine Learning)
- Docker
- Render (Cloud Deployment)
- HTML/CSS/JavaScript

## Authors
- Mouad El Hasbaoui