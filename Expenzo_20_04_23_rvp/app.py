from flask import Flask, request, jsonify
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from flask import Flask, request, render_template
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

from datetime import datetime

from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import io
import base64
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

from sklearn.tree import DecisionTreeRegressor

from flask import Flask, render_template, make_response
import pdfkit

app = Flask(__name__)


@app.route('/', endpoint='login_page')
def login():
    return render_template("login.html")


@app.route('/home', endpoint='home_page')
def home():
    return render_template("home.html")



@app.route('/rvp', methods=['POST'])
def predict():
    # Load data from request payload
    data = request.get_json()['data']
    df = pd.DataFrame(data)

    # Preprocess data and make predictions using the machine learning model
    transformer = ColumnTransformer(
        transformers=[
            ('encoder', OneHotEncoder(handle_unknown='ignore'), [0, 1])
        ],
        remainder='passthrough'
    )
    model = LinearRegression()
    pipeline = Pipeline([
        ('transformer', transformer),
        ('model', model)
    ])
    pipeline.fit(df[['category', 'month']], df['amount'])

    # Predict future expenses
    future_data = pd.DataFrame({
        'month': [10, 11, 12, 1, 2, 3],
        'category': ['food', 'entertainment', 'transportation', 'shopping', 'housing', 'other'],
    })
    predictions = pipeline.predict(future_data[['category', 'month']])

    # Format predictions as a dictionary
    feature_names = list(transformer.named_transformers_[
                         'encoder'].get_feature_names_out(['category', 'month']))

    prediction_dict = {}
    for i in range(len(future_data)):
        month = future_data.loc[i, 'month']
        category = future_data.loc[i, 'category']
        prediction = predictions[i]
        prediction_dict[f"{month}-{category}"] = prediction

    # Return predictions as JSON response
    return jsonify(prediction_dict)



@app.route('/rvp3', methods=['POST'])
def predict_expense():
    data = request.json['data']
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date']) # Convert date column to datetime format
    df['month'] = df['date'].dt.month # Extract month from the date column
    X = df['month'].values.reshape(-1, 1) # Use date column as input feature
    y = df['amount'].values
    model = RandomForestRegressor(n_estimators=100, random_state=0) # Use Random Forest Regressor with 100 trees
    model.fit(X, y)
    future_dates = pd.date_range(start=df['month'].max(), periods=6, freq='MS') # Generate future dates for the next 6 months
    # future_dates = future_dates[1:] # Remove the first month, since it's already in the data
    future_dates = future_dates.values.reshape(-1, 1)
    predictions = model.predict(future_dates)
    return jsonify({'predictions': list(predictions)}
)


# @app.route('/rvp2', methods=['POST'])
# def predict2():
    
#     data2 = request.get_json()['data']
#     data = pd.DataFrame(data2)


# # Select the relevant features for clustering
#     X = data[['category', 'amount', 'currency', 'month']]

# # Convert categorical features into numerical features
#     X = pd.get_dummies(X)

# # Apply KMeans clustering with 3 clusters
#     kmeans = KMeans(n_clusters=3, random_state=0).fit(X)

# # Add the cluster labels to the original data
#     data['cluster'] = kmeans.labels_

# # Print the results
#     print(data.groupby('cluster').mean())
    
#     return jsonify(data.groupby('cluster').mean())





# @app.route('/rvp3', methods=['POST'])
# def process_expense_data():
#     data = request.get_json()['data']
    
#     # Load the expense data into a Pandas DataFrame
#     df = pd.DataFrame(data)

#     # Select the relevant features for clustering
#     X = df[['category', 'amount', 'currency', 'month']]

#     # Convert categorical features into numerical features
#     X = pd.get_dummies(X)

#     # Apply KMeans clustering with 3 clusters
#     kmeans = KMeans(n_clusters=3, random_state=0).fit(X)

#     # Add the cluster labels to the original data
#     df['cluster'] = kmeans.labels_

#     # Train a linear regression model to predict expenses for next month
#     X_train = X[X['month'] != 11]
#     y_train = df.loc[df['month'] != 11, 'amount']
#     X_test = X[X['month'] == 11]
#     lm = LinearRegression().fit(X_train, y_train)
#     y_pred = lm.predict(X_test)

