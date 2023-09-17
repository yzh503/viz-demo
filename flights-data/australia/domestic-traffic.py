import pandas as pd

data = pd.read_csv('pairs-201912.csv')

agg_data = data.groupby(['City1', 'City2'])['Seats'].sum().reset_index()

agg_data.columns = ['source', 'target', 'value']

agg_data['value'] = agg_data['value'] * 0.8
agg_data['value'] = agg_data['value'].astype(int)

# Convert source and target to upper case of first letter in each word
agg_data['source'] = agg_data['source'].str.title()
agg_data['target'] = agg_data['target'].str.title()


agg_data.to_csv('domestic-traffic.csv', index=False)
