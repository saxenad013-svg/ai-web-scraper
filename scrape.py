import os
import re
import time
import json
from urllib.parse import quote, urljoin

from dotenv import load_dotenv
from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from bs4 import BeautifulSoup


# ============================================================
# ENVIRONMENT / BRIGHT DATA
# ============================================================

load_dotenv()

USERNAME = os.getenv(
    "BRIGHT_DATA_USERNAME",
    "brd-customer-hl_5bfc6b47-zone-ai_scraper"
)

PASSWORD = os.getenv("BRIGHT_DATA_PASSWORD")

# Streamlit Cloud fallback
if not PASSWORD:
    try:
        import streamlit as st
        PASSWORD = st.secrets.get("BRIGHT_DATA_PASSWORD")
    except Exception:
        PASSWORD = None

if not PASSWORD:
    raise ValueError(
        "BRIGHT_DATA_PASSWORD is not configured. "
        "Please add it to your .env file."
    )

AUTH = (
    f"{quote(USERNAME, safe='')}:"
    f"{quote(PASSWORD, safe='')}"
)

SBR_WEBDRIVER = (
    f"https://{AUTH}@brd.superproxy.io:9515"
)


# ============================================================
# TEXT HELPERS
# ============================================================

def clean_text(text):
    if not text:
        return ""

    text = str(text)
    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def is_truncated(text):
    if not text:
        return False

    text = clean_text(text)

    return (
        text.endswith("...")
        or text.endswith("…")
    )


def remove_truncation(text):
    if not text:
        return ""

    text = clean_text(text)

    text = re.sub(r"\.{3,}$", "", text)
    text = re.sub(r"…+$", "", text)

    return text.strip()


# ============================================================
# VERY IMPORTANT:
# EXTRACT THE REAL TITLE FROM HTML ATTRIBUTES
# ============================================================

def get_real_title_from_element(element):
    """
    Finds the full title from HTML attributes.

    This specifically handles Books to Scrape, where:

        Visible text:
        A Light in the ...

        HTML attribute:
        title="A Light in the Attic"

    """

    if not element:
        return ""

    candidates = []

    def add_candidate(value):
        if not value:
            return

        value = clean_text(value)

        if not value:
            return

        candidates.append(value)

    # --------------------------------------------------------
    # 1. Check the element itself
    # --------------------------------------------------------

    for attr in [
        "title",
        "aria-label",
        "data-title",
        "data-name",
        "data-product-title",
        "data-original-title",
    ]:
        add_candidate(
            element.get(attr)
        )

    # --------------------------------------------------------
    # 2. Check every link inside it
    # --------------------------------------------------------

    for link in element.find_all("a"):

        # MOST IMPORTANT ATTRIBUTE
        add_candidate(
            link.get("title")
        )

        add_candidate(
            link.get("aria-label")
        )

        add_candidate(
            link.get("data-title")
        )

        add_candidate(
            link.get("data-name")
        )

        add_candidate(
            link.get("data-product-title")
        )

        # Visible text as fallback
        add_candidate(
            link.get_text(
                " ",
                strip=True
            )
        )

    # --------------------------------------------------------
    # 3. Check heading elements
    # --------------------------------------------------------

    for heading in element.find_all(
        ["h1", "h2", "h3", "h4", "h5", "h6"]
    ):

        for attr in [
            "title",
            "aria-label",
            "data-title",
            "data-name",
        ]:
            add_candidate(
                heading.get(attr)
            )

        add_candidate(
            heading.get_text(
                " ",
                strip=True
            )
        )

    # --------------------------------------------------------
    # 4. Visible text fallback
    # --------------------------------------------------------

    add_candidate(
        element.get_text(
            " ",
            strip=True
        )
    )

    if not candidates:
        return ""

    # --------------------------------------------------------
    # Prefer non-truncated candidates.
    # --------------------------------------------------------

    complete = [
        x for x in candidates
        if not is_truncated(x)
    ]

    if complete:
        return max(
            complete,
            key=len
        )

    return max(
        candidates,
        key=len
    )


# ============================================================
# DIRECT BOOKS TO SCRAPE TITLE EXTRACTION
# ============================================================

