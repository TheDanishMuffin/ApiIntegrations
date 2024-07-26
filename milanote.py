import MilanoteUnofficialApi
import requests
from MilanoteUnofficialApi import MilanoteApi
from MilanoteUnofficialApi.milanote import HOME_URL


def get_home_board(self):

    self.logger.debug("Getting boards from home")
    response = requests.get(HOME_URL, headers=self.headers, cookies=self.cookies)
    if response.status_code == 200:
        return self.get_board_by_id(list(response.json()["elements"].keys())[0])
    else:
        self.logger.error("Error getting boards from home. Status code: %s", response.status_code)
        return None


my_headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    # 'cookie': '__stripe_mid=88d065bb-089e-4f62-ba0d-14304c0e02a9a340fe; intercom-device-id-uexq7thd=fedfd8db-3460-455d-a508-69d111f59ced; amp_787f3a_milanote.com=3nxZlaplp7fsZAQKXcPZmV.NjMxMjdkN2Y2ZmNhYmUyNjNlNTJlMTc4..1hij8lp11.1hij8lp13.7.8.f; _tt_enable_cookie=1; _ttp=ezrHHxIQp4yd0VZh4-5n4fKaLJQ; _pin_unauth=dWlkPVltTmlNVE5pTXpNdFlqazROaTAwT1RrM0xXRTBNbU10TXpVMFpEaGlNekl4TTJJMg; _mkto_trk=id:128-JHR-871&token:_mch-milanote.com-1710678023059-96023; ajs_anonymous_id=a317764b-c336-459d-8355-59f51245da1b; _ga_82XP0JMNWT=GS1.1.1710678294.2.1.1710678316.0.0.0; amp_just-a=lFt5pa6NHcoGV6pW2oJppD...1i2i67lua.1i2i67lua.0.0.0; _ga=GA1.1.398142788.1705170092; _ga_3LFWRGNHDM=GS1.1.1720744926.2.1.1720744992.0.0.0; __stripe_sid=156cd653-0a18-4a74-86f1-359d83123e7906cc08; aws-waf-token=2ca9c5e3-4501-45ed-8168-89d21a3966b4:EQoAaVlh9ExgAQAA:pakkcFCkdwuOROSwJ0SjBvMXQIIIP6hNf6n1TzWBIrQiPz+gZ6puMNIJEdXfgG4DcIRR2l2BYpb4MFz5iw5B+xWk5sUtPypPQLqVyvfm3TvkYQKaphTvfW37cspc/ceiNv+qYNBBA4iUu12a4gqiBQ5yo4kBOWEhGj9/Q0I9mUb6JWWuFVHEuKy8Q8uBVjkLuA==; mn-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzYWU1YzQ0MGI1YjUyNDk2NGVlMzIiLCJyb290Qm9hcmRJZCI6IjFTeGxFdzE1T2ZJQ2VGIiwicm9sZSI6IlVTRVIiLCJwbGF0Zm9ybSI6IldFQiIsImlhdCI6MTcyMjAwMzAzOH0.tiUISAK4HBrSww4dJQkQ3Or4OMvoimmoFhvfCsP5TSw; OptanonAlertBoxClosed=2024-07-26T14:10:57.205366079Z; mn-ot-data-subject-params=%7B%22id%22%3A%2266a3ae5c440b5b524964ee32%22%2C%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmEzYWU1YzQ0MGI1YjUyNDk2NGVlMzIiLCJpYXQiOjE3MjIwMDMwNjh9.2ziawGozuWRDuS64CPo0rwp5O7oU3UrSRt45ErJBgH4%22%2C%22isAnonymous%22%3Afalse%7D; io=rv_pXDcR3SrvHMYCBfcd; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+26+2024+10%3A11%3A08+GMT-0400+(Eastern+Daylight+Time)&version=6.38.0&isIABGlobal=false&hosts=&consentId=66a3ae5c440b5b524964ee32&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&iType=&geolocation=US%3BMA&AwaitingReconsent=false; AWSALB=/e0jGE1JHuoUQvS78+5K0olyvybuyXy7xYp1IH47eLTNfgIM7h2uE4xdMh/BaUQfdEm3WZC5NtzIPl+OH1Z8FfAGUB6/MZzzpItIjOlrQ/70a9L4OCuo/XnMoSCw; AWSALBCORS=/e0jGE1JHuoUQvS78+5K0olyvybuyXy7xYp1IH47eLTNfgIM7h2uE4xdMh/BaUQfdEm3WZC5NtzIPl+OH1Z8FfAGUB6/MZzzpItIjOlrQ/70a9L4OCuo/XnMoSCw; amp_787f3a=E7RpyX8MLgS8x9SrvacHRq.NjZhM2FlNWM0NDBiNWI1MjQ5NjRlZTMy..1i3nkt0d2.1i3nm35mb.4vf.2mf.7lu; intercom-session-uexq7thd=STVsVHNiM2RNNTRsSzZzZ0FpYnduUG1PQ3ZsRlNZdWIyMG1waVRXL3BBSnlBa3NWZkJUOHIzcGdid2pJS3dvQy0tdWhRL2NJbzV1RkJxR2xsbFlWM0IxZz09--4b2008831b8c9315f914d1e5be5c9973c63c4115',
    'priority': 'u=0, i',
    'referer': 'https://accounts.google.com/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',}

