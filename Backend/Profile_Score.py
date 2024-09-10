from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service as ChromeService 
from webdriver_manager.chrome import ChromeDriverManager 
import time
import re
from bs4 import BeautifulSoup as beauty
import requests
import urllib
from datetime import datetime
from selenium.webdriver.chrome.options import Options
import json



def profile_score(score_data):
    #___________________________________________________________
    # Input Fields:                                            |
    # Insta profile link, LinkedIn profile Link,               |
    # Twitter Link, income from user and experice from user.   |
    # _________________________________________________________|

    #=============================================================================
    #LinkedIn Scrapper
    # Get the LinkedIn profile URL

    linkedin_profile_url = score_data['LinkedIn']

        
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    # Start the Chrome web browser
    driver = webdriver.Chrome(options=chrome_options)
    print('LinkedIn Scraping is going on.....')

    driver.get(linkedin_profile_url)
    time.sleep(10)
    # Get the HTML of the LinkedIn profile page
    html = driver.page_source

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")


    # NOTE: Yaha pr bhi miss match hai class name ke mapping me
    # Get the intern's name


    name = soup.find(
        "h1", class_="ember-view text-display-medium-bold org-top-card-summary__title full-width")
    if (name!=None):
        name=name.text
    else:
        name="no name"

    
    # print(name)
    stock = soup.find("div", class_="org-stockquote-info__content-right")
    if stock != None:
        stock = stock.text
    else:
        stock = "No stocks"
    # print(stock)

    about_linkedin = soup.find("div", class_="ember-view organization-about-module__content-consistant-cards-description")


    if about_linkedin != None:
        about_linkedin = about_linkedin.text
    else:
        about_linkedin = "Null"
    # print(about_linkedin)
    # print(len(about_linkedin))

    data = {
        "name": name,
        "stocks": stock,
        "about": about_linkedin,
    }

    # Close the Chrome web browser
    driver.quit()

        # Print the scraped data
        # print(data)



    #==========================================================================
    #Instagram Scrapper
    # Get the LinkedIn profile URL
    insta_url = score_data['Instagram']

    # Start the Chrome web browserw
    
    driver = webdriver.Chrome(options=chrome_options)
    print('Instagram Scraping going on ......')

    # Go to the Insta login page
    driver.get("https://www.instagram.com/accounts/login/")
    time.sleep(3)
    # Enter the Insta username and password
    username_element = driver.find_element(By.NAME, "username")
    username_element.send_keys("existing_iota")
    time.sleep(3)

    password_element = driver.find_element(By.NAME, "password")
    password_element.send_keys("$7Istuti7$")
    time.sleep(3)

    # Click the "Sign in" button
    sign_in_button = driver.find_element(By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')
    sign_in_button.click()
    time.sleep(5)
    # Wait for the Insta profile page to load
    driver.get(insta_url)
    time.sleep(10)
    html = driver.page_source

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    name = soup.find(
        "h2", class_="x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye x1ms8i2q xo1l8bm x5n08af x10wh9bi x1wdrske x8viiok x18hxmgj")
    if (name!=None):
        name=name.text
    else:
        name="no name"
    # print(name)
    data = soup.find_all("span", class_="html-span xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs")
    data = list(map(lambda x: x.text, data))
    post = data[0]
    insta_followers = data[1]
    followings = data[2]

    print(post,insta_followers, followings)

    about_insta = soup.find("h1", class_="_aacl _aaco _aacu _aacx _aad6 _aade")


    if about_insta != None:
        about_insta = about_insta.text
    else:
        about_insta = "Null"
    print(about_insta)
    print(len(about_insta))

    insta_data = {
        "name": name,
        "post": post,
        "about": about_insta,
        "followers": insta_followers,
        "following": followings,
    }

    # Close the Chrome web browser
    driver.quit()

    # Print the scraped data
    print(insta_data)
    #==================================================================================
    #twitter Scrapper

    # url=score_data['Twitter']

    url='https://twitter.com/Microsoft'

    urllib.request.urlparse(url).netloc
    if(urllib.request.urlparse(url).netloc=="twitter.com"):
        print('Twitter Scraping going on ......')
        dr=webdriver.Chrome(options=chrome_options)
        dr.get(url)
        print('b')
        x=requests.get(url)
        print('a')
        if x.status_code==200:
            print('inside 200')
            con=dr.page_source
            # dr.close()
            sp=beauty(con,"html.parser")
            basics=sp.find('script',attrs={'data-testid':'UserProfileSchema-test'})
            if basics!=None:
                basics=sp.find('script',attrs={'data-testid':'UserProfileSchema-test'}).text
                print(basics)
                import json
                basics=json.loads(basics)
                print(basics, type(basics))
                # print(basics, type(basics))
                # print(basics["author"]["homeLocation"]["name"])
                # print(basics["author"]["description"])
                if basics["author"]["description"]!=None:
                    twitter_description=basics["author"]["description"]
                else:
                    twitter_description=None
                if basics["author"]["homeLocation"]["name"]!=None:
                    twitter_loc=basics["author"]["homeLocation"]["name"]
                else:
                    twitter_loc=None
            else:
                twitter_description=None
                twitter_loc=None
        else:
                #different error statements depending on status_code
            # print("domain:twitter , website:Could not be accessed.")
            print("inside nested else")
    else:
        # print("domain:not twitter , website:False")
        print("inside parent else")   
    
    # twitter_description=None
    # twitter_loc=None 
    
    # # ============================================================================================

    print('are are bhai bhai')
    income=score_data['Income']
    experience=20
    personal_website=score_data['Personal_Website']

    user='company'
    if user=='company':
        #instagram followers
        if type(insta_followers)!=int and insta_followers!=None:
            numbers = re.findall(r'\d+\.\d+|\d+', insta_followers)
            insta_followers= [float(number) for number in numbers]
            # print(insta_followers)
            insta_followers=insta_followers[0]
                
            if insta_followers<250 and insta_followers>=0:
                insta_followers=0.5
            elif insta_followers>=200 and insta_followers<500:
                insta_followers=1
            elif insta_followers>=500 and insta_followers<1000:
                insta_followers=1.5
            elif insta_followers>=1000 and insta_followers<1500:
                insta_followers=2
            elif insta_followers>=1500:
                insta_followers=2.5
        else:
            insta_followers=0
        print('done',insta_followers)

        if type(post)!=int and post!=None:
            numbers = re.findall(r'\d+\.\d+|\d+', post)
            post= [float(number) for number in numbers]
            # print(post)
            post=post[0]
            if post<3 and post>=0:
                post=0.5
            elif post>=3 and post<7:
                post=1
            elif post>=7 and post<13:
                insta_followers=1.5
            elif post>=13 and post<20:
                post=2
            elif post>=20:
                poat=2.5
        else:
            post=0
        if about_insta!=None:
            about_insta=len(about_insta)#instagram maxi length is 150
            if about_insta<20 and about_insta>=0:
                about_insta=1
            elif about_insta>=20 and about_insta<50:
                about_insta=2
            elif about_insta>=50 and about_insta<100:
                about_insta=3
            elif about_insta>=100 and about_insta<=120:
                about_insta=4
            elif about_insta>=120:
                about_insta=5
        else:
            about_insta=0

        if about_linkedin!=None:
            about_linkedin=len(about_linkedin)#instagram maxi length is 150
            if about_linkedin<50 and about_linkedin>=0:
                about_linkedin=1
            elif about_linkedin>=50 and about_linkedin<100:
                about_linkedin=2
            elif about_linkedin>=100 and about_linkedin<500:
                about_linkedin=3
            elif about_linkedin>=500 and about_linkedin<1000:
                about_linkedin=4
            elif about_linkedin>=1000:
                about_linkedin=5
        else:
            about_linkedin=0

        

        if stock!="No stocks":
            numbers = re.findall(r'\d+\.\d+|\d+', stock)
            stock= [float(number) for number in numbers]
            stock=stock[0]
            stock= (stock/108632.45)*10
            #most expensive stock of India is of Rs.108632.45
        else:
            stock=0

        if income>=0 and income<10000:
            income=5
        elif income>=10000 and income<50000:
            income=10
        elif income>=50000 and income<100000:
            income=15
        elif income>=100000 and income<200000:
            income=20
        elif income>=200000:
            income=25
        else:
            income=0

        if experience<1 and experience>=0:
            experience=5
        elif experience>=1 and experience<2:
            experience=10
        elif experience>=2 and experience<5:
            experience=15
        elif experience>=5 and experience<10:
            experience=20
        elif experience>=10:
            experience=25
        else:
            experience=0

        if personal_website!=None:
            personal_website=15
        else:
            personal_website=0

        print("persnal website done")
        if twitter_loc != None:
            twitter_loc=5
        else:
            twitter_loc=0
        print("twitterloc done")
        if twitter_description!=None:
            twitter_description=len(twitter_description)#instagram maxi length is 150
            if twitter_description<20 and twitter_description>=0:
                twitter_description=1
            elif twitter_description>=20 and twitter_description<50:
                twitter_description=2
            elif twitter_description>=50 and twitter_description<100:
                twitter_description=3
            elif twitter_description>=100 and twitter_description<120:
                twitter_description=4
            elif twitter_description>=120:
                twitter_description=5
        else:
            twitter_description=0 
        
        print(twitter_loc)
        print(twitter_description)
        # print(personal_website)
        # print(stock)
        # print(experience)
        # print(income)
        # print(about_linkedin)
        # print(post)
        # print(about_insta)
        # print(insta_followers)
        print(' done done done ')
        print(twitter_description+personal_website+stock+experience+income+about_linkedin+post+about_insta+insta_followers)
        return  twitter_description+personal_website+stock+experience+income+about_linkedin+post+about_insta+insta_followers
    