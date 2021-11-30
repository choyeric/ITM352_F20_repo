from selenium import webdriver
from info import keys
import time

# driver function
def order(k):
    driver.get(k['product_url'])
    #driver.get(k['product_url1'])
    tick = time.perf_counter()
    print("\nProduct page loaded")
    #choose size
    driver.find_element_by_xpath('//*[@id="s"]/option[{}]'.format(k["size"])).click()
    driver.find_element_by_xpath('//*[@id="add-remove-buttons"]/input').click()
    print("Product carted")
    # sleep for 1 second to wait for checkout button to pop up
    time.sleep(0.75)

    #carting and info filling
    print("Proceeding to checkout...")
    time.sleep(0.75)
    driver.find_element_by_xpath('//*[@id="cart"]/a[2]').click()
    print("Loading checkout...")
    driver.find_element_by_xpath('//*[@id="order_billing_name"]').send_keys(k["name"])
    driver.find_element_by_xpath('//*[@id="order_email"]').send_keys(k["email"])
    driver.find_element_by_xpath('//*[@id="order_tel"]').send_keys(k["phone"])
    driver.find_element_by_xpath('//*[@id="bo"]').send_keys(k["address"])
    driver.find_element_by_xpath('//*[@id="oba3"]').send_keys(k["unit"])
    driver.find_element_by_xpath('//*[@id="order_billing_zip"]').send_keys(k["zip"])
    driver.find_element_by_xpath('//*[@id="order_billing_city"]').send_keys(k["city"])
    driver.find_element_by_xpath('//*[@id="rnsnckrn"]').send_keys(k["card_number"])
    driver.find_element_by_xpath('//*[@id="orcer"]').send_keys(k["cvv"])
    print("Loading captcha...")
    print("Prepare to solve captcha!!!")

    # month
    driver.find_element_by_xpath('//*[@id="credit_card_month"]/option[{}]'.format(k["card_month"])).click()
    # year
    driver.find_element_by_xpath('//*[@id="credit_card_year"]/option[{}]'.format(k["card_year"])).click()
    # state
    driver.find_element_by_xpath('//*[@id="order_billing_state"]/option[{}]'.format(k["billing_state"])).click()
    print("Solve captcha!!!")
    # terms and conditions
    driver.find_element_by_xpath('//*[@id="cart-cc"]/fieldset/p/label/div/ins').click()
    # process payment
    driver.find_element_by_xpath('//*[@id="pay"]/input').click()
    tock = time.perf_counter()
    print(f"Execution Time: {tock - tick:0.4f} seconds\n")


if __name__ == '__main__':
    driver = webdriver.Chrome('chromedriver.exe')
    order(keys)  