#     # Add the predicted expenses to the original data
#     df_pred = pd.DataFrame({'category': X_test['category'],
#                             'amount': y_pred,
#                             'currency': X_test['currency'],
#                             'date': '01/12/2023',
#                             'month': 11,
#                             'cluster': kmeans.predict(X_test)})
#     df = pd.concat([df, df_pred])

#     # Group the expenses by date and cluster, and compute the sum
#     grouped_df = df.groupby(['date', 'cluster'])['amount'].sum().reset_index()

#     # Pivot the table to get the clusters as columns and the dates as rows
#     pivoted_df = grouped_df.pivot(index='date', columns='cluster', values='amount').fillna(0)

#     # Plot the predicted expenses as a line chart
#     fig, ax = plt.subplots(figsize=(12, 6))
#     pivoted_df.plot(ax=ax)
#     ax.set_xlabel('Date')
#     ax.set_ylabel('Expense Amount')
#     ax.set_title('Predicted Expenses for December 2023')
#     ax.legend(title='Cluster', bbox_to_anchor=(1.05, 1), loc='upper left')

#     # Convert the plot to a base64-encoded PNG image
#     buffer = io.BytesIO()
#     fig.savefig(buffer, format='png', bbox_inches='tight')
#     buffer.seek(0)
#     image_data = base64.b64encode(buffer.getvalue()).decode()

#     # Return the image as a JSON object
#     return jsonify({ 'image': image_data })



# @app.route('/rvp3', methods=['POST'])
# def rvp3():
#     data = request.json['data']
    
#     # Load the expense data into a Pandas DataFrame
#     data = pd.DataFrame(data)

#     # Convert categorical features into numerical features
#     X = pd.get_dummies(data[['category', 'currency']])

#     # Add the numerical features to X
#     X[['amount', 'month']] = data[['amount', 'month']]

#     # Separate X into training and testing sets
#     X_train = X[X['month'] != 1]  # Use all months except February for training
#     X_test = X[X['month'] == 1]   # Use February for testing

#     # Separate the target variable (amount) into y_train and y_test
#     y_train = data[data['month'] != 1]['amount']
#     y_test = data[data['month'] == 1]['amount']

#     # Train a Linear Regression model
#     lr = LinearRegression()
#     lr.fit(X_train, y_train)

#     # Predict the next month's expenses
#     X_next_month = X_test.copy()
#     X_next_month['month'] = 2  # Set the next month to March
#     y_pred = lr.predict(X_next_month)

#     # Convert y_pred into a list and send it back to JavaScript
#     return jsonify({'predicted': list(y_pred)})

@app.route('/download-pdf')
def download_pdf():
    # Create a new HTML document containing only the canvas element to be printed
    html_content = '<html><body><canvas id="myChart"></canvas></body></html>'
    
    # Render the HTML content to a PDF using PDFKit and wkhtmltopdf
    options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'disable-smart-shrinking': None
    }
    pdfkit.from_string(html_content, '/tmp/output.pdf', options=options)

    # Return the PDF file as a response to the user
    with open('/tmp/output.pdf', 'rb') as f:
        data = f.read()
    response = make_response(data)
    response.headers.set('Content-Type', 'application/pdf')
    response.headers.set('Content-Disposition', 'attachment', filename='file.pdf')
    return response


@app.route('/generate-pdf')
def generate_pdf():
    # Get the canvas element by its ID
    canvas = html2canvas.Html2Canvas(document.getElementById("my-canvas"))

    # Convert the canvas to a base64-encoded image
    image = canvas.toDataURL()

    # Create a new HTML document containing only the image element
    html_content = '<html><body><img src="' + image + '"></body></html>'

    # Render the HTML content to a PDF using PDFKit and wkhtmltopdf
    options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'disable-smart-shrinking': None
    }
    pdfkit.from_string(html_content, '/tmp/output.pdf', options=options)

    # Return the PDF file as a response to the user
    with open('/tmp/output.pdf', 'rb') as f:
        data = f.read()
    response = make_response(data)
    response.headers.set('Content-Type', 'application/pdf')
    response.headers.set('Content-Disposition', 'attachment', filename='file.pdf')
    return response
        
if __name__ == '__main__':
    app.run()