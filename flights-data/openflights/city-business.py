import pandas as pd

routes_df = pd.read_csv('routes.csv')
airports_df = pd.read_csv('airports.csv')

routes_df['source_airport_id'] = routes_df['source_airport_id'].astype(str)
routes_df['destination_airport_id'] = routes_df['destination_airport_id'].astype(str)
airports_df['id'] = airports_df['id'].astype(str)

routes_df = routes_df.merge(airports_df[['id', 'city']], left_on='source_airport_id', right_on='id', how='left').rename(columns={'city': 'source_city'}).drop(columns='id')
routes_df = routes_df.merge(airports_df[['id', 'city']], left_on='destination_airport_id', right_on='id', how='left').rename(columns={'city': 'destination_city'}).drop(columns='id')

outgoing_routes = routes_df.groupby('source_city').size().reset_index(name='out')
incoming_routes = routes_df.groupby('destination_city').size().reset_index(name='in')
combined_routes = outgoing_routes.merge(incoming_routes, left_on='source_city', right_on='destination_city', how='outer').fillna(0)
combined_routes['number_of_routes'] = combined_routes['out'] + combined_routes['in']

sorted_cities = combined_routes.sort_values(by='number_of_routes', ascending=False)

cities = sorted_cities.apply(lambda row: {
    'name': row['source_city'],
    'number_of_routes': int(row['number_of_routes']),
    'in': int(row['in']),
    'out': int(row['out'])
}, axis=1).tolist()

cities_df = pd.DataFrame(cities)
cities_df.to_csv('city-business.csv', index=False)

