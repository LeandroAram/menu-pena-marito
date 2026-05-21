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

@app.route('/tradicionales')
def tradicionales():
    return render_template('tradicionales.html')

@app.route('/pastas')
def pastas():
    return render_template('pastas.html')

@app.route('/entradas')
def entradas():
    return render_template('entradas.html')

@app.route('/postres')
def postres():
    return render_template('postres.html')

@app.route('/bebidas')
def bebidas():
    return render_template('bebidas.html')

@app.route('/cervezas')
def cervezas():
    return render_template('cervezas.html')

@app.route('/vinos')
def vinos():
    return render_template('vinos.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)