from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate


template = """
You are a precise web data extraction AI.

Your ONLY job is to extract the information requested by the user
from the webpage text.

DO NOT summarize.
DO NOT rewrite.
DO NOT shorten product names.
DO NOT invent information.
DO NOT explain anything.

WEBPAGE TEXT:
{dom_content}

USER REQUEST:
{parse_description}

STRICT RULES:

1. Extract ONLY information explicitly present in the webpage text.

2. Product names must be copied exactly from the webpage text.

3. NEVER shorten a product name.

4. NEVER summarize or rewrite a product name.

5. Keep all words, punctuation, capitalization, and numbers.

6. Extract the exact price belonging to each product.

7. Extract the rating belonging to each product.

8. NEVER guess a rating.

9. Keep each product's name, price, and rating together.

10. Do not mix information between different products.

11. If information is missing, write "Not available".

12. Do not add explanations, introductions, conclusions, or commentary.

13. Return ONLY the requested product information.

OUTPUT FORMAT:

Product: [complete product name]
Price: [price]
Rating: [rating]

Product: [complete product name]
Price: [price]
Rating: [rating]
"""


model = OllamaLLM(
    model="qwen2.5:3b-instruct",
    base_url="http://localhost:11434"
)


def parse_with_ollama(dom_chunks, parse_description):

    prompt = ChatPromptTemplate.from_template(
        template
    )

    chain = prompt | model

    parsed_results = []

    total_chunks = len(dom_chunks)

    for i, chunk in enumerate(dom_chunks, start=1):

        print(
            f"\nProcessing chunk {i} of {total_chunks}..."
        )

        try:

            response = chain.invoke(
                {
                    "dom_content": chunk,
                    "parse_description": parse_description
                }
            )

            response = response.strip()

            print(
                f"Parsed batch {i} of {total_chunks}"
            )

            if response:
                parsed_results.append(response)

        except Exception as e:

            print(
                f"Error processing chunk {i}:"
            )

            print(
                type(e).__name__
            )

            print(
                str(e)
            )

    if not parsed_results:

        return "No matching information found."

    return "\n\n".join(parsed_results)