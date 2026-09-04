import os
import re
import json
from openai import OpenAI
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is not set in the .env file.")


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)


# ============================================================
# CLEAN AI RESPONSE
# ============================================================

def clean_ai_response(response_text):
    """
    Cleans the AI response so that only valid JSON remains.
    """

    if not response_text:
        return ""

    response_text = str(response_text).strip()

    # Remove markdown code fences
    response_text = re.sub(
        r"^```(?:json)?\s*",
        "",
        response_text,
        flags=re.IGNORECASE
    )

    response_text = re.sub(
        r"\s*```$",
        "",
        response_text
    )

    response_text = response_text.strip()

    # Try to locate a JSON object
    start = response_text.find("{")
    end = response_text.rfind("}")

    if start != -1 and end != -1 and end > start:
        response_text = response_text[start:end + 1]

    return response_text.strip()


# ============================================================
# SPLIT WEBPAGE CONTENT
# ============================================================

def split_dom_content(dom_content, max_length=6000):
    """
    Splits large webpage content into smaller chunks.
    """

    if not dom_content:
        return []

    return [
        dom_content[i:i + max_length]
        for i in range(0, len(dom_content), max_length)
    ]


# ============================================================
# PARSE WITH AI
# ============================================================

def parse_with_ollama(dom_content, parse_description):
    """
    Uses the Hugging Face Qwen model to extract information
    from scraped webpage content.
    """

    if not dom_content:
        return json.dumps(
            {
                "title": "No Content",
                "items": [],
                "summary": "No webpage content was provided."
            },
            ensure_ascii=False
        )

    if not parse_description:
        return json.dumps(
            {
                "title": "No Instruction",
                "items": [],
                "summary": "No extraction instruction was provided."
            },
            ensure_ascii=False
        )

    # --------------------------------------------------------
    # COMBINE CHUNKS
    # --------------------------------------------------------

    if isinstance(dom_content, list):
        webpage_text = "\n\n".join(
            str(chunk) for chunk in dom_content
        )
    else:
        webpage_text = str(dom_content)

    # --------------------------------------------------------
    # SYSTEM PROMPT
    # --------------------------------------------------------

    system_prompt = """

You are Fieldglass, an intelligent AI web-data extraction assistant.

Your job is to understand exactly what the user wants from the supplied
webpage and return only the relevant information.

You are NOT a general webpage summarizer.

============================================================
CORE RULE
============================================================

Follow the user's wording exactly.

Do not invent a ranking method, filter, sorting method, or extra fields
unless the user explicitly asks for them.

Use ONLY information contained in the supplied webpage.

Never invent:
- names
- prices
- ratings
- reviews
- dates
- popularity
- rankings
- statistics
- categories
- URLs
- specifications
- descriptions

============================================================
UNDERSTANDING "TOP"
============================================================

The word "top" does NOT automatically mean "highest rated",
"most popular", "best", or any other ranking.

For example:

"top 5 books"

means:

Return 5 relevant books from the webpage.

DO NOT automatically rank them by:
- rating
- price
- popularity
- reviews
- any other field

If the webpage is an ordered list, preserve its existing order.

If the webpage is not explicitly ordered, return the first 5
relevant items found in the supplied webpage.

Only rank when the user explicitly gives a ranking criterion.

Examples:

"top 5 highest rated books"
-> rank by rating.

"top 5 cheapest books"
-> rank by price.

"top 5 most popular books"
-> use an actual popularity signal from the webpage.

"top 5 books with prices"
-> return 5 books and their prices; do NOT rank by price.

============================================================
RANKING RULES
============================================================

Only perform ranking when the user explicitly specifies the criterion.

Explicit ranking criteria include:

- highest rated
- lowest rated
- cheapest
- lowest price
- most expensive
- highest price
- most popular
- most reviewed
- best rated
- newest
- oldest

If the user does not specify a ranking criterion, DO NOT create one.

NEVER turn:

"top 5 books"

into:

"highest rated 5 books"

NEVER turn:

"top 5 products"

into:

"most expensive 5 products"

NEVER turn:

"top 5 courses"

into:

"highest rated 5 courses"

============================================================
RESULT LIMIT
============================================================

Always respect explicit limits.

"top 5 books" -> exactly 5 items if 5 relevant items exist.

"show me 10 products" -> up to 10 items.

"give me 3 jobs" -> up to 3 items.

Never return more items than requested.

If fewer matching items exist, return only the available items.

============================================================
FIELD SELECTION
============================================================

Only return information requested by the user.

For a simple request such as:

"top 5 books"

return book names only.

Do NOT unnecessarily add:
- rating
- price
- description
- availability
- category
- URL
- author

unless the user asks for them.

For:

"top 5 books with ratings"

return names and ratings.

For:

"top 5 books with prices"

return names and prices.

============================================================
COMPLETE NAMES
============================================================

Always preserve complete names and titles.

Never intentionally truncate names.

Never replace names with "...".

If the webpage contains a complete title, return the complete title.

============================================================
SOURCE ACCURACY
============================================================

Use ONLY the supplied webpage content.

Never guess missing information.

If information is unavailable, do not manufacture it.

If the webpage genuinely contains no relevant information, return:

{
    "title": "No matching information",
    "items": [],
    "summary": "No information matching the user's request was found on this webpage."
}

============================================================
OUTPUT FORMAT
============================================================

Return VALID JSON ONLY.

Never return Markdown.

Never return Markdown tables.

Never return code fences.

Never put explanations outside the JSON object.

The response MUST have this structure:

{
    "title": "Short result title",
    "items": [
        {
            "name": "Item name"
        }
    ],
    "summary": "Short useful summary"
}

============================================================
DETAILS
============================================================

Use "details" ONLY when the user asks for additional fields.

Example:

{
    "name": "Book Name",
    "details": {
        "rating": "5/5"
    }
}

For simple extraction requests, prefer the simple name format.

============================================================
SUMMARY
============================================================

Keep the summary short.

For a simple extraction:

"The first 5 relevant books found on the webpage."

For an explicitly ranked request:

"The 5 highest-rated books based on the ratings shown on the webpage."

Do not invent a ranking explanation.

============================================================
FINAL CHECK
============================================================

Before answering, check:

1. What exactly did the user request?
2. Is this extraction, filtering, sorting, or ranking?
3. Did the user explicitly specify a ranking criterion?
4. If the user said "top", did they actually specify what makes
   something top?
5. Did I accidentally invent a ranking criterion?
6. Did I return the requested number of items?
7. Did I include only requested fields?
8. Are all names complete?
9. Is the result valid JSON?

MOST IMPORTANT:

"TOP 5" DOES NOT AUTOMATICALLY MEAN "HIGHEST RATED 5".

Follow the user's actual request.

"""

    # --------------------------------------------------------
    # USER PROMPT
    # --------------------------------------------------------

    user_prompt = f"""

USER REQUEST:

{parse_description.strip()}

============================================================
WEBPAGE CONTENT
============================================================

{webpage_text}

============================================================
TASK
============================================================

Follow the USER REQUEST exactly.

Use ONLY the supplied webpage content.

First determine whether the request is:

- extraction
- filtering
- sorting
- ranking
- comparison
- search
- categorization
- factual question
- general overview

IMPORTANT:

If the user says "top 5" without specifying a ranking criterion,
DO NOT assume highest rating, popularity, price, reviews, or any other
criterion.

For "top 5", return the first 5 relevant items in webpage order,
unless the webpage itself clearly provides an explicit ordering.

Only perform ranking when the user explicitly specifies the criterion.

Examples:

"top 5 books"
-> first 5 relevant books.

"top 5 highest rated books"
-> highest-rated 5 books.

"top 5 cheapest books"
-> cheapest 5 books.

"top 5 most popular books"
-> most-popular 5 books only if a popularity signal exists.

Only include fields requested by the user.

Respect the requested number of results.

Return VALID JSON ONLY.

Required structure:

{{
    "title": "Short result title",
    "items": [
        {{
            "name": "Item name"
        }}
    ],
    "summary": "Short useful summary"
}}

"""

    # --------------------------------------------------------
    # CALL AI
    # --------------------------------------------------------

    try:

        print("Sending webpage content to AI...")

        response = client.chat.completions.create(
            model="Qwen/Qwen3.8-27B:ovhcloud",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.1,
            max_tokens=2500
        )

        # ----------------------------------------------------
        # GET AI RESPONSE
        # ----------------------------------------------------

        message = response.choices[0].message

        result = getattr(message, "content", None)

        # Some providers return content as a list of blocks.
        if isinstance(result, list):

            text_parts = []

            for block in result:

                if isinstance(block, dict):

                    block_text = block.get("text")

                    if block_text:
                        text_parts.append(str(block_text))

                else:

                    block_text = getattr(
                        block,
                        "text",
                        None
                    )

                    if block_text:
                        text_parts.append(str(block_text))

            result = "\n".join(text_parts)

        # ----------------------------------------------------
        # FALLBACK RESPONSE FIELDS
        # ----------------------------------------------------

        if not result:

            for field_name in (
                "output_text",
                "text"
            ):

                fallback = getattr(
                    response,
                    field_name,
                    None
                )

                if fallback:

                    result = fallback

                    break

        # ----------------------------------------------------
        # EMPTY RESPONSE
        # ----------------------------------------------------

        if not result:

            print("AI returned an empty final answer.")

            print("FULL AI RESPONSE:")

            print(response)

            return json.dumps(
                {
                    "title": "Empty AI Response",
                    "items": [],
                    "summary": (
                        "The AI model returned no final answer. "
                        "Check the backend terminal for the full AI response."
                    )
                },
                ensure_ascii=False
            )

        # ----------------------------------------------------
        # CLEAN RESPONSE
        # ----------------------------------------------------

        result = clean_ai_response(
            str(result)
        )

        # ----------------------------------------------------
        # VALIDATE JSON
        # ----------------------------------------------------

        try:

            parsed = json.loads(result)

        except json.JSONDecodeError:

            print("AI returned invalid JSON:")

            print(result)

            return json.dumps(
                {
                    "title": "Invalid AI Response",
                    "items": [],
                    "summary": (
                        "The AI returned an invalid JSON response."
                    )
                },
                ensure_ascii=False
            )

        # ----------------------------------------------------
        # ENSURE EXPECTED STRUCTURE
        # ----------------------------------------------------

        if not isinstance(parsed, dict):

            return json.dumps(
                {
                    "title": "Invalid AI Response",
                    "items": [],
                    "summary": (
                        "The AI response was not a JSON object."
                    )
                },
                ensure_ascii=False
            )

        if "title" not in parsed:

            parsed["title"] = "Extraction Results"

        if "items" not in parsed:

            parsed["items"] = []

        if "summary" not in parsed:

            parsed["summary"] = "Extraction completed."

        # ----------------------------------------------------
        # RETURN CLEAN JSON
        # ----------------------------------------------------

        return json.dumps(
            parsed,
            ensure_ascii=False
        )

    except Exception as e:

        print("AI parsing error:")

        print(e)

        return json.dumps(
            {
                "title": "AI Error",
                "items": [],
                "summary": str(e)
            },
            ensure_ascii=False
        )