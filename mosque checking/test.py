import requests, json

a = requests.get("https://go2masjid.com/api/papi/get_citylist.php")
data = json.loads(a.text)

        
for x in range(len(data)):
    city = data[x]['cityname']
    
    try:
        b = requests.get("https://go2masjid.com/api/papi/loc_getcity.php?name=" + str(city))
        beta = json.loads(b.text)
        
        with open('working mosques.txt', 'a') as f:
            for i in range(len(beta)):
                f.write(f"{beta[i]['masjidname']}, {city}\n")
                time = beta[i]['salats'][0]['fajarstart']
                f.write("Times not set up\n" if time == "00:00" else "Times have been set up and is working\n" )
                f.write("-"*25+"\n")
    except Exception as e:
        with open('errors.txt', 'a') as p:
            p.write(f"{e} {city}\n")