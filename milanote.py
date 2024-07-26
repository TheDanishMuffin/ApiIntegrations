import os
import MilanoteUnofficialApi
import requests
import logging
import time
from MilanoteUnofficialApi import MilanoteApi
from MilanoteUnofficialApi.milanote import HOME_URL
from tqdm import tqdm
import argparse
import csv
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

logging.basicConfig(level=logging.DEBUG)

def setup_session(retries=3, backoff_factor=0.3, status_forcelist=(500, 502, 504)):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

session = setup_session()

class EnhancedMilanoteApi(MilanoteApi):
    def get_home_board(self):
        self.logger.debug("Getting boards from home")
        try:
            response = session.get(HOME_URL, headers=self.headers, cookies=self.cookies)
            response.raise_for_status()
            return self.get_board_by_id(list(response.json()["elements"].keys())[0])
        except requests.RequestException as e:
            self.logger.error("Error getting boards from home: %s", e)
            return None

def export_tasks_to_csv(tasks, filename='tasks.csv'):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['Task', 'Status']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for task in tasks:
            writer.writerow({'Task': task.text_content, 'Status': 'completed' if task.is_complete else 'not completed'})

def main(filter_tasks=None):
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
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
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    }

    cookies = {
        '__stripe_mid': os.getenv('__stripe_mid'),
        'intercom-device-id-uexq7thd': os.getenv('intercom_device_id'),
        'amp_787f3a_milanote.com': os.getenv('amp_milanote_com'),
        '_tt_enable_cookie': os.getenv('_tt_enable_cookie'),
        '_ttp': os.getenv('_ttp'),
        '_pin_unauth': os.getenv('_pin_unauth'),
        '_mkto_trk': os.getenv('_mkto_trk'),
        'ajs_anonymous_id': os.getenv('ajs_anonymous_id'),
        '_ga_82XP0JMNWT': os.getenv('_ga_82XP0JMNWT'),
        'amp_just-a': os.getenv('amp_just_a'),
        '_ga': os.getenv('_ga'),
        '_ga_3LFWRGNHDM': os.getenv('_ga_3LFWRGNHDM'),
        '__stripe_sid': os.getenv('__stripe_sid'),
        'aws-waf-token': os.getenv('aws_waf_token'),
        'mn-token': os.getenv('mn_token'),
        'OptanonAlertBoxClosed': os.getenv('OptanonAlertBoxClosed'),
        'mn-ot-data-subject-params': os.getenv('mn_ot_data_subject_params'),
        'io': os.getenv('io'),
        'OptanonConsent': os.getenv('OptanonConsent'),
        'AWSALB': os.getenv('AWSALB'),
        'AWSALBCORS': os.getenv('AWSALBCORS'),
        'amp_787f3a': os.getenv('amp_787f3a'),
        'intercom-session-uexq7thd': os.getenv('intercom_session_uexq7thd'),
    }

    api = EnhancedMilanoteApi(headers=headers, cookies=cookies)

    home_board = api.get_home_board()

    if home_board:
        my_board = api.get_board_by_id("1Pwm1W1wCvBF4C")

        for board in tqdm(my_board.elements.get("BOARD", []), desc="Fetching board elements"):
            api.get_board_elements(board)

        tasks = my_board.elements.get("TASK", [])
        if filter_tasks:
            tasks = [task for task in tasks if (task.is_complete and filter_tasks == 'completed') or (not task.is_complete and filter_tasks == 'not_completed')]
        
        for task in tasks:
            print(task.text_content, "completed" if task.is_complete else "not completed")
        
        export_tasks_to_csv(tasks)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Milanote API Script with Extended Features")
    parser.add_argument('--filter-tasks', choices=['completed', 'not_completed'], help='Filter tasks by completion status')
    args = parser.parse_args()

    main(filter_tasks=args.filter_tasks)
