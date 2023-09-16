import pandas as pd

# Load the CSV files into pandas DataFrames
routes_df = pd.read_csv('routes.csv')
airports_df = pd.read_csv('airports.csv')

# Convert the relevant columns to string type
routes_df['source_airport_id'] = routes_df['source_airport_id'].astype(str)
routes_df['destination_airport_id'] = routes_df['destination_airport_id'].astype(str)
airports_df['id'] = airports_df['id'].astype(str)

# Merge routes with airports to get source city and coordinates
merged_df = routes_df.merge(airports_df[['id', 'city', 'longitude', 'latitude']], 
                            left_on='source_airport_id', 
                            right_on='id', 
                            how='left').rename(columns={
                                'city': 'source_city',
                                'longitude': 'source_longitude',
                                'latitude': 'source_latitude'
                            }).drop(columns='id')

# Merge again to get destination city and coordinates
merged_df = merged_df.merge(airports_df[['id', 'city', 'longitude', 'latitude']], 
                            left_on='destination_airport_id', 
                            right_on='id', 
                            how='left').rename(columns={
                                'city': 'destination_city',
                                'longitude': 'destination_longitude',
                                'latitude': 'destination_latitude'
                            }).drop(columns='id')

# Extract the required columns
output_df = merged_df[['source_city', 'destination_city', 
                       'source_longitude', 'destination_longitude', 
                       'source_latitude', 'destination_latitude']]

output_df.to_csv('city-routes.csv', index=False)