my_cookies = {'__stripe_mid': '88d065bb-089e-4f62-ba0d-14304c0e02a9a340fe',
    'intercom-device-id-uexq7thd': 'fedfd8db-3460-455d-a508-69d111f59ced',
    'amp_787f3a_milanote.com': '3nxZlaplp7fsZAQKXcPZmV.NjMxMjdkN2Y2ZmNhYmUyNjNlNTJlMTc4..1hij8lp11.1hij8lp13.7.8.f',
    '_tt_enable_cookie': '1',
    '_ttp': 'ezrHHxIQp4yd0VZh4-5n4fKaLJQ',
    '_pin_unauth': 'dWlkPVltTmlNVE5pTXpNdFlqazROaTAwT1RrM0xXRTBNbU10TXpVMFpEaGlNekl4TTJJMg',
    '_mkto_trk': 'id:128-JHR-871&token:_mch-milanote.com-1710678023059-96023',
    'ajs_anonymous_id': 'a317764b-c336-459d-8355-59f51245da1b',
    '_ga_82XP0JMNWT': 'GS1.1.1710678294.2.1.1710678316.0.0.0',
    'amp_just-a': 'lFt5pa6NHcoGV6pW2oJppD...1i2i67lua.1i2i67lua.0.0.0',
    '_ga': 'GA1.1.398142788.1705170092',
    '_ga_3LFWRGNHDM': 'GS1.1.1720744926.2.1.1720744992.0.0.0',
    '__stripe_sid': '156cd653-0a18-4a74-86f1-359d83123e7906cc08',
    'aws-waf-token': '2ca9c5e3-4501-45ed-8168-89d21a3966b4:EQoAaVlh9ExgAQAA:pakkcFCkdwuOROSwJ0SjBvMXQIIIP6hNf6n1TzWBIrQiPz+gZ6puMNIJEdXfgG4DcIRR2l2BYpb4MFz5iw5B+xWk5sUtPypPQLqVyvfm3TvkYQKaphTvfW37cspc/ceiNv+qYNBBA4iUu12a4gqiBQ5yo4kBOWEhGj9/Q0I9mUb6JWWuFVHEuKy8Q8uBVjkLuA==',
    'mn-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzYWU1YzQ0MGI1YjUyNDk2NGVlMzIiLCJyb290Qm9hcmRJZCI6IjFTeGxFdzE1T2ZJQ2VGIiwicm9sZSI6IlVTRVIiLCJwbGF0Zm9ybSI6IldFQiIsImlhdCI6MTcyMjAwMzAzOH0.tiUISAK4HBrSww4dJQkQ3Or4OMvoimmoFhvfCsP5TSw',
    'OptanonAlertBoxClosed': '2024-07-26T14:10:57.205366079Z',
    'mn-ot-data-subject-params': '%7B%22id%22%3A%2266a3ae5c440b5b524964ee32%22%2C%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmEzYWU1YzQ0MGI1YjUyNDk2NGVlMzIiLCJpYXQiOjE3MjIwMDMwNjh9.2ziawGozuWRDuS64CPo0rwp5O7oU3UrSRt45ErJBgH4%22%2C%22isAnonymous%22%3Afalse%7D',
    'io': 'rv_pXDcR3SrvHMYCBfcd',
    'OptanonConsent': 'isGpcEnabled=0&datestamp=Fri+Jul+26+2024+10%3A11%3A08+GMT-0400+(Eastern+Daylight+Time)&version=6.38.0&isIABGlobal=false&hosts=&consentId=66a3ae5c440b5b524964ee32&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&iType=&geolocation=US%3BMA&AwaitingReconsent=false',
    'AWSALB': '/e0jGE1JHuoUQvS78+5K0olyvybuyXy7xYp1IH47eLTNfgIM7h2uE4xdMh/BaUQfdEm3WZC5NtzIPl+OH1Z8FfAGUB6/MZzzpItIjOlrQ/70a9L4OCuo/XnMoSCw',
    'AWSALBCORS': '/e0jGE1JHuoUQvS78+5K0olyvybuyXy7xYp1IH47eLTNfgIM7h2uE4xdMh/BaUQfdEm3WZC5NtzIPl+OH1Z8FfAGUB6/MZzzpItIjOlrQ/70a9L4OCuo/XnMoSCw',
    'amp_787f3a': 'E7RpyX8MLgS8x9SrvacHRq.NjZhM2FlNWM0NDBiNWI1MjQ5NjRlZTMy..1i3nkt0d2.1i3nm35mb.4vf.2mf.7lu',
    'intercom-session-uexq7thd': 'STVsVHNiM2RNNTRsSzZzZ0FpYnduUG1PQ3ZsRlNZdWIyMG1waVRXL3BBSnlBa3NWZkJUOHIzcGdid2pJS3dvQy0tdWhRL2NJbzV1RkJxR2xsbFlWM0IxZz09--4b2008831b8c9315f914d1e5be5c9973c63c4115',}

api = MilanoteApi(headers=my_headers, cookies=my_cookies)

home_board = api.get_home_board()

my_board = api.get_board_by_id("1Pwm1W1wCvBF4C")

for board in my_board.elements["BOARD"]:
    api.get_board_elements(board)

if(my_board.elements["TASK"]):
    for task in my_board.elements["TASK"]:
        print(task.text_content,
              "completed" if task.is_complete else "not completed")
