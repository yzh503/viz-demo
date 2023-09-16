import csv
import json

def csv_to_json_hierarchy(filename):
    hierarchy = {"name": "airports", "children": []}

    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            continent = row['continent']
            country = row['country']
            city = row['city']
            airport = row['airport']

            continent_node = next((item for item in hierarchy["children"] if item["name"] == continent), None)
            if not continent_node:
                continent_node = {"name": continent, "children": []}
                hierarchy["children"].append(continent_node)

            country_node = next((item for item in continent_node["children"] if item["name"] == country), None)
            if not country_node:
                country_node = {"name": country, "children": []}
                continent_node["children"].append(country_node)

            city_node = next((item for item in country_node["children"] if item["name"] == city), None)
            if not city_node:
                city_node = {"name": city, "children": []}
                country_node["children"].append(city_node)

            airport_node = {"name": airport, "value": 1}
            city_node["children"].append(airport_node)

    return hierarchy

filename = 'international.csv'
hierarchical_data = csv_to_json_hierarchy(filename)
json_output = json.dumps(hierarchical_data, indent=4)
print(json_output)
