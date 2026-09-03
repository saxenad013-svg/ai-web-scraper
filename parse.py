# parse.py

import os

import streamlit as st

from dotenv import load_dotenv
from openai import OpenAI


# ============================================================
# LOAD LOCAL .ENV
# ============================================================

load_dotenv()


# ============================================================
# GET HUGGING FACE TOKEN
# ============================================================

HF_TOKEN = os.getenv("HF_TOKEN")


# ============================================================
# GET STREAMLIT CLOUD SECRET
# ============================================================

if not HF_TOKEN:

    try:
        HF_TOKEN = st.secrets["HF_TOKEN"]

    except Exception:
        HF_TOKEN = None


# ============================================================
# CHECK TOKEN
# ============================================================

if not HF_TOKEN:

    client = None

else:

    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=HF_TOKEN,
    )


# ============================================================
# AI PARSER
# ============================================================

def parse_with_ollama(dom_chunks, parse_description):

    if not HF_TOKEN:

        return (
            "Hugging Face token is not configured. "
            "Add HF_TOKEN to your .env file locally "
            "or Streamlit Secrets in the cloud."
        )

    parsed_results = []

    for i, chunk in enumerate(
        dom_chunks,
        start=1
    ):

        try:

            response = client.chat.completions.create(

                model="Qwen/Qwen3.8-27B:ovhcloud",

                messages=[

                    {
                        "role": "system",
                        "content": """
You are an information extraction AI.

Extract ONLY information explicitly present
in the webpage text.

Rules:
- Do not guess.
- Do not invent information.
- Do not explain your answer.
- Do not add introductions.
- Do not add conclusions.
- Return only the requested information.
- If multiple items are found, put each item on a separate line.
"""
                    },

                    {
                        "role": "user",
                        "content": f"""
WEBPAGE TEXT:

{chunk}


USER REQUEST:

{parse_description}


Extract the requested information now.
"""
                    }

                ],
            )

            result = response.choices[0].message.content

            if result:

                result = result.strip()

                if result:
                    parsed_results.append(result)

            print(
                f"Parsed batch {i} "
                f"of {len(dom_chunks)}"
            )

        except Exception as e:

            print(
                f"Error parsing batch {i}: {e}"
            )

    if not parsed_results:

        return "No matching information found."

    return "\n".join(parsed_results)