import pandas as pd

airlines = pd.read_csv('airlines.csv')
routes = pd.read_csv('routes.csv')

airlines['airline_id'] = airlines['airline_id'].astype(str)
routes['airline_id'] = routes['airline_id'].astype(str)

route_counts = routes.groupby('airline_id').size().reset_index(name='number_of_routes')

merged_data = pd.merge(airlines, route_counts, on='airline_id')

sorted_data = merged_data.sort_values(by='number_of_routes', ascending=False)
sorted_data[['name', 'number_of_routes']].to_csv('airline-business.csv', index=False)
