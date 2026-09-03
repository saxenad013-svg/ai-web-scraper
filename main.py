import streamlit as st

from scrape import (
    scrape_website,
    split_dom_content,
    clean_body_content,
    extract_body_content
)

from parse import parse_with_ollama


# ============================================================
# PAGE TITLE
# ============================================================

st.title("AI Website Scraper")


# ============================================================
# WEBSITE URL INPUT
# ============================================================

url = st.text_input(
    "Enter the website URL:"
)


# ============================================================
# SCRAPE WEBSITE
# ============================================================

if st.button("Scrape Site"):

    if not url:

        st.warning(
            "Please enter a website URL first."
        )

        st.stop()

    st.write(
        "Scraping the website..."
    )

    result = scrape_website(url)

    if result is None:

        st.error(
            "The website could not be scraped. "
            "Check your VS Code terminal for the scraper error."
        )

        st.stop()

    body_content = extract_body_content(
        result
    )

    if not body_content:

        st.error(
            "Could not find webpage content."
        )

        st.stop()

    cleaned_content = clean_body_content(
        body_content
    )

    if not cleaned_content:

        st.error(
            "The webpage did not contain readable text."
        )

        st.stop()

    st.session_state.dom_content = (
        cleaned_content
    )

    st.success(
        "Website scraped successfully!"
    )


# ============================================================
# DISPLAY SCRAPED CONTENT
# ============================================================

if "dom_content" in st.session_state:

    with st.expander(
        "View Scraped Content"
    ):

        st.text_area(
            "Scraped Content",
            st.session_state.dom_content,
            height=300
        )


# ============================================================
# PARSE CONTENT
# ============================================================

if "dom_content" in st.session_state:

    parse_description = st.text_area(
        "Describe what you want to parse:",
        placeholder=(
            "Example:\n"
            "Extract all product names, prices, "
            "and ratings from the webpage.\n\n"
            "Return each product in this format:\n"
            "Product: [name]\n"
            "Price: [price]\n"
            "Rating: [rating]"
        )
    )

    if st.button("Parse Content"):

        if not parse_description:

            st.warning(
                "Please describe what you want to parse."
            )

            st.stop()

        st.write(
            "Parsing the content..."
        )

        dom_chunks = split_dom_content(
            st.session_state.dom_content
        )

        st.write(
            "Content split into",
            len(dom_chunks),
            "chunks."
        )

        with st.spinner(
            "Qwen AI is analyzing the content..."
        ):

            parsed_result = parse_with_ollama(
                dom_chunks,
                parse_description
            )

        st.subheader(
            "AI Result"
        )

        st.write(
            "Extracted Information"
        )

        st.text_area(
            "Result",
            parsed_result,
            height=400
        )