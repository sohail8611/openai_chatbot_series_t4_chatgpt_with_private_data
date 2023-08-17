from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity
import uuid
import json
import time
import openai
import numpy as np


with open('backend/events_2023.txt', 'r', encoding='utf-8') as file:
    content = str(file.read())

chunks = []
print(len(content))
my_str = ""
for i in content:
    my_str += i
    if len(my_str) > 800:
        embd = get_embedding(my_str,engine='text-embedding-ada-002')
        chunks.append({
            "id":str(uuid.uuid4()),
            "text":my_str,
            "embeddings": embd
            })
        my_str = ''
        print("my_str",my_str)


knowledgeBase = 'backend/knowledgebase.json'
with open(knowledgeBase, 'r' ,encoding='utf-8') as file:
    existing_data = json.load(file)

newData = []
for i in existing_data:
    newData.append(i)
for i in chunks:
    newData.append(i)

with open(knowledgeBase, 'w' , encoding='utf-8') as file:
    json.dump(newData, file, indent=4, ensure_ascii=False)