def extract_books_to_scrape_titles(soup):
    """
    Specifically extracts titles from Books to Scrape.

    HTML structure:

        <article class="product_pod">
            <h3>
                <a href="..."
                   title="A Light in the Attic">
                    A Light in the ...
                </a>
            </h3>
        </article>

    We ALWAYS prefer the title attribute.
    """

    titles = []

    books = soup.select(
        "article.product_pod"
    )

    for book in books:

        # First choice: exact Books to Scrape selector
        link = book.select_one(
            "h3 a[title]"
        )

        if link:

            title = clean_text(
                link.get("title")
            )

            if title:
                titles.append(title)
                continue

        # Second choice: h3 > a
        link = book.select_one(
            "h3 > a"
        )

        if link:

            title = clean_text(
                link.get("title")
            )

            if title:
                titles.append(title)
                continue

            title = clean_text(
                link.get("aria-label")
            )

            if title:
                titles.append(title)
                continue

            title = clean_text(
                link.get_text(
                    " ",
                    strip=True
                )
            )

            if title:
                titles.append(title)

    return titles


# ============================================================
# SCRAPE WEBSITE USING BRIGHT DATA
# ============================================================

def scrape_website(website):

    print("Launching Bright Data remote browser...")
    print(f"Target website: {website}")

    connection = ChromiumRemoteConnection(
        SBR_WEBDRIVER,
        "goog",
        "chrome"
    )

    options = ChromeOptions()

    options.add_argument(
        "--disable-blink-features=AutomationControlled"
    )

    options.add_argument(
        "--disable-notifications"
    )

    options.add_argument(
        "--window-size=1920,1080"
    )

    driver = None

    try:

        driver = Remote(
            command_executor=connection,
            options=options
        )

        print("Opening website...")

        driver.get(website)

        print("Waiting for page to load...")

        time.sleep(5)

        # ----------------------------------------------------
        # Scroll page to trigger lazy loading
        # ----------------------------------------------------

        try:

            page_height = driver.execute_script(
                "return document.body.scrollHeight"
            )

            current_position = 0

            while current_position < page_height:

                current_position += 800

                driver.execute_script(
                    f"window.scrollTo(0, {current_position});"
                )

                time.sleep(0.4)

                new_height = driver.execute_script(
                    "return document.body.scrollHeight"
                )

                if new_height > page_height:
                    page_height = new_height

            driver.execute_script(
                "window.scrollTo(0, 0);"
            )

        except Exception as e:

            print(
                "Scroll warning:",
                e
            )

        # ----------------------------------------------------
        # GET HTML
        # ----------------------------------------------------

        html = driver.page_source

        print(
            f"HTML received: {len(html)} characters"
        )

        # ----------------------------------------------------
        # DEBUG: DIRECTLY CHECK BOOK TITLES
        # ----------------------------------------------------

        try:

            soup = BeautifulSoup(
                html,
                "html.parser"
            )

            books = soup.select(
                "article.product_pod"
            )

            print(
                f"Books detected: {len(books)}"
            )

            if books:

                print(
                    "\n===== FULL BOOK TITLES FROM HTML ====="
                )

                for book in books[:20]:

                    link = book.select_one(
                        "h3 > a"
                    )

                    if link:

                        title_attribute = (
                            link.get("title")
                        )

                        visible_text = (
                            link.get_text(
                                " ",
                                strip=True
                            )
                        )

                        print(
                            "FULL TITLE:",
                            repr(title_attribute)
                        )

                        print(
                            "VISIBLE:",
                            repr(visible_text)
                        )

                print(
                    "===== END FULL BOOK TITLES =====\n"
                )

        except Exception as debug_error:

            print(
                "Title debug warning:",
                debug_error
            )

        return html

    except Exception as e:

        print(
            "SCRAPING ERROR:",
            e
        )

        return None

    finally:

        if driver:

            try:
                driver.quit()
            except Exception:
                pass


# ============================================================
# TABLE EXTRACTION
# ============================================================

def extract_tables(soup):

    tables = []

    for table in soup.find_all("table"):

        rows = []

        for tr in table.find_all("tr"):

            cells = tr.find_all(
                ["th", "td"]
            )

            row = []

            for cell in cells:

                text = clean_text(
                    cell.get_text(
                        " ",
                        strip=True
                    )
                )

                if text:
                    row.append(text)

            if row:
                rows.append(row)

        if rows:
            tables.append(rows)

    return tables


# ============================================================
# HEADINGS
# ============================================================

def extract_headings(soup):

    headings = []

    # --------------------------------------------------------
    # First handle Books to Scrape specifically.
    # --------------------------------------------------------

    books = soup.select(
        "article.product_pod"
    )

    for book in books:

        link = book.select_one(
            "h3 > a"
        )

        if link:

            # ALWAYS use title attribute first
            title = clean_text(
                link.get("title")
            )

            if title:

                if title not in headings:
                    headings.append(title)

                continue

    # --------------------------------------------------------
    # Then handle normal headings.
    # --------------------------------------------------------

    for heading in soup.find_all(
        ["h1", "h2", "h3", "h4", "h5", "h6"]
    ):

        # Look for link inside heading
        link = heading.find("a")

        if link:

            # IMPORTANT:
            # title attribute takes priority
            title = clean_text(
                link.get("title")
            )

            if title and not is_truncated(title):

                if title not in headings:
                    headings.append(title)

                continue

            title = clean_text(
                link.get("aria-label")
            )

            if title and not is_truncated(title):

                if title not in headings:
                    headings.append(title)

                continue

        # Check heading attributes
        title = clean_text(
            heading.get("title")
        )

        if title and not is_truncated(title):

            if title not in headings:
                headings.append(title)

            continue

        title = clean_text(
            heading.get("aria-label")
        )

        if title and not is_truncated(title):

            if title not in headings:
                headings.append(title)

            continue

        # Visible heading text
        title = clean_text(
            heading.get_text(
                " ",
                strip=True
            )
        )

        if title:

            if title not in headings:
                headings.append(title)

    return headings


# ============================================================
# LISTS
# ============================================================

def extract_lists(soup):

    lists = []

    for list_element in soup.find_all(
        ["ul", "ol"]
    ):

        items = []

        for li in list_element.find_all(
            "li",
            recursive=False
        ):

            text = clean_text(
                li.get_text(
                    " ",
                    strip=True
                )
            )

            if text:
                items.append(text)

        if items:
            lists.append(items)

    return lists


# ============================================================
# LINKS
# ============================================================

def extract_links(
    soup,
    base_url=""
):

    links = []

    for link in soup.find_all(
        "a",
        href=True
    ):

        href = clean_text(
            link.get("href")
        )

        if not href:
            continue

        visible_text = clean_text(
            link.get_text(
                " ",
                strip=True
            )
        )

        title = clean_text(
            link.get("title")
        )

        aria_label = clean_text(
            link.get("aria-label")
        )

        # Full title takes priority when visible
        # text is truncated.
        if is_truncated(visible_text):

            text = (
                title
                or aria_label
                or visible_text
            )

        else:

            text = (
                visible_text
                or title
                or aria_label
            )

        if base_url:

            href = urljoin(
                base_url,
                href
            )

        if text:

            links.append(
                f"{text} -> {href}"
            )

        else:

            links.append(
                href
            )

    return links


# ============================================================
# IMAGES
# ============================================================

def extract_images(
    soup,
    base_url=""
):

    images = []

    for img in soup.find_all("img"):

        src = (
            img.get("src")
            or img.get("data-src")
            or img.get("data-lazy-src")
            or ""
        )

        src = clean_text(src)

        if not src:
            continue

        alt = clean_text(
            img.get("alt")
        )

        title = clean_text(
            img.get("title")
        )

        if base_url:

            src = urljoin(
                base_url,
                src
            )

        description = (
            alt
            or title
            or "Image"
        )

        images.append(
            f"{description} -> {src}"
        )

    return images


# ============================================================
# PRICES
# ============================================================

def extract_price_candidates(soup):

    prices = []

    selectors = [
        ".price",
        ".product_price",
        ".price_color",
        "[class*='price']",
        "[data-price]",
        "[itemprop='price']",
    ]

    seen = set()

    for selector in selectors:

        try:
            elements = soup.select(
                selector
            )
        except Exception:
            continue

        for element in elements:

            text = clean_text(
                element.get_text(
                    " ",
                    strip=True
                )
            )

            if not text:
                continue

            if (
                "$" in text
                or "€" in text
                or "£" in text
                or "₹" in text
                or re.search(
                    r"\b\d+(?:\.\d{1,2})?\b",
                    text
                )
            ):

                if text not in seen:

                    prices.append(text)
                    seen.add(text)

    return prices


# ============================================================
# RATINGS
# ============================================================

def extract_rating_from_element(element):

    if not element:
        return ""

    # Direct attributes
    for attr in [
        "data-rating",
        "data-score",
        "data-rate",
        "aria-label",
    ]:

        value = clean_text(
            element.get(attr)
        )

        if value:

            match = re.search(
                r"(\d+(?:\.\d+)?)\s*(?:/5|out of 5|stars?)?",
                value,
                re.IGNORECASE
            )

            if match:
                return match.group(1)

    # Books to Scrape classes
    classes = element.get(
        "class",
        []
    )

    rating_words = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
    }

    for class_name in classes:

        lower = class_name.lower()

        if lower in rating_words:

            return rating_words[
                lower
            ]

    # Child elements
    for child in element.find_all(
        ["span", "p", "div"]
    ):

        child_classes = child.get(
            "class",
            []
        )

        for class_name in child_classes:

            lower = class_name.lower()

            if lower in rating_words:

                return rating_words[
                    lower
                ]

        text = clean_text(
            child.get_text(
                " ",
                strip=True
            )
        )

        if text:

            match = re.search(
                r"(\d+(?:\.\d+)?)\s*(?:/5|out of 5|stars?)",
                text,
                re.IGNORECASE
            )

            if match:

                return match.group(1)

    return ""


def extract_rating_candidates(soup):

    ratings = []

    selectors = [
        "[class*='rating']",
        "[class*='star']",
        "[data-rating]",
        "[data-score]",
        "[aria-label*='star']",
        "[aria-label*='rating']",
    ]

    seen = set()

    for selector in selectors:

        try:

            elements = soup.select(
                selector
            )

        except Exception:

            continue

        for element in elements:

            rating = (
                extract_rating_from_element(
                    element
                )
            )

            if rating and rating not in seen:

                ratings.append(
                    rating
                )

                seen.add(
                    rating
                )

    return ratings


# ============================================================
# PRODUCTS / CARDS
# ============================================================

def extract_product_candidates(soup):

    products = []

    # --------------------------------------------------------
    # Books to Scrape gets its own exact selector.
    # --------------------------------------------------------

    books = soup.select(
        "article.product_pod"
    )

    for book in books:

        title_link = book.select_one(
            "h3 > a"
        )

        title = ""

        if title_link:

            # ABSOLUTELY PRIORITIZE TITLE ATTRIBUTE
            title = clean_text(
                title_link.get("title")
            )

            if not title:

                title = clean_text(
                    title_link.get(
                        "aria-label"
                    )
                )

            if not title:

                title = clean_text(
                    title_link.get_text(
                        " ",
                        strip=True
                    )
                )

        if not title:

            title = get_real_title_from_element(
                book
            )

        if not title:
            continue

        lines = []

        lines.append(
            f"Title: {title}"
        )

        # ----------------------------------------------------
        # Price
        # ----------------------------------------------------

        price_element = book.select_one(
            ".price_color"
        )

        if not price_element:

            price_element = book.select_one(
                ".price"
            )

        if price_element:

            price = clean_text(
                price_element.get_text(
                    " ",
                    strip=True
                )
            )

            if price:

                lines.append(
                    f"Price: {price}"
                )

        # ----------------------------------------------------
        # Rating
        # ----------------------------------------------------

        rating = (
            extract_rating_from_element(
                book
            )
        )

        if rating:

            lines.append(
                f"Rating: {rating}/5"
            )

        # ----------------------------------------------------
        # Product URL
        # ----------------------------------------------------

        if title_link:

            href = clean_text(
                title_link.get("href")
            )

            if href:

                lines.append(
                    f"Link: {href}"
                )

        products.append(
            "\n".join(lines)
        )

    # --------------------------------------------------------
    # Generic product/card extraction
    # --------------------------------------------------------

    selectors = [
        "article",
        ".product",
        ".product-card",
        ".product-card-wrapper",
        "[class*='product']",
        "[class*='card']",
    ]

    seen = set()

    for product in products:

        seen.add(
            re.sub(
                r"\s+",
                " ",
                product
            ).strip().lower()
        )

    for selector in selectors:

        try:

            elements = soup.select(
                selector
            )

        except Exception:

            continue

        for element in elements:

            # Don't duplicate Books to Scrape products
            if (
                "product_pod"
                in element.get(
                    "class",
                    []
                )
            ):
                continue

            title = get_real_title_from_element(
                element
            )

            if not title:
                continue

            lines = [
                f"Title: {title}"
            ]

            price_element = element.select_one(
                ".price, "
                ".price_color, "
                "[itemprop='price'], "
                "[data-price]"
            )

            if price_element:

                price = clean_text(
                    price_element.get_text(
                        " ",
                        strip=True
                    )
                )

                if price:

                    lines.append(
                        f"Price: {price}"
                    )

            rating = (
                extract_rating_from_element(
                    element
                )
            )

            if rating:

                lines.append(
                    f"Rating: {rating}/5"
                )

            product_text = "\n".join(
                lines
            )

            normalized = re.sub(
                r"\s+",
                " ",
                product_text
            ).strip().lower()

            if normalized in seen:
                continue

            seen.add(
                normalized
            )

            products.append(
                product_text
            )

            if len(products) >= 50:

                return products

    return products[:50]


