from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/menu_es')
def menu_es():
    return render_template('menu_es.html')

@app.route('/regionales')
def regionales():
    return render_template('regionales.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)