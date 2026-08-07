from flask import Flask, render_template
import os

app = Flask(__name__)


# =========================
# INICIO
# =========================

@app.route('/')
def inicio():
    return render_template('index.html')


# =========================
# ESPAÑOL
# =========================

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


# =========================
# INGLÉS
# =========================

@app.route('/menu_en')
def menu_en():
    return render_template('menu_en.html')


@app.route('/regionales_en')
def regionales_en():
    return render_template('regionales_en.html')


@app.route('/tradicionales_en')
def tradicionales_en():
    return render_template('tradicionales_en.html')


@app.route('/pastas_en')
def pastas_en():
    return render_template('pastas_en.html')


@app.route('/entradas_en')
def entradas_en():
    return render_template('entradas_en.html')


@app.route('/postres_en')
def postres_en():
    return render_template('postres_en.html')


@app.route('/menu-dia_en')
def menu_dia_en():
    return render_template('menu-dia_en.html')


# =========================
# PORTUGUÉS
# =========================

@app.route('/menu_pt')
def menu_pt():
    return render_template('menu_pt.html')


@app.route('/regionales_pt')
def regionales_pt():
    return render_template('regionales_pt.html')


@app.route('/tradicionales_pt')
def tradicionales_pt():
    return render_template('tradicionales_pt.html')


@app.route('/pastas_pt')
def pastas_pt():
    return render_template('pastas_pt.html')


@app.route('/entradas_pt')
def entradas_pt():
    return render_template('entradas_pt.html')


@app.route('/postres_pt')
def postres_pt():
    return render_template('postres_pt.html')


@app.route('/menu-dia_pt')
def menu_dia_pt():
    return render_template('menu-dia_pt.html')


# =========================
# FRANCÉS
# =========================

@app.route('/menu_fr')
def menu_fr():
    return render_template('menu_fr.html')


@app.route('/regionales_fr')
def regionales_fr():
    return render_template('regionales_fr.html')


@app.route('/tradicionales_fr')
def tradicionales_fr():
    return render_template('tradicionales_fr.html')


@app.route('/pastas_fr')
def pastas_fr():
    return render_template('pastas_fr.html')


@app.route('/entrees_fr')
def entrees_fr():
    return render_template('entrees_fr.html')


@app.route('/postres_fr')
def postres_fr():
    return render_template('postres_fr.html')


@app.route('/menu-dia_fr')
def menu_dia_fr():
    return render_template('menu-dia_fr.html')


# =========================
# CARRUSEL DE POSTRES
# =========================

@app.route('/carrusel-postres')
def carrusel_postres():
    return render_template('carrusel_postres.html')


# =========================
# CARRUSEL DE REGIONALES
# =========================

@app.route('/carrusel-regionales')
def carrusel_regionales():
    return render_template('carrusel_regionales.html')


# =========================
# CARRUSEL GENERAL
# REGIONALES + POSTRES
# =========================

@app.route('/carrusel')
def carrusel_general():
    return render_template('carrusel_general.html')


# =========================
# EJECUTAR APLICACIÓN
# =========================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            10000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )