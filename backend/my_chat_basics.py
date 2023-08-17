import openai
import os
import json
from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity
import uuid
import json
import time
import openai
import numpy as np

openai.api_key = os.getenv('OPENAI_API_KEY')

def get_response(input_prompt,short_term_memory,context):
    message = [
            {"role": "system", "content": "You are a helpful assistant. Please answer user's question according to given data.\nData: {}".format(context)},
        ]
    
    for i in short_term_memory:
        message.append({"role": "user", "content":i['user']})
        message.append({"role": "assistant", "content":i['AI']})
    
    message.append({"role": "user", "content": input_prompt})
    res = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=message
    )
    return res['choices'][0]['message']['content']


def get_context(input_prompt):

    search_term_vector = get_embedding(input_prompt,engine='text-embedding-ada-002')
    
    with open("backend/knowledgebase.json",encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)
        for item in data:
            item['embeddings'] = np.array(item['embeddings'])

        for item in data:
            item['similarities'] = cosine_similarity(item['embeddings'], search_term_vector)

        sorted_data = sorted(data, key=lambda x: x['similarities'], reverse=True)
        context = ''
        referencs = []
        for i in sorted_data[:2]:
            context += i['text'] + '\n'
            # referencs.append({"pdf_name":i['pdf_name'],"page_num":i['page_num']})
    return context