# ============================================================
# JSON-LD
# ============================================================

def extract_json_ld(soup):

    data = []

    for script in soup.find_all(
        "script",
        type="application/ld+json"
    ):

        raw = script.string

        if not raw:

            raw = script.get_text()

        raw = raw.strip()

        if not raw:
            continue

        try:

            parsed = json.loads(
                raw
            )

            if isinstance(
                parsed,
                list
            ):

                data.extend(
                    parsed
                )

            else:

                data.append(
                    parsed
                )

        except Exception:

            continue

    return data


# ============================================================
# BODY CONTENT
# ============================================================

def extract_body_content(html_content):

    if not html_content:
        return ""

    soup = BeautifulSoup(
        html_content,
        "html.parser"
    )

    # --------------------------------------------------------
    # Extract JSON-LD BEFORE deleting scripts.
    # --------------------------------------------------------

    json_ld = extract_json_ld(
        soup
    )

    # --------------------------------------------------------
    # Remove unwanted elements.
    # --------------------------------------------------------

    for element in soup(
        [
            "script",
            "style",
            "noscript",
            "svg",
            "iframe",
            "canvas",
            "template",
        ]
    ):

        element.decompose()

    # --------------------------------------------------------
    # Base URL
    # --------------------------------------------------------

    base_url = ""

    base_tag = soup.find(
        "base",
        href=True
    )

    if base_tag:

        base_url = clean_text(
            base_tag.get("href")
        )

    # --------------------------------------------------------
    # Page title
    # --------------------------------------------------------

    page_title = ""

    if soup.title:

        page_title = clean_text(
            soup.title.get_text()
        )

    # --------------------------------------------------------
    # Extract all data
    # --------------------------------------------------------

    headings = extract_headings(
        soup
    )

    tables = extract_tables(
        soup
    )

    lists = extract_lists(
        soup
    )

    links = extract_links(
        soup,
        base_url
    )

    images = extract_images(
        soup,
        base_url
    )

    prices = extract_price_candidates(
        soup
    )

    ratings = extract_rating_candidates(
        soup
    )

    products = extract_product_candidates(
        soup
    )

    # --------------------------------------------------------
    # Visible page text
    # --------------------------------------------------------

    page_text = clean_text(
        soup.get_text(
            " ",
            strip=True
        )
    )

    sections = []

    # --------------------------------------------------------
    # PAGE TITLE
    # --------------------------------------------------------

    if page_title:

        sections.append(
            "===== PAGE TITLE =====\n"
            + page_title
        )

    # --------------------------------------------------------
    # HEADINGS
    # --------------------------------------------------------

    if headings:

        sections.append(
            "===== HEADINGS =====\n"
            + "\n".join(
                f"- {heading}"
                for heading in headings
            )
        )

    # --------------------------------------------------------
    # STRUCTURED DATA
    # --------------------------------------------------------

    if json_ld:

        json_lines = []

        for item in json_ld:

            try:

                json_lines.append(
                    json.dumps(
                        item,
                        ensure_ascii=False,
                        indent=2
                    )
                )

            except Exception:

                pass

        if json_lines:

            sections.append(
                "===== STRUCTURED DATA =====\n"
                + "\n".join(
                    json_lines
                )
            )

    # --------------------------------------------------------
    # TABLES
    # --------------------------------------------------------

    if tables:

        table_lines = []

        for index, table in enumerate(
            tables,
            start=1
        ):

            table_lines.append(
                f"Table {index}:"
            )

            for row in table:

                table_lines.append(
                    " | ".join(row)
                )

            table_lines.append("")

        sections.append(
            "===== TABLE DATA =====\n"
            + "\n".join(
                table_lines
            )
        )

    # --------------------------------------------------------
    # PRODUCTS
    # --------------------------------------------------------

    if products:

        sections.append(
            "===== ITEMS / CARDS =====\n"
            + "\n\n".join(
                products
            )
        )

    # --------------------------------------------------------
    # PRICES
    # --------------------------------------------------------

    if prices:

        sections.append(
            "===== PRICE INFORMATION =====\n"
            + "\n".join(
                f"- {price}"
                for price in prices
            )
        )

    # --------------------------------------------------------
    # RATINGS
    # --------------------------------------------------------

    if ratings:

        sections.append(
            "===== RATING INFORMATION =====\n"
            + "\n".join(
                f"- {rating}/5"
                for rating in ratings
            )
        )

    # --------------------------------------------------------
    # LISTS
    # --------------------------------------------------------

    if lists:

        list_lines = []

        for index, items in enumerate(
            lists,
            start=1
        ):

            list_lines.append(
                f"List {index}:"
            )

            for item in items:

                list_lines.append(
                    f"- {item}"
                )

            list_lines.append("")

        sections.append(
            "===== LIST DATA =====\n"
            + "\n".join(
                list_lines
            )
        )

    # --------------------------------------------------------
    # LINKS
    # --------------------------------------------------------

    if links:

        sections.append(
            "===== LINKS =====\n"
            + "\n".join(
                f"- {link}"
                for link in links
            )
        )

    # --------------------------------------------------------
    # IMAGES
    # --------------------------------------------------------

    if images:

        sections.append(
            "===== IMAGES =====\n"
            + "\n".join(
                f"- {image}"
                for image in images
            )
        )

    # --------------------------------------------------------
    # PAGE TEXT
    # --------------------------------------------------------

    if page_text:

        sections.append(
            "===== PAGE TEXT =====\n"
            + page_text
        )

    return "\n\n".join(
        sections
    )


