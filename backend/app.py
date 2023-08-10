from flask import Flask, request, jsonify
from my_chat_basics import *
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/get_response', methods=['POST'])
def get_chat_response():
    try:
        input_prompt = request.json['input_prompt']
        if len(input_prompt) > 400:
            return jsonify({'response': "length exceeded"})  
        short_term_memory = request.json['short_term_memory']

        context = get_context()
        response = get_response(input_prompt,short_term_memory,context)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
