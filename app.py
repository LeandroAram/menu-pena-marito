from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def inicio():
    return render_template('index.html')

# ESPAÑOL

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

@app.route('/menu-dia')
def menu_dia():
    return render_template('menu-dia.html')

# INGLES

@app.route('/menu_en')
def menu_en():
    return render_template('menu_en.html')

@app.route('/starters_en')
def starters_en():
    return render_template('starters_en.html')

# PORTUGUES

@app.route('/menu_pt')
def menu_pt():
    return render_template('menu_pt.html')

@app.route('/entradas_pt')
def entradas_pt():
    return render_template('entradas_pt.html')

# FRANCES

@app.route('/menu_fr')
def menu_fr():
    return render_template('menu_fr.html')

@app.route('/entrees_fr')
def entrees_fr():
    return render_template('entrees_fr.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)