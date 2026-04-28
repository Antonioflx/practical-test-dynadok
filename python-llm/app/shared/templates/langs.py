LANG_NAMES = {
    "pt": "português",
    "en": "English",
    "es": "español",
}

TEMPLATES = {
    "task": "Summarize the following text in {lang_name}. Return only the summary, no extra commentary:\n\n{text}",
    "document": "Analyze the following document in {lang_name}. Return only the analysis:\n\n{text}",
}


def get_template(type: str, lang: str, text: str) -> str:
    if type not in TEMPLATES:
        raise ValueError(f"Unknown type: {type}")

    if lang not in LANG_NAMES:
        raise ValueError(f"Unsupported lang: {lang}")

    return TEMPLATES[type].format(lang_name=LANG_NAMES[lang], text=text)
