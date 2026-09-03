import time
from urllib.parse import quote

from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from bs4 import BeautifulSoup


# ============================================================
# BRIGHT DATA LOGIN
# ============================================================

USERNAME = "brd-customer-hl_5bfc6b47-zone-ai_scraper"

# PUT YOUR BRIGHT DATA PASSWORD HERE
PASSWORD = "j346hxjfsx4e"

AUTH = f"{quote(USERNAME, safe='')}:{quote(PASSWORD, safe='')}"

SBR_WEBDRIVER = f"https://{AUTH}@brd.superproxy.io:9515"


# ============================================================
# WEBSITE SCRAPER
# ============================================================

def scrape_website(website):

    print("Connecting to Bright Data...")

    driver = None

    try:

        connection = ChromiumRemoteConnection(
            SBR_WEBDRIVER,
            "goog",
            "chrome"
        )

        options = ChromeOptions()

        driver = Remote(
            command_executor=connection,
            options=options
        )

        print("Connected to Bright Data!")
        print("Opening:", website)

        driver.get(website)

        print("Page loaded!")

        time.sleep(5)

        print("Getting page source...")

        html = driver.page_source

        print("Successfully scraped website!")
        print("HTML length:", len(html))

        return html

    except Exception as e:

        print("\n========== SCRAPER ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("====================================\n")

        return None

    finally:

        if driver:

            try:
                driver.quit()
                print("Browser closed.")
            except Exception:
                pass


# ============================================================
# EXTRACT BODY CONTENT
# ============================================================

def extract_body_content(html_content):

    soup = BeautifulSoup(
        html_content,
        "html.parser"
    )

    # ========================================================
    # BOOKS TO SCRAPE
    # ========================================================
    #
    # Books to Scrape uses:
    #
    # article.product_pod
    # h3 a -> full title is in the "title" attribute
    # p.price_color -> price
    # p.star-rating -> rating is stored in the class
    #
    # Example:
    #
    # <p class="star-rating Three">
    #
    # ========================================================

    books = soup.select("article.product_pod")

    if books:

        print(f"Books to Scrape detected!")
        print(f"Found {len(books)} books.")

        products = []

        # Rating conversion
        rating_map = {
            "One": "1/5",
            "Two": "2/5",
            "Three": "3/5",
            "Four": "4/5",
            "Five": "5/5"
        }

        for book in books:

            # ------------------------------------------------
            # FULL BOOK TITLE
            # ------------------------------------------------

            title = "Unknown"

            title_link = book.select_one("h3 a")

            if title_link:

                # The title attribute contains the FULL title
                title = title_link.get("title")

                # Fallback if title attribute doesn't exist
                if not title:
                    title = title_link.get_text(
                        strip=True
                    )

            # ------------------------------------------------
            # PRICE
            # ------------------------------------------------

            price = "Unknown"

            price_element = book.select_one(
                "p.price_color"
            )

            if price_element:

                price = price_element.get_text(
                    strip=True
                )

            # ------------------------------------------------
            # RATING
            # ------------------------------------------------

            rating = "Not rated"

            rating_element = book.select_one(
                "p.star-rating"
            )

            if rating_element:

                rating_classes = rating_element.get(
                    "class",
                    []
                )

                for class_name in rating_classes:

                    if class_name in rating_map:

                        rating = rating_map[class_name]

                        break

            # ------------------------------------------------
            # PRODUCT OUTPUT
            # ------------------------------------------------

            product_text = (
                f"Product: {title}\n"
                f"Price: {price}\n"
                f"Rating: {rating}"
            )

            products.append(product_text)

            # Print to terminal so we can verify extraction
            print("\n------------------------------")
            print("Product:", title)
            print("Price:", price)
            print("Rating:", rating)

        if products:

            print("\nBooks successfully extracted!")

            return "\n\n".join(products)

    # ========================================================
    # AMAZON PRODUCT RESULTS
    # ========================================================

    amazon_products = soup.select(
        'div[data-component-type="s-search-result"]'
    )

    if amazon_products:

        print("Amazon product listings detected!")

        products = []

        for product in amazon_products:

            text = product.get_text(
                separator="\n",
                strip=True
            )

            if text:

                products.append(text)

        if products:

            return "\n\n".join(products)

    # ========================================================
    # COMMON PRODUCT CONTAINERS
    # ========================================================

    product_selectors = [

        '[data-testid*="product"]',
        '[data-testid*="Product"]',

        '[class*="product-card"]',
        '[class*="ProductCard"]',

        '[class*="product-item"]',
        '[class*="ProductItem"]',

        '[class*="product-card-container"]',

        '[class*="product-tile"]',

        'article'
    ]

    found_products = []

    for selector in product_selectors:

        elements = soup.select(selector)

        if elements:

            print(
                f"Found {len(elements)} elements using {selector}"
            )

            for element in elements:

                text = element.get_text(
                    separator="\n",
                    strip=True
                )

                if text and len(text) > 20:

                    found_products.append(text)

            if found_products:

                break

    # ========================================================
    # REMOVE DUPLICATES
    # ========================================================

    unique_products = []

    for product in found_products:

        if product not in unique_products:

            unique_products.append(product)

    if unique_products:

        return "\n\n".join(unique_products)

    # ========================================================
    # FALLBACK TO NORMAL BODY
    # ========================================================

    body = soup.body

    if body:

        return str(body)

    return ""


# ============================================================
# CLEAN BODY CONTENT
# ============================================================

def clean_body_content(body_content):

    soup = BeautifulSoup(
        body_content,
        "html.parser"
    )

    # Remove unnecessary elements
    for element in soup(
        [
            "script",
            "style",
            "noscript",
            "svg",
            "iframe"
        ]
    ):

        element.extract()

    cleaned_content = soup.get_text(
        separator="\n"
    )

    # Clean empty lines
    lines = []

    for line in cleaned_content.splitlines():

        line = line.strip()

        if line:

            lines.append(line)

    cleaned_content = "\n".join(lines)

    return cleaned_content


# ============================================================
# SPLIT DOM CONTENT
# ============================================================

def split_dom_content(
    dom_content,
    max_length=6000
):

    return [
        dom_content[i:i + max_length]
        for i in range(
            0,
            len(dom_content),
            max_length
        )
    ]