# ============================================================
# CLEAN BODY CONTENT
# ============================================================

def clean_body_content(body_content):

    if not body_content:
        return ""

    soup = BeautifulSoup(
        body_content,
        "html.parser"
    )

    text = soup.get_text(
        "\n",
        strip=True
    )

    lines = []

    for line in text.splitlines():

        line = clean_text(
            line
        )

        if not line:
            continue

        lines.append(
            line
        )

    return "\n".join(
        lines
    )


# ============================================================
# SPLIT CONTENT FOR AI
# ============================================================

def split_dom_content(
    dom_content,
    max_length=6000
):

    if not dom_content:
        return []

    sections = re.split(
        r"(?=^===== )",
        dom_content,
        flags=re.MULTILINE
    )

    chunks = []

    current_chunk = ""

    for section in sections:

        section = section.strip()

        if not section:
            continue

        # ----------------------------------------------------
        # Section fits in current chunk
        # ----------------------------------------------------

        if (
            len(current_chunk)
            + len(section)
            + 2
            <= max_length
        ):

            if current_chunk:

                current_chunk += "\n\n"

            current_chunk += section

        else:

            if current_chunk:

                chunks.append(
                    current_chunk
                )

            # ------------------------------------------------
            # Section itself is too large
            # ------------------------------------------------

            if len(section) > max_length:

                start = 0

                while start < len(section):

                    end = (
                        start
                        + max_length
                    )

                    chunks.append(
                        section[
                            start:end
                        ]
                    )

                    start = end

                current_chunk = ""

            else:

                current_chunk = section

    if current_chunk:

        chunks.append(
            current_chunk
        )

    return chunks