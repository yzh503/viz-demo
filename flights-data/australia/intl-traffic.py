import pandas as pd
df = pd.read_csv('flight-2022.csv')
agg_df = df.groupby(['Australian_City', 'Year', 'Month_num'])['Max_Seats'].sum().reset_index()
agg_df['Date'] = pd.to_datetime(agg_df['Year'].astype(str) + '-' + agg_df['Month_num'].astype(str) + '-01')
agg_df = agg_df.drop(columns=['Year', 'Month_num'])
agg_df = agg_df.rename(columns={'Australian_City': 'name', 'Date': 'date', 'Max_Seats': 'value'})
agg_df.to_csv('intl-traffic.csv', index=False)
