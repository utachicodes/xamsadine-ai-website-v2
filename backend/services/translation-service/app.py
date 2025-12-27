"""
Translation Service API
Provides REST endpoints for Wolof translation
"""

import sys
import io

# Fix UTF-8 encoding for Windows console
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from flask import Flask, request, jsonify
from wolof_translator import get_translator
import os
from typing import Dict, Any

app = Flask(__name__)

# Initialize translator
translator = get_translator()


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'translation-service',
        'model': os.getenv('TRANSLATION_MODEL', 'galsenai/wolofToFrenchTranslator_nllb'),
        'device': 'cuda' if translator.device == 'cuda' else 'cpu'
    })


@app.route('/translate', methods=['POST'])
def translate():
    """
    Translate text between French and Wolof
    
    Request body:
    {
        "text": "Text to translate",
        "source_lang": "fr" or "wo" (optional, auto-detected if omitted),
        "target_lang": "fr" or "wo" (optional, opposite of source if omitted)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        source_lang = data.get('source_lang')  # 'fr' or 'wo'
        target_lang = data.get('target_lang')
        
        # Translate
        result = translator.translate(text, source_lang, target_lang)
        
        # Detect actual source language if not provided
        if not source_lang:
            source_lang = translator.detect_language(text)
        if not target_lang:
            target_lang = 'wo' if source_lang == 'fr' else 'fr'
        
        return jsonify({
            'success': True,
            'original': text,
            'translated': result,
            'source_language': source_lang,
            'target_language': target_lang
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/translate-batch', methods=['POST'])
def translate_batch():
    """
    Translate multiple texts at once
    
    Request body:
    {
        "texts": ["Text 1", "Text 2", ...],
        "source_lang": "fr" or "wo" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({'error': 'Missing texts field'}), 400
        
        texts = data['texts']
        source_lang = data.get('source_lang')
        
        if not isinstance(texts, list):
            return jsonify({'error': 'texts must be a list'}), 400
        
        # Translate all texts
        translations = translator.batch_translate(texts, source_lang)
        
        return jsonify({
            'success': True,
            'count': len(texts),
            'translations': translations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/detect-language', methods=['POST'])
def detect_language():
    """
    Detect if text is French or Wolof
    
    Request body:
    {
        "text": "Text to detect"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        lang = translator.detect_language(text)
        language_names = {'fr': 'French', 'wo': 'Wolof'}
        
        return jsonify({
            'success': True,
            'text': text,
            'detected_language': lang,
            'language_name': language_names.get(lang, 'Unknown')
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('TRANSLATION_PORT', 5000))
    print(f"Translation service starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
