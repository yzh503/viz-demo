def process_airport_data(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()

    continent = None
    country = None
    new_data = []
    previous_line = None

    for line in lines:
        line = line.strip()
        if not line or 'CLOSED' in line:
            continue

        if ',' in line: 
            assert country is not None and continent is not None, f"{country}, {continent}"
            datum = line.split(',')
            if len(datum) == 2:
                datum.insert(0, datum[0].split(' ')[0])
            city, airport, iata = datum[0], datum[1], datum[2]
            new_line = [airport, city, country, continent, iata]
            new_line = ','.join(new_line)
            new_line = new_line.replace('"', '')
            new_data.append(new_line)
        else: 
            if previous_line is None or ',' not in previous_line:
                continent = previous_line
            country = line
            
        
        previous_line = line

    # Write the modified data to a new file
    with open('international.csv', 'w') as f:
        f.write('airport,city,country,continent,iata\n')
        for line in new_data:
            f.write(line + '\n')

# Call the function with the name of your text file
process_airport_data('international.txt')
